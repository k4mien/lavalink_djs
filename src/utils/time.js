module.exports = function formatMSHHMMSS (num) {
  return [86400000, 3600000, 60000, 1000, 1].reduce((p, c) => {
    const res = Math.floor(num / c)
    num -= res * c
    return [...p, res]
  }, [])
    .map((v, i) => i <= 1 && v === 0 ? '' : [i === 4 ? '.' : '', v < 10 ? `0${v}` : v, [' Days, ', ':', ':', '', ''][i]].join(''))
    .filter(Boolean)
    .slice(0, -1)
    .join('')
}
