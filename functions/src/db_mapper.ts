import * as admin_qanty from 'firebase-admin'

//const db = admin.firestore()

export async function getFullMap() {
    try {

        const qantyCredentials = require('../qanty-firebase-adminsdk-xdnss.json');
        console.log(qantyCredentials)
        admin_qanty.initializeApp({
            credential: admin_qanty.credential.cert(qantyCredentials)
        });
        const qantyDb = admin_qanty.firestore();

        const companyData = (await qantyDb.collection("/companies").doc("57b2ORKV0Rw1u9Glnowh").get()).data()

        console.log(companyData)
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