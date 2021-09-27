import Image from 'next/image'

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
      width={35}
      height={35}
      {...others}
    />
  )
}

export default Avatar