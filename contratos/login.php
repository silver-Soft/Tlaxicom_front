<?php
require __DIR__ . '/lib/bootstrap.php';

if (!empty($_SESSION['usuario'])) {
    header('Location: dashboard.php');
    exit;
}
$flash = tlx_flash();
?>
<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión</title>
    <link rel="stylesheet" href="styles/login.css">
</head>
<body>
    <form action="procesar_login.php" method="post" autocomplete="off">
        <?= tlx_csrf_campo() ?>
        <h2>🌐 ¡Bienvenido a la Conexión del Futuro!</h2>
        <?php if ($flash): ?>
            <p style="color:#c0392b; font-weight:bold;"><?= e($flash['m']) ?></p>
        <?php endif; ?>
        <h2>Usuario: <input type="text" name="usuario" required autocomplete="username"><br></h2>
        <h2>Contraseña: <input type="password" name="contrasena" required autocomplete="current-password"><br></h2>
        <input type="submit" value="Iniciar sesión">
    </form>

    <a href="../index.html">
        <button>Volver a la página principal</button>
    </a>
</body>
</html>
