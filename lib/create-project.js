const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const inquirer = require('inquirer');

const question = [
  {
    name: 'templateName',
    type: 'list',
    choices: ['SSR(vue2)', 'uni-app'],
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
    type: 'input',
    message: 'prot',
    default: '3000',
    name: 'prot',
  },
];


module.exports = function () {
  // 获取node进程的工作目录
  const cwd = process.cwd();
 
  
  // 校验项目名(包名)是否合法
  // const validateResult = validateProjectName(name);

  inquirer.prompt(question).then(async (answer)=>{
    console.log(answer)
    const projectName = answer.projectName
    // 判断是否是当前目录
    const inCurrentDir = projectName === '.';
    console.log(inCurrentDir)
      // 获取项目名(当前目录 or 指定的项目名)
    const name = inCurrentDir ? path.relative('../', cwd) : projectName;
    // 真正的目录地址
    const targetDir = path.resolve(cwd, projectName);
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `Generate project in current directory?`
      }
    ]);
    if (!ok) {
      return;
    }
    if (fs.existsSync(targetDir)) {
      // TODO 可通过配置强制删除
      // 目录存在有两种情况: 1. 当前目录创建 2. 确实存在同名目录
      // await clearConsole();
      if (inCurrentDir) {
        // 当前目录下创建给用户提示
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`
          }
        ]);
        if (!ok) {
          return;
        }
      }/*  else {
        // 待创建目录已经存在
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)}
              already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              {
                name: 'Merge',
                value: 'merge'
              },
              {
                name: 'Cancel',
                value: false
              }
            ]
          }
        ]);
        if (!action) {
          return;
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await exec(`rm -rf ${targetDir}`);
        }
      } */
    }
  
    // 目录不存在
    // process.env.EASY_CLI_TEMPLATE_NAME = templateName;
    // const creator = new Creator(name, targetDir);
    // await creator.create(options);
  })
}