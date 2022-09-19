const { Router } = require("express"); // Router es una propiedad de express
const { check } = require("express-validator");
const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

//Ruta para generar el token.
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos
], login); // El segundo parametro es la función que está en controlador.

module.exports = router;