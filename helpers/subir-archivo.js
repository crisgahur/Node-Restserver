const path = require("path"); // Utiles para crear las URL's
const { v4: uuidv4 } = require("uuid");

const { rejects } = require("assert");

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "gif"], carpeta = "" ) => {
  return new Promise((resolve, reject) => {

    const { archivo } = files;
    const nombreCortado = archivo.name.split("."); // split permite cortar/dividir un String, en este caso a partir del punto .
    const formato = nombreCortado[nombreCortado.length - 1]; // Aqui tomamos la ultima posición de la división, osea que tomamos el string de la extensión

    // Validar la extensión:
    if (!extensionesValidas.includes(formato)) {
       return reject(`El formato no es valido: ${formato}. Solo se permite: ${extensionesValidas}`)
    }

    const nombreTemp = uuidv4() + "." + formato;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp); // el name es una propiedad por defecto del archivo que subimos

    // Funcion para mover el archivo a la carpeta
    archivo.mv(uploadPath,  (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = { subirArchivo };
