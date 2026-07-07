import { getConnection, sql } from "../config/database.js";

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Usuarios WHERE email = @email");

  return result.recordset[0];
};

// Crear nuevo usuario
export const createUser = async (
  nombres,
  apellidos,
  fecha_nacimiento,
  email,
  hashedPassword,
  rol = "usuario",
) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("nombres", sql.VarChar, nombres)
    .input("apellidos", sql.VarChar, apellidos)
    .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
    .input("email", sql.VarChar, email)
    .input("password", sql.VarChar, hashedPassword)
    .input("rol", sql.VarChar, rol).query(`
      INSERT INTO Usuarios (nombres, apellidos, fecha_nacimiento, email, password, rol)
      OUTPUT INSERTED.*
      VALUES (@nombres, @apellidos, @fecha_nacimiento, @email, @password, @rol)
    `);

  return result.recordset[0];
};

// Obtener usuario por ID (CORREGIDO)
export const findUserById = async (id) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(
      "SELECT id, nombres, apellidos, fecha_nacimiento, email, rol, fecha_registro FROM Usuarios WHERE id = @id",
    );

  return result.recordset[0];
};

// Obtener usuario por ID incluyendo password
export const findUserByIdWithPassword = async (id) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM Usuarios WHERE id = @id");

  return result.recordset[0];
};

// Actualizar datos del usuario (CORREGIDO)
export const updateUser = async (id, data) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nombres", sql.VarChar, data.nombres)
    .input("apellidos", sql.VarChar, data.apellidos)
    .input("email", sql.VarChar, data.email)
    .input("fecha_nacimiento", sql.Date, data.fecha_nacimiento).query(`
      UPDATE Usuarios 
      SET nombres = @nombres, 
          apellidos = @apellidos, 
          email = @email,
          fecha_nacimiento = @fecha_nacimiento
      OUTPUT INSERTED.id, INSERTED.nombres, INSERTED.apellidos, INSERTED.fecha_nacimiento, INSERTED.email, INSERTED.rol, INSERTED.fecha_registro
      WHERE id = @id
    `);

  return result.recordset[0];
};

// Actualizar contraseña (NUEVO)
export const updatePassword = async (id, hashedPassword) => {
  const pool = await getConnection();
  await pool
    .request()
    .input("id", sql.Int, id)
    .input("password", sql.VarChar, hashedPassword)
    .query("UPDATE Usuarios SET password = @password WHERE id = @id");
};

// Listar todos los usuarios (solo para admin)
export const getAllUsers = async () => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .query(
      "SELECT id, nombres, apellidos, fecha_nacimiento, email, rol, fecha_registro FROM Usuarios ORDER BY fecha_registro DESC",
    );

  return result.recordset;
};

// Buscar usuarios por texto: nombres, apellidos, email o rol
export const searchUsers = async (search) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("search", sql.VarChar, `%${search}%`).query(`
      SELECT id, nombres, apellidos, fecha_nacimiento, email, rol, fecha_registro
      FROM Usuarios
      WHERE nombres LIKE @search
      OR apellidos LIKE @search
      OR email LIKE @search
      OR rol LIKE @search
      ORDER BY fecha_registro DESC
    `);

  return result.recordset;
};

// Actualizar usuario como administrador
export const updateUserByAdmin = async (id, data) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nombres", sql.VarChar, data.nombres)
    .input("apellidos", sql.VarChar, data.apellidos)
    .input("fecha_nacimiento", sql.Date, data.fecha_nacimiento)
    .input("email", sql.VarChar, data.email)
    .input("rol", sql.VarChar, data.rol).query(`
      UPDATE Usuarios
      SET nombres = @nombres,
          apellidos = @apellidos,
          fecha_nacimiento = @fecha_nacimiento,
          email = @email,
          rol = @rol
      OUTPUT INSERTED.id, INSERTED.nombres, INSERTED.apellidos,
      INSERTED.fecha_nacimiento, INSERTED.email, INSERTED.rol,
      INSERTED.fecha_registro
      WHERE id = @id
    `);

  return result.recordset[0];
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const pool = await getConnection();
  const result = await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Usuarios
      OUTPUT DELETED.id, DELETED.nombres, DELETED.apellidos,
      DELETED.fecha_nacimiento, DELETED.email, DELETED.rol,
      DELETED.fecha_registro
      WHERE id = @id
    `);

  return result.recordset[0];
};

// Contar usuarios administradores
export const countAdmins = async () => {
  const pool = await getConnection();
  const result = await pool.request().query(`
      SELECT COUNT(*) AS total
      FROM Usuarios
      WHERE rol = 'admin'
    `);

  return result.recordset[0].total;
};
