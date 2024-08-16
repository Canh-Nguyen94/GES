import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { apiClient } from '@helpers/fetch.helper'
import { getDefaultOptions, pathToUrl } from '@helpers/vue-query.helper'

export const fetcher = async ({ queryKey, pageParam: page }, configs) => {
  const [url, params, pathParams] = queryKey
  const paramsRequest = {
    ...params
  }

  if (page) {
    paramsRequest['page'] = page
  }

  const res = await apiClient.get(pathParams ? pathToUrl(url, { ...pathParams }) : url, {
    ...configs,
    params: paramsRequest
  })

  return res.data
}

export const useFetch = (url, configs, queryOptions, pathParams) => {
  const context = useQuery(
    [url, configs?.params, pathParams, configs?.key],
    ({ queryKey, meta }) => fetcher({ queryKey, meta }, configs),
    {
      enabled: !!url,
      ...getDefaultOptions(queryOptions)
    }
  )

  return context
}

export const usePrefetch = (url, configs) => {
  const queryClient = useQueryClient()

  return () => {
    if (!url) {
      return
    }

    queryClient.prefetchQuery([url, configs?.params], ({ queryKey, meta }) =>
      fetcher({ queryKey, meta }, configs)
    )
  }
}

// FOR POST FETCHER
/**
 *
 * @param param0
 * @param configs
 * @returns
 */
export const fetcherByPost = async ({ queryKey, pageParam }, configs) => {
  const [url, body, params] = queryKey
  let res

  if (pageParam) {
    res = await apiClient.post(
      url,
      {
        data: {
          ...body.data,
          page_number: pageParam
        }
      },
      { ...configs, params: { ...params, pageParam } }
    )
  } else {
    res = await apiClient.post(url, body, {
      ...configs,
      params: { ...params }
    })
  }

  return res.data
}

export const usePostFetch = (url, body, configs, queryOptions) => {
  const context = useQuery(
    [url, body, configs?.params],
    ({ queryKey, meta }) => fetcherByPost({ queryKey, meta }, configs),
    {
      enabled: !!url,
      ...getDefaultOptions(queryOptions)
    }
  )

  return context
}

export const usePostPrefetch = (url, body, configs) => {
  const queryClient = useQueryClient()

  return () => {
    if (!url) {
      return
    }

    queryClient.prefetchQuery([url, body, configs?.params], ({ queryKey, meta }) =>
      fetcherByPost({ queryKey, meta }, configs)
    )
  }
}
// END POST FETCHER

export const usePostLoadMore = (url, body, configs, queryOptions) => {
  const context = useInfiniteQuery(
    [url, body, configs?.params],
    ({ queryKey, pageParam = 1, meta }) => fetcherByPost({ queryKey, pageParam, meta }, configs),
    {
      getPreviousPageParam: (firstPage) => {
        return firstPage.current_page ?? false
      },

      getNextPageParam: (lastPage) => {
        if (lastPage?.current_page < lastPage?.total_pages) {
          return lastPage.page + 1
        }

        return undefined
      },

      ...getDefaultOptions(queryOptions)
    }
  )

  return context
}

export const useLoadMore = (url, configs, queryOptions) => {
  const context = useInfiniteQuery(
    [url, configs?.params],
    ({ queryKey, pageParam = 1, meta }) => fetcher({ queryKey, pageParam, meta }, configs),
    {
      getPreviousPageParam: (firstPage) => {
        return firstPage.current_page ?? false
      },

      getNextPageParam: (lastPage) => {
        if (lastPage?.current_page < lastPage?.total_pages) {
          return lastPage.current_page + 1
        }

        return undefined
      },

      ...getDefaultOptions(queryOptions)
    }
  )

  return context
}

const useGenericMutation = (func, url, params, updater, queryOptions) => {
  const queryClient = useQueryClient()

  return useMutation(func, {
    onMutate: async (data) => {
      await queryClient.cancelQueries([url, params])
      const previousData = queryClient.getQueryData([url, params])
      queryClient.setQueryData([url, params], (oldData) => {
        return updater ? updater(oldData, data) : data
      })
      return previousData
    },

    onError: (err, _, context) => {
      queryClient.setQueryData([url, params], context)
    },

    onSettled: () => {
      queryClient.invalidateQueries([url, params])
    },

    ...getDefaultOptions(queryOptions)
  })
}

export const useDeleteWithBody = (url, configs, updater, queryOptions) => {
  return useGenericMutation(
    (data) => apiClient.delete(url, data, configs),
    url,
    configs?.params,
    updater,
    queryOptions
  )
}

export const useDelete = (url, configs, updater, queryOptions) => {
  return useGenericMutation(
    (data) =>
      apiClient.delete(
        data?.pathParams ? pathToUrl(url, { ...data.pathParams }) : url,
        data?.bodyPayload,
        configs
      ),
    url,
    configs?.params,
    updater,
    queryOptions
  )
}

export const usePost = (url, configs, updater, queryOptions) => {
  return useGenericMutation(
    (data) =>
      apiClient.post(
        data?.pathParams ? pathToUrl(url, { ...data.pathParams }) : url,
        data?.bodyPayload,
        configs
      ),
    url,
    configs?.params,
    updater,
    queryOptions
  )
}

export const usePatch = (url, configs, updater, queryOptions) => {
  return useGenericMutation(
    (data) =>
      apiClient.patch(
        data.pathParams ? pathToUrl(url, { ...data.pathParams }) : url,
        data.bodyPayload,
        configs
      ),
    url,
    configs?.params,
    updater,
    queryOptions
  )
}

export const usePut = (url, configs, updater, queryOptions) => {
  return useGenericMutation(
    (data) =>
      apiClient.put(
        data.pathParams ? pathToUrl(url, { ...data.pathParams }) : url,
        data.bodyPayload,
        configs
      ),
    url,
    configs?.params,
    updater,
    queryOptions
  )
}
