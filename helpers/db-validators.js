const { Categoria, Usuario, Producto } = require("../models");
const Role = require("../models/role");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la base de datos`); // Con "throw new Error" se lanza un error personalizado, es decir que no revienta/detiene la aplicación NODE,
  }
};

// Verificar que el correo ya existe:
const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error (`El correo ${correo}ya está registrado en la base de datos`);
  }
};

// Verificar que el id existe:
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error (`El ID ${id} no existe`);
  }
};

// Verificar que la categoria ya existe por id:
const existeCategoriaPorID = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error (`El id ${id} no existe`);
  }
};

// Verificar que el producto ya existe por id:
const existeProductoPorID = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error (`El id ${id} no existe`);
  }
};

module.exports = { esRoleValido, emailExiste, existeUsuarioPorId, existeCategoriaPorID, existeProductoPorID };
