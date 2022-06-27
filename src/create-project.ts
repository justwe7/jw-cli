export {}
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const inquirer = require('inquirer')
const validateProjectName = require('validate-npm-package-name')
const chalk = require('chalk')
const ora = require('ora')

const fetchRemoteRepoTemp = require('./download-repo')

const question = [
  {
    name: 'templateName',
    type: 'list',
    choices: [
      {
        name: 'SSR(vue2)',
        value: 'Vue-SSR', // 对应GitHub仓库名（TODO: 整理template仓库
      },
      {
        name: 'uni-app',
        value: 'wxAppCanvasText',
      },
    ],
    default: 'SSR(vue2)',
  },
  {
    name: 'projectName',
    type: 'input',
    message: 'projectName',
    default: 'my-app',
  },
  {
    type: 'input',
    message: 'version',
    name: 'version',
    default: '1.0.0',
  },
  // {
  //   type: 'input',
  //   message: 'prot',
  //   default: '3000',
  //   name: 'prot',
  // },
]

module.exports = function () {
  const cwd = process.cwd()
  let timoutTimer = null

  // 设置模板的packageJson
  const setPackageJson = ({ projectName, version }) => {
    const packageJson = require(path.resolve(
      cwd,
      `${projectName}/package.json`,
    ))
    packageJson.name = projectName
    packageJson.version = version
    fs.writeFileSync(
      path.resolve(cwd, `${projectName}/package.json`),
      JSON.stringify(packageJson, null, 2),
      {},
    ) // \t为制表符, 2代表空格数
  }

  // 处理模板下载
  const inquirerHandler = async (answer) => {
    // console.log(answer)
    const _projectName = answer.projectName
    // 判断是否是当前目录
    const inCurrentDir = _projectName === '.' // 指定目录名为“.”则在当前文件夹内拉取模板文件
    // 获取项目名(当前目录 or 指定的项目名)
    const realProjectName = inCurrentDir
      ? path.relative('../', cwd)
      : _projectName

    // 校验项目名(包名)是否合法
    const validateResult = validateProjectName(realProjectName)
    if (!validateResult.validForNewPackages) {
      // 打印出错误以及警告
      console.error(chalk.red(`Invalid project name: "${realProjectName}"`))
      validateResult.errors &&
        validateResult.errors.forEach((error) => {
          console.error(chalk.red.dim(`Error: ${error}`))
        })
      validateResult.warnings &&
        validateResult.warnings.forEach((warn) => {
          console.error(chalk.red.dim(`Warning: ${warn}`))
        })
      process.exit(1)
    }

    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `是否在当前目录创建项目?`,
      },
    ])
    if (!ok) return

    const spinner = ora({
      spinner: 'bouncingBar',
    }).start()

    timoutTimer = setTimeout(() => {
      spinner.text = '正在努力下载模板...'
      spinner.color = 'yellow'
      timoutTimer = setTimeout(() => {
        spinner.text = '马上就好...'
        spinner.color = 'red'
      }, 4000)
    }, 2000)

    // 缓存在内存中的项目文件
    const tmpDir = await fetchRemoteRepoTemp('justwe7/' + answer.templateName)
    clearTimeout(timoutTimer)

    // 真正的目录地址
    const targetDir = path.resolve(cwd, realProjectName)
    try {
      fse.copySync(tmpDir, targetDir, {
        overwrite: true,
      })
      setPackageJson({ projectName: realProjectName, version: answer.version })
      spinner.succeed(chalk.greenBright('🚀 模板下载完成~'))
      // execSync(`cd ${realProjectName}`)
      // console.log(chalk.cyanBright(`已跳转至${realProjectName}目录`))
    } catch (error) {
      console.error(chalk.red.dim(`Error: ${error}`))
    }
  }

  inquirer.prompt(question).then(inquirerHandler)
}
