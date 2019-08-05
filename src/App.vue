<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn flat to="/login">
        <span class="mr-2">Logga ut</span>
      </v-btn>
      <v-btn flat to="/hello">
        <span class="mr-2">hem</span>
      </v-btn>
      <v-btn flat to="/overview">
        <span class="mr-2">Overview</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
	name: 'App',
	components: {},
	data() {
		return {
			//
		}
	},
	created() {
		this.$electron.ipcRenderer.on('error', (event, arg) => {
			console.log(arg)
		})
	}
}
</script>
