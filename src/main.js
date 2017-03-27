import Vue from 'vue/dist/vue.js'
import VueRouter from "vue-router";
Vue.use(VueRouter);

import $ from "jquery";

import app from "./components/app";
import about from "./components/about";
import base from "./components/base";

require("./style/app");

Vue.config.debug = true;

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