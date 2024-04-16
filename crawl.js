normalizeURL = function (url) {
  const urlObj = new URL(url)
  let hostname = urlObj.hostname
  let pathname = urlObj.pathname

  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return `${hostname}${pathname}`
}


module.exports = {
  normalizeURL
}