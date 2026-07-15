export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'El cuerpo JSON no es válido' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'El cuerpo de la solicitud es demasiado grande' });
  }

  if (error.code === 'CORS_ORIGIN_DENIED') {
    return res.status(403).json({ error: 'Origen no autorizado por CORS' });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;

  if (status >= 500) {
    console.error('Error no controlado:', error);
  }

  return res.status(status).json({
    error: status >= 500 ? 'Error interno inesperado' : error.message
  });
};
