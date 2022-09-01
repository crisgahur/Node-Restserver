const {response, request} = require('express'); // Response es una propiedad de express

const usuariosGet = (req = request, res = response) => {
    
    const {q,nombre,apikey} = req.query; // Leyendo y extrayendo a variables los query (lo digitado en la barra de navegación)

    res.json({
      msg: "get API - controlador ",
      q,
      nombre,
      apikey
    });
  };

  const usuariosPut = (req, res = response) => {

   const {id} = req.params.id;
    
    res.json({
      msg: "put API - controlador ",
      id
    });
  };

  const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body; // Desestructuro del body lo que necesito, en este caso, el nombre y la edad
    
    res.json({
      msg: "post API - controlador ",
      nombre, 
      edad
    });
  };

  const usuariosDelete = (req, res = response) => {
    
    res.json({
      msg: "delete API - controlador "
    });
  };

  const usuariosPatch = (req, res = response) => {
    
    res.json({
      msg: "patch API - controlador "
    });
  };

  module.exports = {usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch}