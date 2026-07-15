import { expect } from '@playwright/test';

export const loginFromUi = async (page, email, password) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Comenzar' }).click();

  const loginPanel = page.locator('.login-panel');
  await loginPanel.locator('input[name="email"]').fill(email);
  await loginPanel.locator('input[name="password"]').fill(password);
  await loginPanel.getByRole('button', { name: 'INICIAR SESIÓN' }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator('header.home-header')).toBeVisible();
};

export const requireCredentials = (test, values, description) => {
  const missing = values.some((value) => !value);
  test.skip(missing, `Configura credenciales QA para ejecutar: ${description}`);
};
