### 开发过程中使用的库

* @babel/core：babel核心库
* @babel/preset-env：将高版本转换为es5
* ejs：模版引擎，允许在html模版中插入js，从而在服务端动态生成html
* tapable：用于实现插件系统

### 说明

* webpack中存在module，chunk，file三种概念，本demo中仅以module为例进行说明

### 补充

* path.join：用于将多个路径片段连接成一个完整的路径
    ```
    const path = require('path');
    const fullPath = path.join('/path', 'to', 'directory', 'file.txt');
    console.log(fullPath);
    
    // /path/to/directory/file.txt
    ```
* path.dirname：用于获取路径中的目录部分
    ```
    const path = require('path');
    const directoryPath = path.dirname('/path/to/directory/file.txt');
    console.log(directoryPath);

    // /path/to/directory
    ```