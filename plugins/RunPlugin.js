module.exports = class RunPlugin {
  /**
   * 每个插件都要有一个apply方法，用于注册插件
   * apply方法中接收一个参数，compiler，在实际执行注册时，会从外面将Compiler的实例传进来
   */
  // 注册插件
  apply(compiler) {
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('RunPlugin')
    })
  }
}