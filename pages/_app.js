import { AppProviders } from 'components'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
  <AppProviders>
    <Component {...pageProps} />
  </AppProviders>
  )
}

export default MyApp
