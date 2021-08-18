const STRING_IN_QUOTES_REGEX = /^'|".*'|"$/

export const isQueryCorrectLength = (query: string): boolean => {
  if (STRING_IN_QUOTES_REGEX.test(query)) {
    return query.length >= 5
  }

  return query.length >= 3
}