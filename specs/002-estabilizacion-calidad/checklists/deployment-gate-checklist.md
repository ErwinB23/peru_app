# Checklist de Puerta de Despliegue

- [ ] `git status` limpio.
- [ ] Rama correcta o PR aprobado.
- [ ] No hay `.env` ni credenciales QA versionadas.
- [ ] OpenAPI 70/70.
- [ ] Jest y cobertura aprobados.
- [ ] ESLint aprobado.
- [ ] Vite build aprobado.
- [ ] `npm audit --omit=dev` revisado y documentado.
- [ ] Respaldo SQL verificado.
- [ ] Cloudinary probado.
- [ ] Azure SQL probado.
- [ ] Health de Render 200.
- [ ] Vercel consume la API pública.
- [ ] CORS acepta únicamente el frontend definitivo.
- [ ] Newman de producción aprobado.
- [ ] Playwright de producción aprobado.
