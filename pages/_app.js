import { useReducer } from 'react'
import { appWithTranslation } from 'next-i18next'
import { ProfileContext, state, reducer} from '../stores/useProfile'
import '../styles/globals.scss'
import '../styles/themes.scss'

function MyApp({ Component, pageProps }) {
  const store = useReducer(reducer, state)

  return (
    <ProfileContext.Provider value={store}>
      <Component {...pageProps} />
    </ProfileContext.Provider>
  )
}

export default appWithTranslation(MyApp)
