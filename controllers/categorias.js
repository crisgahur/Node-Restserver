const { response } = require("express");
const { Categoria } = require("../models"); // En la ruta no es necesario apuntar a models/categoria gracias al archivo index creado en esa carpeta

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    // Este metodo permite almacenar promesas en un array y las ejecuta de manera simultanea, si alguna da error, todas dan error. Lo que está en la primera posición del array como variable es resultado de la primera promesa, y lo que está en segunda posición es resultado de la segunda promesa
    Categoria.countDocuments(query), // Metodo que realiza conteo de objetos almacenados como Categoria
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json(categoria);
};

// Postear categoria nueva.
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase(); // tomo el nombre que envia el usuario y lo llevo a mayuscula (esto me ayuda a filtrar los nombres y que no se repitan)

  const categoriaDB = await Categoria.findOne({ nombre }); // Aqui revisamos si ya existe ese nombre en las categorias

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  //Generar en formato Json la data/objeto a grabar en la BD:
  const data = {
    nombre,
    usuario: req.usuario._id, // Esto es para que al generar la categoria indentifiquemos cual fue el id que lo generó
  };

  const categoria = new Categoria(data);

  // Guardar en DB:
  await categoria.save();

  res.status(201).json(categoria); //201 significa que se creó algo en la BD
};

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body; // usuario y estado lo estamos excluyendo de la data

  data.nombre  = data.nombre.toUpperCase(); // Metodo para que al actualizar el nombre se guarde en mayuscula
  data.usuario = req.usuario._id; // Para dejar registro de quien fue el usuario que hizo la actualización

  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}); // el primer parametro indica al metodo que haga la busqueda por la propiedad "id" y el segundo parametro indica que el resto de las propiedades de usuario las actualice.

  res.json(categoria);
};

// borrarCategoria - estado: false

const categoriasDelete = async (req, res = response) => {
  const { id } = req.params; // Aqui toma el id de los parametros enviados

  const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true}); // actualiza la categoria a estado falso

  res.json(categoria);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  categoriasDelete,
};
