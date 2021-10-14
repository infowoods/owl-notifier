function fallbackCopyText(text, toast, t) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    successful ? toast.success(t('copy_success')) : toast.error(t('try_again'))
  } catch (err) {
    document.body.removeChild(textArea)
    toast.error(t('try_again'))
  }
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
