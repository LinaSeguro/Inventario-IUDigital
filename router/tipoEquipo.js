const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const {validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async (req, res) => {
    try {
        const tiposEquipos = await TipoEquipo.find(); // Consulta para obtener todos los tipos de equipo
        res.send(tiposEquipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// POST method route
router.post('/', [validarJWT , validarRolAdmin ], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save(); // Insertar en la base de datos
        res.status(201).send(tipoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el tipo de equipo');
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

        const tipoEquipoId = req.params.id;
        let tipoEquipo = await TipoEquipo.findById(tipoEquipoId);
        if (!tipoEquipo) {
            return res.status(404).send('Tipo de equipo no encontrado');
        }

        // Actualizar los campos del tipo de equipo
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save(); // Guardar los cambios en la base de datos
        res.status(200).send(tipoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el tipo de equipo');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async (req, res) => {
    const { id } = req.params;

    try {

        const tipoEquipo = await TipoEquipo.findById(id);
        if (!tipoEquipo) {
            return res.status(404).send('Tipo de equipo no encontrado');
        }


        await TipoEquipo.findByIdAndDelete(id);

        res.status(200).send('Tipo de equipo eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al eliminar el tipo de equipo');
    }
});

module.exports = router;
