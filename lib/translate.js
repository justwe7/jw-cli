const https = require('https');
const { unescape, escape } = require('querystring');
const MD5 = require('./md5');

const appid = '20220617001250356';
const key = 'HJXcVnFUYsUk1PvTDzBK';
const query = 'apple';
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'


// console.log({
//   q: query,
//   appid: appid,
//   salt: salt,
//   from: from,
//   to: to,
//   sign: sign
// })

function translate ({ wd, from = 'auto', to = 'zh' }) {
  console.log(111, wd)
  const salt = +new Date();
  const sign = MD5(appid + wd + salt + key);
  console.log(sign)
  const options = {
    hostname: 'fanyi-api.baidu.com',
    // hostname: 'https://fanyi-api.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + `q=${escape(wd)}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`,
    method: 'GET'
  }

  return new Promise((resolve) => {
      const req = https.request(options, res => {
        console.log(`状态码: ${res.statusCode}`)
      
        res.on('data', d => {
          console.log(d.toString())
          // process.stdout.write(d)
          const result = JSON.parse(d.toString())
          console.log(result)
          // resolve(result)
          resolve({
            from: result.from,
            to: result.to,
            trans_result: result.trans_result.map(item => {
              return {
                src: item.src,
                dst: decodeURIComponent(item.dst)
              }
            })
          })
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()
  })
  
}

module.exports = translate

// translate({ wd: '橙子', to: 'en' }).then(res => {
//   console.log(1, res)
// })
translate({ wd: 'How are you' }).then(res => {
  console.log(1, res)
})