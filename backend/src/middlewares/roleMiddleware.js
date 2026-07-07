//VERIFICAR SI EL USUARIO TIENE EL ROL REQUERIDO

export const isAdmin = (req, res, next) =>{
    try{
        // req.user fue agregado por el middleware verifyToken
        if(!req.user){
            return res.status(401).json({error: 'Usuario no autenticado'});
        }

        if(req.user.rol !== 'admin'){
            return res.status(403).json({error: 'Acceso denegado. Requiere rol de administrador'});

        }

        next(); // El usuario tiene el rol requerido, continuar
    }
    catch(error){
        console.error('Error en isAdmin middleware:', error);
        res.status(500).json({error: 'Error en la verificación de rol'});
    }
};