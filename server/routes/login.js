const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
            }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN });
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

//  Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err
            })
        })
    let condicion = { email: googleUser.email }
    Usuario.findOne(condicion).then((usuarioDB) => {
        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN });
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // SI EL USUARIO NO EXISTE EN LA DB
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)'
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'no'
                        }
                    });
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN });
                    res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
                }
            })
        }

    }).catch((err) => {

        res.status(500).json({
            ok: false,
            err
        });
    });
});
module.exports = app;