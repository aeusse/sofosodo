import * as admin from 'firebase-admin'
const db = admin.firestore()

export async function getFullMap() {
    try {

        const qantyCredentials = require('../qanty-cert.json');
        const qantyAppConfig = {
            credential: admin.credential.cert(qantyCredentials),
            databaseURL: "https://qanty-dev.firebaseio.com"
        }
        const adminQanty = admin.initializeApp(qantyAppConfig, "qanty")
        const qantyDb = adminQanty.firestore()

        const ignoredPaths = [  //- Estos son paths absolutos empezando desde la propia /
            "branches",
            "companyMainMaps",
            "customInfo",
            "devices",
            "errorLog",
            "lines",
            "mobiles",
            "printers",
            "screens",
            "slots",
            "spots",
            "statEvents",
            "companies/57b2ORKV0Rw1u9Glnowh/tactiles",
            "companies/57b2ORKV0Rw1u9Glnowh/touchScreenTemplates"
        ]
        const allowedToReadAllDocs = [  //- Estos son solo el nombrecito de la colección
            "roles",
            //"sessions",
            //"users",
            "branches",
            "lines",
            "printers",
            "screens",
            "slots"
        ]
        const collections = await qantyDb.listCollections()

        const result: any = {}
        await processCollections(qantyDb, collections, result, ignoredPaths, allowedToReadAllDocs)

        return {
            success: true,
            dict: result
        }

    } catch (error) {
        console.error("Error db_mapper getFullMap: " + error.stack)
        return {
            success: false,
            code: "GET_FULL_MAP_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}

async function processCollections(qantyDb: any, collections: any, result: any, ignoredPaths: any, allowedToReadAllDocs: any) {

    const ps = []   //- Recolector de promesas
    const cs = []   //- Recolector de colecciones sincronizado con ps
    for (const c of collections) {
        //console.log("path:", c.path)
        if (ignoredPaths.indexOf(c.path) === -1) {
            /*if (c.id !== "companies" && c.id !== "branches"){
                continue
            }*/
            if (allowedToReadAllDocs.indexOf(c.id) === -1) {
                ps.push(qantyDb.collection(c.path).limit(1).get())
            } else {
                ps.push(qantyDb.collection(c.path).get())
            }
            cs.push(c)
        }
    }
    const rs = await Promise.all(ps)
    const ps2 = []   //- Un segundo recolector de promesas
    for (const idx in rs) {
        const docs = rs[idx].docs
        if (typeof result[cs[idx].id] === "undefined") {
            result[cs[idx].id] = {}
        }
        //console.log("path:", cs[idx].path)
        for (const doc of docs) {
            try {
                const data = doc.data()
                processData(result, cs[idx], data)
                const subCollections = await doc.ref.getCollections()
                if (subCollections.length > 0) {
                    if (typeof result[cs[idx].id]["subcollections"] === "undefined") {
                        result[cs[idx].id]["subcollections"] = {}
                    }
                    ps2.push(processCollections(qantyDb, subCollections, result[cs[idx].id]["subcollections"], ignoredPaths, allowedToReadAllDocs))
                }
            } catch (error) {
                console.log("Qué raro!!!!!!!!!!!!")
            }
        }
    }
    await Promise.all(ps2)
    return result
}

function processData(result: any, c: any, data: any) {
    if (typeof result[c.id]["fields"] === "undefined") {
        result[c.id]["fields"] = {}
    }
    const thisResultFields = result[c.id]["fields"]
    for (const key in data) {
        if (typeof (data[key]) === "object") {
            if (typeof thisResultFields[key] === "undefined") {
                thisResultFields[key] = {}
            }
            walkThroughSingleObject(thisResultFields[key], data[key])
        } else {
            thisResultFields[key] = typeof (data[key])
        }
    }
}

function walkThroughSingleObject(target: any, field: any) {
    for (const subKey in field) {
        if (typeof (field[subKey]) === "object") {
            if (typeof target[subKey] === "undefined") {
                target[subKey] = {}
            }
            walkThroughSingleObject(target[subKey], field[subKey]);
        } else {
            target[subKey] = typeof (field[subKey])
        }
    }
}

export async function saveFullMap(dict: any) {
    try {
        await db.collection("softwares").doc("qanty").set({ currentDBMap: dict }, { merge: true })
        return { success: true }
    } catch (error) {
        console.error("Error db_mapper saveFullMap: " + error.stack)
        return {
            success: false,
            code: "SAVE_FULL_MAP_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}

export async function getCurrentSavedDBMap() {
    try {
        const query = (await db.collection("softwares").doc("qanty").get()).data()
        if (query) {
            return {
                success: true,
                dict: query.currentDBMap
            }
        } else {
            return {
                success: false,
                msg: "Viejo, no se encontró nada en la DB"
            }
        }
    } catch (error) {
        console.error("Error db_mapper getCurrentSavedDBMap: " + error.stack)
        return {
            success: false,
            code: "GET_CURRENT_SAVED_DB_MAP_INTERNAL_ERROR",
            msg: "Error interno"
        }
    }
}