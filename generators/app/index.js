'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const _ = require('lodash');
const mkdirp = require('mkdirp');

function makeProjectName(name) {
  name = _.kebabCase(name);
  name = name.indexOf('api-') === 0 ? name : 'api-' + name;
  return name;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  prompting() {
    return askName({
      name: 'name',
      message: 'Your generator name',
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
        projectName: this.props.name
      }
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
