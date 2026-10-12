<?php
require __DIR__ . '/lib/bootstrap.php';
tlx_requiere_admin();

$resultado = tlx_db()->query('SELECT id, usuario, estado, privilegios FROM usuarios ORDER BY id');
$flash = tlx_flash();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Usuarios</title>
    <style>
        body { text-align: center; font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #0991cf; color: white; }
        form { display: inline; }
        .habilitar, .deshabilitar, .eliminar {
            display: inline-block; padding: 8px 12px; margin: 4px; border: 0; color: white;
            cursor: pointer; border-radius: 4px; font-size: 14px;
        }
        .habilitar { background-color: #4caf50; }
        .deshabilitar { background-color: #ff9800; }
        .eliminar { background-color: #f44336; }
        .msg-ok { color: #2e7d32; font-weight: bold; }
        .msg-error { color: #c0392b; font-weight: bold; }
    </style>
</head>
<body>

<h2>Lista de Usuarios</h2>
<?php if ($flash): ?>
    <p class="msg-<?= $flash['t'] === 'ok' ? 'ok' : 'error' ?>"><?= e($flash['m']) ?></p>
<?php endif; ?>
<table>
    <tr>
        <th>ID</th>
        <th>Usuario</th>
        <th>Estado</th>
        <th>Acciones</th>
    </tr>
    <?php while ($fila = $resultado->fetch_assoc()): ?>
        <tr>
            <td><?= e($fila['id']) ?></td>
            <td><?= e($fila['usuario']) ?></td>
            <td><?= e($fila['estado']) ?></td>
            <td>
                <?php foreach (['habilitar' => 'Habilitar', 'deshabilitar' => 'Deshabilitar', 'eliminar' => 'Eliminar'] as $accion => $texto): ?>
                    <form action="procesar_accion_usuario.php" method="post"
                          <?= $accion === 'eliminar' ? 'onsubmit="return confirm(\'¿Eliminar al usuario ' . e(addslashes($fila['usuario'])) . '? Esta acción no se puede deshacer.\');"' : '' ?>>
                        <?= tlx_csrf_campo() ?>
                        <input type="hidden" name="id" value="<?= (int) $fila['id'] ?>">
                        <input type="hidden" name="accion" value="<?= e($accion) ?>">
                        <button type="submit" class="<?= e($accion) ?>"><?= e($texto) ?></button>
                    </form>
                <?php endforeach; ?>
            </td>
        </tr>
    <?php endwhile; ?>
</table>
<p><a href="dashboard.php">Volver al Dashboard</a></p>

</body>
</html>
