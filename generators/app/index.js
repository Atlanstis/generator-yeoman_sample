// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时，会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    // Yenman 在询问用户环节，会自动调用此方法
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'name:',
        default: this.appname // appname 为项目生成目录名称
      }
    ]).then((answers) => {
      this.answers = answers
    })
  }

  writing() {
    // 把每一个文件都通过模板转换到目标路径
    const templates = [
      'babel.config.js',
      'package.json',
      'README.md',
      'public/favicon.ico',
      'public/index.html',
      'src/main.js',
      'src/App.vue',
      'src/assets/logo.png',
      'src/components/child.vue',
      'src/router/index.js',
      'src/store/index.js',
      'src/views/Home.vue'
    ]
    templates.forEach((item) => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}
