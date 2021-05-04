import * as functions from 'firebase-functions'

import * as userManualFuncs from './user_manual'
import * as dbMapperFuncs from './db_mapper'
import * as mainFuncs from './main'
import * as utils from './utils'

const magicWord = (require('../credentials/magic_word.json')).word

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

//-------------------
//- Métodos expuestos
//-------------------

//-
//- Listado principal, o sea, los Softwares

nativeFuncs.get_softwares = (async (session: any) => {
	return await mainFuncs.getSoftwares()
})
nativeFuncs.register_new_software = (async (session: any, data: any) => {
	const check = utils.checkStringParam("name", data.name)
	if (check.success === false) {
		return {
			success: false,
			code: check.code,
			msg: check.msg
		}
	}
	return await mainFuncs.registerNewSoftware(data.name)
})

//-
//- User Manual
nativeFuncs.get_user_manuals = (async (session: any, data: any) => {
	return await userManualFuncs.getUserManuals(data.software_id)
})
nativeFuncs.create_new_manual = (async (session: any, data: any) => {
	const check = utils.checkStringParam("name", data.name)
	if (check.success === false) {
		return {
			success: false,
			code: check.code,
			msg: check.msg
		}
	}
	return await userManualFuncs.createNewManual(data.name, data.software_id)
})
nativeFuncs.get_manual_body = (async (session: any, data: any) => {
	return await userManualFuncs.getManualBody(data.software_id, data.manual_id)
})
nativeFuncs.save_user_manual = (async (session: any, data: any) => {
	const result = await userManualFuncs.save(data.software_id, data.manual_id, data.tree, data.checkpoint_tree)
	return result
})
nativeFuncs.export_user_manuals = (async (session: any, data: any) => {
	if (data.magicWord !== magicWord) {
		return {
			success: false,
			code: "DENY",
			msg: "No dijiste la palabra mágica"
		}
	}
	return await userManualFuncs.exportUserManuals(data.softwareId)
})

//-
//- DB Walker

nativeFuncs.get_full_db_map = (async (session: any) => {
	const result = await dbMapperFuncs.getFullMap()
	return result
})

nativeFuncs.save_full_db_map = (async (session: any, data: any) => {
	if (data === null || data.new_body === undefined) {
		return {
			success: false,
			msg: "Me estás cargando ché boludo!!"
		}
	}
	if (Object.keys(data.new_body).length === 0 && data.new_body.constructor === Object) {
		return {
			success: false,
			msg: "Ese objeto está vacío papito!"
		}
	}
	const result = await dbMapperFuncs.saveFullMap(data.software_id, data.new_body)

	return result
})

nativeFuncs.get_current_saved_db_map = (async (session: any, data: any) => {
	const result = await dbMapperFuncs.getCurrentSavedDBMap(data.software_id)
	return result
})