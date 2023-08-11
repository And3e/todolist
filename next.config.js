const randomBytes = require('randombytes')

const nonce = randomBytes(128).toString('base64')
const ContentSecurityPolicy = `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' https://authjs.dev;`

module.exports = {
  pageExtensions: ['js', 'jsx'],
  async headers() {
    return [
      {
        // Set specific routes where the Content-Security-Policy header applies
        source: '/',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
}
