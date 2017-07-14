'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const crypto = require('crypto');

function makeProjectName(name) {
  name = _.kebabCase(name);
  name = name.indexOf('api-') === 0 ? name : 'api-' + name;
  return name;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {
      hash: {
        default: crypto.randomBytes(40).toString('base64'),
        production: crypto.randomBytes(40).toString('base64'),
        secret: crypto.randomBytes(40).toString('base64')
      }
    };
  }

  prompting() {
    return askName({
      name: 'name',
      message: 'Your API-project name',
      default: makeProjectName(path.basename(process.cwd())),
      filter: makeProjectName,
      validate: str => {
        return str.length > 'api-'.length;
      }
    }, this).then(props => {
      this.props.name = props.name;
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      {
        projectName: this.props.name,
        hash: this.props.hash
      }
    );
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  }

  install() {
    this.installDependencies({
      bower: false, callback: function () {
        console.log('Happy ODA api hacking!!!!');
      }
    });
  }
};
