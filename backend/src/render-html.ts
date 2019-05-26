import firebase from './firebase-admin'
import { Request, Response } from 'express'

const SITEURL = 'https://text-glitcher.tenmihi.dev'
const DESCRIPTION = 'description here'

export default async function (req: Request, res: Response) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const id = req.params.id
  const bucket = firebase.storage().bucket()
  const file = bucket.file(`uploaded_images/${id}.png`)
  const [exists] = await file.exists()
  
  if (!exists) {
    res.status(404).end("file not found")
    return
  }

  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '01-01-2099'
  })
  
  const html = buildHtml(signedUrl)
  res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
  res.status(200).end(html)
  return
}

const buildHtml = (imageUrl: string) => {
  const PAGEURL = `${SITEURL}`
  const TITLE = "Text Glitcher"
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>Text Glitcher</title>
        <meta property="og:title" content="${TITLE}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:description" content="${DESCRIPTION}">
        <meta property="og:url" content="${PAGEURL}">
        <meta property="og:site_name" content="Text Glitcher">
        <meta name="twitter:site" content="${SITEURL}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${TITLE}">
        <meta name="twitter:description" content="グリッチエフェクトのかかった文字画像を作れます">
      </head>
      <body>
        <script type="text/javascript">window.location="${SITEURL}";</script>
      </body>
    </html>
    `
}

