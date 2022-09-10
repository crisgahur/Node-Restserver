const { validationResult } = require("express-validator");

// Aglomera todos los errores que haya al diligenciar los campos:
const validarCampos = (req, res, next) => {
  // next es lo que hace que se ejecute la siguiente linea de codigo s(sea un middleware o un controlador) en caso tal no haya caido en el error 400.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //se lee como :"Si hay algo en la variable errores..."
    return res.status(400).json(errors);
  }

  next();
};

module.exports = { validarCampos };
