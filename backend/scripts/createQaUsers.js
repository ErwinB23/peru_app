import bcrypt from 'bcrypt';
import { closeConnection } from '../src/config/database.js';
import { createUser, findUserByEmail } from '../src/models/userModel.js';

const required = [
  'QA_ADMIN_EMAIL',
  'QA_ADMIN_PASSWORD',
  'QA_USER_EMAIL',
  'QA_USER_PASSWORD'
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Faltan variables QA: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  const accounts = [
    {
      email: process.env.QA_ADMIN_EMAIL.trim().toLowerCase(),
      password: process.env.QA_ADMIN_PASSWORD,
      nombres: 'Administrador',
      apellidos: 'QA',
      rol: 'admin'
    },
    {
      email: process.env.QA_USER_EMAIL.trim().toLowerCase(),
      password: process.env.QA_USER_PASSWORD,
      nombres: 'Usuario',
      apellidos: 'QA',
      rol: 'usuario'
    }
  ];

  try {
    for (const account of accounts) {
      if (account.password.length < 8) {
        throw new Error(`La clave QA de ${account.email} debe tener al menos 8 caracteres`);
      }

      const existing = await findUserByEmail(account.email);
      if (existing) {
        console.log(`[SKIP] ${account.email} ya existe con rol ${existing.rol}`);
        continue;
      }

      const passwordHash = await bcrypt.hash(account.password, 10);
      const created = await createUser(
        account.nombres,
        account.apellidos,
        '2000-01-01',
        account.email,
        passwordHash,
        account.rol
      );

      console.log(`[OK] Cuenta QA creada: ${created.email} (${created.rol})`);
    }
  } catch (error) {
    console.error('[ERROR] No se pudieron preparar las cuentas QA:', error.message);
    process.exitCode = 1;
  } finally {
    await closeConnection();
  }
}
