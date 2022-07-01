import { unescape, escape } from 'querystring'
import * as https from 'https'
import * as ora from 'ora'
import * as chalk from 'chalk'
import MD5 from '../lib/md5'

const appid = '20220617001250356'
const key = 'HJXcVnFUYsUk1PvTDzBK'
const query = 'apple'
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'

// console.log({
//   q: query,
//   appid: appid,
//   salt: salt,
//   from: from,
//   to: to,
//   sign: sign
// })

function translate({ wd, from = 'auto', to = 'zh' }) {
  const salt = +new Date()
  const sign = MD5(appid + wd + salt + key)
  const options = {
    hostname: 'fanyi-api.baidu.com',
    // hostname: 'https://fanyi-api.baidu.com',
    port: 443,
    path:
      '/api/trans/vip/translate?' +
      `q=${escape(
        wd,
      )}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`,
    method: 'GET',
  }

  return new Promise((resolve, reject) => {
    const spinner = ora({
      spinner: 'circleHalves',
    }).start()
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        const result = JSON.parse(d.toString())
        // console.log(result)
        if (result.error_code) {
          reject(result.error_msg)
          spinner.fail(result.error_msg)
          return
        }
        const resultStr = result.trans_result.slice(1).reduce((str, target) => {
          str += '-' + target.dst
          return str
        }, result.trans_result[0].dst)
        resolve(resultStr)
        spinner.stopAndPersist({
          // prefixText: '🦄',
          text: chalk.redBright(wd) + ' ↪️ ' + chalk.cyanBright(resultStr),
        })

        // resolve({
        //   from: result.from,
        //   to: result.to,
        //   trans_result: result.trans_result.map(item => {
        //     return {
        //       src: item.src,
        //       dst: decodeURIComponent(item.dst)
        //     }
        //   })
        // })
      })
    })

    req.on('error', (error) => {
      console.error(error)
    })

    req.end()
  })
}

export default translate

/* translate({ wd: '橙子', to: 'en' }).then(res => {
  console.log(1, res)
}).catch(err => {
  console.log(err, '失败')
})
translate({ wd: 'How are you' }).then(res => {
  console.log(1, res)
}).catch(err => {
  console.log(err, '失败')
}) */
