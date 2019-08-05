/* eslint-disable indent */
import { verifyAuth, fetchWatchlists, fetchListContent } from '@/handlers/api/apiHandler'
// import { shallowMount, mount } from '@vue/test-utils'

const emptyAvanza = {
	_credentials: {
		username: '',
		password: '',
		totpSecret: ''
	},
	_authenticated: false,
	_authenticationSession: '',
	_customerId: '',
	_securityToken: ''
}

describe('apiHandler', async () => {
	describe('verify auth', () => {
		it('Sets all the session variables', async () => {
			const avanza = { ...emptyAvanza }
			const params = {
				userCredentials: {
					username: 'testUser',
					password: 'testPass',
					totpSecret: 'testSecret'
				},
				session: {
					securityToken: '3423h43h-342j-j342-123213b-2138908f',
					authenticationSession: '213-5324-234264-234-24-23425',
					customerId: '325643'
				}
			}

			const outputAvanza = verifyAuth({ avanza }, params)

			expect(outputAvanza._securityToken).toBe(params.session.securityToken)
			expect(outputAvanza._authenticationSession).toBe(params.session.authenticationSession)
			expect(outputAvanza._customerId).toBe(params.session.customerId)
			expect(outputAvanza._credentials).toBe(params.userCredentials)
			expect(outputAvanza._authenticated).toBe(true)
		})

		it('sets authenticated to false when not all the session variables are set', () => {
			const avanza = { ...emptyAvanza }
			const params = {
				userCredentials: {
					username: 'testUser',
					password: 'testPass',
					totpSecret: 'testSecret'
				},
				session: {
					securityToken: '3423h43h-342j-j342-123213b-2138908f',
					authenticationSession: '',
					customerId: '325643'
				}
			}

			const outputAvanza = verifyAuth({ avanza }, params)

			expect(outputAvanza._securityToken).toBe(params.session.securityToken)
			expect(outputAvanza._authenticationSession).toBe(params.session.authenticationSession)
			expect(outputAvanza._customerId).toBe(params.session.customerId)
			expect(outputAvanza._credentials).toBe(params.userCredentials)
			expect(outputAvanza._authenticated).toBe(false)
		})

		it('sets authenticated to false when not all the user credentials are set', () => {
			const avanza = { ...emptyAvanza }
			const params = {
				userCredentials: {
					username: 'testUser',
					password: '',
					totpSecret: 'testSecret'
				},
				session: {
					securityToken: '3423h43h-342j-j342-123213b-2138908f',
					authenticationSession: '2342643543534',
					customerId: '325643'
				}
			}

			const outputAvanza = verifyAuth({ avanza }, params)

			expect(outputAvanza._securityToken).toBe(params.session.securityToken)
			expect(outputAvanza._authenticationSession).toBe(params.session.authenticationSession)
			expect(outputAvanza._customerId).toBe(params.session.customerId)
			expect(outputAvanza._credentials).toBe(params.userCredentials)
			expect(outputAvanza._authenticated).toBe(false)
		})
	})

	describe('fetchWatchlists', () => {
		it('Makes call to fetch watchlists if logged in', () => {
			const mock = jest.fn()

			const avanza = { ...emptyAvanza, getWatchlists: mock }
			const verifyAuth = () => {
				const avanza = { ...emptyAvanza, getWatchlists: mock }
				return avanza
			}

			const mockSession = {}
			const mockLogin = true
			const mockCredentials = {}

			fetchWatchlists(
				{ avanza, verifyAuth },
				{
					session: mockSession,
					loggedIn: mockLogin,
					credentials: mockCredentials
				}
			)

			expect(mock).toHaveBeenCalled()
		})

		it('Does _not_ call to fetch watchlists if not logged in', () => {
			const mock = jest.fn()

			const avanza = { ...emptyAvanza, getWatchlists: mock }
			const verifyAuth = () => {}

			const mockSession = {}
			const mockLogin = false
			const mockCredentials = {}

			fetchWatchlists(
				{ avanza, verifyAuth },
				{
					session: mockSession,
					loggedIn: mockLogin,
					credentials: mockCredentials
				}
			)

			expect(mock).not.toHaveBeenCalled()
		})
	})

	describe('fetchListContent', async () => {
		const mockVerifyAuth = jest.fn()

		const mockContext = {
			loggedIn: true,
			session: {},
			userCredentials: {}
		}
		const mockAvanza = {}
		it('does not try to fetch if list is empty', async () => {
			const mockFetch = jest.fn()

			const deps = {
				verifyAuth: mockVerifyAuth,
				avanza: mockAvanza
			}
			const payload = {
				name: '123',
				id: '234',
				orderbooks: []
			}

			const resp = await fetchListContent(deps, mockContext, payload)

			expect(resp).toEqual(payload)
			expect(mockFetch).not.toHaveBeenCalled()
		})

		it('Does not try to fetch if not logged in', async () => {
			const deps = {
				verifyAuth: mockVerifyAuth,
				avanza: mockAvanza
			}
			const payload = {
				name: '123',
				id: '234',
				orderbooks: []
			}
			const context = {
				loggedIn: false,
				session: {},
				userCredentials: {}
			}

			await expect(fetchListContent(deps, context, payload)).rejects.toThrowError(
				'not logged in'
			)

			expect(mockVerifyAuth).not.toHaveBeenCalled()
		})

		it('Try to fetch data if logged in & have ids to fetch', async () => {
			const mockFetch = jest.fn()

			const deps = {
				verifyAuth: mockVerifyAuth,
				avanza: {
					getOrderbooks: mockFetch
				}
			}

			// Adding mock return values:
			mockVerifyAuth.mockReturnValue({
				getOrderbooks: mockFetch
			})

			const returnData = [
				{ id: '123', name: 'test' },
				{ id: '5453', name: 'test' },
				{ id: '657567', name: 'test' },
				{ id: '756757675', name: 'test' }
			]
			mockFetch.mockReturnValue(returnData)
			const payload = {
				name: '123',
				id: '234',
				orderbooks: ['123', '5453', '657567', '756757675']
			}
			const context = {
				loggedIn: true,
				session: { s: 'mycoool-sesh' },
				credentials: { a: 'creds yo' }
			}

			const resp = await fetchListContent(deps, context, payload)

			expect(mockFetch).toHaveBeenCalledWith(payload.orderbooks)
			expect(mockVerifyAuth).toHaveBeenCalledWith(
				{ avanza: deps.avanza },
				{
					session: context.session,
					userCredentials: context.credentials
				}
			)
			expect(resp).toEqual({
				id: payload.id,
				name: payload.name,
				orderbooks: returnData
			})
		})
	})
})
