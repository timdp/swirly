const re = /^[-+]?(?:\d+|\d*(?:\.\d+))$/

export const isNumeric = (str: string): boolean => re.test(str)
