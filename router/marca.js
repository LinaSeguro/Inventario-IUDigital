const { Router } = require('express');
const Marca = require('../models/Marca');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const {validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async (req, res) => {
    try {
        const marcas = await Marca.find(); // Select * from marcas;
        res.send(marcas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save() //insert into
        res.status(201).send(marca);


    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el marca');
    }
});

// PUT method route
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const marcaId = req.params.id;
        let marca = await Marca.findById(marcaId);
        if (!marca) {
            return res.status(404).send('Marca no encontrada');
        }

        // Actualizar los campos de la marca
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();

        marca = await marca.save();
        res.status(200).send(marca);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar la marca');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async (req, res) => {
    const { id } = req.params;

    try {

        const marca = await Marca.findById(id);
        if (!marca) {
            return res.status(404).send('Marca no encontrada');
        }

        await Marca.findByIdAndDelete(id);

        res.status(200).send('Marca eliminada correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al eliminar la marca');
    }
});

module.exports = router;