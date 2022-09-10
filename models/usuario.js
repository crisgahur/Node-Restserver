const { Schema, model } = require("mongoose"); // Se extraen las propiedades Schema y model de mongoose

const UsuarioSchema = Schema({
  // Modelo de creación de objetos literales (Se denomina objeto literal al objeto cuyas propiedades están declaradas textualmente en el código.)
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },

  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true, // Significa que es una propiedad irrepetible, unica
  },

  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },

  img: {
    type: String,
  },

  rol: {
    type: String,
    required: true,
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.methods.toJSON = function () {
  // se debe utilizar la función normal, no puede ser funcion flecha porque la función flecha aplica lo que está adentro solo allí, no pasa de ahí, osea, solo local, en cambio la función normal lo hace de manera global

  const { __v, password, ...usuario} = this.toObject; // Aqui estamos extrayendo las propiedades __V y password del objeto, y el resto de propiedades quedan almacenadas en el tercer parametro "usuario"
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema); // El primer parametro es el nombre que se le asigna a la colección de objetos, y segundo parametro el nombre del esquema que se le asignará.
