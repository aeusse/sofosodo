import * as admin from 'firebase-admin'
import * as utils from './utils'
const path = require('path');
const os = require('os');
const fs = require('fs');
const db = admin.firestore()

const currentEnv = JSON.parse(process.env.FIREBASE_CONFIG || '')

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
        const docRef = db.collection("/softwares").doc(softwareId)
            .collection("manuals").doc(manualId)
        const transResult = await db.runTransaction(async transaction => {
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
            if (treeToSave !== checkpointTree) {
                await docRef.collection("modificationHistory").add({ issueDate: Date.now(), body: treeToSave })
            }
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
        let bucketQanty: any
        let target = "qanty-dev"
        let cert = "qanty-cert"
        if (currentEnv.projectId === "sofosodo-prod") {
            target = "qanty-prod"
            cert = "qanty-cert-prod"
        }
        const qantyCredentials = require('../credentials/' + cert + '.json');
        const qantyAppConfig = {
            credential: admin.credential.cert(qantyCredentials),
            databaseURL: "https://" + target + ".firebaseio.com",
            storageBucket: (target + ".appspot.com")
        }
        let found = false
        for (const app of admin.apps) {
            if (app?.name === "qantyForManuals") {
                found = true
                qantyDb = app.firestore()
                bucketQanty = app.storage().bucket();
                break
            }
        }
        if (found === false) {
            const adminQanty = admin.initializeApp(qantyAppConfig, "qantyForManuals")
            qantyDb = adminQanty.firestore()
            bucketQanty = adminQanty.storage().bucket();
        }
        const implementedExports = (await db.collection("/softwares").doc(softwareId).get()).data()
        if (implementedExports?.name !== "Qanty") {
            return {
                success: false,
                code: "NOT_IMPLEMENTED",
                msg: "Lo sentimos. Los manuales de ese software no se pueden exportar"
            }
        }
        const ps = []
        ps.push(exportStorage(bucketQanty))
        ps.push(exportFirestore(qantyDb, softwareId))
        await Promise.all(ps)
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

async function exportFirestore(qantyDb: any, softwareId: string) {
    const get = await getUserManuals(softwareId)
    if (get.success !== true) {
        return false
    }
    const qantyBatch = qantyDb.batch();
    let replacement = "qanty-dev.appspot.com/o/manuals%2F"
    if (currentEnv.projectId === "sofosodo-prod") {
        replacement = "qanty-prod.appspot.com/o/manuals%2F"
    }
    for (const id in get.manuals) {
        get.manuals[id].body = utils.replaceAll(get.manuals[id].body, "sofosodo-dev.appspot.com/o/", replacement)
        qantyBatch.set(qantyDb.collection("/manuals").doc(id), get.manuals[id])
    }
    await qantyBatch.commit();
    return true
}
async function exportStorage(bucketQanty: any) {
    const bucket = admin.storage().bucket();
    const files = (await bucket.getFiles())[0]
    const ps = []
    for (const key in files) {
        ps.push(exportSingleFile(bucket, bucketQanty, files[key]))
    }
    await Promise.all(ps)
    return true
}
async function exportSingleFile(bucket: any, bucketQanty: any, file: any) {
    const fileName = path.basename(file.name);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    await bucket.file(file.name).download({ destination: tempFilePath });
    await bucketQanty.upload(tempFilePath, {
        destination: "manuals/" + file.name
    });
    // Once the file has been uploaded, delete the local file to free up disk space.
    return fs.unlinkSync(tempFilePath);
}