import { createMocks } from 'node-mocks-http'
import generatePdf from '@api/generatePdf'

beforeEach(async () => {
  jest.setTimeout(100000)
})

describe('/api/generatePdf', () => {
  test('PDF of a valid url is generated and returned', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        from: 'https://google.com',
      },
    })

    await generatePdf(req, res)
    expect(res._getHeaders()['content-type']).toBe('application/pdf')
    expect(res._getStatusCode()).toBe(200)
  })

  test('PDF of a valid url is generated but not returned because it is >5MB', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        from: 'https://wideawake.earth/shop',
      },
    })

    await generatePdf(req, res)
    expect(res._getHeaders()['content-type']).toBe('application/json')
    expect(res._getStatusCode()).toBe(413)
  })

  test("PDF can't be generated (page not found)", async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        from: 'https://testdomaindoesntexist.com/',
      },
    })
    await generatePdf(req, res)
    expect(res._getHeaders()['content-type']).toBe('application/json')
    expect(res._getStatusCode()).toBe(404)
  })
})
