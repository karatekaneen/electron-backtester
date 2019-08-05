/* eslint-disable max-len */
import { shallowMount, mount } from '@vue/test-utils'
import Login from '@/components/Login.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Avanza from 'Avanza'

Vue.use(Vuetify)

describe('Login.vue', () => {
	describe('DOM', () => {
		it('Renders login card', () => {
			const wrapper = shallowMount(Login)
			expect(wrapper.html()).toContain('Login')
			expect(wrapper.html()).toContain('Username')
			expect(wrapper.html()).toContain('Password')
		})

		it('Tries to login when button is pressed', () => {
			const mock = jest.fn()
			const mockAvanza = jest.fn()
			jest.mock('Avanza', () => {
				return function() {
					return { mockAvanza }
				}
			})
			const wrapper = mount(Login, {
				data() {
					return {
						// Avanza: mockAvanza,
						username: 'testUser',
						password: 'testPass'
					}
				},
				methods: {
					submitLogin: mock
				}
			})

			wrapper.find('.loginbutton').trigger('click')

			expect(mock.mock.calls[0][0].dep.avanza).toEqual(new Avanza())
			expect(mock.mock.calls[0][0].payload).toEqual({
				username: 'testUser',
				password: 'testPass'
			})
		})

		it.skip('Makes sure login button is disabled if no username&password given', () => {
			// TODO Enable this again when dev is complete and placeholder username and password removed.
			const mock = jest.fn()
			const wrapper = mount(Login, {
				methods: {
					submitLogin: mock
				}
			})

			wrapper.find('.loginbutton').trigger('click')
			expect(mock).not.toBeCalled()
		})
	})

	describe('Logic', () => {
		it('Tries to auth with credentials given', () => {
			const mockAuth = jest.fn()
			// Expected API-response:
			const apiResp = {
				authenticationSession: 'sajh3421-f1324-f526-asdjkad-0bljas523',
				customerId: '1231531',
				pushSubscriptionId: '87678a6sd678687a6b68ba6876ba',
				securityToken: 'bb12312-d6435-4fcads-41314-123123123'
			}
			mockAuth.mockReturnValue(apiResp)

			// Mock data:
			const mockAvanza = {
				authenticate: mockAuth
			}

			const payload = {
				username: 'testUser',
				password: 'testPass'
			}

			const mockStore = {
				commit: jest.fn()
			}

			const wrapper = shallowMount(Login, {
				mocks: {
					$store: mockStore
				},
				data() {
					return {
						secret: 'hello'
					}
				}
			})

			wrapper.vm.submitLogin({
				dep: {
					avanza: mockAvanza
				},

				payload: { ...payload, totpSecret: 'hello' }
			})

			expect(mockAuth).toBeCalledWith(payload)
		})
	})

	it('Stores values given from API', () => {
		const mockStore = {
			commit: jest.fn()
		}
		const wrapper = shallowMount(Login, {
			mocks: {
				$store: mockStore
			}
		})

		const mockInput = {
			session: {
				authenticationSession: 'sajh3421-f1324-f526-asdjkad-0bljas523',
				customerId: '1231531',
				pushSubscriptionId: '87678a6sd678687a6b68ba6876ba',
				securityToken: 'bb12312-d6435-4fcads-41314-123123123'
			},
			credentials: {
				username: 'testUser',
				password: 'testPass',
				totpSecret: 'testSecret'
			}
		}

		wrapper.vm.storeSession(mockInput)
		expect(mockStore.commit.mock.calls[0][0]).toBe('setSession')
		expect(mockStore.commit.mock.calls[0][1]).toBe(mockInput.session)
		expect(mockStore.commit.mock.calls[1][0]).toBe('setCredentials')
		expect(mockStore.commit.mock.calls[1][1]).toBe(mockInput.credentials)
	})
})
