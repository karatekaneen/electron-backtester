import { shallowMount, mount } from '@vue/test-utils'
import Overview from '@/components/Overview'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
document.body.setAttribute('data-app', true)

describe('Overview.vue', async () => {
	describe('DOM', () => {
		it('Displays header', () => {
			const mockStore = {
				state: {
					session: {},
					credentials: {},
					loggedIn: false
				}
			}
			const wrapper = mount(Overview, {
				mocks: {
					$store: mockStore
				},
				data() {
					return {
						watchlists: [{ name: 'mittcoolatest', id: 'snopp1' }],
						chosenWatchlist: 'snopp1',
						tableTitle: 'tabell-titel'
					}
				}
			})
			const selector = wrapper.find('.watchlistSelector')
			expect(selector.html()).toContain('mittcoolatest')

			const header = wrapper.find('.watchlist-title')
			expect(header.html()).toContain('tabell-titel')
		})
	})

	describe('Logic', async () => {
		describe('Load list content', async () => {
			it('Tries to fetch the data in watchlist', async () => {
				// Empty stuff to pass to functions:
				const emptyFunction = () => {
					return 'test'
				}
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}

				const mockFn = jest.fn()
				mockFn.mockReturnValue({
					name: 'hejhej',
					orderbooks: [{}, {}]
				})

				// Create wrapper:
				const wrapper = shallowMount(Overview, {
					mocks: {
						$store: mockStore
					}
				})

				await wrapper.vm.loadListContent(
					{
						avanza: emptyFunction,
						verifyAuth: emptyFunction,
						fetchListContent: mockFn
					},
					'12345',
					[{ name: 'hellothere', id: '12345' }]
				)

				expect(mockFn.mock.calls[0][0]).toEqual({
					avanza: emptyFunction,
					verifyAuth: emptyFunction
				})
				expect(mockFn.mock.calls[0][1]).toEqual({
					credentials: {},
					loggedIn: false,
					session: {}
				})
				expect(mockFn.mock.calls[0][2]).toEqual({ name: 'hellothere', id: '12345' })
			})

			it('Does not try to fetch data if no watchlist match id', async () => {
				// Empty stuff to pass to functions:
				const emptyFunction = () => {
					return 'test'
				}
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}

				const mockFn = jest.fn()

				// Create wrapper:
				const wrapper = shallowMount(Overview, {
					mocks: {
						$store: mockStore
					}
				})
				await wrapper.vm.loadListContent(
					{
						avanza: emptyFunction,
						verifyAuth: emptyFunction,
						fetchListContent: mockFn
					},
					'12345',
					[{ name: 'hellothere', id: '1234' }]
				)

				expect(mockFn).not.toHaveBeenCalled()
			})

			it('Does not try to fetch data if no watchlistId specified', async () => {
				// Empty stuff to pass to functions:
				const emptyFunction = () => {
					return 'test'
				}
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}

				const mockFn = jest.fn()

				// Create wrapper:
				const wrapper = shallowMount(Overview, {
					mocks: {
						$store: mockStore
					}
				})

				await wrapper.vm.loadListContent(
					{
						avanza: emptyFunction,
						verifyAuth: emptyFunction,
						fetchListContent: mockFn
					},
					'',
					['hellothere']
				)

				expect(mockFn).not.toHaveBeenCalled()
			})

			it('Does not try to fetch data if no watchlists in list', async () => {
				// Empty stuff to pass to functions:
				const emptyFunction = () => {
					return 'test'
				}
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}

				const mockFn = jest.fn()

				// Create wrapper:
				const wrapper = shallowMount(Overview, {
					mocks: {
						$store: mockStore
					}
				})

				await wrapper.vm.loadListContent(
					{
						avanza: emptyFunction,
						verifyAuth: emptyFunction,
						fetchListContent: mockFn
					},
					'1235',
					[]
				)

				expect(mockFn).not.toHaveBeenCalled()
			})
		})

		describe('Load summary data', () => {
			it('Destructures object & return values needed', () => {
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}

				// Create wrapper:
				const wrapper = shallowMount(Overview, {
					mocks: {
						$store: mockStore
					}
				})

				const resp = wrapper.vm.getSummaryData({
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
				})

				expect(resp).toEqual({ id: '5447', name: 'ABB Ltd', instrumentType: 'STOCK' })
			})
		})
	})
})
