const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {
  
  const { correo, password } = req.body;

  // Verificar que el correo existe:
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      // Hacerlo asi es igual que hacer la expresión usuario == false
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // Si el usuario está activo:
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar contraseña:
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Genera el JWT (Jason Web Token):
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

// Funcion que se encarga de recibir el token, y a partir del token destructurar el nombre, img y correo.
const googleSingIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const {correo, nombre, img} = await googleVerify(id_token);
    console.log(googleUser);

    let usuario = await Usuario.findOne({correo}); // Esta pidiendo que busque en la BD el correo

    // Si el correo no existe en la BD, lo creamos:
    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true
      };

      usuario = new Usuario( data ); // Aca estamos creando el nuevo usuario con los datos de la cuenta google
      await usuario.save();
    }

    // Si el usuario en BD está en estado false / desactivado (porque el admin no se quiere permitir su ingreso):

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el admin, el usuario está bloqueado",
      });
    }

    // Genera el JWT (Jason Web Token):
    const token = await generarJWT(usuario.id); // usuario.id hace referencia la ID que genera mongo.

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "El token de Google no es valido",
    });
  }
};

module.exports = { 
  login, 
  googleSingIn }
