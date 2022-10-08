const { response } = require("express");
const { Producto } = require("../models"); // En la ruta no es necesario apuntar a models/producto gracias al archivo index creado en esa carpeta

// obtenerCategorias - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    // Este metodo permite almacenar promesas en un array y las ejecuta de manera simultanea, si alguna da error, todas dan error. Lo que está en la primera posición del array como variable es resultado de la primera promesa, y lo que está en segunda posición es resultado de la segunda promesa
    Producto.countDocuments(query), // Metodo que realiza conteo de objetos almacenados como Categoria
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  res.json({
    total,
    productos,
  });
};

// obtenerProducto - populate {}
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id).populate("usuario", "nombre");
  res.json(producto);
};

// Postear producto nuevo.
const crearProducto = async (req, res = response) => {
  const { disponible, estado, usuario, ...body } = req.body; // Excluyo el estado y el usuario para que no sea modificable y lo demás lo incluyo en body.

  const productoDB = await Producto.findOne({ nombre: body.nombre }); // Aqui revisamos si ya existe ese nombre en los productos

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }

  //Generar en formato Json la data/objeto a grabar en la BD:
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(), // Guardamos el nombre del producto en mayuscula
    usuario: req.usuario._id, // Esto es para que al generar el producto identifiquemos cual fue el id que lo generó
  };

  const producto = new Producto(data);

  // Guardar en DB:
  await producto.save();

  res.status(201).json(producto); //201 significa que se creó algo en la BD
};

// actualizarCategoria
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body; // usuario y estado lo estamos excluyendo de la data

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase(); // Metodo para que al actualizar el nombre se guarde en mayuscula
  }
  data.usuario = req.usuario._id; // Para dejar registro de quien fue el usuario que hizo la actualización

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); // el primer parametro indica al metodo que haga la busqueda por la propiedad "id" y el segundo parametro indica que el resto de las propiedades de usuario las actualice.

  res.json(producto);
};

// borrarProducto - estado: false
const borrarProducto = async (req, res = response) => {
  const { id } = req.params; // Aqui toma el id de los parametros enviados

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  ); // actualiza el producto a estado falso

  res.json(productoBorrado);
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto};
