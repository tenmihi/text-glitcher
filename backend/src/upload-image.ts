import firebase from './firebase-admin'
import * as md5 from 'md5'
import * as Busboy from 'busboy'
import { Request, Response } from 'express'

export default function (req: Request, res: Response) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.status(200).end();
    return;
  }

  const busboy = new Busboy({ headers: req.headers });
  const allowMimeTypes = ['image/png'];
  const bucket = firebase.storage().bucket();

  const filename = md5(Date.now().toString())
  const filepath = `uploaded_images/${filename}.png`
  const uploadFile = bucket.file(filepath)

  busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: any) => {
    if (!allowMimeTypes.includes(mimetype.toLocaleLowerCase())) {
      console.warn('disallow mimetype: ' + mimetype);
      return;
    }

    file.pipe(uploadFile.createWriteStream({ metadata: { contentType: 'image/png' } }));

    file.on('end', () => {
      console.log('END')
    });
  });

  busboy.on('finish',async () => {
    res.status(200).send(JSON.stringify({ filename }));
  });

  busboy.end(req.body)
}