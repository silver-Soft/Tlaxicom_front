<?php
require __DIR__ . '/lib/bootstrap.php';
tlx_requiere_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: lista_usuarios.php');
    exit;
}
tlx_csrf_verificar();

function tlx_volver(string $mensaje, string $tipo): void
{
    tlx_flash($mensaje, $tipo);
    header('Location: lista_usuarios.php');
    exit;
}

$id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$accion = (string) ($_POST['accion'] ?? '');

if ($id === false || $id === null) {
    tlx_volver('Falta el ID del usuario o no es válido.', 'error');
}

$db = tlx_db();

// Un administrador no puede deshabilitarse ni eliminarse a sí mismo (quedaría sin acceso).
$propio = $db->prepare('SELECT 1 FROM usuarios WHERE id = ? AND usuario = ?');
$propio->bind_param('is', $id, $_SESSION['usuario']);
$propio->execute();
$esPropio = $propio->get_result()->num_rows > 0;
$propio->close();
if ($esPropio && $accion !== 'habilitar') {
    tlx_volver('No puedes deshabilitar ni eliminar tu propio usuario.', 'error');
}

switch ($accion) {
    case 'habilitar':
        $sql = "UPDATE usuarios SET estado = 'activo' WHERE id = ?";
        $texto = 'Usuario habilitado.';
        break;
    case 'deshabilitar':
        $sql = "UPDATE usuarios SET estado = 'inactivo' WHERE id = ?";
        $texto = 'Usuario deshabilitado.';
        break;
    case 'eliminar':
        $sql = 'DELETE FROM usuarios WHERE id = ?';
        $texto = 'Usuario eliminado.';
        break;
    default:
        tlx_volver('Acción no válida.', 'error');
}

try {
    $stmt = $db->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $afectadas = $stmt->affected_rows;
    $stmt->close();
} catch (mysqli_sql_exception $ex) {
    error_log('Tlaxicom: error en accion de usuario: ' . $ex->getMessage());
    tlx_volver('No fue posible realizar la acción.', 'error');
}

tlx_volver($afectadas > 0 ? $texto : 'No hubo cambios (el usuario no existe o ya tenía ese estado).', $afectadas > 0 ? 'ok' : 'error');
