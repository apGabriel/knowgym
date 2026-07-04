# KnowGym

Aplicación web de rutinas de gimnasio (PHP + MySQL/MariaDB, sin framework).
Permite registro/login de usuarios, creación de rutinas por grupo muscular y
un calendario de eventos de entrenamiento.

## Requisitos

- PHP 8+ con PDO MySQL
- MySQL / MariaDB
- Un servidor web (Apache/XAMPP o similar) sirviendo la raíz del repo

## Configuración

El código **no contiene credenciales**: todo se lee de variables de entorno.
Hay dos formas de definirlas:

1. **Apache**: `SetEnv` en el VirtualHost o `.htaccess`.
2. **Archivo local**: copia `code/php/db/config.local.php.example` a
   `code/php/db/config.local.php` y rellena tus valores. Este archivo está en
   `.gitignore` y **nunca debe subirse**.

### Variables necesarias

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host de MySQL (por defecto `127.0.0.1`) |
| `DB_NAME` | Nombre de la base de datos (por defecto `knowgym`) |
| `DB_USER` | Usuario de MySQL |
| `DB_PASS` | Contraseña de MySQL |
| `RECAPTCHA_SITEKEY` | Site key (pública) de reCAPTCHA — formulario de registro |
| `RECAPTCHA_SECRET` | Secret key (privada) de reCAPTCHA — validación en servidor |

### Configuración de reCAPTCHA

El formulario de registro usa **reCAPTCHA v2, tipo "No soy un robot"
(checkbox)**. Cada instalación debe crear sus propias claves:

1. Entra en <https://www.google.com/recaptcha/admin> y crea un sitio nuevo.
2. Elige **reCAPTCHA v2 → casilla "No soy un robot"** (el código valida con
   `siteverify` mirando solo `success`; una clave v3 no funcionará).
3. Añade tu dominio (y `localhost` para desarrollo).
4. Copia la **site key** en `RECAPTCHA_SITEKEY` y la **secret key** en
   `RECAPTCHA_SECRET` (en `config.local.php` o variables de entorno).

Sin estas variables, el registro responde con un error controlado y el detalle
queda en el log del servidor.
