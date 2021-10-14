function fallbackCopyText(text, toast, t) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  // textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    successful ? toast.success(t('copy_success')) : toast.error(t('try_again'))
  } catch (err) {
    toast.error(t('try_again'))
  }
  document.body.removeChild(textArea)
}

export function copyText(text, toast, t) {
  if (!navigator.clipboard) {
    fallbackCopyText(text, toast, t)
    return
  }
  navigator.clipboard.writeText(text).then(() => {
    toast.success(t('copy_success'))
  }, (err) => {
    fallbackCopyText(text, toast, t)
  })
}
