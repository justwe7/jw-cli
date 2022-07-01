import * as path from 'path'
import * as os from 'os'
import * as downloadGit from 'download-git-repo'

export default async function (originRepoName: string) {
  const tmpdir = path.resolve(os.tmpdir(), 'jw-cli')

  return new Promise((resolve, reject) => {
    downloadGit(originRepoName, tmpdir, {}, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(tmpdir)
    })
  })
}

// // console.log(os.tmpdir(), tmpdir)
// // https://github.com/justwe7/Vue-SSR

// let api = 'microsoft/vscode-react-sample'
// downloadGit(api, 'demo', {}, (err) => {
// })
