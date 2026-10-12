<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

date_default_timezone_set('America/Mexico_City');

/** Carpeta privada de escritura (logs, bloqueos de login). Fuera de public_html si es posible. */
function tlx_storage_dir(): ?string
{
    static $dir = false;
    if ($dir === false) {
        $dir = null;
        $preferidos = array_filter([
            tlx_config('storage_dir'),
            dirname(__DIR__, 3) . '/tlaxicom_storage',
            sys_get_temp_dir() . '/tlaxicom_storage',
        ]);
        foreach ($preferidos as $candidato) {
            if ((is_dir($candidato) || @mkdir($candidato, 0700, true)) && is_writable($candidato)) {
                $dir = $candidato;
                break;
            }
        }
    }
    return $dir;
}

// Errores: nunca al navegador (salvo debug local); siempre al log fuera del docroot.
$tlxDebug = (bool) tlx_config('debug');
ini_set('display_errors', $tlxDebug ? '1' : '0');
ini_set('display_startup_errors', $tlxDebug ? '1' : '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);
if (($tlxStorage = tlx_storage_dir()) !== null) {
    ini_set('error_log', $tlxStorage . '/php-error.log');
}

function tlx_es_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

function tlx_iniciar_sesion(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('TLAXICOMSESS');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/contratos/',
        'secure' => tlx_es_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    session_start();
}

// El panel solo se sirve por HTTPS (excepto en desarrollo local).
$tlxHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
if (PHP_SAPI !== 'cli' && !tlx_es_https() && !in_array($tlxHost, ['localhost', '127.0.0.1'], true) && !tlx_config('debug')) {
    header('Location: https://tlaxicom.com' . ($_SERVER['REQUEST_URI'] ?? '/contratos/login.php'), true, 301);
    exit;
}

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');
tlx_iniciar_sesion();

/** Escapa texto para HTML. */
function e($valor): string
{
    return htmlspecialchars((string) $valor, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Conexion mysqli (lanza excepciones; los detalles van al log, no al usuario). */
function tlx_db(): mysqli
{
    static $conexion = null;
    if ($conexion === null) {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $db = tlx_config('db');
        try {
            $conexion = new mysqli($db['host'], $db['user'], $db['pass'], $db['name']);
            $conexion->set_charset('utf8mb4');
        } catch (mysqli_sql_exception $ex) {
            error_log('Tlaxicom: fallo de conexion a la BD: ' . $ex->getMessage());
            http_response_code(500);
            exit('No fue posible conectar con la base de datos. Intente mas tarde.');
        }
    }
    return $conexion;
}

// ---- CSRF ----
function tlx_csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function tlx_csrf_campo(): string
{
    return '<input type="hidden" name="csrf" value="' . e(tlx_csrf_token()) . '">';
}

/** Corta la peticion si el token no coincide. */
function tlx_csrf_verificar(): void
{
    $enviado = $_POST['csrf'] ?? '';
    if (!is_string($enviado) || !hash_equals(tlx_csrf_token(), $enviado)) {
        http_response_code(403);
        exit('Solicitud no valida. Regrese, recargue la pagina e intente de nuevo.');
    }
}

// ---- Autenticacion / autorizacion ----
function tlx_requiere_login(): void
{
    if (empty($_SESSION['usuario'])) {
        header('Location: login.php');
        exit;
    }
}

function tlx_es_admin(): bool
{
    return isset($_SESSION['privilegios']) && (int) $_SESSION['privilegios'] === 1;
}

function tlx_requiere_admin(): void
{
    tlx_requiere_login();
    if (!tlx_es_admin()) {
        http_response_code(403);
        echo "<div style='text-align:center; margin-top:50px; font-family:Arial; color:red;'>"
           . "No tienes permisos para acceder a esta p&aacute;gina.<br><a href='dashboard.php'>Volver al inicio</a></div>";
        exit;
    }
}

/** Guarda (o, sin argumentos, entrega y borra) un mensaje de una sola vez para la siguiente pagina. */
function tlx_flash(?string $mensaje = null, string $tipo = 'ok'): ?array
{
    if ($mensaje !== null) {
        $_SESSION['flash'] = ['m' => $mensaje, 't' => $tipo];
        return null;
    }
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}
