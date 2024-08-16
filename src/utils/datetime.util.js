import { format } from 'date-fns'
import OffsetInMilisecond from './offsetInMilisecond.json'
import { isDate } from 'lodash'

export const formatDatetime = (value, formatString, isLocalTime = false) => {
  if (value) {
    const dateTimeString = isLocalTime ? value : value?.slice(0, -1)

    return format(new Date(dateTimeString), formatString)
  }
  return ''
}

export function convertISOToLocalTimeWithGMT(value, gmtString, formatString) {
  // Remove "Z" latest character
  const parseValue = new Date(value.slice(0, -1))
  const timestamp = parseValue.getTime()
  const offset = OffsetInMilisecond[gmtString]

  if (offset) {
    const result = timestamp + offset
    return formatDatetime(result, formatString, true)
  }

  return '-'
}

export function isValidDate(obj) {
  return isDate(obj) && obj.toString() !== 'Invalid Date'
}
