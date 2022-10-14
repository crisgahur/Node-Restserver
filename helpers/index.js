const dbValidators = require("./db-validators");
const generarJWT   = require("./generar-jwt");
const googleVerify = require("./google-verify");
const subirArchivo = require("./subir-archivo");

module.exports = {
    // Usando los tres puntos estamos exportando todas las propiedades y variables que contengan los archivos:
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}