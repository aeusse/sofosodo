import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

//- Manejo de la credencial (más que todo para storage, pero firestore también es afectado)
let serviceAccountKeyFile = 'serviceAccountKey.json'
if (functions.config().service_account_key !== undefined) {
    serviceAccountKeyFile = functions.config().service_account_key.file
}
const serviceAccount = require('../credentials/' + serviceAccountKeyFile)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: (serviceAccount.project_id + ".appspot.com")
})

exports.funcs_ep = require('./funcs_ep')
//exports.ep = require('./api_ep')