import rateLimit from 'express-rate-limit';

const commonOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false
};

export const loginLimiter = rateLimit({
  ...commonOptions,
  limit: 10,
  skipSuccessfulRequests: true,
  message: {
    error: 'Demasiados intentos de inicio de sesión. Inténtalo nuevamente más tarde'
  }
});

export const registerLimiter = rateLimit({
  ...commonOptions,
  limit: 5,
  message: {
    error: 'Demasiados intentos de registro. Inténtalo nuevamente más tarde'
  }
});
