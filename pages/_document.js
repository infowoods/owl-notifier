import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    // const { theme='light' } = nookies.get(ctx) || {}
    // return { ...initialProps, theme }
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script defer src="/fonts/iconfont-2021-08-08.js" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
