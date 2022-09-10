const { response, request, query } = require("express"); // Response es una propiedad de express
const bcryptjs = require("bcryptjs"); // Paquete que nos permite encriptar la password.
const Usuario = require("../models/usuario"); // El nombre de la variable se pone con la primera letra mayuscula por buenas practicas, por estandar...

const usuariosGet = async (req = request, res = response) => {
  const {limite = 5, desde = 0} = req.query;
  const query = {estado: true};

  const [total, usuarios] = await Promise.all([ // Este metodo permite almacenar promesas en un array y las ejecuta de manera simultanea, si alguna da error, todas dan error. Lo que está en la primera posición del array como variable es resultado de la primera promesa, y lo que está en segunda posición es resultado de la segunda promesa 
     Usuario.countDocuments(query), // Metodo que realiza conteo de objetos almacenados como Usuario
     Usuario.find(query)
       .skip(Number(desde))
       .limit(Number(limite))
  ]) 
  res.json({
   total,
   usuarios
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body; // el body hace referencia a la información que envia el cliente al server, y lo que está escrito en la variable es qué variables del body queremos tomar y almacenar.

  const usuario = new Usuario({ nombre, correo, password, rol }); // Para esta instancia se crea la linea 3 con la primera letra mayuscula

  // Encriptar la contraseña:
  const salt = bcryptjs.genSaltSync(); // Numero de vueltas que queremos darle a la password, por defecto trae 10, entre mayor sea el numero mas seguro y más relentizará la base de datos.
  usuario.password = bcryptjs.hashSync(password, salt); // aqui tomamos el password que sacamos del body.

  //Guardar usuario en base de datos:
  await usuario.save();

  res.json({usuario});
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base da datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto) // el primer parametro indica al metodo que haga la busqueda por la propiedad "id" y el segundo parametro indica que el resto de las propiedades de usuario las actualice.

  res.json(usuario);
};

const usuariosDelete = async(req, res = response) => {
  const {id} = req.params;

  // Borrado fisico/total de la base de datos:
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

  res.json(usuario);

};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controlador ",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
