const util = require('util')
const exec = util.promisify(require('child_process').exec)
const execSync = require('child_process').execSync
const ora = require('ora')
const chalk = require('chalk')
const { formatDate } = require('./utils')

module.exports = async function ({ name, separator }) {
  const spinner = ora({
    spinner: 'dots12'
  }).start()
  let remoteDefaultBranchName = 'master'
  execSync('git branch -r').toString().split('\n').some(brName => {
    if (brName.trim() === 'origin/main') { // 以origin处理
      remoteDefaultBranchName = 'main'
      return true
    }
  })
  const userName = execSync('git config user.name').toString().trim()
  // e.g: dev_userName_demandName_YYYYMMDD

  const branchName = separator + [userName, name, formatDate(new Date(), 'YYYYMMDD')].join(separator)
  const DevBarnch = 'dev' + branchName
  const TestBarnch = 'test' + branchName
  // console.log(DevBarnch)
  spinner.text = '同步远端仓库...'
  await exec('git fetch --all')
  spinner.text = '同步完成，正在切换分支...'
  try {
    const res = await exec(`git checkout -b ${DevBarnch} origin/${remoteDefaultBranchName}`)
    spinner.text = res.stderr
  } catch (error) {
    spinner.fail(chalk.red(error.stderr))
    // spinner.text = `本地存在分支<${DevBarnch}>`
    // exec(`git checkout ${DevBarnch}`)
    return
  }
  spinner.color = 'yellow'
  spinner.text = `已切换到<${DevBarnch}>分支，正在推送至远端...`
  try {
    await exec(`git push origin HEAD:${DevBarnch}`)
    await exec(`git push origin HEAD:${TestBarnch}`)
    await exec(`git branch --set-upstream-to=origin/${DevBarnch}`)
    spinner.succeed(chalk.greenBright(`本地<${DevBarnch}>分支已创建并关联远端同名分支，远端<${TestBarnch}>已推送`))
  } catch (error) {
    spinner.fail(chalk.red(error.stderr))
  }
}
