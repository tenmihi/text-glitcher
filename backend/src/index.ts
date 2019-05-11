import uploadImage from './upload-image'
import renderHtml from './render-html'
import * as functions from "firebase-functions"
import * as express from "express"

const app = express()

app.post('/upload_image', uploadImage)
app.get('/fetch/:id', renderHtml)

exports.api = functions.https.onRequest(app)