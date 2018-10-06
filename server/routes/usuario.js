const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificarToken, verificarAdminRole } = require('../middlewares/auth');

const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limit = req.query.limite || 5
    limit = Number(limit);
    let condicion = { estado: true };
    Usuario.find(condicion, 'nombre email img role estado google ')
        .skip(desde)
        .limit(limit)
        .exec((err, usuariosDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                Usuario.count(condicion, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios: usuariosDB,
                        cantidad: conteo
                    })
                });
            }
        })
})

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
    let body = req.body;
    let usuarioActual = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuarioActual.save().then((usuarioDB) => {
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            err
        });
    });
})

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'estado', 'img', 'role']);

    let options = {
        new: true,
        runValidators: true
    }

    let query = { _id: id };
    Usuario.findOneAndUpdate(query, body, options).then((usuarioDB) => {
        if (!usuarioDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        }
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            err
        });
    });
})


app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    let body = { estado: false }
    let query = { _id: id };
    let options = {
            new: true,
            runValidators: true
        }
        //Usuario.findOneAndRemove(query).then((usuarioDB) => {
    Usuario.findOneAndUpdate(query, body, options).then((usuarioDB) => {
        if (!usuarioDB) {
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
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