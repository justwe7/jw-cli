const inquirer = require('inquirer');

const question = [
  {
    name: 'projectName',
    type: 'input',
    message: 'projectName',
    default: 'my-app',
  },
  {
    name: 'language',
    type: 'list',
    choices: ['react', 'vue'],
    default: 'react',
  },
  {
    name: 'style',
    type: 'list',
    choices: ['less', 'sass'],
    default: 'less',
  },
  {
    name: 'jsType',
    type: 'list',
    choices: ['js', 'ts'],
    default: 'js',
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
  inquirer.prompt(question).then((answer)=>{console.log(answer)})
}