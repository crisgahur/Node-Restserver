const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');

const { dbConnection } = require("../database/config");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;


    this.paths = {
      auth:         "/api/auth",
      buscar:       "/api/buscar",
      categorias:   "/api/categorias",
      productos:    "/api/productos",
      usuarios:     "/api/usuarios",
      uploads:     "/api/uploads"
    }
  

    // Conectar a base de datos
     this.conectarDB(); //Llamamos la función

    //Middlewares: son funciones que añaden funcionalidades al webserver. Osea, funciones que siempre van a ejecutarse con el servidor.
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() { // Creamos la funcion que inicia la Base Datos.
    await dbConnection(); 

  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body:
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public")); // la palabra use identifica que el metodo es un middleware
 
    // Fileupload - Carga de archivos:
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath : true // Al cargar archivos en caso de que no exista la ruta esto permite crear una carpeta con la ruta especificada.
  }));

  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.buscar, require("../routes/buscar.routes"));
    this.app.use(this.paths.categorias, require("../routes/categorias.routes"));
    this.app.use(this.paths.productos, require("../routes/productos.routes"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios.routes"));
    this.app.use(this.paths.uploads, require("../routes/uploads.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
