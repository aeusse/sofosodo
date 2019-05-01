import * as admin from 'firebase-admin'

//const db = admin.firestore()

export async function getFullMap() {
    try {

        const qantyCredentials = require('../qanty-firebase-adminsdk-xdnss.json');
        const qantyAppConfig = {
            credential: admin.credential.cert(qantyCredentials),
            databaseURL: "https://qanty-dev.firebaseio.com"
        }
        const adminQanty = admin.initializeApp(qantyAppConfig, "qanty")
        const qantyDb = adminQanty.firestore()




        /*const companyData = (await qantyDb.collection("/companies").doc("57b2ORKV0Rw1u9Glnowh").get()).data()
        console.log(companyData)
        const companyCollections = (await qantyDb.collection("/companies").doc("57b2ORKV0Rw1u9Glnowh").getCollections())
        for (const collection in companyCollections){
            const algo = (await companyCollections[collection].get()).docs
            for (const i in algo){
                console.log(algo[i].data())
            }
        }*/
        const ignoredPaths = ["branches",
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
            "statEvents"
        ]

        const allowedToReadAllDocs = ["companies",
            "customerDocTypes",


            "sessions"


        ]

        let result:any = {}

        const collections = await qantyDb.getCollections()
        for (const c of collections){
            if (ignoredPaths.indexOf(c.path) === -1){
                //console.log(c.id)
                if (c.id !== "sessions"){
                    continue
                }
                //console.log(c.path)
                result[c.id] = {}
                const docs = (await qantyDb.collection(c.path).get()).docs
                if (allowedToReadAllDocs.indexOf(c.id) > -1){
                    console.log(c.id, "leyendo todos los documentos")
                    for (const doc of docs){
                        const data = doc.data()
                        processData(result, c, data)
                    }
                }else{
                    console.log(c.id, "leyendo solo el primer documento")
                    const data = docs[0].data()
                    processData(result, c, data)
                }
                //break
            }
        }

        console.log("====")
        console.log("====")
        console.log(result)
        console.log(JSON.stringify(result))


        return{
            success: true
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

function processData(result:any, c:any, data:any){
    for (const key in data){
        if (typeof(data[key]) === "object"){
            result[c.id][key] = {}
            walkThroughSingleObject(result[c.id][key], data[key])
        }else{
            result[c.id][key] = typeof(data[key])
        }
    }
}

function walkThroughSingleObject(target:any, field:any){
    for (const subKey in field){
        if (typeof (field[subKey]) === "object") {
            target[subKey] = {}
            walkThroughSingleObject(target[subKey], field[subKey]);
        }else{
            target[subKey] = typeof(field[subKey])
        }
    }
}