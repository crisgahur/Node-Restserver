const { Router } = require("express"); // Router es una propiedad de express
const {buscar} = require('../controllers/buscar')
const router = Router();

router.get('/:coleccion/:termino', buscar) 

module.exports = router;
