const { Router } = require("express"); // Router es una propiedad de express
const { check } = require("express-validator");

/* const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole, tieneRole } = require("../middlewares/validar-roles"); */

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares"); // Al hacer la importacion de un archivo llamada index no es necesario especificar el archivo index, solo con especificar la carpeta es suficiente.

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPatch,
  usuariosDelete,
  usuariosPost,
  usuariosPut,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(), // Metodo del express-validator que permite validar que ID's  sean en formato Mongo
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    // Check es un middleware en el que puedo especificar que campo del body necesito revisar
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser de mas de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE", "USER_ROLE"),
    check("id", "No es un ID valido").isMongoId(), // Metodo del express-validator que permite validar que ID's  sean en formato Mongo
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
