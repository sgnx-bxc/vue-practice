const title = 'My Reaction Platform'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return title
}
