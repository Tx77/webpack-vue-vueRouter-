const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
			{test : /\.css$/, loader : "style-loader!css-loader"},
			{test : /\.(html|tpl)$/, loader : 'html-loader' }
		]
	},
	devServer : {
		historyApiFallback : true,
		inline : true,
		hot : false
	},
	devtool : 'eval-source-map',
	resolve : {
		// require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue','.css'],
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
		}),
		new ExtractTextPlugin('[name].css'),
		new webpack.ProvidePlugin({
			jQuery : "jquery",
			$ : "jquery"
		})
	]
};