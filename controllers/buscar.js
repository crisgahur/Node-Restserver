const { response } = require("express");
const { ObjectId } = require("mongoose").Types; // Importamos una función de mongoose llamada objectId que nos ayuda a filtrar si una variable es un ID de MongoDB

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); //Si es un ID Mongo retorna TRUE, sino FALSE.

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  // Funcion para buscar por nombre y correo:

  // Expresión regular para que al hacer la busqueda por nombre y apellido no diferencia mayusculas ni minusculas:

  const regex = new RegExp(termino, "i"); // La i le indica que sea insensible a mayusculas y minusculas

  const usuarios = await Usuario.find({ // $or y $and son propiedades del mongo y del find
    $or: [{nombre: regex}, {correo: regex}],
    $and: [{estado: true}] // Solo mostrará aquellos nombres o correos (segun la busqueda) que esten en estado true
   });
  return res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino); //Si es un ID Mongo retorna TRUE, sino FALSE.
  
    if (esMongoID) {
      const categoria = await Categoria.findById(termino);
      return res.json({
        results: categoria ? [categoria] : [],
      });
    }
  
    const regex = new RegExp(termino, "i"); 
  
    const categorias = await Categoria.find({nombre: regex, estado: true});
    return res.json({
      results: categorias,
    });
  };

  const buscarProductos = async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino); //Si es un ID Mongo retorna TRUE, sino FALSE.
  
    if (esMongoID) {
      const producto = await Producto.findById(termino)
      .populate('categoria', 'nombre');
      return res.json({
        results: producto ? [producto] : [],
      });
    }
  
    const regex = new RegExp(termino, "i"); 
  
    const productos = await Producto.find({nombre: regex, estado: true})
    .populate('categoria', 'nombre');
    return res.json({
      results: productos,
    });
  };

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;

    case "categorias":
        buscarCategorias(termino, res);
      break;

    case "productos":
        buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se me olvidó hacer esta busqueda",
      });
  }
};

module.exports = { buscar };
