import { Toaster } from "react-hot-toast"
import styles from './index.module.scss'

function OwlToast(props) {
  return (
    <Toaster
      toastOptions={{
        className: styles.toast,
      }}
    />
  )
}

export default OwlToast