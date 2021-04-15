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
        console.error("Error User manual getUserManuals: " + error.stack)
        return {
            success: false,
            code: "GET_USER_MANUALS_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}


export async function getManualBody(softwareId: string, manualId: string) {
    try {
        const softwareInfo = (await db.collection("/softwares").doc(softwareId)
            .collection("manuals").doc(manualId)
            .get()).data()
        let body: string
        if (softwareInfo) {
            body = softwareInfo.body || JSON.stringify({})
        } else {
            body = JSON.stringify({})
        }
        return {
            success: true,
            body: body
        }
    } catch (error) {
        console.error("Error user_manual getManualBody: " + error.stack)
        return {
            success: false,
            code: "GET_MANUAL_BODY_INTERNAL_ERROR",
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

export async function save(softwareId: string, manualId: string, treeToSave: any, checkpointTree: any) {
    try {
        const transResult = await db.runTransaction(async transaction => {
            const docRef = db.collection("/softwares").doc(softwareId)
                .collection("manuals").doc(manualId)
            const softwareInfo = (await transaction.get(docRef)).data()

            if (softwareInfo && softwareInfo.body !== undefined) {
                if (softwareInfo.body !== checkpointTree) {
                    return {
                        success: false,
                        code: "INTEGRITY_CHECK_WARNING",
                        msg: "Se han realizado cambios en la DB desde que usted cargó este manual. Por favor corrobe"
                    }
                }
            }

            transaction.set(docRef, { body: treeToSave }, { merge: true })

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

export async function exportUserManuals(softwareId: string) {
    try {
        let qantyDb: any
        const currentEnv = JSON.parse(process.env.FIREBASE_CONFIG || '')
        if (currentEnv.projectId === "sofosodo-prod") {
            return {
                success: false,
                code: "NOT_IMPLEMENTED",
                msg: "Aún no vamos por allá en la implementación"
            }
        } else {
            //- Si no es "sofosodo-prod", casi que no importa donde estemos y nos vamos a pegarle a dev
            const qantyCredentials = require('../credentials/qanty-cert.json');
            const qantyAppConfig = {
                credential: admin.credential.cert(qantyCredentials),
                databaseURL: "https://qanty-dev.firebaseio.com"
            }
            let found = false
            for (const app of admin.apps) {
                if (app?.name === "qantyForManuals") {
                    found = true
                    qantyDb = app.firestore()
                    break
                }
            }
            if (found === false) {
                const adminQanty = admin.initializeApp(qantyAppConfig, "qantyForManuals")
                qantyDb = adminQanty.firestore()
            }
        }
        const implementedExports = (await db.collection("/softwares").doc(softwareId).get()).data()
        if (implementedExports?.name !== "Qanty") {
            return {
                success: false,
                code: "NOT_IMPLEMENTED",
                msg: "Lo sentimos. Los manuales de ese software no se pueden exportar"
            }
        }
        const get = await getUserManuals(softwareId)
        if (get.success !== true) {
            return get
        }
        const qantyBatch = qantyDb.batch();
        for (const id in get.manuals) {
            qantyBatch.set(qantyDb.collection("/manuals").doc(id), get.manuals[id])
        }
        await qantyBatch.commit();
        return {
            success: true
        }

    } catch (error) {
        console.error("Error User manual exportUserManuals: " + error.stack)
        return {
            success: false,
            code: "EXPORT_USER_MANUALS_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}