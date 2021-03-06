const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const detalleSchema = new Schema({
    subtotal:{
        type: Number,
        require: [true, "subtotal es necesario"]
    },
    cantidad:{
        type: Number,
        require: [true, "cantidad es necesario"]
    },
    descripcion:{
        type: String,
        require: [true, "Descripcion necesaria"]
    },
    factura_id:{
        type: Schema.Types.ObjectId,
        ref: 'Factura',
        require: [true, "Id Requerido"]
    },
    producto_id:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        require: [true, "Id Requerido"]
    }
    
})

detalleSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único'})
module.exports = mongoose.model('Detalle', detalleSchema )
