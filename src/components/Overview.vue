<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12 sm10>
        <div>{{ msg }}</div>
        <v-card>
          <v-card-title class="watchlist-title">
            {{tableTitle}}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="dataToDisplay"
            hide-actions
            :search="search"
            :expand="false"
            item-key="id"
          >
            <template v-slot:items="props">
              <tr @click="props.expanded = !props.expanded">
                <td class="text-xs-right">{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.lastPrice }}</td>
                <td class="text-xs-right">{{ props.item.changePercent }}</td>
                <td class="text-xs-right">{{ props.item.change }}</td>
                <td class="text-xs-right">{{ props.item.totalVolumeTraded }}</td>
                <td class="text-xs-right">{{ props.item.id }}</td>
                <td class="text-xs-right">{{ props.item.instrumentType }}</td>
              </tr>
            </template>

            <template v-slot:expand="props">
              <InstrumentSummary :instrument="getSummaryData(props.item)"></InstrumentSummary>
            </template>

            <v-alert
              v-slot:no-results
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs12 sm2>
        <!-- TODO Gör om till radio-buttons eller något coolt ui -->
        <v-card>
          <v-select
            class="watchlistSelector"
            :items="watchlists"
            v-model="chosenWatchlist"
            label="Watchlist"
            item-text="name"
            item-value="id"
            @change="loadListContent({avanza, verifyAuth, fetchListContent}, chosenWatchlist, watchlists)"
          ></v-select>
          <div>
            <!-- TODO Lägg till filtrering på typ -->
            Filtrering på typ
          </div>
          <div>
            <!-- Lägg till val av kolumner -->
            Val av kolumner
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { verifyAuth, fetchWatchlists, fetchListContent } from '../handlers/api/apiHandler'
import Avanza from 'avanza'
import InstrumentSummary from './InstrumentSummary.vue'

export default {
	components: {
		InstrumentSummary
	},
	data: () => {
		return {
			msg: 'Välkommen till översikten',
			watchlists: [],
			chosenWatchlist: '',
			headers: [],
			verifyAuth,
			fetchWatchlists,
			fetchListContent,
			dataToDisplay: [
				{
					currency: 'SEK',
					highestPrice: 179.65,
					lowestPrice: 177.2,
					lastPrice: 179.6,
					change: 1.9,
					changePercent: 1.07,
					updated: '2019-03-18T15:43:53.022+0100',
					totalVolumeTraded: 822657,
					flagCode: 'SE',
					priceThreeMonthsAgo: 176.65,
					tradable: true,
					instrumentType: 'STOCK',
					name: 'ABB Ltd',
					id: '5447'
				}
			],
			avanza: new Avanza(),

			tableTitle: '',
			search: '',
			tableHeaders: [
				{ text: 'Name', value: 'name' },
				{ text: 'Price', value: 'lastPrice' },
				{ text: 'Change %', value: 'changePercent' },
				{ text: 'Change $', value: 'change' },
				{ text: 'Volume', value: 'totalVolumeTraded' },
				{ text: 'ID', value: 'id' },
				{ text: 'Type', value: 'instrumentType' }
			]
		}
	},
	methods: {
		testMetod(i) {
			console.log(JSON.stringify(i, null, 2))
			return 'fniss'
		},

		getSummaryData(instrument) {
			let id = ''
			let name = ''
			let instrumentType = ''

			// Prevent from throwing errors if any fields are non existent:
			if (instrument.id) {
				id = instrument.id
			}
			if (instrument.name) {
				name = instrument.name
			}
			if (instrument.instrumentType) {
				instrumentType = instrument.instrumentType
			}
			return { id, name, instrumentType }
		},
		async loadData() {
			try {
				const resp = await this.fetchWatchlists(
					{
						avanza: this.avanza,
						verifyAuth: this.verifyAuth
					},
					{
						session: this.$store.state.session,
						loggedIn: this.$store.state.loggedIn,
						credentials: this.$store.state.credentials
					}
				)
				if (resp) {
					this.watchlists = resp.map(watchlist => {
						return {
							id: watchlist.id,
							name: watchlist.name,
							orderbooks: watchlist.orderbooks
						}
					})
				}
			} catch (err) {
				console.log(err)
			}
		},
		async loadListContent(deps, watchlistId, watchlists) {
			try {
				if (watchlistId && watchlists.length > 0) {
					const wantedWatchlist = watchlists.find(list => {
						return list.id === watchlistId
					})
					if (wantedWatchlist !== undefined) {
						const resp = await deps.fetchListContent(
							{ avanza: deps.avanza, verifyAuth: deps.verifyAuth },
							{
								session: this.$store.state.session,
								loggedIn: this.$store.state.loggedIn,
								credentials: this.$store.state.credentials
							},
							wantedWatchlist
						)

						this.dataToDisplay = resp.orderbooks
						this.tableTitle = resp.name
						return resp
					}
				}
				return []
			} catch (err) {
				console.log(err)
			}
		}
	},
	async mounted() {
		this.loadData()
	}
}
</script>

<style scoped>
</style>
