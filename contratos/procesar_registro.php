<?php
require __DIR__ . '/lib/bootstrap.php';
tlx_requiere_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: registro.php');
    exit;
}
tlx_csrf_verificar();

function tlx_registro_resultado(string $mensaje, string $tipo): void
{
    tlx_flash($mensaje, $tipo);
    header('Location: registro.php');
    exit;
}

$usuario = trim((string) ($_POST['nuevo_usuario'] ?? ''));
$contrasena = (string) ($_POST['nueva_contrasena'] ?? '');
$estado = (string) ($_POST['tipo_usuario'] ?? '');
$privilegios = (string) ($_POST['con_privilegios'] ?? '');

if ($usuario === '' || $contrasena === '') {
    tlx_registro_resultado('Datos incompletos.', 'error');
}
if (!preg_match('/^[A-Za-z0-9._-]{3,50}$/', $usuario)) {
    tlx_registro_resultado('El usuario debe tener de 3 a 50 caracteres: letras, números, punto, guion o guion bajo.', 'error');
}
if (strlen($contrasena) < 10 || !preg_match('/[A-Za-z]/', $contrasena) || !preg_match('/\d/', $contrasena)) {
    tlx_registro_resultado('La contraseña debe tener al menos 10 caracteres, con letras y números.', 'error');
}
if (!in_array($estado, ['activo', 'inactivo'], true) || !in_array($privilegios, ['0', '1'], true)) {
    tlx_registro_resultado('Estado o privilegios no válidos.', 'error');
}
$privilegios = (int) $privilegios;

$hash = password_hash($contrasena, PASSWORD_DEFAULT);

try {
    $insert = tlx_db()->prepare('INSERT INTO usuarios (usuario, contrasena, estado, privilegios) VALUES (?, ?, ?, ?)');
    $insert->bind_param('sssi', $usuario, $hash, $estado, $privilegios);
    $insert->execute();
    $insert->close();
} catch (mysqli_sql_exception $ex) {
    if ($ex->getCode() === 1062) { // UNIQUE (usuario)
        tlx_registro_resultado('El usuario ya existe.', 'error');
    }
    error_log('Tlaxicom: error al registrar usuario: ' . $ex->getMessage());
    tlx_registro_resultado('No fue posible registrar al usuario.', 'error');
}

tlx_registro_resultado('Usuario registrado correctamente.', 'ok');
