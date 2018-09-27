const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    let condicion = { email: body.email }
    Usuario.findOne(condicion).then((usuarioDB) => {
        if (!usuarioDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        } else if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        } else {
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN })
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
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