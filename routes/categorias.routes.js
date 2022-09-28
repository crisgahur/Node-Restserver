const { Router } = require("express"); // Router es una propiedad de express
const { check } = require("express-validator");

const { validarJWT, validarCampos } = require("../middlewares");

const {crearCategoria, obtenerCategorias} = require("../controllers/categorias.js")

const router = Router();

/**
 * url/api/categorias
 */

// Obtener todas las categorias - public
router.get("/", obtenerCategorias);

// Obtener una categoria por id - public
router.get("/:id", (req, res) => {
  res.json("get - id");
});

// Crear categoria - privado - cualquier persona con un token valido
router.post("/", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token valido
router.put("/:id", (req, res) => {
    res.json("put");
  });


// Borrar una categoria - solo Admin
router.delete("/:id", (req, res) => {
    res.json("delete");
  });

module.exports = router;
