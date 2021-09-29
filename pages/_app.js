import { useReducer, useEffect } from 'react'
import { appWithTranslation, i18n } from 'next-i18next'
import { ProfileContext, state, reducer} from '../stores/useProfile'
import '../styles/globals.scss'
import '../styles/themes.scss'
const i18nConfig = require('../next-i18next.config')
import Layout from '../components/Layout'
import { getMixinContext } from '../services/api/mixin'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const store = useReducer(reducer, state)

  const { pathname, push } = useRouter()
  // if (typeof window !== 'undefined') {
  //   console.log('18n lang:', i18n.language)
  //   const ctx = getMixinContext()
  //   if (ctx?.locale && ctx.locale !== 'zh-CN' && i18n.language === 'zh') {
  //     i18n.changeLanguage('en')
  //     push(pathname, pathname, { locale: 'en' })
  //   }
  // }

  // useEffect(() => {
  //   console.log('>>> _app init:', pathname)
  //   console.log('>>> _app lang:', pathname, i18n.language)
  //   const ctx = getMixinContext()
  //   if (ctx?.locale && ctx.locale !== 'zh-CN' && i18n.language !== 'en') {
  //     i18n.changeLanguage('en')
  //     push(pathname, pathname, { locale: 'en' })
  //   }
  // }, [])

  return (
    <ProfileContext.Provider value={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProfileContext.Provider>
  )
}

export default appWithTranslation(MyApp, i18nConfig)
