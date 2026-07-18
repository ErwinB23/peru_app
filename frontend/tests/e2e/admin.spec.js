import { expect, test } from '@playwright/test';
import { loginFromUi, requireCredentials } from './helpers/auth.js';

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const apiBaseUrl = process.env.QA_API_BASE_URL || 'http://localhost:5000';

test('administrador crea y elimina un departamento temporal', async ({ page, request }) => {
  requireCredentials(test, [adminEmail, adminPassword], 'CRUD administrativo');
  await loginFromUi(page, adminEmail, adminPassword);

  const token = await page.evaluate(() => localStorage.getItem('token'));
  const uniqueName = `QA-E2E-${Date.now()}`;

  try {
    await page.goto('/gestionar-departamentos');
    await expect(page.getByRole('heading', { name: 'Gestionar departamentos' })).toBeVisible();

    await page.getByRole('button', { name: '+ Agregar departamento' }).click();
    const form = page.locator('form.gestion-form');
    await form.locator('input[name="nombre"]').fill(uniqueName);
    await form.locator('input[name="capital"]').fill('Capital QA');
    await form.locator('input[name="region_natural"]').fill('Sierra');
    await form.locator('input[name="area_km2"]').fill('100.50');
    await form.locator('input[name="poblacion_aprox"]').fill('1500');
    await form.locator('input[name="clima_predominante"]').fill('Templado');
    await form.locator('input[name="principales_actividades"]').fill('Pruebas automatizadas');
    await form.locator('input[name="atractivo_turistico_principal"]').fill('Laboratorio QA');
    await form.locator('textarea[name="descripcion"]').fill('Registro temporal creado por Playwright.');
    await form.getByRole('button', { name: 'Guardar departamento' }).click();

    await expect(page.locator('.gestion-dep-alert.success')).toContainText('creado correctamente');
    const card = page.locator('article.gestion-dep-card').filter({ hasText: uniqueName });
    await expect(card).toBeVisible();

    await card.getByRole('button', { name: 'Eliminar' }).click();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(page.locator('.gestion-dep-alert.success')).toContainText('eliminado correctamente');
    await expect(page.locator('article.gestion-dep-card').filter({ hasText: uniqueName })).toHaveCount(0);
  } finally {
    // Limpieza defensiva: evita dejar datos QA si una asercion falla despues de crear.
    if (token) {
      const listResponse = await request.get(`${apiBaseUrl}/api/departamentos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (listResponse.ok()) {
        const payload = await listResponse.json();
        const list = Array.isArray(payload) ? payload : payload.departamentos || [];
        const remaining = list.find((item) => item.nombre === uniqueName);

        if (remaining) {
          await request.delete(`${apiBaseUrl}/api/departamentos/${remaining.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    }
  }
});
