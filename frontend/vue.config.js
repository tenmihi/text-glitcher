module.exports = {
  devServer: {
    proxy: {
      'debug-shrine/us-central1': {
        target: 'http://localhost:5000'
      },
    },
  }
}