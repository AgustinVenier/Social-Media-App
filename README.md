# Social Media App — Azure

React/Vite y Express se despliegan juntos en **Azure App Service Linux, Node.js 24 LTS**, con Azure Database for MySQL Flexible Server. Express sirve `public/` y `/api`; no se requiere una URL de API en el frontend.

## Configuracion inicial de Azure

1. Crear App Service Linux con Node 24 LTS y MySQL Flexible Server. Crear previamente la base `social_media` (UTF-8). Habilitar backups y configurar la red/firewall para permitir la conexion desde App Service; no abrir MySQL a Internet indiscriminadamente.
2. En App Service, activar **HTTPS Only**, TLS minimo 1.2, Always On (si el plan lo permite), Health check `/api/ready` y logs de aplicacion. Startup command: `npm start`.
3. Configurar estas variables en **Settings > Environment variables**, nunca en el repositorio:

| Variable | Valor |
| --- | --- |
| `NODE_ENV` | `production` |
| `DB_HOST` | `<servidor>.mysql.database.azure.com` |
| `DB_PORT` | `3306` |
| `DB_USER` | Usuario de la aplicacion |
| `DB_PASSWORD` | Contrasena de MySQL (preferible referencia a Key Vault) |
| `DB_NAME` | `social_media` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | Secreto aleatorio de al menos 32 caracteres (preferible Key Vault) |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `false` (el workflow entrega dependencias y frontend compilado) |

App Service proporciona `PORT`; no fijarlo en Azure. `DB_SSL_CA_PATH` es opcional si se necesita un archivo de CA adicional. Se verifica el certificado TLS; no deshabilitar esa verificacion.

4. Inicializar las tablas **antes del primer despliegue** desde un equipo con acceso de red a MySQL, usando las variables anteriores y una cuenta con permisos DDL:

```powershell
cd backend
npm ci
npm run db:migrate
```

El comando crea las tablas si no existen; no crea la base ni transforma esquemas existentes. Para cambios futuros usar migraciones versionadas y backup. El usuario de ejecucion de la app solo necesita SELECT, INSERT, UPDATE y DELETE sobre esa base; usar otra cuenta para DDL. El servidor no modifica el esquema al arrancar.

## GitHub Actions

Workflow: [`.github/workflows/azure.yml`](.github/workflows/azure.yml).

1. Crear un Environment de GitHub llamado `production` y limitar despliegues a `main`.
2. Crear una identidad de Microsoft Entra con credencial federada OIDC para el sujeto `repo:<OWNER>/<REPO>:environment:production`, audience `api://AzureADTokenExchange`. Asignarle **Website Contributor** sobre el App Service concreto.
3. En el Environment `production`, agregar los secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, y la variable `AZURE_WEBAPP_NAME` con el nombre del App Service.
4. Subir a `main` o ejecutar el workflow manualmente desde `main`. Si la rama principal tiene otro nombre, cambiar las tres referencias de rama del YAML y la restriccion del Environment.

El pipeline compila React, prueba el backend, instala dependencias de produccion en Linux y publica un ZIP con una lista explicita de archivos. No incluye `.env`. Los pull requests solo construyen y prueban. Tras desplegar, verifica `/api/ready` (incluye MySQL) y `/`. Si la verificacion falla, el workflow falla; no hace rollback automatico. Para restaurar una version, ejecutar el workflow sobre el commit anterior de `main` restaurado mediante revert. Para despliegues sin interrupcion usar un deployment slot y swap en un plan compatible.

Referencia: https://learn.microsoft.com/azure/app-service/deploy-github-actions?tabs=openid

## Desarrollo local

Copiar `backend/.env.example` a `backend/.env`, completar valores, crear la base y ejecutar `npm run db:migrate`. Luego `npm run dev` en backend y en `frontend/social-media-app`. Vite redirige `/api` a `localhost:3000`.

`backend/node_modules` tambien estaba versionado: se retiro del indice conservando la instalacion local. Las dependencias se reconstruyen con `npm ci` desde los lockfiles.

## Credenciales existentes

`backend/.env` ya estaba versionado antes de estos cambios. Se retiro del indice de Git conservando la copia local y se agrego a `.gitignore`. Antes de publicar, rotar todas las credenciales que haya contenido y, si se compartio el repositorio, limpiar el historial segun la politica del equipo. No reutilizar esos valores en Azure.

## Protecciones y verificacion

Se validan secretos al iniciar, se verifica TLS de MySQL, se usan cookies HttpOnly/Secure en produccion, se rechazan escrituras cross-site, se limita el cuerpo JSON a 100 KB y se limita `/api/auth` a 30 peticiones por 15 minutos/IP. El limite es por instancia; para varias instancias usar un store compartido o Azure Front Door/WAF. Helmet agrega cabeceras de seguridad; la politica CSP queda desactivada y requiere definir los origenes de imagenes/scripts admitidos por el producto. El pipeline bloquea dependencias de produccion con vulnerabilidades altas o criticas.

## Alcance de verificacion

Los tests HTTP verifican rutas SPA/API, origen de peticiones y configuracion. El despliegue real, permisos de Azure, migracion y flujos contra MySQL deben verificarse con los recursos y credenciales del entorno. No se provisionan recursos ni se publica desde esta preparacion local.
