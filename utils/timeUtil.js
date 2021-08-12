export function convertTimestamp(time, offset) {
  const local_ts_ms = time * 1000 + offset * 3600
  const date_ob = new Date(local_ts_ms)
  const year = date_ob.getFullYear()
  const month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
  const day = ('0' + date_ob.getDate()).slice(-2)
  const hour = ('0' + date_ob.getHours()).slice(-2)
  const min = ('0' + date_ob.getMinutes()).slice(-2)
  const date = year + '-' + month + '-' + day + ' ' + hour + ':' + min

  return date
}