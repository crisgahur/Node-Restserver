const { Schema, model } = require('mongoose');

const ProductoSchema = Schema ({

    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId, // Quiere decir: El usuario tiene que ser otro objeto que tenemos en mongo
        ref: "Usuario", // Aqui se indica cual es ese objeto de mongo
        required: true
    },

    precio: {
        type: Number,
        default: 0
    },

    categoria: {
        type: Schema.Types.ObjectId, // Quiere decir: El usuario tiene que ser otro objeto que tenemos en mongo
        ref: "Categoria", // Aqui se indica cual es ese objeto de mongo
        required: true
    },

    descripcion: {
        type: String
    },

    disponible: {
        type: Boolean,
        default: true
    },
    
    img: {
        type: String,
      },

});

ProductoSchema.methods.toJSON = function () {
    // se debe utilizar la función normal, no puede ser funcion flecha porque la función flecha aplica lo que está adentro solo allí, no pasa de ahí, osea, solo local, en cambio la función normal lo hace de manera global
  
    const {__v,estado, ...data} = this.toObject(); // Aqui estamos extrayendo las propiedades __V y estado del objeto, y el resto de propiedades quedan almacenadas en el tercer parametro "data", esto se hace con el fin de que al utilizar el get no nos muestra las propiedades __V y estado porque sobran en la practica
    return data;
  };


module.exports= model("Producto", ProductoSchema)