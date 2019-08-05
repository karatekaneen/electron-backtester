import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import(/* webpackChunkName: "about" */ './components/Login.vue')
		},
		{
			path: '/hello',
			name: 'hello',
			component: () => import(/* webpackChunkName: "about" */ './views/Home.vue')
		},
		{
			path: '/overview',
			name: 'overview',
			component: () => import(/* webpackChunkName: "about" */ './components/Overview.vue')
		}
	]
})
