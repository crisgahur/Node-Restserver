const { response } = require("express");

const validarArchivo = (req, res = response, next) => {
  // Aqui pregunta si hay algun file cargado ó si al hacer un barrido de los files no hay nada o en la propiedad archivo está vacio:
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({ msg: "No hay archivo en la petición." });
  }

  next();
};

module.exports = { validarArchivo };
