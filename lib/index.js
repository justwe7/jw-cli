const { program } = require('commander');
const createProject = require('./createProject');

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
  .command('zy <str>')
  .description('翻译')
  .option('--lang', 'zh')
  .action((str, cmd) => {
    console.log(str)
    // 输入参数校验
    console.log(program.opts())
  });

program.parse();

// const options = program.opts();
// console.log(options)
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));

