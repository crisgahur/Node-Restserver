const { response } = require("express");
const { request } = require("http");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token"); // Aqui indicamos que debe ser en la sección header donde se cree el key

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // Me ayuda a verificar que el JSON web token sea valido.

    // Leer el usuario que corresponde al id:
    const usuario = await Usuario.findById(uid);
    
    //Verificar que el usuario existe en la base de datos
    if (!usuario) {
      //Si el usuario es false/no existe.
      return res.status(401).json({
        msg: "Token no valido - El usuario no existe en la base de datos",
      });
    }

    // Verificar que el usuario esté habilitado/estado en true:
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - El usuario está deshabilitado / estado false en base de datos",
      });
    }

    req.usuario = usuario; // Dentro del request se crea una propiedad nueva llamada usuario, la cual tendrá el mismo valor  que el usuario del uid.

    next(); // este next se hace para que en caso tal el middleware allá pasado de forma correcta continue ejecutando el siguiente middleware especificado en el routes.
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }

  console.log(token);
};

module.exports = { validarJWT };
