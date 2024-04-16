const { crawlPage } = require('./crawl.js')

// accept command line arguments
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Please provide a URL')
    return
  }
  if (args.length > 1) {
    console.log('Please provide only one URL')
    return
  }

  const baseURL = args[0]
  console.log(`Crawling ${baseURL}`)
  await crawlPage(baseURL)
}


main()