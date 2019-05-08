<template>
  <div class="editor">
    <input type="text" v-model="text"/>
    <div>
      <canvas id="test" width=1200 height=630></canvas>
    </div>
  </div>
</template>

<script>
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630
const GLITCH_AMOUNT = 4
const FONT_SIZE = 160

export default {
  data () {
    return {
      text: 'うどん',
      context: null,
    }
  },
  methods: {
    drawText () {
      const ctx = this.context
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
  },
  watch: {
    text (val) {
      this.drawText(val)
    }
  },
  mounted () {
    const testCanvas = document.getElementById("test")
    this.context = testCanvas.getContext("2d")
    this.drawText()
  }
}
</script>