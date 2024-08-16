import Cookies from 'js-cookie'
import _isEmpty from 'lodash-es/isEmpty'
import _get from 'lodash-es/get'

import { HEADERS_DEFAULT } from '@constants/header.constant'
import { API_METHOD } from '@constants/api-method.constant'
import { TOKEN_VARIABLE_NAME } from '@constants/cookies.constant'
import { REGEX_CONTENT_TYPE_JSON, REGEX_CONTENT_TYPE_TEXT } from '@constants/regex.constant'
// import { systemErrorMessages } from '@assets/locales/en-us/error-messages.locale.json'
import { removeAllCookies } from '@helpers/cookies.helper'
import { typeOfValue } from '@utils/value.util'

import { ADMIN_BASE } from '@constants/api.constant'
import { getStorage } from './storage.helper'
import { CURRENT_PROJECT_USING } from '@constants/storage.constant'

// Static strings.
const { fetch: originalFetch } = window

export const blankFetch = originalFetch

/**
 * Implement interceptor
 */
window.fetch = async (...args) => {
  let [resource, options] = args
  const currentProject = getStorage(CURRENT_PROJECT_USING)

  // Request interceptor starts
  options.headers = {
    ...(Cookies.get(TOKEN_VARIABLE_NAME) && {
      Authorization: `Bearer ${Cookies.get(TOKEN_VARIABLE_NAME)}`,
      'project-id': (currentProject && currentProject?.projectId) || ''
    }),
    ...options.headers
  }
  // Request interceptor ends

  // Call
  const response = await originalFetch(resource, options)

  if (!response.ok) {
    // 40* error handling
    if (Math.floor(response.status / 10) === 40) {
      return Promise.resolve(response)
    }

    // 50* error handling
    if (Math.floor(response.status / 10) === 50) {
      return Promise.resolve(response)
    }
  }

  // Response interceptor starts
  const clonedResponse = response.clone()
  const json = () => clonedResponse.json().then((data) => ({ ...data }))

  response.json = json
  // Response interceptor ends

  return response
}

class ApiClient {
  timeout = 15000
  dataBaseUrl = ADMIN_BASE

  constructor(timeout) {
    this.timeout = timeout
  }

  delete(url, data, config) {
    return this.makeRequest(url, data, Object.assign({ method: API_METHOD.DELETE }, config))
  }

  get(url, config) {
    return this.makeRequest(url, null, Object.assign({ method: API_METHOD.GET }, config))
  }

  post(url, data, config) {
    return this.makeRequest(url, data, Object.assign({ method: API_METHOD.POST }, config))
  }

  put(url, data, config) {
    return this.makeRequest(url, data, Object.assign({ method: API_METHOD.PUT }, config))
  }

  patch(url, data, config) {
    return this.makeRequest(url, data, Object.assign({ method: API_METHOD.PATCH }, config))
  }

  async makeRequest(url, data, config) {
    const abortController = config.abortController ?? new AbortController()

    const method = config.method
    const headers = { ...HEADERS_DEFAULT, ...config.headers }

    let body
    let queryString = ''

    if (typeOfValue(url) === 'string' && url.startsWith('/')) {
      url = this.dataBaseUrl + url
    }

    if (!_isEmpty(config.params)) {
      queryString = '?' + this.getQueryString(config.params)
      url = url + queryString
    }

    if (
      [API_METHOD.PATCH, API_METHOD.POST, API_METHOD.PUT, API_METHOD.DELETE].indexOf(method) > -1 &&
      !!data
    ) {
      if (_get(headers, 'Content-Type') === 'multipart/form-data') {
        body = data

        delete headers['Content-Type']
      } else if (_get(headers, 'Content-Type') === 'application/json') {
        body = JSON.stringify(data)
      } else {
        body = JSON.stringify(data)
      }
    }

    try {
      const id =
        !config.keepalive &&
        setTimeout(() => abortController.abort(), config.timeout || this.timeout)
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: abortController.signal,
        keepalive: config.keepalive ?? false
      })

      id && clearTimeout(id)

      const data = await this.unwrapResponseData(response)

      if (response.ok) {
        const responseData = {
          data,
          status: {
            code: response.status,
            text: response.statusText,
            isAbort: false
          },
          headers: Object.fromEntries(response.headers.entries()),
          response: response
        }

        return responseData
      }

      return Promise.reject(this.normalizeError(data, response))
    } catch (error) {
      return Promise.reject(this.normalizeTransportError(error))
    }
  }

  /**
   * I unwrap the response payload from the given response based on the reported
   * content-type.
   */
  async unwrapResponseData(response) {
    const contentType = response.headers.has('content-type')
      ? response.headers.get('content-type')
      : ''

    if (contentType && REGEX_CONTENT_TYPE_JSON.test(contentType)) {
      return response.json()
    } else if (contentType && REGEX_CONTENT_TYPE_TEXT.test(contentType)) {
      return response.text()
    } else {
      return response.blob()
    }
  }

  getQueryString(params) {
    const esc = encodeURIComponent

    return Object.keys(params)
      .map((k) => {
        if (params[k] !== '') {
          if (typeOfValue(params[k]) === 'array') {
            let queryParam = ''

            for (let item of params[k]) {
              queryParam = queryParam + `${queryParam.length > 0 ? '&' : ''}${k}=${item}`
            }

            return queryParam
          }

          return esc(k) + '=' + esc(params[k])
        }
      })
      .filter((item) => item)
      .join('&')
  }

  normalizeError(data, fetchResponse) {
    const error = {
      data,
      status: {
        code: fetchResponse.status,
        text: fetchResponse.statusText,
        isAbort: false
      },
      headers: Object.fromEntries(fetchResponse.headers.entries()),
      // request: fetchRequest,
      response: fetchResponse
    }

    if (error?.status?.code === 401 && window.location.pathname !== '/auth/login') {
      removeAllCookies()
      window.location.replace('/auth/login?expired=true')
    }

    if (error?.status?.code === 403) {
      window.location.replace('/forbidden')
    }

    return error
  }

  normalizeTransportError(error) {
    return {
      data: {
        type: 'TransportError',
        // message: systemErrorMessages.unexpectedError,
        message: 'error',
        rootCause: error
      },
      status: {
        code: 0,
        text: 'Unknown',
        isAbort: error.name === 'AbortError'
      }
    }
  }
}

export const apiClient = new ApiClient(
  // process.env.VITE_PUBLIC_AUTH_API_URL || 'http://localhost:3000', // Auth URL
  // process.env.VITE_PUBLIC_DATA_API_URL || 'http://localhost:3000', // API URL
  process.env.VITE_GDOS_FETCH_TIMEOUT || 15000
)
