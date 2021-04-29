# URL2PDF

URL2PDF is a micro service that aims to generate PDF from web pages easily by just providing the URL.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FnaomiHauret%2Furl2pdf)

## API
### Generate a PDF
#### Endpoint
```
GET /api/generatePdf?from=<some-url>
```
Returns the PDF version of the `<some-url>` page.

#### Parameters
* `some-url`: A valid URL

#### Responses

* `200`: PDF Generated with success
* `400`: Invalid URL
* `404`: The target page could not be found. `<some-url>` might be broken.
* `413`: Generated PDF is too large. The limit is 5MB. See [Vercel docs](https://vercel.com/docs/platform/limits#serverless-function-payload-size-limit)
* `500`: Internal server error. Something broke down, for some reason.

## Under the hood

URL2PDF uses [Puppeteer](https://developers.google.com/web/tools/puppeteer/), a Node.js library that allows us to control a headless Chromium/Chrome.

## Limitations

- The size of the generated PDF must be < 5MB. Make sure that the page you want to render as a PDF is optimized, especially when it comes to images !
- If the page/element you want to convert to PDF is protected (eg: the user needs to be logged in to access it), you won't be able to generate a PDF from that page (or it will be an error page from that page).