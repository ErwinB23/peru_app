# BLOQUE 5 - PRUEBAS AUTOMATIZADAS

Este paquete agrega Jest/Supertest, Postman/Newman, Playwright y GitHub Actions. No contiene `.env`, credenciales, `node_modules`, base de datos ni imagenes del proyecto.

## Aplicacion

Copie todo el contenido en la raiz de PERU_APP_FINAL y reemplace los archivos indicados.

## Primera ejecucion

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\block5-automated-tests.ps1 -Install
```

Esto instala dependencias, ejecuta Jest/Supertest, ESLint y build. Las pruebas usan mocks y no modifican SQL Server.

## Cuentas QA y pruebas completas

1. Copie `tests\qa-credentials.example.ps1` como `tests\qa-credentials.local.ps1`.
2. Cambie correos y claves.
3. Cargue variables:

```powershell
. .\tests\qa-credentials.local.ps1
```

4. Cree las cuentas QA locales si aun no existen:

```powershell
cd backend
npm run qa:seed
cd ..
```

5. Instale Chromium y ejecute API + E2E:

```powershell
.\scripts\block5-automated-tests.ps1 -RunApi -InstallBrowser -RunE2E
```

El backend debe poder conectarse a SQL Server. El script de Playwright puede iniciar backend y frontend automaticamente.
