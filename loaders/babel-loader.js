const babel = require('@babel/core')

/**
 * @param source
 * @param options
 * @returns {*}
 * 实现babel-loader
 * 接收两个参数：源码+选项
 * 借助babel，将代码进行转换然后返回即可
 */
const loader = function (source, options) {
  const res = babel.transform(source, {
    presets: options.presets
  })
  return res.code
}

module.exports = loader