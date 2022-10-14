const { Router } = require("express"); // Router es una propiedad de express
const { check } = require("express-validator");

const { validarCampos, validarArchivo } = require("../middlewares/");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const router = Router();


router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'el ID no es formato Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])), // creo una variable: c la cual dentro del array defino que es lo que contiene
    validarCampos
], actualizarImagenCloudinary);
// actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'el ID no es formato Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])), // creo una variable: c la cual dentro del array defino que es lo que contiene
    validarCampos
],
mostrarImagen);


module.exports = router;