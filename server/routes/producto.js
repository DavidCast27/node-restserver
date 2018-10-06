const express = require('express');
const { verificarToken } = require('../middlewares/auth');

const app = express();
const Producto = require('../models/producto');


app.get('/productos', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limit = req.query.limite || 5
    limit = Number(limit);
    let condicion = { disponible: true };
    Producto.find(condicion)
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec().then((productoDB) => {
            res.json({
                ok: true,
                productos: productoDB,
            })
        }).catch((err) => {
            res.status(500).json({
                ok: false,
                err
            });
        });

})

//obtener una Producto de acuerdo a un id
app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let query = { _id: id };
    Producto.findOne(query)
        .populate('categoria', 'descripcion')
        .exec().then((productoDB) => {
            if (!productoDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrad0'
                    }
                });

            } else {
                res.json({
                    ok: true,
                    productos: productoDB,
                })
            }
        }).catch((err) => {
            res.status(500).json({
                ok: false,
                err
            });
        });

})

//buscar productos
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regExp = RegExp(termino, 'i');
    let condicion = { disponible: true, nombre: regExp };
    Producto.find(condicion)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec().then((productoDB) => {
            res.json({
                ok: true,
                productos: productoDB,
            })
        }).catch((err) => {
            res.status(500).json({
                ok: false,
                err
            });
        });

})

//crear una nueva producto
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    let productoActual = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: req.usuarioToken._id
    });
    productoActual.save().then((productoDB) => {
        res.json({
            ok: true,
            producto: productoDB,
        })
    }).catch((err) => {
        res.status(500).json({
            ok: false,
            err
        });
    });
})

//modificar una producto
app.put('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let options = {
        new: true,
        runValidators: true
    }
    let query = { _id: id };
    Producto.findOneAndUpdate(query, body, options).then((productoDB) => {
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                producto: productoDB,
            })
        }
    }).catch((err) => {
        res.status(500).json({
            ok: false,
            err
        });
    });

})

// modificar el atributo disponible no barralo fisicamente
app.delete('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = { disponible: false }
    let query = { _id: id };
    let options = {
        new: true,
        runValidators: true
    }
    Producto.findOneAndUpdate(query, body, options).then((productoDB) => {
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                producto: productoDB
            })
        }
    }).catch((err) => {
        res.status(500).json({
            ok: false,
            err
        });
    });

})
module.exports = app;