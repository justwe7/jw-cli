import * as https from 'https'
import * as ora from 'ora'
import * as chalk from 'chalk'

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

function translate(params: { wd: string; from?: string; to?: string }) {
  const queryStringArr = []
  for (const [key, val] of Object.entries(params)) {
    queryStringArr.push(`${key}=${val}`)
  }
  // const salt = +new Date()
  // const sign = MD5(appid + wd + salt + key)
  const options = {
    hostname: 'api-puce-rho.vercel.app',
    // hostname: 'https://fanyi-api.baidu.com',
    port: 443,
    path: encodeURI('/api/translate?' + queryStringArr.join('&')),
    method: 'GET',
  }
  // const options = {
  //   hostname: 'fanyi-api.baidu.com',
  //   // hostname: 'https://fanyi-api.baidu.com',
  //   port: 443,
  //   path:
  //     '/api/trans/vip/translate?' +
  //     `q=${escape(
  //       wd,
  //     )}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`,
  //   method: 'GET',
  // }

  return new Promise((resolve, reject) => {
    const spinner = ora({
      spinner: 'circleHalves',
    }).start()
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        const result = JSON.parse(d.toString())
        // console.log(result)
        if (result.code !== 200) {
          reject(result.data)
          spinner.fail(result.data)
          return
        }
        const ret = result.data
        const resultStr = ret.trans_result.slice(1).reduce((str, target) => {
          str += '-' + target.dst
          return str
        }, ret.trans_result[0].dst)
        resolve(resultStr)
        spinner.stopAndPersist({
          // prefixText: '🦄',
          text:
            chalk.redBright(params.wd) + ' ↪️ ' + chalk.cyanBright(resultStr),
        })
      })
    })

    req.on('error', (error) => {
      console.error(error)
      reject(error)
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
