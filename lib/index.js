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
  .description('中译英')
  // .option('-l, --letter [letters...]', 'specify letters')
  .action((str, cmd) => {
    const wd = str.join(' ')
    // console.log(str)
    translate({ wd, from: 'zh', to: 'en' })/* .then(res => {
      // spinner.succeed(chalk.redBright(wd) + ' ↪️ ' + chalk.cyanBright(res))
      spinner.stopAndPersist({
        // prefixText: '🦄',
        text: chalk.redBright(wd) + ' ↪️ ' + chalk.cyanBright(res)
      })
    }) */
    // 输入参数校验
    // console.log(program.opts())
  });

program
  .command('yz <str...>')
  .description('英译中')
  .action((str, cmd) => {
    const wd = str.join(' ')
    /* const spinner = ora({
      spinner: 'circleHalves'
    }).start() */
    translate({ wd, to: 'zh' })/* .then(res => {
      spinner.stopAndPersist({
        text: chalk.redBright(wd) + ' ↪️ ' + chalk.cyanBright(res)
      })
    }) */
  });

program.parse();

// const options = program.opts();
// console.log(options)
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));

