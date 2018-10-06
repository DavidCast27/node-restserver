const express = require('express');
const { verificarToken, verificarAdminRole } = require('../middlewares/auth');

const app = express();
const Categoria = require('../models/categoria');


//obtener todas las categorias
app.get('/categoria', verificarToken, (req, res) => {
    let condicion = {};
    Categoria.find(condicion)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    categorias: categoriaDB,
                })
            }
        })

})

//obtener una categoria de acuerdo a un id
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let query = { _id: id };
    Categoria.findOne(query)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            } else if (!categoriaDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });

            } else {
                res.json({
                    ok: true,
                    categoria: categoriaDB,
                })
            }
        })

})

//crear una nueva categoria
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoriaActual = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuarioToken
    });
    categoriaActual.save().then((categoriaDB) => {
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    }).catch((err) => {
        res.status(500).json({
            ok: false,
            err
        });
    });
})

//modificar una categoria
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let options = {
        new: true,
        runValidators: true
    }
    let query = { _id: id };
    Categoria.findOneAndUpdate(query, body, options).then((categoriaDB) => {
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        } else {
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        }
    }).catch((err) => {
        res.status(500).json({
            ok: false,
            err
        });
    });

})

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    // solo un admin puede borrar la categoria (eliminar fisicamente)
    let id = req.params.id;
    let query = { _id: id };
    Categoria.findOneAndDelete(query).then((categoriaDB) => {
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        } else {
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        }
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            err
        });
    });

})
module.exports = app;