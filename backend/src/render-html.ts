import firebase from './firebase-admin'

const SITEURL = 'http://localhost:8000' // `https://${CONFIG.app.domain}`
const DESCRIPTION = 'description here'

const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

export default async function (req: any, res: any) {
  const bucket = firebase.storage().bucket()
  const file = bucket.file('images/test.jpg')
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
  const TITLE = "HOGEHOGE"
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>colorinco</title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="colorinco*カラーインコ">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${SITEURL}/ogp/stockimg">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    
  </body>
</html>
`
}

// <script type="text/javascript">window.location="/_stock/";</script>
