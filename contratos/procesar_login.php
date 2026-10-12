<?php
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/ratelimit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit;
}
tlx_csrf_verificar();

function tlx_login_error(string $mensaje): void
{
    tlx_flash($mensaje, 'error');
    header('Location: login.php');
    exit;
}

$usuario = trim((string) ($_POST['usuario'] ?? ''));
$contrasena = (string) ($_POST['contrasena'] ?? '');

if ($usuario === '' || $contrasena === '') {
    tlx_login_error('Datos incompletos.');
}

$espera = tlx_login_bloqueado($usuario);
if ($espera > 0) {
    tlx_login_error('Demasiados intentos fallidos. Intente de nuevo en ' . ceil($espera / 60) . ' minuto(s).');
}

$consulta = tlx_db()->prepare('SELECT usuario, contrasena, estado, privilegios FROM usuarios WHERE usuario = ? LIMIT 1');
$consulta->bind_param('s', $usuario);
$consulta->execute();
$fila = $consulta->get_result()->fetch_assoc();
$consulta->close();

// Siempre se verifica un hash (aunque el usuario no exista) para no revelar su existencia por tiempo de respuesta.
$hash = $fila['contrasena'] ?? password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
$valida = password_verify($contrasena, $hash) && $fila !== null;

if (!$valida) {
    tlx_login_fallo($usuario);
    tlx_login_error('Usuario o contraseña incorrectos.');
}

if ($fila['estado'] !== 'activo') {
    tlx_login_error('Tu cuenta está inhabilitada.');
}

tlx_login_exito($usuario);

// Actualiza el hash si el algoritmo por defecto de PHP cambió
if (password_needs_rehash($fila['contrasena'], PASSWORD_DEFAULT)) {
    $nuevo = password_hash($contrasena, PASSWORD_DEFAULT);
    $up = tlx_db()->prepare('UPDATE usuarios SET contrasena = ? WHERE usuario = ?');
    $up->bind_param('ss', $nuevo, $fila['usuario']);
    $up->execute();
    $up->close();
}

session_regenerate_id(true);
$_SESSION['usuario'] = $fila['usuario'];
$_SESSION['privilegios'] = (int) $fila['privilegios'];
unset($_SESSION['flash']);

header('Location: dashboard.php');
exit;
