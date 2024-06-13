const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const router = Router();

// POST method route for authentication
router.post('/', [
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }


        const usuario = await Usuario.findOne({ email: req.body.email }); // Busca el usuario por email       
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const esIgual = bcrypt.compareSync(req.body.password, usuario.password);// Compara las contraseñas
        if (!esIgual) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        // generara token 
        const token = generarJWT(usuario);

        res.json({
            usuario: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                access_token: token
            },
            mensaje: 'Usuario autenticado exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al autenticar al usuario');
    }
});

module.exports = router;




