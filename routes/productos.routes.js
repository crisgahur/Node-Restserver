const { Router } = require("express"); // Router es una propiedad de express
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
  } = require("../controllers/productos.js")

const { existeProductoPorID, existeCategoriaPorID } = require("../helpers/db-validators");

const router = Router();

/**
 * url/api/productos
 */

// Obtener todos los productos - public
router.get("/", obtenerProductos);

// Obtener producto por id - public
router.get("/:id",[
  check('id', 'No es un ID de Mongo').isMongoId(),
  check("id").custom(existeProductoPorID),
  validarCampos
], obtenerProducto);

// Crear Producto - privado - cualquier persona con un token valido
router.post("/", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID de Mongo').isMongoId(),
  check("categoria").custom(existeCategoriaPorID),
  validarCampos
], crearProducto );

// Actualizar - privado - cualquiera con token valido
router.put("/:id",[
  validarJWT,
  check("id").custom(existeProductoPorID),
  validarCampos
], actualizarProducto);


// Borrar un producto - solo Admin
router.delete("/:id", [  
  validarJWT,
  esAdminRole,
  check("id").custom(existeProductoPorID),
  check("id", "No es un ID valido").isMongoId(),
  validarCampos], borrarProducto);

module.exports = router;