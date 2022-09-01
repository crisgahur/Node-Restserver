const express = require("express");
const cors = require("cors");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

    //Middlewares: son funciones que añaden funcionalidades al webserver. Osea, funciones que siempre van a ejecutarse con el servidor.
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body:
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public")); // la palabra use identifica que el metodo es un middleware


  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
