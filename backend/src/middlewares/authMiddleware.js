import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findUserById } from '../models/userModel.js';

const unauthorized = (res, message) => {
  return res.status(401).json({ error: message });
};

// Verifica el JWT y recupera el usuario y su rol vigente desde SQL Server.
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.get('authorization');

    if (!authHeader) {
      return unauthorized(res, 'Acceso denegado. No se proporcionó token');
    }

    const [scheme, token] = authHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return unauthorized(res, 'Formato de autorización inválido');
    }

    const decoded = jwt.verify(token, env.jwt.secret);
    const userId = Number(decoded.id ?? decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return unauthorized(res, 'Token inválido');
    }

    const currentUser = await findUserById(userId);

    if (!currentUser) {
      return unauthorized(
        res,
        'La sesión ya no es válida porque el usuario no existe'
      );
    }

    // Nunca se confía en el rol contenido en el token. El rol vigente viene de SQL Server.
    req.user = currentUser;
    req.auth = {
      tokenIssuedAt: decoded.iat,
      tokenExpiresAt: decoded.exp
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token expirado');
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return unauthorized(res, 'Token inválido');
    }

    console.error('Error al validar la sesión:', error);
    return res.status(500).json({
      error: 'No fue posible validar la sesión en este momento'
    });
  }
};
