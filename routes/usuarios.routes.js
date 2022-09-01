const { Router } = require("express"); // Router es una propiedad de express
const { usuariosGet, usuariosPatch, usuariosDelete, usuariosPost, usuariosPut } = require("../controllers/usuarios");

const router = Router();

router.get('/', usuariosGet);

router.put("/:id", usuariosPut);

router.post("/", usuariosPost);

router.delete("/", usuariosDelete);

router.patch("/", usuariosPatch);


module.exports = router;
