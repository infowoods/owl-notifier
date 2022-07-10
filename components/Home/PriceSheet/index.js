import BottomSheet from '../../../widgets/BottomSheet'
import Image from 'next/image'
import Icon from '../../../widgets/Icon'
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
        {options.map((item) => {
          return (
            <div
              key={item.period}
              className={`${
                item.period === selectPeriod && styles.optionSelected
              }`}
              onClick={() => {
                setSelectPeriod(item.period)
              }}
            >
              <div className={styles.subcribePrice}>
                <div>
                  <Image
                    src={chargeCrypto.icon_url}
                    alt="crypto"
                    width={25}
                    height={25}
                    quality={100}
                  />
                  <span>
                    {item.price} {chargeCrypto.symbol} / {t(item.period)}
                  </span>
                </div>
              </div>
              {item.period === selectPeriod && (
                <Icon type="check-line" className={styles.selected} />
              )}
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}

export default PriceSheet
