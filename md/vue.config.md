# vue配置项配置

* baseUrl 
~~cli3.3起已废弃~~

* publicPath 部署应急包的基本url
   1. 默认值：'/'
   2. 用法和webpack.publicPath用法一致（但不应该去修改 output.publicPath）
   3. 这个值可以被设置为（''）、('./')这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
   4. 如果你的应用程序部署在子路径中，则需要使用此选项指定该子路径
      - 例：假设程序部署根目录在 https://www.my-app.com/
      而项目部署在 https://www.foobar.com/my-app/
      则设置publicPath为'/my-app/'
      
   ```js
    module.exports = {
     publicPath: process.env.NODE_ENV === 'production'? '/my-app/' : './'
  }
    ```
 * outputDir 打包文件名
    1. 默认值：'dist'
    2. 运行时将在其中生成生产构建文件的目录vue-cli-service build。请注意，目标目录将在构建之前删除（可以通过--no-clean在构建时通过传递禁用此行为）
 * assetsDir 放置静态资源的目录
    1. 默认值：''
    2. 放置生成的静态资源 (js、css、img、fonts) 的目录。
 * indexPath 
    1. 默认值：'index.html'
    2.指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
 * filenameHashing
    1. 类型： boolean
    2. 默认值: true
    3. 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
 * pages 入口文件信息
    1. 类型：Object
    2. 默认：undefined
    3. 单页面模式 
    ```js
    module.exports = {
       pages: {
           // 单页面的入库文件
           entry: 'src/main.js',
           // 模板文件
           template: 'public/index.html',
           // 输出文件名
           filename: 'index.html',
       }
    }
    ```
    4. 多页模式
        - 单页程序和多页面程序的区别
        ![avatar](../src/assets/md/1.png)
        - 提取多页面入口文件
        ```js
        /**
        * 获取多页面入口文件
        * @globPath 文件路径
        */
        const glob = require ('glob')
         function getEntries(globPath)  {
         const entries = glob.sync(globPath).reduce((result, entry) => {
           const moduleName = path.basename(path.dirname(entry)) // 获取模块名称
             result[moduleName] = entry
             return result
           }, {})
           return entries
        }
        ```
        
    
   
