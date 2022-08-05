import * as path from 'path'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as inquirer from 'inquirer'
import { exec, execSync } from 'child_process'
import * as validateProjectName from 'validate-npm-package-name'
import * as ora from 'ora'
import * as chalk from 'chalk'
import fetchRemoteRepoTemp from '../lib/download-repo'
import installNodeModules from '../lib/install-node-modules'
import gitInit from '../lib/git-init'

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
        value: '@uni-app', // 以@开头，为https://github.com/justwe7/jw-cli-templates仓库的一级子目录
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
  {
    type: 'confirm',
    name: 'useGit',
    message: 'use git as version control?',
  },
  {
    type: 'list',
    name: 'package',
    message: 'select the package management',
    choices: ['npm', 'yarn'],
    default: 'npm',
  },
  // {
  //   type: 'input',
  //   message: 'prot',
  //   default: '3000',
  //   name: 'prot',
  // },
]

export default function () {
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
      }, 6000)
    }, 3000)

    // 缓存在内存中的项目文件
    const repoUri =
      (/^@/.test(answer.templateName) && 'justwe7/jw-cli-templates') || '' // 以@开头的为https://github.com/justwe7/jw-cli-templates的子目录
    const folderName = (repoUri && `/${answer.templateName.substr(1)}`) || ''
    const tmpDir = await fetchRemoteRepoTemp(
      repoUri || 'justwe7/' + answer.templateName,
      folderName,
    )
    clearTimeout(timoutTimer)

    // 真正的目录地址
    const targetDir = path.resolve(cwd, realProjectName)
    try {
      fse.copySync(tmpDir as string, targetDir, {
        overwrite: true,
      })
      setPackageJson({ projectName: realProjectName, version: answer.version })
      // spinner.text = '模板下载完成，正在安装依赖...'
      // spinner.color = 'cyan'
      spinner.stop()
      // 安装依赖
      await installNodeModules({
        cwd: path.join(process.cwd(), realProjectName),
        package: answer.package,
      })

      if (answer.useGit) {
        gitInit({ cwd: path.join(process.cwd(), realProjectName) })
      }

      console.log()
      spinner.succeed(chalk.greenBright('🚀 模板下载完成~'))
      console.log()
      console.log('We suggest that you begin by typing:')
      console.log()
      console.log(chalk.cyan('  cd'), realProjectName)
      console.log(`  ${chalk.cyan(`${answer.package} run dev`)}`)
      // execSync(`cd ${realProjectName}`)
      // console.log(chalk.cyanBright(`已跳转至${realProjectName}目录`))
    } catch (error) {
      console.error(chalk.red.dim(`Error: ${error}`))
    }
  }

  inquirer.prompt(question).then(inquirerHandler)
}
