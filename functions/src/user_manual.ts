import * as admin from 'firebase-admin'

const db = admin.firestore()

export async function getUserManuals() {
    try {

        const manuals = (await db.collection("/softwares").doc("qanty")
        .collection("userManuals").get()).docs

        console.log(manuals)
        
        return{
            success: true
        }

    } catch (error) {
        console.error("Error user_manuals get: " + error.stack)
        return {
            success: false,
            code: "GET_USER_MANUAL_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}

export async function getCurrent() {
    try {

        const softwareInfo = (await db.collection("/softwares").doc("qanty").get()).data()
        let currentManual:string
        if (softwareInfo){
            currentManual = softwareInfo.currentManual || JSON.stringify({})
        }else{
            currentManual = JSON.stringify({})
        }
        return{
            success: true,
            currentManual: currentManual
        }

    } catch (error) {
        console.error("Error user_manual get: " + error.stack)
        return {
            success: false,
            code: "GET_USER_MANUAL_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}

export async function save(treeToSave:any, checkpointTree:any) {
    try {
        const transResult = await db.runTransaction(async transaction => {
            const docRef = db.collection("/softwares").doc("qanty")
            const softwareInfo = (await transaction.get(docRef)).data()

            if (softwareInfo && softwareInfo.currentManual !== undefined){
                if (softwareInfo.currentManual !== checkpointTree){
                    return{
                        success: false,
                        code: "INTEGRITY_CHECK_WARNING",
                        msg: "Se han realizado cambios en la DB desde que usted cargó la aplicación. Por favor corrobe a mano"
                    }
                }
            }

            transaction.set(docRef, {currentManual: treeToSave}, { merge: true })

            return {
                success: true
            }
        })

        if (transResult.success === true) {
            return {
                success: true
            }
        } else {
            return {
                success: false,
                code: transResult.code,
                msg: transResult.msg
            }
        }

    } catch (error) {
        console.error("Error user_manual save: " + error.stack)
        return {
            success: false,
            code: "SAVE_USER_MANUAL_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}