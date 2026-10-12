<?php
require __DIR__ . '/lib/bootstrap.php';
tlx_requiere_admin();
$flash = tlx_flash();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuarios</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        .container {
            width: 80%; 
            max-width: 400px; 
        }

        form {
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
        }

        label {
            display: block;
            margin-top: 15px;
            font-weight: bold;
            color: #333;
        }

        input, select {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
            transition: border-color 0.3s;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #0991cf;
        }

        input[type="submit"] {
            background-color: #0991cf;
            color: #fff;
            border: none;
            padding: 12px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        input[type="submit"]:hover {
            background-color: #077bb5;
        }

        .dashboard-btn {
            background-color: #0991cf;
            color: #fff;
            border: none;
            padding: 12px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: block;
            margin-top: 20px;
            text-align: center;
            transition: background-color 0.3s;
        }

        .dashboard-btn:hover {
            background-color: #077bb5;
        }
    </style>
</head>
<body>

<div class="container">
    <form action="procesar_registro.php" method="post" autocomplete="off">
        <?= tlx_csrf_campo() ?>
        <h2>Bienvenido, puedes registrar nuevos usuarios</h2>
        <?php if ($flash): ?>
            <p style="color: <?= $flash['t'] === 'ok' ? '#2e7d32' : '#c0392b' ?>; font-weight: bold;"><?= e($flash['m']) ?></p>
        <?php endif; ?>

        <label for="nuevo_usuario">Nuevo Usuario:</label>
        <input type="text" id="nuevo_usuario" name="nuevo_usuario" required minlength="3" maxlength="50" pattern="[A-Za-z0-9._\-]+" title="Letras, números, punto, guion y guion bajo" autocomplete="off">

        <label for="nueva_contrasena">Nueva Contraseña:</label>
        <input type="password" id="nueva_contrasena" name="nueva_contrasena" required minlength="10" autocomplete="new-password" title="Mínimo 10 caracteres, con letras y números">
        <small>Mínimo 10 caracteres, con letras y números.</small>

        <label for="tipo_usuario">Estado:</label>
        <select id="tipo_usuario" name="tipo_usuario" required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
        </select>

        <label for="con_privilegios">Privilegios:</label>
        <select id="con_privilegios" name="con_privilegios" required>
            <option value="1">Sí</option>
            <option value="0">No</option>
        </select>

        <input type="submit" value="Registrar Usuario">
    </form>

    <a href="dashboard.php" class="dashboard-btn">Volver al Dashboard</a>
</div>

</body>
</html>