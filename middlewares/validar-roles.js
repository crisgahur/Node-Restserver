const { response } = require("express");

//Esto se va ejecutar despues de haber ejecutado y validado el ValidarJWT
const esAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token primero",
    }); //500: Internal server error, osea error de backend
  }
  const { rol, nombre } = req.usuario; // de la request.usuario vamos a extraer el rol y el nombre

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es Administrador por lo que no puede eliminar usuario`,
    });
  }

  next();
};

const tieneRole = (...roles) => { // El ... se conoce como operador REST, lo que hace es que todo lo que el usuario envie se almacena en roles en forma de array
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token primero",
      }); //500: Internal server error, osea error de backend
    }

    if(!roles.includes(req.usuario.rol)){
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles: ${roles}`
      })
    }

    next();
  }
}

module.exports = { esAdminRole, tieneRole };
