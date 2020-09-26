const express = require('express')

const app = express()

// Endpoints de la API
app.use(require('./categoria'))
app.use(require('./marca'))
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./producto'))

if( process.env.NODE_ENV !== 'dev' ){
    app.use(require('./uploadcloud'))
}else{

    app.use(require('./upload'))
}

app.use(require('./imagenes'))


module.exports = app