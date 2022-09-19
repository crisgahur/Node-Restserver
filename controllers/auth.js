const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    // Verificar que el correo existe:
    try {
        const usuario = await Usuario.findOne({correo});
        if(!usuario){ // Hacerlo asi es igual que hacer la expresión usuario == false
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }

    // Si el usuario está activo:
    if (!usuario.estado){
        return res.status(400).json({
            msg: "Usuario / Password no son correctos - estado: false"
        });
    }

    // Verificar contraseña:
    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if(!validPassword){
        return res.status(400).json({
            msg: "Usuario / Password no son correctos - password"
        });
    }

    // Genera el JWT (Jason Web Token):
    const token = await generarJWT(usuario.id)

    res.json ({
        usuario,
        token
     })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
        
    }
}

module.exports = {login}