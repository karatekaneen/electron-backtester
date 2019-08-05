import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		loggedIn: false,
		session: {},
		credentials: {}
	},
	getters: {},
	mutations: {
		setSession(state, session) {
			state.session = session
		},

		setLogin(state, loggedIn) {
			state.loggedIn = loggedIn
		},

		setCredentials(state, credentials) {
			state.credentials = credentials
		}
	},
	actions: {}
})
