const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt');
const {validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET method route
router.get('/', [validarJWT], async (req, res) => {
    try {
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },
            {
                path: 'marca', select: 'nombre estado'
            },
            {
                path: 'estadoEquipo', select: 'nombre estado'
            },
            {
                path: 'tipoEquipo', select: 'nombre estado'
            },
        ]);
        res.send(inventarios);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').isISO8601(),
    check('precio', 'invalid.precio').isNumeric(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        const existeInventario = await Inventario.findOne({ serial: req.body.serial }); // Selec from where
        if (existeInventario) {
            return res.status(400).send('Serial ya existe');
        }

        let inventario = new Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario;
        inventario.marca = req.body.marca;
        inventario.estadoEquipo = req.body.estadoEquipo;
        inventario.tipoEquipo = req.body.tipoEquipo;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save() //insert into
        res.status(201).send(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el inventario');
    }
});

// PUT method route
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').isISO8601(),
    check('precio', 'invalid.precio').isNumeric(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const inventarioId = req.params.id;
        let inventario = await Inventario.findById(inventarioId);
        if (!inventario) {
            return res.status(404).send('Inventario no encontrado');
        }

        // Actualizar los campos del inventario
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario;
        inventario.marca = req.body.marca;
        inventario.estadoEquipo = req.body.estadoEquipo;
        inventario.tipoEquipo = req.body.tipoEquipo;
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.status(200).send(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el inventario');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async (req, res) => {
    const { id } = req.params;

    try {

        const inventario = await Inventario.findById(id);
        if (!inventario) {
            return res.status(404).send('Inventario no encontrado');
        }

        await Inventario.findByIdAndDelete(id);

        res.status(200).send('Inventario eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al eliminar el inventario');
    }
});


module.exports = router;
