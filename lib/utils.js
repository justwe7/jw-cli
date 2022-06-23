const { execSync } = require('child_process')
let hasGit

module.exports = {
  promisify: function promisify(fn) {
    return function (...arg) {
      let promise = fn(...arg)
      if (
        !promise ||
        (!(promise instanceof Promise) && typeof promise.then !== 'function')
      ) {
        promise = Promise.resolve(promise)
      }
      return promise
    }
  },
  hasGit: function hasGit() {
    if (hasGit) return true

    try {
      execSync('git --version', { stdio: 'ignore' })
      return (hasGit = true)
    } catch (error) {
      return (hasGit = false)
    }
  },
  formatDate: function formatDate(date, fmt) {
    fmt = fmt || 'YYYY-MM-DD HH:mm:ss'
    if (!date) {
      return ''
    }
    if (typeof date === 'string') {
      date = isNaN(Number(date))
        ? new Date(date.replace(/-/g, '/'))
        : new Date(+date)
    }
    if (typeof date === 'number') {
      date = new Date(date)
    }
    var o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds(),
    }
    var week = {
      0: '\u65e5',
      1: '\u4e00',
      2: '\u4e8c',
      3: '\u4e09',
      4: '\u56db',
      5: '\u4e94',
      6: '\u516d',
    }
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length),
      )
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (RegExp.$1.length > 1
          ? RegExp.$1.length > 2
            ? '\u661f\u671f'
            : '\u5468'
          : '') + week[date.getDay() + ''],
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length),
        )
      }
    }
    return fmt
  },
}