import * as admin from 'firebase-admin'

const db = admin.firestore()

export async function getUserManuals(softwareId: string) {
    try {
        const docs = (await db.collection("/softwares").doc(softwareId)
        .collection("manuals").orderBy("issueDate", "asc").get()).docs
        const result: any = {}
        for (const doc of docs) {
            result[doc.id] = doc.data()
        }
        return {
            success: true,
            manuals: result
        }
    } catch (error) {
        console.error("Error Main getSoftwares: " + error.stack)
        return {
            success: false,
            code: "GET_USER_MANUALS_INTERNAL_ERROR",
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

export async function createNewManual(name: string, softwareId: string) {
    try {
        const now = (new Date()).getTime()

        //- TO DO: Validar si ya existe ese nombre

        const create = await db.collection("/softwares").doc(softwareId)
        .collection("manuals").add({
            name: name,
            issueDate: now
        })
        return {
            success: true,
            id: create.id
        }
    } catch (error) {
        console.error("Error User Manuals createNewManual: " + error.stack)
        return {
            success: false,
            code: "CREATE_NEW_MANUAL_INTERNAL_ERROR",
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
                        msg: "Se han realizado cambios en la DB desde que usted cargó este manual. Por favor corrobe"
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