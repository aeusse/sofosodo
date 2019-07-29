import * as admin from 'firebase-admin'

const db = admin.firestore()

export async function getSoftwares() {
    try {
        const softs = (await db.collection("/softwares").orderBy("issueDate", "asc").get()).docs
        const result: any = {}
        for (const doc of softs) {
            result[doc.id] = doc.data()
        }
        return {
            success: true,
            softwares: result
        }
    } catch (error) {
        console.error("Error Main getSoftwares: " + error.stack)
        return {
            success: false,
            code: "GET_USER_MANUAL_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}

export async function registerNewSoftware(name: string) {
    try {
        const now = (new Date()).getTime()

        //- TO DO: Validar si ya existe ese nombre

        const create = await db.collection("/softwares").add({
            name: name,
            issueDate: now
        })
        return {
            success: true,
            id: create.id
        }
    } catch (error) {
        console.error("Error Main registerNewSoftware: " + error.stack)
        return {
            success: false,
            code: "GET_USER_MANUAL_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}