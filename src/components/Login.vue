<template>
  <v-container fill-height>
    <v-layout text-xs-center row wrap align-center>
      <v-spacer />
      <v-flex xs12 sm7 align-center>
        <v-card flat>
          <v-card-title primary-title>
            <h4>{{ msg }}</h4>
          </v-card-title>
          <v-card-text>{{data}}</v-card-text>
          <v-form>
            <v-text-field
              v-model="username"
              prepend-icon="person"
              name="Username"
              label="Username"
            />
            <v-text-field
              v-model="password"
              prepend-icon="lock"
              name="Password"
              label="Password"
              type="password"
            />
            <v-card-actions>
              <v-btn
                class="loginbutton"
                primary
                large
                block
                :disabled="credentialsFulfilled({username, password})"
                @click="submitLogin({dep: {avanza: new Avanza()}, payload: {username, password}})"
              >Login</v-btn>
            </v-card-actions>
            <!-- @click="submitLogin({username, password})" -->
          </v-form>
        </v-card>
      </v-flex>
      <v-spacer />
    </v-layout>
  </v-container>
</template>
<script>
import secret from '../data/secret'
import Avanza from 'avanza'
export default {
	name: 'Test',
	props: {
		dataObj: Object
	},
	data() {
		return {
			Avanza,
			data: '',
			secret,
			username: '',
			password: '',
			msg: 'Enter your credentials'
		}
	},
	methods: {
		testMetod(i) {
			// console.log(i)
		},
		submitLogin: async function(input) {
			const avanza = input.dep.avanza
			const { username, password } = input.payload

			try {
				const resp = await avanza.authenticate({
					username,
					password,
					totpSecret: this.secret.TOTP_SECRET
				})

				if (resp.hasOwnProperty('authenticationSession') && resp.hasOwnProperty('customerId')) {
					this.storeSession({
						session: resp,
						credentials: {
							username,
							password,
							totpSecret: this.secret.TOTP_SECRET
						}
					})
				}
			} catch (err) {
				// console.error(err)
			}
		},

		storeSession(input) {
			this.$store.commit('setSession', input.session)
			this.$store.commit('setCredentials', input.credentials)
			this.$store.commit('setLogin', true)
		},

		credentialsFulfilled(input) {
			if (input.username.length > 0 && input.password.length > 0) {
				return false
			} else {
				return true
			}
		}
	}
}
</script>
