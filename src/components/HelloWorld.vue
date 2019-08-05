<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex>
        <div>{{ msg }}</div>
        <div>{{ session }}</div>
        <div>{{ cred }}</div>
        <div>
          här ska det vara:
          <v-btn class="loginbutton" primary large block @click="testData">Login</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { verifyAuth } from '../handlers/api/apiHandler'
import Avanza from 'avanza'
export default {
	data: () => {
		return {
			verifyAuth,
			avanza: new Avanza(),
			msg: 'helloworld renderar det här',
			session: 'helloworld renderar det här',
			cred: 'helloworld renderar det här'
		}
	},
	methods: {
		async testData() {
			try {
				if (this.$store.state.loggedIn) {
					this.avanza = this.verifyAuth(
						{ avanza: this.avanza },
						{
							userCredentials: this.$store.state.credentials,
							session: this.$store.state.session
						}
					)
					const output = await this.avanza.getWatchlists()
					console.log(output)
					return output
				}
			} catch (err) {
				console.error(err)
			}
		}
	},
	async mounted() {}
}
</script>

<style>
</style>
