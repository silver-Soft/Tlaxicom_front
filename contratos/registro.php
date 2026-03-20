<?php
session_start();

// 🔐 Validar sesión
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}

// 🔐 Validar privilegios (solo admin)
if (!isset($_SESSION['privilegios']) || (int)$_SESSION['privilegios'] !== 1) {
    echo "<div style='text-align:center; margin-top:50px; font-family:Arial; color:red;'>
            No tienes permisos para acceder a esta página.<br>
            <a href='dashboard.php'>Volver al inicio</a>
          </div>";
    exit;
}
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
    <form action="procesar_registro.php" method="post">
        <h2>Bienvenido, puedes registrar nuevos usuarios</h2>

        <label for="nuevo_usuario">Nuevo Usuario:</label>
        <input type="text" name="nuevo_usuario" required>

        <label for="nueva_contrasena">Nueva Contraseña:</label>
        <input type="password" name="nueva_contrasena" required>

        <label for="tipo_usuario">Estado:</label>
        <select name="tipo_usuario" required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
        </select>

        <label for="con_privilegios">Privilegios:</label>
        <select name="con_privilegios" required>
            <option value="1">Sí</option>
            <option value="0">No</option>
        </select>

        <input type="submit" value="Registrar Usuario">
    </form>

    <a href="dashboard.php" class="dashboard-btn">Volver al Dashboard</a>
</div>

</body>
</html>