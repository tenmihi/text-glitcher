import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import GlitchCanvas from './components/GlitchCanvas'
import TextInput from './components/TextInput'
import Button from '@material-ui/core/Button'

import { canvasToBlob } from './utils/canvas.js.js'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  description: {
    'text-align': 'center',
  },
  editor: {
    display: 'flex',
    'justify-content': 'center',
    'flex-direction': 'column',
    'align-items': 'center',
  },
  input: {
    display: 'flex',
    'justify-content': 'center',
  },
  output: {
    display: 'flex',
    'background-color': 'black',
    'justify-content': 'center',
  },
  canvas_wrapper: {
    'max-width': '400px',
  },
  title: {
    'font-size': '82px',
  },
  action_btn:{
    "margin": "12px",
  },
});

class App extends React.Component {
  state = {
    text: 'Glitch',
    canvas: null,
  }

  updateCanvas(canvas) {
    this.setState({ canvas })
  }

  updateText(text){
    this.setState({ text })
  }

  onClickDownload() {
    const link = document.createElement("a")
    link.href = this.state.canvas.toDataURL("image/png")
    link.download = `${this.state.text}.png`
    link.click()
  }

  async onClickTweet() {
    const filename = await this.sendImage()
    if (!filename) return

    const link = document.createElement("a")
    const ogp_image_link = `${encodeURI(filename)}`
    link.href=`https://twitter.com/intent/tweet?text=${ogp_image_link}`
    link.click()
  }

  async sendImage() {
    const blob = canvasToBlob(this.state.canvas)
    const formData = new FormData()
    formData.append('img', blob)

    let filename
    try {
      const { data } = await axios.post('/api/upload_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      filename = data.filename
    } catch(e) {
      console.log(e)
    }

    return filename
  }

  render () {
    const { classes } = this.props;

    return (
      <main className={classes.root}>
        <section className={classes.description}>
          <h1 className={classes.title}>Text Glitcher</h1>
          <p>グリッチエフェクトのかかったテキスト画像を作るくん &amp; ツイートするくん</p>
        </section>
        <section className={classes.editor}>
          <TextInput
            className={classes.input}
            text={this.state.text}
            updateText={this.updateText.bind(this)}
          ></TextInput>
          <div className={classes.output}>
            <div className={classes.canvas_wrapper}>
              <GlitchCanvas
                text={this.state.text}
                updateCanvas={this.updateCanvas.bind(this)}
              ></GlitchCanvas>
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              className={classes.action_btn}
              onClick={this.onClickDownload.bind(this)}
            >Download</Button>
            <Button
              className={classes.action_btn}
              variant="contained"
              onClick={this.onClickTweet.bind(this)}
            >Tweet</Button>
          </div>
        </section>
      </main>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);