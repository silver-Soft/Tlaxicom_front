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

        a {
            text-decoration: none;
            color: #0991cf;
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
            transition: background-color 0.3s;
        }

        .dashboard-btn:hover {
            background-color: #077bb5;
        }

    
        .no-permission {
            text-align: center;
            margin-top: 20px;
            color: #ff0000;
        }
    </style>
</head>
<body>

<div class="container">
    <?php
    session_start();

   
    if (isset($_SESSION['privilegios']) && $_SESSION['privilegios'] == true) {
        
        echo "<form action='procesar_registro.php' method='post'>";
        echo "<h2>Bienvenido, Puedes registrar nuevos usuarios.</h2>";
       
        ?>
        <label for="nuevo_usuario">Nuevo Usuario:</label>
        <input type="text" name="nuevo_usuario" required>
        <br>
        <label for="nueva_contrasena">Nueva Contraseña:</label>
        <input type="password" name="nueva_contrasena" required>
        <br>
        <label for="tipo_usuario">Tipo de Usuario:</label>
        <select name="tipo_usuario" required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
        </select>
        <br>
        <label for="con_privilegios">Con Privilegios:</label>
        <select name="con_privilegios" required>
            <option value="1">Sí</option>
            <option value="0">No</option>
        </select>
        <br>
        <input type="submit" value="Registrar Usuario">
        </form>

        <a href="dashboard.php" class="dashboard-btn">Volver al Dashboard</a>
        
        <?php
    } else {
        
        echo "<div class='no-permission'>No tienes permisos para acceder a esta página. <a href='../contratos/dashboard.php'>Volver al inicio</a></div>";
    }
    ?>
</div>

</body>
</html>
