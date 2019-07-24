import * as functions from 'firebase-functions'

import * as userManualFuncs from './user_manual'
import * as dbMapperFuncs from './db_mapper'

//-
//- Setups
//-
const withoutSession = [
	"save_user_manual"
]
const nativeFuncs = <any>{}
module.exports = functions.https.onCall(async (data, context) => {
	const receivedFn = context.rawRequest.url.split('/')[2]
	const fn = nativeFuncs[receivedFn]
	if (typeof fn !== "function") {
		return {
			success: false,
			code: "UNDEFINED_FUNCTION",
			msg: "Función no definida"	//- Aquí podemos informar esto ya que por definición https.onCall está bien autenticado
		}
	}
	//- Verificaciones transversales
	let session
	if (withoutSession.indexOf(receivedFn) !== -1) {
		session = null
	} else {
		/*session = await utils.checkDocId("", "sessions", data.session)
		if (session.success === false) {
			return session
		}
		company = await globalVars.getMainMap(session.info.company.id)*/
	}
	//- Métodos expuestos
	const fnResult = await fn(session, data)
	if (fnResult.success === false) {
		console.log("fnResult Error -> La función fue:", receivedFn)
		console.log("fnResult Error -> El data en el request fue:", JSON.stringify(data))
		console.log("fnResult Error -> La sesión fue:", JSON.stringify(session))
		console.log("fnResult Error -> La respuesta fue:", JSON.stringify(fnResult))
	}
	return fnResult
})

//-
//- Métodos expuestos
//-
nativeFuncs.get_current_user_manual = (async (session: any) => {

	return await userManualFuncs.getCurrent()

})

nativeFuncs.save_user_manual = (async (session: any, data: any) => {

	const result = await userManualFuncs.save(data.tree, data.checkpoint_tree)

	return result

})

nativeFuncs.get_full_db_map = (async (session: any) => {

	const result = await dbMapperFuncs.getFullMap()

	return result

})

nativeFuncs.save_full_db_map = (async (session: any, data: any) => {

	if (data === null || data.dict === undefined){
		return {
			success: false,
			msg: "Me estás cargando ché boludo!!"
		}
	}
	if (Object.keys(data.dict).length === 0 && data.dict.constructor === Object){
		return {
			success: false,
			msg: "Ese objeto está vacío papito!"
		}
	}
	const result = await dbMapperFuncs.saveFullMap(data.dict)

	return result

})

nativeFuncs.get_current_saved_db_map = (async (session: any) => {

	const result = await dbMapperFuncs.getCurrentSavedDBMap()

	return result

})