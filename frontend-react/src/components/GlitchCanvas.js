import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  glitch_canvas: {
    width: '100%',
    height: '100%',
  },
});

const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630
const GLITCH_AMOUNT = 4
const FONT_SIZE = 160

class GlitchCanvas extends React.Component {
  state = {
    width: OGP_IMG_WIDTH,
    height: OGP_IMG_HEIGHT,
  }

  drawCanvas() {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');

    const text = this.props.text

    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(0, 0, OGP_IMG_WIDTH, OGP_IMG_HEIGHT)

    const maxWidth = OGP_IMG_WIDTH - 128
    let fontSize = FONT_SIZE
    let textWidth
    do {
      ctx.font = `bold ${fontSize}pt Sawarabi Gothic`
      textWidth = ctx.measureText(text).width
    } while (textWidth > maxWidth && fontSize--)

    const textHeight = fontSize
    const between = fontSize / 20

    const x = OGP_IMG_WIDTH / 2 - textWidth / 2
    const y = OGP_IMG_HEIGHT / 2 + textHeight / 2
    ctx.fillStyle = 'rgb(255,0,255)'
    ctx.fillText(text, x + between, y)
    ctx.fillStyle = 'rgb(0,255,255)'
    ctx.fillText(text, x - between, y)
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillText(text, x, y)

    for (let i = 0; i < GLITCH_AMOUNT; i++) {
      const height = Math.floor(Math.random() * 5 + 1) * 5
      const offsetY = y - Math.floor(Math.random() * textHeight)
      const slideX = Math.floor(Math.random() * 21) - 10

      const slide = ctx.getImageData(0, offsetY, OGP_IMG_WIDTH, height)
      ctx.fillStyle = 'rgb(0,0,0)'
      ctx.fillRect(0, offsetY, OGP_IMG_WIDTH, height)
      ctx.putImageData(slide, slideX, offsetY)
    }
  }

  componentDidMount() {
    this.drawCanvas()
    this.props.updateCanvas(this.canvas)
  }

  componentDidUpdate() {
    this.drawCanvas()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.drawCanvas()
    }
  }
  
  render() {
    const { classes } = this.props;

    return (
      <canvas
        ref={(e) => { this.canvas = e; }}
        className={classes.glitch_canvas}
        width={this.state.width}
        height={this.state.height}
      ></canvas>
    )
  }
}

GlitchCanvas.propTypes = {
  text: PropTypes.string.isRequired,
  updateCanvas: PropTypes.func.isRequired,
}

export default withStyles(styles)(GlitchCanvas)