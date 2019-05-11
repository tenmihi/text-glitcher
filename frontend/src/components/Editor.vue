<template>
  <div class="editor">
    <input type="text" v-model="text"/>
    <div>
      <canvas id="test" width=1200 height=630></canvas>
    </div>
    <button type="button" @click="sendImage">send</button>
    <div v-if="filename">
      <a :href="`/debug-shrine/us-central1/api/fetch/${filename}`">Open</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630
const GLITCH_AMOUNT = 4
const FONT_SIZE = 160

function canvasToBlob (canvas) {
  const type = 'image/png';
  const dataurl = canvas.toDataURL(type);
  const bin = atob(dataurl.split(',')[1]);
  const buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new Blob([buffer.buffer], {type: type});
}

export default {
  data () {
    return {
      text: 'うどん',
      canvas: null,
      filename: null,
    }
  },
  methods: {
    drawText () {
      const ctx = this.canvas.getContext("2d")
      ctx.fillStyle = "rgb(0,0,0)"
      ctx.fillRect(0, 0, OGP_IMG_WIDTH, OGP_IMG_HEIGHT)

      const maxWidth = OGP_IMG_WIDTH - 128
      let fontSize = FONT_SIZE
      let textWidth
      do {
        ctx.font = `bold ${fontSize}pt Sawarabi Gothic`
        textWidth = ctx.measureText(this.text).width
      } while (textWidth > maxWidth && fontSize--)

      const textHeight = fontSize
      const between = fontSize / 20

      const x = OGP_IMG_WIDTH / 2 - textWidth / 2
      const y = OGP_IMG_HEIGHT / 2 + textHeight / 2
      ctx.fillStyle = 'rgb(255,0,255)'
      ctx.fillText(this.text, x + between, y)
      ctx.fillStyle = 'rgb(0,255,255)'
      ctx.fillText(this.text, x - between, y)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fillText(this.text, x, y)

      for (let i = 0; i < GLITCH_AMOUNT; i++) {
        const height = Math.floor(Math.random() * 5 + 1) * 5
        const offsetY = y - Math.floor(Math.random() * textHeight)
        const slideX = Math.floor(Math.random() * 21) - 10

        const slide = ctx.getImageData(0, offsetY, OGP_IMG_WIDTH, height)
        ctx.fillStyle = 'rgb(0,0,0)'
        ctx.fillRect(0, offsetY, OGP_IMG_WIDTH, height)
        ctx.putImageData(slide, slideX, offsetY)
      }
    },
    sendImage() {
      const blob = canvasToBlob(this.canvas)

      const formData = new FormData()
      formData.append('img', blob)

      axios.post('/debug-shrine/us-central1/api/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        alert('ok')
        console.log(res)
        this.filename = res.data.filename
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    text (val) {
      this.drawText(val)
    }
  },
  mounted () {
    this.canvas = document.getElementById("test")
    this.drawText()
  }
}
</script>