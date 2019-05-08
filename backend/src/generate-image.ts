import firebase from './firebase-admin'

const Canvas = require('canvas-prebuilt')

const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630
const MIMETYPE = 'image/jpeg'

export default async function(req: any, res: any) {
  const bucket = firebase.storage().bucket()

  const canvas = Canvas.createCanvas(OGP_IMG_WIDTH, OGP_IMG_HEIGHT)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = "rgb(255, 255, 255)"
  ctx.fillRect(0, 0, OGP_IMG_WIDTH, OGP_IMG_HEIGHT)

  // 文字描画
  ctx.font = "30px Lato"
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.rotate(.1)
  ctx.fillText('Canvas', 50, 100)

  // ライン描画
  let te = ctx.measureText('Canvas')
  ctx.stroke.style = 'rgba(0,0,0,0.7)'
  ctx.beginPath()
  ctx.lineTo(50,102)
  ctx.lineTo(50 + te.width, 102)
  ctx.stroke()

  const buffer = canvasToBuffer(canvas, MIMETYPE)

  const file = bucket.file('images/test.jpg');
  try {
    await file.save(buffer);
    await file.setMetadata({ contentType: MIMETYPE });
  } catch (err) {
    console.log(err);
  }

  res.status(200).end("ok")
}

function canvasToBuffer(canvas: any, mimetype: string) {
  const dataurl = canvas.toDataURL(mimetype)

  const data = dataurl.split(',')[1]
  const bin = new Buffer(data, 'base64').toString('binary')

  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }

  return Buffer.from(buffer)
}