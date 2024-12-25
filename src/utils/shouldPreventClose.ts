let shouldPreventClose = false

export const getShouldPreventClose = (): boolean => shouldPreventClose

export const setShouldPreventClose = (value): void => {
  shouldPreventClose = value
}
