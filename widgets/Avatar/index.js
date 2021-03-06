import Image from 'next/image'

function Avatar(props) {
  const { group = false, imgSrc, ...others } = props
  const defalutAvatar = '/default-avatar.png'

  return (
    <Image
      src={group ? defalutAvatar : imgSrc ? imgSrc : defalutAvatar}
      alt="avatar"
      width={36}
      height={36}
      {...others}
    />
  )
}

export default Avatar
