const jwt = require('jsonwebtoken');

//==============================
//Verificar token
//==============================
let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        } else {
            req.usuarioToken = decoded.usuario;
            next();
        }
    })

};

//==============================
//Verificar token  URL
//==============================
let verificarTokenURL = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        } else {
            req.usuarioToken = decoded.usuario;
            next();
        }
    })

};

//==============================
//Verificar Admin Role
//==============================
let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuarioToken;
    if (usuario.role !== 'ADMIN_ROLE') {
        res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene rol de administrador'
            }
        })
    } else {
        next();
    }

};

module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenURL
}