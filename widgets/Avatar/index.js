import Image from 'next/image'
import styles from './index.module.scss'

function Avatar(props) {
  const { group=false, imgSrc } = props
  const defalutAvatar = '/default-avatar.png'

  return (
    <Image
      src={group ? defalutAvatar : (imgSrc ? imgSrc : defalutAvatar)}
      alt="avatar"
      width={35}
      height={35}
    />
  )
}

export default Avatar