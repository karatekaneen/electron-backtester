/* eslint-disable function-paren-newline */
/* eslint-disable indent */
import { shallowMount } from '@vue/test-utils'
// import { shallowMount, mount } from '@vue/test-utils'
import InstrumentSummary from '@/components/InstrumentSummary'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
document.body.setAttribute('data-app', true)

describe('Instrument Summary', async () => {
	describe('Logic', async () => {
		describe('loadData', async () => {
			it('Calls loadData on mount with instrument prop', () => {
				// Create wrapper:
				const mockLoadData = jest.fn()
				shallowMount(InstrumentSummary, {
					methods: {
						loadData: mockLoadData
					},
					propsData: {
						instrument: {
							id: '1234',
							name: 'Kalle Anka AB',
							instrumentType: 'STOCK'
						}
					}
				})
				expect(mockLoadData.mock.calls[0][1]).toEqual({
					id: '1234',
					name: 'Kalle Anka AB',
					instrumentType: 'STOCK'
				})
			})

			it('Tries to fetch data if ID and type provided', async () => {
				const mockVerifyAuth = jest.fn()
				const mockfetchInstrument = jest.fn()
				const mockAvanza = {}
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: true
					}
				}

				const wrapper = shallowMount(InstrumentSummary, {
					mocks: {
						$store: mockStore
					},
					propsData: {
						instrument: {
							id: '1234',
							name: 'Kalle Anka AB',
							instrumentType: 'STOCK'
						}
					}
				})
				await wrapper.vm.loadData(
					{
						avanza: mockAvanza,
						verifyAuth: mockVerifyAuth,
						fetchInstrument: mockfetchInstrument
					},
					{
						id: '1234',
						name: 'Kalle Anka AB',
						instrumentType: 'STOCK'
					}
				)
				expect(mockfetchInstrument).toHaveBeenCalledWith(
					{
						avanza: mockAvanza,
						verifyAuth: mockVerifyAuth
					},
					mockStore.state,
					{
						id: '1234',
						name: 'Kalle Anka AB',
						instrumentType: 'STOCK'
					}
				)
			})

			it('Generates error if invalid instrument passed', async () => {
				const emptyFunction = jest.fn()
				const mockfetchInstrument = jest.fn()
				const mockAssign = jest.fn()
				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}

				const wrapper = shallowMount(InstrumentSummary, {
					mocks: {
						$store: mockStore
					},
					propsData: {
						instrument: {
							id: '',
							name: 'Kalle Anka AB',
							instrumentType: 'STOCK'
						}
					},
					methods: {
						assignData: mockAssign
					}
				})

				const resp = await wrapper.vm.loadData(
					{
						avanza: {},
						verifyAuth: emptyFunction,
						fetchInstrument: mockfetchInstrument
					},
					{
						id: '1234',
						name: 'Kalle Anka AB',
						instrumentType: ''
					}
				)
				expect(resp).toBe('error')
				// TODO Generate error component here instead.
				expect(mockAssign).toHaveBeenCalled()
				expect(mockfetchInstrument).not.toHaveBeenCalled()
			})
		})

		describe('assignData', () => {
			it('Applies attributes to output object', () => {
				const mockLoadData = jest.fn()
				mockLoadData.mockReturnValue('error')
				// To prevent this from running on mount

				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}
				const wrapper = shallowMount(InstrumentSummary, {
					mocks: {
						$store: mockStore
					},
					propsData: {
						instrument: {
							id: '',
							name: 'Kalle Anka AB',
							instrumentType: 'STOCK'
						}
					},
					methods: {
						loadData: mockLoadData
					}
				})
				const dataObject = {
					correctString: 'hejhej',
					correctNumber: 42,
					wrongArr: [1, 1, 2, 3, 5, 8, 13]
				}
				const resp = wrapper.vm.assignData({}, dataObject, [
					{
						value: 'correctString',
						optional: true
					},
					{
						value: 'correctNumber',
						optional: false
					}
				])

				expect(resp).toEqual({
					obj: {
						correctString: dataObject.correctString,
						correctNumber: dataObject.correctNumber
					},
					condition: true
				})
				expect(resp.wrongArr).toBe(undefined)
			})

			it('Returns empty object if incorrect dataObject is passed', () => {
				const mockLoadData = jest.fn()
				mockLoadData.mockReturnValue('error')
				// To prevent this from running on mount

				const mockStore = {
					state: {
						session: {},
						credentials: {},
						loggedIn: false
					}
				}
				const wrapper = shallowMount(InstrumentSummary, {
					mocks: {
						$store: mockStore
					},
					propsData: {
						instrument: {
							id: '',
							name: 'Kalle Anka AB',
							instrumentType: 'STOCK'
						}
					},
					methods: {
						loadData: mockLoadData
					}
				})
				const resp = wrapper.vm.assignData({}, 'dataObject', [
					'correctString',
					'correctNumber'
				])

				expect(resp).toEqual({ obj: {}, condition: false })
			})
		})
	})
})
