import Details from '../../../components/Amos/Details'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
const i18nConfig = require('../../../next-i18next.config')

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  }
}

export async function getStaticPaths() {
  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

export default Details