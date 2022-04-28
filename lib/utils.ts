export const isInternalLink = (link: string): boolean => {
  if (
    link.startsWith('/') ||
    link.startsWith('#') ||
    link.startsWith('https://terraform.io') ||
    link.startsWith('https://www.terraform.io')
  ) {
    return true
  }
  return false
}
