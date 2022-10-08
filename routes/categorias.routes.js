const { Router } = require("express"); // Router es una propiedad de express
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const {
  crearCategoria, 
  obtenerCategorias, 
  obtenerCategoria, 
  actualizarCategoria, 
  categoriasDelete
  } = require("../controllers/categorias.js")

const { existeCategoriaPorID } = require("../helpers/db-validators");

const router = Router();

/**
 * url/api/categorias
 */

// Obtener todas las categorias - public
router.get("/", obtenerCategorias);

// Obtener una categoria por id - public
router.get("/:id",[
  check("id").custom(existeCategoriaPorID),
  validarCampos
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token valido
router.post("/", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token valido
router.put("/:id",[
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID de Mongo').isMongoId(),
  check("id").custom(existeCategoriaPorID),
  validarCampos
], actualizarCategoria);


// Borrar una categoria - solo Admin
router.delete("/:id", [  
  validarJWT,
  esAdminRole,
  check("id", "No es un ID valido").isMongoId(),
  validarCampos], categoriasDelete);

module.exports = router;
