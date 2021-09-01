import BottomSheet from "../../../widgets/BottomSheet"
import Icon from "../../../widgets/Icon"
import styles from './index.module.scss'

function PriceSheet(props) {
  const {
    t,
    show,
    withConfirm,
    confirmTitle,
    confirmText,
    onClose,
    onCancel,
    onConfirm,
    options,
    selectPeriod,
    chargeCrypto,
    setSelectPeriod,
  } = props

  return (
    <BottomSheet
      t={t}
      show={show}
      withConfirm={withConfirm}
      confirmTitle={confirmTitle}
      confirmText={confirmText}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <div className={styles.sheet}>
        {
          options.map((item) => {
            return (
              <div
                key={item.period}
                className={`${item.period === selectPeriod && styles.optionSelected}`}
                onClick={() => {
                  setSelectPeriod(item.period)
                }}
              >
                <p className={styles.subcribePrice}>
                  <div>
                    <img
                      src={chargeCrypto.icon_url}
                      alt="crypto"
                    />
                    {item.price} {chargeCrypto.symbol} / {t(item.period)}
                  </div>
                </p>
                {
                  item.period === selectPeriod &&
                  <Icon type="check-line" className={styles.selected} />
                }
              </div>
            )
          })
        }
      </div>
    </BottomSheet>
  )
}

export default PriceSheet