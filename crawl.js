const { JSDOM } = require('jsdom')


async function crawlPage(baseURL, currentURL, pages) {
  try {
    if (new URL(baseURL).hostname !== new URL(currentURL).hostname) {
      return pages;
    }

    let normalizedURL = normalizeURL(currentURL);

    if (normalizedURL in pages) {
      pages[normalizedURL] = pages[normalizedURL] + 1;
      return pages;
    } else {
      pages[normalizedURL] = 1;
    }
    console.log(`Crawling ${currentURL}`);
    const response = await fetch(currentURL);
    let contentType = response.headers.get('content-type') || '';

    if (response.status > 399) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    } else if (!contentType.includes('text/html')) {
      throw new Error('Page is not HTML');
    } else {
      let html = await response.text();
      let urls = getURLsFromHTML(html, currentURL);

      for (let i = 0; i < urls.length; i++) {
        if (!(normalizeURL(urls[i]) in pages)) {
          pages = await crawlPage(baseURL, urls[i], pages);
        }
      }

      return pages;
    }

  } catch (err) {
    console.log(err.message);
    return pages || {};
  }
}


function getURLsFromHTML(html, currentURL) {
  const urls = [];
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll('a');

  links.forEach(link => {
    if (link.href.slice(0, 1) === '/') {
      try {
        urls.push(new URL(link.href, currentURL).href);
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