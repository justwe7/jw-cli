// require('module-alias/register')
import { program } from 'commander'
import createProject from './moudles/create-project'
import translate from './moudles/translate'
import gitFlow from './moudles/git-flow'
// const cliSpinners = require('cli-spinners');

// program
//   .option('--first, --xx <char>')
//   .option('-s, --separator <char>');
program
  .command('create')
  .description('create a new project from a template')
  .action((templateName, projectName, cmd) => {
    // console.log(2222)
    // 输入参数校验
    // console.log(program.opts(), cmd)
    createProject()
  })

// jw gflow
program
  .option('-s, --separator <char>', '<jw glow>separator character', '/')
  .command('gflow <name>')
  .description(
    'create a git flow process, the branch rule is dev_userName_demandName_YYYYMMDD',
  )
  .action((name, cmd) => {
    gitFlow({
      name,
      separator: program.opts().separator,
    })
    // console.log(program.opts())
  })

// jw zy
program
  .command('zy <str...>')
  .description('中译英')
  // .option('-l, --letter [letters...]', 'specify letters')
  .action((str, cmd) => {
    const wd = str.join(' ')
    translate({ wd, from: 'zh', to: 'en' })
  })

// jw yz
program
  .command('yz <str...>')
  .description('英译中')
  .action((str, cmd) => {
    const wd = str.join(' ')
    translate({ wd, to: 'zh' })
  })

program.parse()
