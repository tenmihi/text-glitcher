import uploadImage from './upload-image'
import renderHtml from './render-html'
import * as functions from "firebase-functions"
import * as express from "express"

const router = express.Router();
const app = express()

app.use((req: express.Request, res: express.Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  next();
});

router.post('/upload_image', uploadImage)
router.get('/fetch/:id', renderHtml)

app.use('/api', router)

exports.api = functions.https.onRequest(app)