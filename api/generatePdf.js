let chrome = {}
let puppeteer

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform
  chrome = require('chrome-aws-lambda')
  puppeteer = require('puppeteer-core')
} else {
  // running locally.
  puppeteer = require('puppeteer')
}

const urlExist = require('url-exist')
const MAX_PDF_SIZE = 5242880 // ~ 5MB ; maximum PDF size

module.exports = async function ({ query: { from } }, res) {
  const url = from
  try {
    const pageExists = await urlExist(url)
    if (!pageExists) {
      return res.status(404).json({ error: `Page at url ${url} could not be found`, i18n_id: '@url2pdf/not_found' })
    }

    const browser = await puppeteer.launch(
      process.env.AWS_REGION
        ? {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
          }
        : {
            args: [],
          },
    )

    const webPage = await browser.newPage()

    // Go to the page
    const navRes = await webPage.goto(url, {
      waitUntil: 'networkidle0', // tells Puppeteer to wait for the page to finish loading
      timeout: 0,
    })

    if (navRes.status() === 200) {
      const pdf = await webPage.pdf({
        format: 'A4',
        printBackground: true,
      })
      await browser.close()

      const buffedPdf = Buffer.from(pdf)
      if (buffedPdf.length < MAX_PDF_SIZE) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/pdf')
        res.send(pdf)
      } else {
        return res
          .status(413)
          .json({ error: 'The generated PDF is too large to be sent.', i18n_id: '@url2pdf/payload_too_large' })
      }
    }
  } catch (e) {
    return res.status(500).json({ error: `Unexpected error. ${e}`, i18n_id: '@url2pdf/unexpected_error' })
  }
}
