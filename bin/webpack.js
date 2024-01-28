const Compiler = require('../lib/Compiler')
const config = require('../webpack.config')
console.log(process.cwd())

/**
 * @param options
 * @returns {Compiler}
 * 创建compiler，注册插件
 */
const createCompiler = function (options) {
  // 创建compiler实例
  const compiler = new Compiler(options)
  // 检查webpack.config.js中的配置，如果配置了plugins，并且是个数组，那么就遍历数组，挨个调用每个插件的apply方法实施插件注册，同时将compiler实例传入apply方法中
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const p of options.plugins) {
      p.apply(compiler)
    }
  }
  return compiler
}

/**
 * @type {Compiler}
 * 根据webpack.config.js中的配置创建compiler
 * 然后执行其中的run方法开启编译
 */
const compiler = new Compiler(config)
compiler.run()
