# webpack-vue-vueRouter
webpack2.0+vue2.0+vue-router2.0项目搭建。

### webpack安装流程：

	1. npm init 新建package.json配置文件；
	2. npm install 新建node_modules文件夹；
	3. npm install webpack -g 安装webpack；
	4. 创建一个index.html文件和entry.js文件；
	5. 在index.html文件里引用"bundle.js"（此为webpack自动生成文件）；
	6. 在index.html中随便写一个标签，设置好ID或CLASS，在entry.js中引用该ID或CLASS，随便进行点操作，比如innerHTML为"hello world"；
	7. 在命令行中输入：webpack entry.js bundle.js；
	8. 运行成功，显示"hello world"。


注意：在第一步中，如果package.json配置文件name为"webpack"，npm install webpack --save-dev操作会报错：

Refusing to install webpack as a dependency of itself

修改"webpack"名字即可。

用此方法安装webpack更好一些，因为会在package.json文件中添加一个webpack的依赖。

添加一个webpack.config.js的配置文件，目的：

	* 使运行webpack的操作变得简单，不用像上面第7步那样写很长的运行代码，只需要在命令行输入："webpack" 即可；
	* 使webpack输入输出变得清晰，定义好入口文件、出口文件、对模块的处理逻辑等等。


定义好的配置文件如下：
```
var webpack = require("webpack");

module.exports = {
    entry : ['./entry.js'],//入口文件
    output : { //出口文件
        path : __dirname,
        filename : "bundle.js"
    },
    module : {
        //定义了对模块的处理逻辑
    }
};
```

### webpack服务器搭建

命令：
```
npm install --save-dev webpack-dev-server
```
devserver作为webpack配置选项中的一项，具有一下配置参数：

	* contentBase 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另一个目录下的文件提供本地服务器，应该在这里设置其所在目录；
	* port 设置默认监听端口，如果省略，默认为”8080“；
	* inline 设置为true，当源文件改变时，会自动刷新页面；
	* colors 设置为true，使终端输出的文件为彩色的；
	* histroyApiFallback 设置为true，所有跳转指向为index.html。


说一下整个的步骤：

	1. 首先是安装server；
	2. 修改webpack.config.js配置文件：入口及出口文件、支持ES6 babel的模块、devServer的参数配置、babel的参数配置；
	3. 在package.json配置文件的”scripts“对象里，加入"start": "webpack-dev-server --inline"这一行代码，表示实时刷新页面；
	4. 安装"babel"、"babel-core"、"babel-loader"、"babel-preset-es2015"；
	5. 在命令行输入"npm start"，默认端口号为8080。


遇到的问题：

	1. webpack2.1以上的版本，在webpack.config.js配置文件里，babel的参数配置不能直接写在子对象里，现在转移到plugins数组里面；
	2. 主要还是由于新版本导致以前正确安装的位置变得无效了，看log里面的提示来安装文件和写入属性。


代码：
```
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry : './entry/entry',//入口文件
    output : { //出口文件
        path : path.join(__dirname,'./output'),
        filename : "[name].js"
    },
    module : {
        //定义了对模块的处理逻辑
        loaders : [
            {test : /\.js$/,loader : "babel-loader" ,exclude : /node_modules/}
        ]
    },
    devServer : {
        historyApiFallback : true,
        inline : true,
        hot : false
    },
    devtool : 'eval-source-map',
    plugins : [
        new webpack.LoaderOptionsPlugin({
            options : {
                babel : {
                    presets: ['es2015']
                }
            }
        })
    ]
};
```
现在遇到的问题是：成功启动服务，但实时刷新没成功，等修改以后再记录新的笔记。(2017/3/22)

实施刷新成功，应该是入口文件和出口文件写反了，导致刷新失败（2017/3/23）

### Vue+webpack
接着之前webpack服务器搭建的说，先说下步骤：

	1. 首先还是webpack.config.js配置文件，模块的逻辑处理很重要，也就是loader，要运行vue，首先要在loader里面加入vue；
	2. 还是配置文件，要配置“resolve”对象，里面声明了组件引用路径；
	3. 最后就是在package.json文件里面添加各种loader即可。


