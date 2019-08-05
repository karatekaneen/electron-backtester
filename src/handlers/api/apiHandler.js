export const verifyAuth = (dep, payload) => {
	const avanza = dep.avanza

	avanza._credentials = payload.userCredentials
	avanza._securityToken = payload.session.securityToken
	avanza._customerId = payload.session.customerId
	avanza._authenticationSession = payload.session.authenticationSession

	const sessionVariablesSet =
		payload.session.securityToken &&
		payload.session.customerId &&
		payload.session.authenticationSession

	const userCredentialsSet =
		payload.userCredentials.username &&
		payload.userCredentials.password &&
		payload.userCredentials.totpSecret

	if (sessionVariablesSet && userCredentialsSet) {
		avanza._authenticated = true
	}

	return avanza
}

export const fetchWatchlists = async (dep, state) => {
	try {
		if (state.loggedIn) {
			dep.avanza = dep.verifyAuth(
				{ avanza: dep.avanza },
				{
					userCredentials: state.credentials,
					session: state.session
				}
			)
			const output = await dep.avanza.getWatchlists()
			return output
		} else {
			return false
		}
	} catch (err) {
		console.error(err)
	}
}

export const fetchListContent = async (dep, context, payload) => {
	try {
		if (context.loggedIn) {
			const clone = { ...payload }
			if (clone.orderbooks.length > 0) {
				dep.avanza = dep.verifyAuth(
					{ avanza: dep.avanza },
					{
						userCredentials: context.credentials,
						session: context.session
					}
				)
				clone.orderbooks = await dep.avanza.getOrderbooks(payload.orderbooks)
			}
			return clone
		} else {
			throw new Error('not logged in')
		}
	} catch (err) {
		throw new Error(err)
	}
}

export const fetchInstrument = async (dep, context, payload) => {
	try {
		if (context.loggedIn) {
			dep.avanza = dep.verifyAuth(
				{ avanza: dep.avanza },
				{
					userCredentials: context.credentials,
					session: context.session
				}
			)
			return await dep.avanza.getInstrument(payload.instrumentType, payload.id)
		} else {
			throw new Error('not logged in')
		}
	} catch (err) {
		throw new Error(err)
	}
}
