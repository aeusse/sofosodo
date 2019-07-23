import * as admin from 'firebase-admin'

//const db = admin.firestore()

export async function getFullMap() {
    try {

        const qantyCredentials = require('../qanty-cert.json');
        const qantyAppConfig = {
            credential: admin.credential.cert(qantyCredentials),
            databaseURL: "https://qanty-dev.firebaseio.com"
        }
        const adminQanty = admin.initializeApp(qantyAppConfig, "qanty")
        const qantyDb = adminQanty.firestore()

        const ignoredPaths = [
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
        const allowedToReadAllDocs = [
            "roles",
            //"sessions",
            //"users",
            "branches",
            "lines",
            "printers",
            "screens",
            "slots"
        ]
        const collections = await qantyDb.getCollections()
        
        let result:any = {}
        await processCollections(qantyDb, collections, result, ignoredPaths, allowedToReadAllDocs)

        console.log("====")
        console.log("====")
        console.log(result)
        console.log(JSON.stringify(result))

        //const result = JSON.parse('{"companies":{"enabled":"boolean","token":"string","thirdPartyFrontendFolder":"string","name":"string","fcmServerKey":"string","thirdPartyStrings":{"customFields":{"tipo_de_empaque":"string","tipo_de_carne":"string","tipo_de_corte":"string"}},"deleted":"boolean"},"customerDocTypes":{"shortName":"string","key":"string","name":"string"},"ownCustomers":{"docType":"string","email":"string","name":"string","mobileToken":"string","mobileId":"string","lastName":"string","docNumber":"string"},"apps":{"enabled":"boolean","deleted":"boolean","hidden":"boolean","name":"string","fcmServerKey":"string"},"ownMobiles":{"deviceId":"string","appName":"string","pushToken":"string"},"branches":{"enabled":"boolean","hidden":"boolean","gmt":"string","customBranchId":"string","name":"string","appId":"string","deleted":"boolean","branchGroupIds":{"0":"string"},"location":{"latitude":"number","longitude":"number","name":"string","address":"string"},"lastUpdate":"number"},"roles":{"lastUpdate":"number","companyId":"string","ep":"string","name":"string","rules":{"read":{"0":"string"},"update":{"0":"string"},"create":{"0":"string"}},"deleted":"boolean","isFullAdmin":"boolean","enabled":"boolean","description":"string","hidden":"boolean","profile":"string"},"tickets":{"branchName":"string","startLineId":"string","status":"string","details":"string","name":"string","activity":{"0":{"name":"string","lineName":"string","endDate":"number","startDate":"number","lineId":"string"},"1":{"slotRef":"string","startDate":"number","userId":"string","name":"string","lineId":"string","lineName":"string","endDate":"number"}},"createdBy":{"id":"string","email":"string","name":"string"},"currentLineName":"string","currentActivity":"number","lineName":"string","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","origin":"string","currentLineId":"string","startLineName":"string","branchId":"string"},"lines":{"enabled":"boolean"},"realtime":{"placement":{"slotGroup":{"id":"string","name":"string"},"slot":{"displayName":"string","id":"string","name":"string"},"branch":{"gmt":"string","id":"string","twentyfourSevenService":{},"name":"string"}},"user":{"lastName":"string","firstName":"string","id":"string"},"action":"string","issueDate":"number"},"slotGroups":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"},"orders":{"allOrders":{"0":"string"},"waitingOrders":{"0":"string"}},"slots":{"status":"string","user":{"firstName":"string","id":"number","lastName":"string"},"name":"string","deleted":"boolean","type":"string","lines":{"0":"string"},"lastUser":{"id":"string","lastName":"string","firstName":"string"},"slotGroupId":"string","displayName":"string","enabled":"boolean","hidden":"boolean"},"stats":{"inTransitTickets":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","maxInTransitTime":"number","served":"number","waitTime":"number","tickets":"number","maxWaitTime":"number","finished":"number","successfullyServeTime":"number","inTransitTime":"number","waitingTickets":"number","minWaitTime":"number","canceled":"number","minInTransitTime":"number","dumped":"number","successfullyServed":"number","servingTickets":"number","serveTime":"number"},"detailed":{"issueDate":"number","status":"string","details":"string","createdBy":{"email":"string","name":"string","id":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","name":"string","lastName":"string","phoneNumbers":{"0":"number"}},"customFields":{"exito":{"carnes":{"0":{"tipo_de_corte":"string","plu":"number","cantidad":"number","tipo_de_empaque":"string","precio":"number","tipo_de_carne":"string"},"1":{"tipo_de_empaque":"string","precio":"number","tipo_de_carne":"string","tipo_de_corte":"string","plu":"number","cantidad":"number"}}}}},"sessions":{"company":{"id":"string","name":"string"},"placement":{"branch":{"id":"string","name":"string","gmt":"string"}},"userId":"string","issueDate":"number","ref":"string","companyId":"string"},"touchScreens":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"},"byHour":{"reused":"number","docId":"number","autodumped":"number","served":"number","canceled":"number","dumped":"number","successfullyServed":"number","tickets":"number","finished":"number"},"users":{"deleted":"boolean","roleId":"string","lastName":"string","hidden":"boolean","firstName":"string","docNumber":"string","branches":{"0":"string","1":"string"},"docType":"string","companyId":"string","lastLogin":"string","description":"string","enabled":"boolean","password":"string","email":"string"},"printers":{"name":"string","type":"string","deleted":"boolean","interface":"string","enabled":"boolean","hidden":"boolean"},"screens":{"name":"string","token":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"},"detailedByDay":{"json":"string"},"printerHubEvents":{"printerId":"string","details":"string","ticketIssueDate":"number","ticketName":"string","lineId":"string","lineName":"string","issueDate":"number"},"tactiles":{"enabled":"boolean"},"events":{"ticketId":"string","issueDate":"number","slotDisplayName":"string","ticketName":"string","lineId":"string"},"customers":{"docId":"string","docType":"string","docTypeId":"string"},"mobiles":{"deviceId":"string","appName":"string","pushToken":"string"},"activity":{"name":"string","endDate":"number","startDate":"number","lineId":"string"}}');

        return{
            success: true,
            json: result
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

async function processCollections(qantyDb:any, collections:any, result:any, ignoredPaths:any, allowedToReadAllDocs:any){
    
    const ps = []   //- Recolector de promesas
    const cs = []   //- Recolector de colecciones sincronizado con ps
    for (const c of collections){
        //console.log("path:", c.path)
        if (ignoredPaths.indexOf(c.path) === -1){
            /*if (c.id !== "companies" && c.id !== "branches"){
                continue
            }*/
            if (allowedToReadAllDocs.indexOf(c.id) === -1){
                ps.push(qantyDb.collection(c.path).limit(1).get())
            }else{
                ps.push(qantyDb.collection(c.path).get())
            }
            cs.push(c)
        }else{
            //console.log("no señor")
        }
    }
    const rs = await Promise.all(ps)
    const ps2 = []   //- Un segundo recolector de promesas
    for (const idx in rs){
        const docs = rs[idx].docs
        result[cs[idx].id] = {}
        console.log("path:", cs[idx].path)
        for (const doc of docs){
            try {
                const data = doc.data()
                processData(result, cs[idx], data)
                const subCollections = await doc.ref.getCollections()
                if (subCollections.length > 0){
                    result[cs[idx].id]["subcollections"] = {}
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

function processData(result:any, c:any, data:any){
    result[c.id]["fields"] = {}
    const thisResultFields = result[c.id]["fields"]
    for (const key in data){
        if (typeof(data[key]) === "object"){
            thisResultFields[key] = {}
            walkThroughSingleObject(thisResultFields[key], data[key])
        }else{
            thisResultFields[key] = typeof(data[key])
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