import { useReducer } from 'react'
import { appWithTranslation } from 'next-i18next'
import { ProfileContext, state, reducer } from '../stores/useProfile'
import '../styles/globals.scss'
import '../styles/themes.scss'
const i18nConfig = require('../next-i18next.config')
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  const store = useReducer(reducer, state)

  return (
    <ProfileContext.Provider value={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProfileContext.Provider>
  )
}

export default appWithTranslation(MyApp, i18nConfig)
