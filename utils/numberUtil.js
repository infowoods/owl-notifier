export function formatNum(val) {
  return Number(val).toFixed(8).replace(/\.?0+$/,"")
}

export function formatAdd(a, b) {
  return (Number(a) + Number(b)).toFixed(8).replace(/\.?0+$/,"")
}