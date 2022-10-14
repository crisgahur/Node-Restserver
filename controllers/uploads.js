const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  try {
    // Cargar archivos txt, md:
    // const nombre = await subirArchivo(req.files, ["txt", "md"], 'textos');
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImagen = async (req, res = response) => {
  // Todas las funciones que impliquen grabar en BD son asincronas

  const { id, coleccion } = req.params;

  let modelo;

  // Validador de que la colección y el ID coincidan:
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id); // Se coloca await porque es una busqueda en BD.

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe usuario con el ID ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id); // Se coloca await porque es una busqueda en BD.

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe producto con el ID ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imagenes previas:
  if (modelo.img) {
    // Hay que borrar la imagen del servidor:
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      // Acaso estamos diciendo que si existe un archivo en la ruta pathImagen se ejecuta....
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion); // Con el tercer parametro pedimos que lo que carga de imagen lo almacene en una carpeta llamada colección

  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  // Todas las funciones que impliquen grabar en BD son asincronas

  const { id, coleccion } = req.params;

  let modelo;

  // Validador de que la colección y el ID coincidan:
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id); // Se coloca await porque es una busqueda en BD.

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe usuario con el ID ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id); // Se coloca await porque es una busqueda en BD.

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe producto con el ID ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imagenes previas:
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr [nombreArr.length -1 ];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath); // Secure_url es la propiedad de cloudinary donde almacena la url de la imagen.

  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  // Validador de que la colección y el ID coincidan:
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id); // Se coloca await porque es una busqueda en BD.

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe usuario con el ID ${id}`,
        });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id); // Se coloca await porque es una busqueda en BD.

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe producto con el ID ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imagenes previas:
  if (modelo.img) {
    // Hay que borrar la imagen del servidor:
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, "../assets", "no-image.jpg");
  res.sendFile(pathImagen);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
