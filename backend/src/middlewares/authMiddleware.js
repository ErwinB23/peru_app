import jwt from 'jsonwebtoken';

// Verificar si el usuario está autenticado (tiene token válido)
export const verifyToken = (req, res, next) => {
    try {
    // Obtener token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario a la petición
    req.user = decoded;
    
    next(); // Continuar con el siguiente middleware o controller
    } 
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
    }
        if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' });
    }
    res.status(500).json({ error: 'Error al verificar token' });
    }
};