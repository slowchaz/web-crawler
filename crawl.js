const { JSDOM } = require('jsdom')


async function crawlPage(url) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`)
    } else if (!response.headers.get('content-type').includes('text/html')) {
      throw new Error('Page is not HTML')
    } else {
      return await response.text()
    }

  } catch (err) {
    console.log(err.message)
    return null
  }

}


function getURLsFromHTML(html, baseURL) {
  const urls = [];
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll('a');

  links.forEach(link => {
    if (link.href.slice(0, 1) === '/') {
      try {
        urls.push(new URL(link.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${link.href}`);
      }
    } else {
      try {
        urls.push(new URL(link.href).href);
      } catch (err) {
        console.log(`${err.message}: ${link.href}`);
      }
    }
  });

  return urls;
}


function normalizeURL(url) {
  const urlObj = new URL(url);
  let hostname = urlObj.hostname;
  let pathname = urlObj.pathname;

  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return `${hostname}${pathname}`;
}


module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}