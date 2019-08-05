<template>
  <v-card class="justify-center">
    <!-- <v-card-title class="justify-center "> -->
    <span class="attribute-group">
      <span class="font-weight-thin body-2 attribute-title">Change %:</span>
      <span
        class="font-weight-medium font-weight-medium subheading attribute-value"
        v-bind:class="{positive: changeSigns.positive, negative: !changeSigns.positive}"
      >
        {{priceData.changePercent}}%
        <v-icon
          small
          v-bind:class="{positive: changeSigns.positive, negative: !changeSigns.positive}"
        >{{changeSigns.icon}}</v-icon>
      </span>
    </span>
    <span class="attribute-group">
      <span class="font-weight-thin body-2 attribute-title">Change:</span>
      <span
        class="font-weight-medium font-weight-medium subheading attribute-value"
        v-bind:class="{positive: changeSigns.positive, negative: !changeSigns.positive}"
      >
        {{priceData.change}}
        <v-icon
          small
          v-bind:class="{positive: changeSigns.positive, negative: !changeSigns.positive}"
        >{{changeSigns.icon}}</v-icon>
      </span>
    </span>
    <span class="attribute-group">
      <span class="font-weight-thin body-2 attribute-title">Last:</span>
      <span class="font-weight-medium subheading attribute-value">{{dataToDisplay.lastPrice}}</span>
    </span>
    <span v-if="dataToDisplay.buyPrice && dataToDisplay.sellPrice">
      <span class="attribute-group">
        <span class="font-weight-thin body-2 attribute-title">Bid:</span>
        <span class="font-weight-medium subheading attribute-value">{{dataToDisplay.buyPrice}}</span>
      </span>
      <span class="attribute-group">
        <span class="font-weight-thin body-2 attribute-title">Ask:</span>
        <span class="font-weight-medium subheading attribute-value">{{dataToDisplay.sellPrice}}</span>
      </span>
    </span>
    <span class="attribute-group">
      <span class="font-weight-thin body-2 attribute-title">High:</span>
      <span class="font-weight-medium subheading attribute-value">{{dataToDisplay.highestPrice}}</span>
    </span>
    <span class="attribute-group">
      <span class="font-weight-thin body-2 attribute-title">Low:</span>
      <span class="font-weight-medium subheading attribute-value">{{dataToDisplay.lowestPrice}}</span>
    </span>
    <span class="attribute-group">
      <span class="font-weight-thin body-2 attribute-title">At:</span>
      <span class="font-weight-medium subheading attribute-value">{{dataToDisplay.lastPriceUpdated}}</span>
    </span>
    <!-- </v-card-title> -->
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
	props: ['priceData'],
	data() {
		return {
			moment,

			dataToDisplay: {
				lastPrice: null,
				buyPrice: null,
				sellPrice: null,
				highestPrice: null,
				lowestPrice: null,
				lastPriceUpdated: null,
				change: null,
				changePercent: null
			}
		}
	},
	computed: {
		changeSigns() {
			if (this.dataToDisplay.change > 0) {
				return { positive: true, icon: 'keyboard_arrow_up' }
			} else if (this.dataToDisplay.change == 0) {
				return { positive: true, icon: 'keyboard_arrow_right' }
			} else if (this.dataToDisplay.change < 0) {
				return { positive: false, icon: 'keyboard_arrow_down' }
			} else {
				return { positive: true, icon: 'keyboard_arrow_right' }
			}
		}
	},
	methods: {
		loadDataToDisplay(deps, price) {
			const dataOutput = { ...price }

			// Add time tag:
			const lastPriceUpdated = new Date(dataOutput.lastPriceUpdated)
			dataOutput.lastPriceUpdated = deps
				.moment(lastPriceUpdated)
				.format('HH:mm:ss')
			this.dataToDisplay = dataOutput
		}
	},
	mounted() {
		this.loadDataToDisplay({ moment: this.moment }, this.priceData)
	}
}
</script>

<style scoped>
.attribute-group {
	margin-left: 0.5vw;
	margin-right: 0.5vw;
}

.attribute-value {
	padding-inline-start: 5px;
}

.positive {
	color: rgb(123, 226, 123);
}
.negative {
	color: rgb(185, 93, 93);
}
</style>
