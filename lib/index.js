const { program } = require('commander');
const chalk = require('chalk')
const createProject = require('./createProject');
const log = console.log;
const ora = require('ora');
const translate = require('./translate');
// const cliSpinners = require('cli-spinners');


program
  .option('--first, --xx <char>')
  .option('-s, --separator <char>');

program
  .command('create <project-name>')
  .description('create a new project from a template')
  .action((templateName, projectName, cmd) => {
    console.log(2222)
    // 输入参数校验
    console.log(program.opts(), cmd)
  });

program
  .command('zy <str...>')
  .description('翻译')
  // .option('-l, --letter [letters...]', 'specify letters')
  .action((str, cmd) => {
    console.log(str)
    // const spinner = ora('正在搜索...').start();
    translate({ wd: str[0], from: 'zh', to: 'en' }).then(res => {
      log(chalk.blue('str', res.trans_result))
      console.log(res)
    })

    // setTimeout(() => {
    //   spinner.color = 'yellow';
    //   spinner.text = '马上就好...';
    // }, 1000);
    // log(chalk.blue('str', 'xxxx'))
    // 输入参数校验
    console.log(program.opts())
  });

program.parse();

// const options = program.opts();
// console.log(options)
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));

