import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  createUser,
  findUserById,
  findUserByIdWithPassword,
  updateUser,
  updatePassword,
} from "../models/userModel.js";

// REGISTRAR USUARIO
export const register = async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, email, password } = req.body;

    // Validar campos obligatorios
    if (!nombres || !apellidos || !fecha_nacimiento || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Normalizar email
    const emailNormalizado = email.trim().toLowerCase();

    // Verificar si el email ya existe
    const existingUser = await findUserByEmail(emailNormalizado);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario siempre como usuario normal
    const newUser = await createUser(
      nombres.trim(),
      apellidos.trim(),
      fecha_nacimiento,
      emailNormalizado,
      hashedPassword,
      'usuario'
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        email: newUser.email,
        rol: newUser.rol
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // Normalizar email
    const emailNormalizado = email.trim().toLowerCase();

    // Buscar usuario
    const user = await findUserByEmail(emailNormalizado);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar configuración del JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET no está configurado en el servidor' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '1d'
      }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// OBTENER PERFIL (usuario autenticado)
export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// ACTUALIZAR PERFIL
export const updateProfile = async (req, res) => {
  try {
    const { nombres, apellidos, email, fecha_nacimiento, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validar campos obligatorios
    if (!nombres || !apellidos || !email || !fecha_nacimiento) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Si quiere cambiar el email, verificar que no esté usado por otro usuario
    if (emailNormalizado !== req.user.email) {
      const existingUser = await findUserByEmail(emailNormalizado);

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    // Si desea cambiar contraseña, primero validar contraseña actual
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Debe ingresar la contraseña actual y la nueva contraseña'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      const userWithPassword = await findUserByIdWithPassword(userId);

      if (!userWithPassword) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }
    }

    // Actualizar datos del perfil
    const updatedUser = await updateUser(userId, {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      email: emailNormalizado,
      fecha_nacimiento
    });

    // Actualizar contraseña si corresponde
    if (currentPassword && newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updatePassword(userId, hashedPassword);
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};