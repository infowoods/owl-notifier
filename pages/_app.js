import { useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { i18n } from 'next-i18next'
import { getMixinContext } from '../services/api/mixin'
import { ProfileContext, state, reducer} from '../stores/useProfile'
import storageUtil from '../utils/storageUtil'
import '../styles/globals.scss'
import '../styles/themes.scss'

function MyApp({ Component, pageProps }) {
  const store = useReducer(reducer, state)
  const { pathname, push } = useRouter()

  useEffect(() => {
    const ctx = getMixinContext()
    if (ctx?.locale && ctx.locale !== 'zh-CN') {
      i18n.changeLanguage('en')
      push(pathname, pathname, { locale: 'en' })
    }
    ctx.appearance && document.documentElement.setAttribute('data-theme', ctx.appearance)
  }, [])

  return (
    <ProfileContext.Provider value={store}>
      <Component {...pageProps} />
    </ProfileContext.Provider>
  )
}

export default appWithTranslation(MyApp)
