import Document, { Html, Head, Main, NextScript } from 'next/document'

class _Document extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charset='UTF-8' />
          <meta
            name='description'
            content='A simple fullstack TO DO list where you can organize all your stuffs'
          />
          <meta name='keywords' content='Next.js, React, Prisma' />
          <meta name='author' content='And3e - https://github.com/And3e' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default _Document
