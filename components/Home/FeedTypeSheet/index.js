import BottomSheet from "../../../widgets/BottomSheet"
import Icon from "../../../widgets/Icon"
import styles from './index.module.scss'

function FeedTypeSheet(props) {
  const {
    t,
    show,
    onClose,
    feedOptions,
    feedType,
    setFeedType,
    setFeedInfo,
    setFeedError,
    setShow,
  } = props

  return (
    <BottomSheet
        t={t}
        show={show}
        onClose={onClose}
      >
        <div className={styles.sheet}>
          {
            feedOptions.map((item) => {
              const isSelected = item.name === feedType.name
              return (
                <div
                  key={item.type}
                  className={`${isSelected && styles.optionSelected}`}
                  onClick={() => {
                    setFeedType(item)
                    if (feedType.type !== item.type) {
                      setFeedInfo({})
                      setFeedError('')
                    }
                    setShow(false)
                  }}
                >
                  <p>
                    <Icon type={item.icon} className={styles.feedIcon} />
                    {item.name}
                    {item.remark && <span>{item.remark}</span>}
                  </p>
                  {
                    isSelected &&
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

export default FeedTypeSheet