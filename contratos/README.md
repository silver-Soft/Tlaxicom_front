# Sistema para la creación de contratos para clientes del servicio Tlaxicom

Módulo PHP 8.2 (sin framework): login de administradores/operadores, formulario de contrato, PDF con TCPDF y envío por correo con PHPMailer.

## Estructura

| Ruta | Para qué sirve |
|---|---|
| `login.php`, `procesar_login.php`, `logout.php` | Acceso (CSRF, límite de intentos, sesión con cookie segura) |
| `dashboard.php` | Menú principal |
| `bienvenido.php` → `procesar_bienvenido.php` | Formulario y generación/envío del contrato |
| `registro.php`, `lista_usuarios.php` | Solo administradores (privilegios = 1) |
| `lib/bootstrap.php` | Sesión, errores, CSRF, autenticación, conexión a la BD |
| `lib/contrato.php` | Validación, PDF (coordenadas en mm) y correo |
| `lib/paquetes.php` | **Catálogo de paquetes (megas, costo, folio).** Editar aquí para cambiar tarifas o folios |
| `config.example.php` | Plantilla de la configuración privada |
| `TCPDF/`, `PHPMailer/` | Librerías (versiones fijas en el repo) |

## Configuración privada (no está en el repo)

Credenciales de BD y de correo y los datos de pago se leen de **uno** de estos archivos (en este orden):

1. variable de entorno `TLAXICOM_CONFIG`
2. `/home/<cuenta>/config/tlaxicom.php` (fuera de `public_html`; **recomendado en producción**)
3. `contratos/config.local.php` (ignorado por git y bloqueado por `.htaccess`)

Copie `config.example.php` y llene los valores. Los logs de PHP y los bloqueos de login se guardan en `/home/<cuenta>/tlaxicom_storage/` (o `storage_dir`).

## Entorno local

`dev/up.sh` levanta Apache + PHP 8.2 + MariaDB + Mailpit (correo de pruebas, <http://localhost:8025>). El sitio queda en <http://localhost:8080>. Usuarios locales: `admin_dev` y `operador_dev`, contraseña `dev-pass-123`.

Pruebas: `tools/test_contratos.sh` y `tools/test_htaccess.sh`.

## Notas de mantenimiento

- Las coordenadas del PDF están en `tlx_contrato_pdf()` (`lib/contrato.php`), una línea por texto: `[x, y, texto]`.
- Si cambia la plantilla (`contrato_en_img/*.jpg`), genere un contrato de prueba en local y compare visualmente.
- Actualizar TCPDF: reemplazar `TCPDF/` con la versión 6.x más reciente y repetir la comparación de PDF.
