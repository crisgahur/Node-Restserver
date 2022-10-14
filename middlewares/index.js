const  validarCampos  = require("../middlewares/validar-campos");
const  validarJWT  = require("../middlewares/validar-jwt");
const  tieneRole  = require("../middlewares/validar-roles");
const validarArchivo = require("../middlewares/validar-archivo")

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...tieneRole,
    ...validarArchivo,
}