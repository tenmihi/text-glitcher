const firebaseAdmin = require("firebase-admin")
const serviceAccount = require("../firebase-key.json")

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "textglitcher.appspot.com"
})

export default firebaseAdmin;