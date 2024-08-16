import { REGEX_EMAIL } from '@constants/regex.constant'
import { isNil } from 'lodash-es'

export const required = (value) => {
  if (isNil(value)) return false
  return !!String(value).length
}

export const email = (value) => REGEX_EMAIL.test(value)
