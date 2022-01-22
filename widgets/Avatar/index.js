import Image from 'next/image'
import styles from './index.module.scss'

function Avatar(props) {
  const {
    group = false,
    imgSrc,
    ...others
  } = props
  const defalutAvatar = '/default-avatar.png'

  return (
    <Image
      src={group ? defalutAvatar : (imgSrc ? imgSrc : defalutAvatar)}
      alt="avatar"
      width={36}
      height={36}
      className={styles.avatar}
      {...others}
    />
  )
}

export default Avatar