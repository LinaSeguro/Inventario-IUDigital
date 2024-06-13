const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const {validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET method route
router.get('/', [validarJWT, validarRolAdmin], async (req, res) => {
    try {
        const estadosEquipos = await EstadoEquipo.find(); // Consulta para obtener todos los estados de equipo
        res.send(estadosEquipos);
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

        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save(); // Insertar en la base de datos
        res.status(201).send(estadoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el estado de equipo');
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

        const estadoEquipoId = req.params.id;
        let estadoEquipo = await EstadoEquipo.findById(estadoEquipoId);
        if (!estadoEquipo) {
            return res.status(404).send('Estado de equipo no encontrado');
        }

        // Actualizar los campos del estado de equipo
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save(); // Guardar los cambios en la base de datos
        res.status(200).send(estadoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el estado de equipo');
    }
});

// DELETE method route
router.delete('/:id', [validarJWT, validarRolAdmin], async (req, res) => {
    const { id } = req.params;

    try {

        const estadoEquipo = await EstadoEquipo.findById(id);
        if (!estadoEquipo) {
            return res.status(404).send('Estado de equipo no encontrado');
        }

        await EstadoEquipo.findByIdAndDelete(id);

        res.status(200).send('Estado de equipo eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al eliminar el estado de equipo');
    }
});
module.exports = router;
