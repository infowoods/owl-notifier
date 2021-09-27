import Home from '../components/Home'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
const i18nConfig = require('../next-i18next.config')

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
}

export default Home
// export default function HomePage() {
//   return (
//     <Home />
//   )
// }

// HomePage.getLayout = function getLayout(page) {
//   return (
//     <HomeLayout>
//       {page}
//     </HomeLayout>
//   )
// }
