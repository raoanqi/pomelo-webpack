const path = require('path')

module.exports = {
  /**
   * process.cwd()：执行脚本的目录
   * 如果在xxx/pomelo-webpack这个文件夹中输入process.cwd()，会输出'E:\\MyCode\\pomelo\\pomelo-webpack'
   * 如果在xxx/pomelo-webpack/test这个文件夹中输入process.cwd()，会输出'E:\\MyCode\\pomelo\\pomelo-webpack/test'
   */
  context: process.cwd(),
  mode: 'development',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.join(__dirname, './loaders/babel-loader.js'),
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  },
  /**
   * plugin是一个class，因此在使用时需要使用new的方式来使用
   */
  plugins: []
}