遇到的问题：

	1. 程序报Module build failed: TypeError: this._init is not a function错误，解决方案是将config配置文件中的loader里的vue改写成vue-loader，如果没有的话就在命令行安装即可；
	2. 当引入vue文件名的文件时，如果无法引用，应该是在config配置文件中没有配置resolve导致无法正常解析路径；
	3. 当一切配置完成时如果无法获取内容，有可能是"contentBase"引入的路径错误，删除即可。


贴一下代码：
```
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry : './src/main',//入口文件
    output : { //出口文件
        path : path.join(__dirname,'./dist'),
        filename : "[name].js",
        publicPath : "/dist/"
    },
    module : {
        //定义了对模块的处理逻辑
        loaders : [
            {test : /\.js$/,loader : "babel-loader" ,exclude : /node_modules/},
            {test : /\.vue$/,loader : "vue-loader"},
            {test : /\.css$/, loader : 'style-loader!css-loader!autoprefixer'},
            {test : /\.(html|tpl)$/, loader : 'html-loader' }
        ]
    },
    devServer : {
        historyApiFallback : true,
        inline : true,
        hot : false,
        contentBase : "./dist" //如果无法显示内容，就把这行删掉
    },
    devtool : 'eval-source-map',
    resolve : {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            filter: path.join(__dirname, './src/filters'),
            components: path.join(__dirname, './src/components')
        }
    },
    plugins : [
        new webpack.LoaderOptionsPlugin({
            options : {
                babel : {
                    presets: ['es2015']
                }
            }
        })
    ]
};
```
Plus : 暂时不考虑node-sass这个包，安装起来太复杂，以后再考虑这个问题 （2017/3/23）

2017/3/27：
之前引用css成功但样式无法加载的问题已解决，原因我估计是在webpack.config.js里的loaders写错了，之前写的是：
```
{test : /\.css$/, loader : ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })}
```
现在改为：
```
{test : /\.css$/, loader : "style-loader!css-loader"}
```
样式成功被自动修改

Vue-router+Webpack

#### Error/Warn：
1、
```
Component template should contain exactly one root element error
```

在vue文件里面，template标签里只能有一个根节点，所以应该把所有元素包含在一个根元素里面，比如用div标签包裹template里所有内容。

2、
```
[Vue warn] : You are using the runtime-only build of Vue where the template option is not available. Either pre-compile the templates into render functions, or use the compiler-included build. (found in root instance)
```

错误原因是项目中"import Vue from 'vue'"中引用的是vue.common.js，因为vue的package.json的main指向的是vue.common.js，所以改变一下引用路径，将"vue"改为"vue/dist/vue.js"即可。

3、如果要设计路由，比如三个页面"app"、"about"、"base"，要设计成如下图所示：
就要有跳转标签（router-link）以及展示内容的区域（router-view），在设计路由的时候，也要考虑重定向问题，贴下运行成功的代码：

```
const router = new VueRouter({
    routes : [
        {
            path : "/",
            name : "app",
            component : app
        },
        {
            path : "/about",
            name : "about",
            component : about
        },
        {
            path : "/base",
            name : "base",
            component : base
        },
        {
            path : "*",
            redirect : "/"
        }
    ]
});

const index = new Vue({
    router
}).$mount('#app');
```

注意代码中的"/"，这个斜杠代表主页面，其他三个子页面.vue文件，在打包输出的代码（export default()）中，不写"el"属性，在入口文件"main.js"中会自动绑定到主节点上面。

### 在vue+webpack项目中引用jquery
步骤：

	1. 首先安装jquery；
	2. 在webpack.config.js配置文件的Plugins中添加几段代码：

 ```         
new webpack.ProvidePlugin({
    jQuery : "jquery",
    $ : "jquery"
})
```

	1. 在入口文件main.js中，引用jquery，代码为：

```
import $ from "jquery";
```































