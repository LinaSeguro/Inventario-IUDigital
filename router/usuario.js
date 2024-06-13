const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt');
const {validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Select * from usuarios;
        res.send(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        const existeUsuario = await Usuario.findOne({ email: req.body.email }); // Selec from where
        if (existeUsuario) {
            return res.status(400).send('email ya existe');
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save() //insert into
        res.status(201).send(usuario);


    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el usuario');
    }
});

// PUT method route
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const usuarioId = req.params.id;
        let usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Actualizar los campos del usuario
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.rol = req.body.rol;
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        res.status(200).send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el usuario');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async (req, res) => {
    const { id } = req.params;

    try {

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }


        await Usuario.findByIdAndDelete(id);

        res.status(200).send('Usuario eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al eliminar el usuario');
    }
});


module.exports = router;


