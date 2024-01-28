const {SyncHook} = require('tapable')
const path = require('path')
const fs = require('fs')
const babel = require('@babel/core')

module.exports = class Compiler {
  constructor(options) {
    this.options = options
    // modules属性用于存储后续编译流程中遇到的module
    this.modules = []
    /**
     * @type {{}}
     * 定义两个钩子：
     * run
     * done
     * 使用tapable库的SyncHook方法创建hook，在调用时直接采用hookName.call()即可实现调用
     */
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook()
    }
  }

  /**
   * @param modulePath：模块路径
   */
  getSource(modulePath) {
    // 读取文件内容
    let content = fs.readFileSync(modulePath, 'utf-8')
    // 读取webpack.config.js中配置的规则，是个数组
    const rules = this.options.module.rules
    // 对于rules中配置的每一条rule，都要提取出来进行执行
    for (const r of rules) {
      const {test, use} = r
      if (test.test(modulePath)) {
        let len = use.length - 1
        /**
         * 一条rule中如果use了多个loader，那么按照从右向左的的方式进行处理
         * 所以这里len的初始值就是use.length-1，指向最后一个loader
         */
        while (len >= 0) {
          const {loader, options} = use[len--]
          const loaderFunc = require(loader)
          content = loaderFunc(content, options)
        }
      }
    }
    return content
  }

  parse(source, modulePath) {
    const dependencies = []
    const dirname = path.dirname(modulePath)
    const requirePlugin = {
      visitor:{
        CallExpression(p){
          const node=p.node
          if(node.callee.name==='require'){
            node.callee.name='__webpack_require__'

          }
        }
      }
    }
    const res = babel.transform(source, {
      plugins: [requirePlugin]
    })
    return {
      sourceCode: res.code,
      dependencies
    }
  }

  /**
   * @param modulePath：模块路径
   * @param isEntry：是否为入口文件
   * 构建模块
   */
  buildModule(modulePath, isEntry) {
    // 生成module中的源代码
    const source = this.getSource(modulePath)
    modulePath = './' + path.relative(this.root, modulePath).replace(/\\/g, '/')
    /**
     * parse方法中生成的sourceCode，就是处理完毕的模块了，json序列化之后将其保存到this.modules中
     * 针对对应模块的依赖，接下来会逐个进行处理
     */
    const {sourceCode, dependencies} = this.parse(source, modulePath)
    this.modules[modulePath] = JSON.stringify(sourceCode)
    dependencies.forEach(d => {
      this.buildModule(path.join(this.root, d))
    }, false)
  }

  // run方法，实际上webpack就是在用这个方法开启编译流程
  run() {
    // 调用上面定义的run钩子
    this.hooks.run.call()
    // 获取编译流程入口
    const entry = path.join(this.options.context, this.options.entry)
    // 从入口开始构建模块
    this.buildModule(entry, true)
  }
}