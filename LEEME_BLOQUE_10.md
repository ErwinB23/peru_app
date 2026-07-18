# Bloque 10 - Ajustes finales antes de Cloudinary

Copiar el contenido del paquete en la raiz del proyecto y ejecutar:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block10-precloud-check.ps1
```

Para retirar los PNG antiguos y el archivo temporal de la raiz:

```powershell
.\scripts\block10-precloud-check.ps1 -Apply
```

Los PNG se mueven a un respaldo externo; no se destruyen.
