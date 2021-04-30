# Yeoman

## 安装

### 在全局范围安装 yo

```shell l
$ npm install yo --global
// or
$ yarn global add yo
```

### 安装对应的 generator

```shell
$ npm install generator-node --global
// or
$ yarn global add generator-node
```

### 通过 yo 运行 generator

在对应的目录下，执行

```shell
$ yo node
```

得到一个初始化完的项目结构。

## 使用步骤总结

1. 明确你的需求
2. 找到合适的 Generator
3. 全局范围安装找到的 Generator
4. 通过 Yo 运行对应的 Generator
5. 通过命令行交付填写选项
6. 生成你需要的项目结构

## 创建自己的 Generator 模块

Generator 本质上就是一个 NPM 模块。

### Generator 基本结构

```
｜- generators/	// 生成器目录
｜- ｜- app/	// 默认生成器目录
｜- ｜- ｜- index.js // 默认生成器实现
｜- ｜- component/	// 其它生成器目录
｜- ｜- ｜- index.js // 其它生成器实现
｜- package.json	// 模块包配置文件
```

Yeoman 的 Generator 必须以 `generator-<name>` 命名。

### 新建目录

首先，在文件夹中新建一个名为 `generator-yeoman_sample` 的目录。然后在该目录下，通过 `yarn init` 初识化 `package.json`。

### 安装 yeoman-generator

```shell
$ yarn add yeoman-generator
```

该模块提供了生成器的基类，该基类中提供了基础的工具及函数，让我们在创建生成器时，更加便捷。

### 创建项目目录

在目录下创建以下文件。

![1](./dist/1.png)

此文件作为 Generator 的核心入口，需要导出一个继承自 Yeoman Generator 的类型。Yeoman Generator 在工作时，会自动调用我们在此类型中定义的一些生命周期方法，我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入。

```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  writing() {
    // Yemon 自动在生成文件阶段，调用此方法
    // 尝试往项目目录中写入文件
    // 接受两个参数：写入文件的绝对路径，写入的内容
    // this.destinationPath('temp.txt')：自动获取生成项目目录下对应的文件路径
    this.fs.write(this.destinationPath('temp.txt'), Math.random().toString())
  }
}
```

这样一个简单的 Generator 就完成了。

#### 测试

我们可以通过 `yarn link` 将这个模块链接到全局范围，使之成为一个全局模块包。这样 Yeoman 在工作时，就可以找到这个我们这个模块。

在一个新的目录下，使用

```shell
$ yo yeoman_sample // 项目名 generator-<name> 中的name
```

可在目录下查看到新建的文件。

![2](./dist/2.png)

### 根据模版创建文件

我们也可以通过模板的方式创建文件。

首先在 `app` 目录下，新建目录 `templates`，用于存放我们的模版文件。模板文件遵循 EJS 模板语法，因此我们可以通过 `<%= title %>`的方式，动态生成文件内容。

在`templates`目录下，新建 test.txt 文件用于测试。

![3](./dist/3.png)

文件内容如下：

```
// test.txt
name: <%= name %>
age: <%= age %>
```

更改 `index.js` 文件内容。

```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  writing() {
    // 通过模板方式写入文件到目标目录
    // 模板文件路径
    const templ = this.templatePath('test.txt')
    // 输出文件路径
    const output = this.destinationPath('test.txt')
    // 模板数据上下文
    const context = { name: 'Gypos', age: 18 }

    this.fs.copyTpl(templ, output, context)
  }
}
```

再次通过  `yo yeoman_sample` 命令进行测试。

这样，相对于手动创建每一个文件，模板的方式大大提高了效率。

### 接受用户输入

针对与一些动态内容，我们可以通过用户输入的方式，接受数据。 

更改 `index.js` 文件内容。

主要通过实现 `Generator` 基类的 `prompting` 方法。

再调用，基类提供的 `this.prompt` 方法。该方法接受一个数组参数，数组的每个对象为在命令行中的一个问题。返回一个 `promise`，在 then 方法中，将用户输入的内容，进行保存。后在 `writing`方法中， 作为模板数据上下文，更改对应的模板内容。

```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    // Yenman 在询问用户环节，会自动调用此方法
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    return this.prompt([
      {
        type: 'input',
        name: 'name', // 返回的对象名
        message: 'name:', // 命令行中的提示
        default: this.appname // appname 为项目生成目录名称
      },
      {
        type: 'input',
        name: 'age',
        message: 'age:',
        default: 0
      }
    ]).then((answers) => {
      // 键值对形式对象 { name: 'user input name', age: 'user input age' }
      this.answers = answers
    })
  }

  writing() {
    // 通过模板方式写入文件到目标目录
    // 模板文件路径
    const templ = this.templatePath('test.txt')
    // 输出文件路径
    const output = this.destinationPath('test.txt')
    // 模板数据上下文
    const context = this.answers

    this.fs.copyTpl(templ, output, context)
  }
}
```

再次通过  `yo yeoman_sample` 命令进行测试。

### vue3 工程模板

这边，我们以 vue3 的一个初始化项目作为模板。

首先将，项目文件复制到 `templates` 下。

![3](./dist/4.png)

在相应动态生成的地方，按照 EJS 模板的方式更改就可以。

唯一需要变更的地方在于，`writing` 方法中，之前针对的是单文件的模板转换，现在需更改为多文件。

更改 `index.js` 文件

```js
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
```

通过循环的方式，将模板进行转换。

之后，就可以再次通过  `yo yeoman_sample` 命令进行测试。