export const typeOfValue = (value) =>
  Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
