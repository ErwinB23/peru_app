import { expect, test } from '@playwright/test';
import { loginFromUi, requireCredentials } from './helpers/auth.js';

const userEmail = process.env.E2E_USER_EMAIL;
const userPassword = process.env.E2E_USER_PASSWORD;

test('una URL protegida redirige al login sin sesion', async ({ page }) => {
  await page.goto('/home');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('button', { name: 'Comenzar' })).toBeVisible();
});

test('login invalido muestra un mensaje controlado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Comenzar' }).click();
  const loginPanel = page.locator('.login-panel');
  await loginPanel.locator('input[name="email"]').fill('no-existe@peruapp.test');
  await loginPanel.locator('input[name="password"]').fill('ClaveIncorrecta123');
  await loginPanel.getByRole('button', { name: 'INICIAR SESIÓN' }).click();
  await expect(page.locator('.toast-error')).toContainText(/credenciales/i);
});

test('usuario inicia sesion, navega y cierra sesion', async ({ page }) => {
  requireCredentials(test, [userEmail, userPassword], 'flujo de usuario');
  await loginFromUi(page, userEmail, userPassword);

  await page.locator('header.home-header').getByRole('button', { name: 'Departamentos' }).click();
  await expect(page).toHaveURL(/\/departamentos$/);

  await page.locator('.user-avatar').click();
  await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
});
