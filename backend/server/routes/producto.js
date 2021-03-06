/* ROUTE de producto  */

const express = require('express')

const app = express()
const _ = require('underscore')

const Producto = require('../models/producto')

const { verificarToken, verificarRole } = require('../middleware/autenticacion')

//==============================
// Lista de todos los productos 
//==============================
app.get('/producto', (req, res) => {

    let desde = Number(req.query.page || 1)
    desde = 10 * (desde - 1)


    const buscar = req.query.buscar
    let filter = { descontinuado: false }

    if (buscar) {
        let regexp = RegExp(buscar, 'i');
        filter = {...filter, nombre: regexp }

    }

    Producto.find(filter)
        .skip(desde)
        .limit(10)
        .populate('categoria', 'nombre')
        .populate('marca', 'nombre')
        .populate('imagenes')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            Producto.countDocuments(filter, (err, conteo) => {


                res.json({
                    status: true,
                    count: conteo,
                    productos,

                })
            })

        })
})

// =======================================
//  Lista de producto por rango de precios
// =======================================
app.get('/producto/precio/', (req, res) => {

    let desde = Number(req.query.page || 1)
    desde = 10 * (desde - 1)

    const min = req.query.min || 0
    const max = req.query.max || 0

    Producto.find({ descontinuado: false, precio: { $gte: min, $lte: max } })
        .skip(desde)
        .limit(10)
        .populate('categoria', 'nombre')
        .populate('marca', 'nombre')
        .populate('imagenes')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            Producto.countDocuments({
                descontinuado: false,
                precio: { $gte: min, $lte: max }
            }, (err, conteo) => {

                res.json({
                    status: true,
                    count: conteo,
                    productos,

                })
            })

        })

})

//==============================
// Obtener un sólo producto
//==============================
app.get('/producto/:id', (req, res) => {

    const id = req.params.id

    Producto.findOne({ _id: id, descontinuado: false })
        .populate('categoria', 'nombre')
        .populate('marca', 'nombre')
        .populate('imagenes')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(404).json({
                    status: false,
                    err: {
                        message: 'No existe la categoria'
                    }
                })
            }

            res.json({
                status: true,
                producto: productoDB
            })

        })
})

//=========================================
// Lista de productos por marca y categoria
//=========================================
app.get('/producto/marca/:categoria/:marca', (req, res) => {

    let desde = Number(req.query.page || 1)
    desde = 10 * (desde - 1)

    const categoria = req.params.categoria
    const marca = req.params.marca


    Producto.find({ descontinuado: false, categoria, marca })
        .skip(desde)
        .limit(10)
        .populate('categoria', 'nombre')
        .populate('marca', 'nombre')
        .populate('imagenes')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            Producto.countDocuments({ descontinuado: false, categoria, marca }, (err, conteo) => {

                res.json({
                    status: true,
                    count: conteo,
                    productos,

                })
            })

        })
})

//=========================================
// Lista de productos por categoria
//=========================================
app.get('/producto/categoria/:categoria', (req, res) => {

    let desde = Number(req.query.page || 1)
    desde = 10 * (desde - 1)

    const categoria = req.params.categoria

    Producto.find({ descontinuado: false, categoria })
        .skip(desde)
        .limit(10)
        .populate('categoria', 'nombre')
        .populate('marca', 'nombre')
        .populate('imagenes')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            Producto.countDocuments({ descontinuado: false, categoria }, (err, conteo) => {

                res.json({
                    status: true,
                    count: conteo,
                    productos,

                })
            })

        })

})

//=========================================
// Lista de productos por marca
//=========================================
app.get('/producto/marca/:marca', (req, res) => {

    let desde = Number(req.query.page || 1)
    desde = 10 * (desde - 1)

    const marca = req.params.marca

    Producto.find({ descontinuado: false, marca })
        .skip(desde)
        .limit(10)
        .populate('categoria', 'nombre')
        .populate('marca', 'nombre')
        .populate('imagenes')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            Producto.countDocuments({ descontinuado: false, marca }, (err, conteo) => {

                res.json({
                    status: true,
                    count: conteo,
                    productos,

                })
            })

        })

})

// ===========================
//  Crear un nuevo producto
// ===========================
app.post('/producto', [verificarToken, verificarRole], (req, res) => {


    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        existencia: body.existencia,
        especificacion: body.especificacion,
        disponible: body.disponible,
        garantia: body.garantia,
        ofertado: body.ofertado,
        porcenjateOferta: body.porcenjateOferta,
        marca: body.marca,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        res.status(201).json({
            status: true,
            producto: productoDB
        })

    });

});

// ===========================
//  Actualizar un producto
// ===========================
app.put('/producto/:id', [verificarToken, verificarRole], (req, res) => {

    let body = _.pick(req.body, ['nombre',
        'precio',
        'descripcion',
        'existencia',
        'especificacion',
        'disponible',
        'garantia',
        'ofertado',
        'porcenjateOferta',
        'marca',
        'categoria'
    ])

    const id = req.params.id

    Producto.findByIdAndUpdate(
        id,
        body, { new: true },
        (err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    status: false,
                    err: {
                        message: 'No existe el producto'
                    }
                })
            }

            res.status(201).json({
                status: true,
                producto: productoDB
            });

        });

});

// ======================================
//  Actualizar la existencia del producto 
// ======================================
app.put('/producto/update/:id', async(req, res) => {

    try {
        const id = req.params.id

        let producto = await Producto.findById(id)

        if (!producto) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'No existe el producto'
                }
            })
        }

        const { tipo, cant } = req.body;
        let reservado = producto.reservado;

        if (tipo === 'add') {
            reservado++;

            if (reservado > producto.existencia) {

                return res.status(400).json({
                    staus: false,
                    err: {
                        message: 'Existencia insuficiente'
                    }
                })
            }

            producto.reservado = reservado
        }

        if (tipo === 'dec') {
            reservado -= 1;
            producto.reservado = reservado <= 0 ? 0 : reservado
        }

        if (tipo === 'reserve') {

            if (!cant) {
                return res.status(400).json({
                    staus: false,
                    err: {
                        message: 'La cantidad es necesario'
                    }
                })
            }

            reservado = reservado + cant;

            if (reservado > producto.existencia) {

                return res.status(400).json({
                    staus: false,
                    err: {
                        message: 'Existencia insuficiente'
                    }
                })
            }

            producto.reservado = reservado

        }
        if (tipo === 'reset') {

            if (!cant) {
                return res.status(400).json({
                    staus: false,
                    err: {
                        message: 'La cantidad es necesario'
                    }
                })
            }

            reservado = reservado - cant;
            producto.reservado = reservado > 0 ? reservado : 0

        }

        await producto.save()

        return res.json({
            staus: true
        })

    } catch (err) {
        return res.status(500).json({
            status: false,
            err
        })
    }
})


// ===========================
//  Eliminar un producto
// ===========================
app.delete('/producto/:id', [verificarToken, verificarRole], (req, res) => {



    const id = req.params.id

    Producto.findByIdAndUpdate(
        id, { descontinuado: true }, { new: true },
        (err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    status: false,
                    err: {
                        message: 'No existe el producto'
                    }
                })
            }

            res.status(201).json({
                status: true,
                producto: productoDB
            });

        });

});

module.exports = app