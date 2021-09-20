import BottomSheet from "../../../widgets/BottomSheet"
import styles from './index.module.scss'
const QRCode = require('qrcode.react')

function QrCodeSheet(props) {
  const {
    t,
    show,
    id,
    withConfirm,
    confirmTitle,
    confirmText,
    onClose,
    onCancel,
    onConfirm,
  } = props

  return (
    <BottomSheet
      t={t}
      show={show}
      withConfirm={true}
      confirmTitle={t('pay_with_phone')}
      confirmText={t('has_paid')}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <div className={styles.qrcode}>
        <QRCode
          value={id}
          size={240}
        />
      </div>
    </BottomSheet>
  )
}

export default QrCodeSheet