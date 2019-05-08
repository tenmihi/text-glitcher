import generateImage from './generate-image'
import renderHtml from './render-html'

const functions = require('firebase-functions')

exports.generate_image = functions.https.onRequest(generateImage)
exports.fetch_ogp = functions.https.onRequest(renderHtml)