const express = require('express')

const app = express()

// Endpoints de la API
app.use(require('./categoria'))
app.use(require('./marca'))
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./producto'))
app.use(require('./upload'))
app.use(require('./imagenes'))


module.exports = app