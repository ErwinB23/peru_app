// Verifica el rol vigente recuperado por verifyToken desde SQL Server.
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        error: 'Acceso denegado. Se requiere rol de administrador'
      });
    }

    return next();
  } catch (error) {
    console.error('Error en la verificación de rol:', error);
    return res.status(500).json({
      error: 'No fue posible verificar los permisos del usuario'
    });
  }
};
