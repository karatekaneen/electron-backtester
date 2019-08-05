<template>
  <v-container>
    <v-layout row fluid wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-title primary-title class="headline instrument-summary-title">{{instrument.name}}</v-card-title>
          <div v-if="priceComponentVisible">
            <price :priceData="priceComponentData"></price>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Price from './subcomponents/Price.vue'
import { verifyAuth, fetchInstrument } from '../handlers/api/apiHandler'
import Avanza from 'avanza'
export default {
	props: {
		instrument: {
			type: Object
		}
	},
	components: {
		Price
	},
	data() {
		return {
			verifyAuth,
			fetchInstrument,
			avanza: new Avanza(),
			instrumentData: {},

			// Data for price component:
			priceComponentVisible: false,
			priceComponentData: {}
		}
	},
	methods: {
		async loadData(deps, instrument) {
			try {
				if (instrument.id && instrument.instrumentType) {
					const resp = await deps.fetchInstrument(
						{ avanza: deps.avanza, verifyAuth: deps.verifyAuth },
						{
							session: this.$store.state.session,
							loggedIn: this.$store.state.loggedIn,
							credentials: this.$store.state.credentials
						},
						instrument
					)
					return { ...instrument, ...resp }
				} else {
					throw new Error('Invalid instrument passed')
				}
			} catch (err) {
				return 'error'
				// TODO Fix error handling here
				// throw err
			}
		},
		passComponentData(instrumentData) {
			// Function to portion up the data that's received from API to their respective components.
			if (instrumentData) {
				const dataNeededForPriceComp = [
					{ value: 'buyPrice', optional: true },
					{ value: 'sellPrice', optional: true },
					{ value: 'change', optional: false },
					{ value: 'changePercent', optional: false },
					{ value: 'currency', optional: false },
					{ value: 'highestPrice', optional: false },
					{ value: 'lowestPrice', optional: false },
					{ value: 'lastPrice', optional: false },
					{ value: 'lastPriceUpdated', optional: false },
					{ value: 'quoteUpdated', optional: false }
				]
				const priceCompData = this.assignData({}, instrumentData, dataNeededForPriceComp)
				if (priceCompData) {
					if (priceCompData.condition) {
						this.priceComponentVisible = priceCompData.condition
						this.priceComponentData = priceCompData.obj
					}
				}
			}
		},
		assignData(obj, data, attributes) {
			let condition = false
			if (data != undefined && typeof data !== 'string') {
				condition = true
				for (const attribute of attributes) {
					if (data.hasOwnProperty(attribute.value)) {
						obj[attribute.value] = data[attribute.value]
					} else {
						if (!attribute.optional) {
							condition = false
						}
					}
				}
			}
			return { obj, condition }
		}
	},
	async mounted() {
		this.passComponentData(
			await this.loadData(
				{
					avanza: this.avanza,
					verifyAuth: this.verifyAuth,
					fetchInstrument: this.fetchInstrument
				},
				this.instrument
			)
		)
	}
}
</script>

<style scoped>
.instrument-summary-title {
	text-align: right;
}
</style>
