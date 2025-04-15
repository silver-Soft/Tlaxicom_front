<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
echo "<!-- Sesión iniciada correctamente -->";
include("conexion.php");

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}

$usuario = $_SESSION['usuario'];


?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            overflow-x: hidden;
        }

        .sidebar {
            height: 100%;
            width: 250px;
            position: fixed;
            z-index: 1;
            top: 0;
            left: -250px;
            background-color: #111;
            padding-top: 20px;
            color: white;
            transition: left 0.3s;
        }

        .sidebar a {
            padding: 15px;
            text-decoration: none;
            font-size: 18px;
            color: #818181;
            display: block;
            transition: 0.3s;
        }

        .sidebar a:hover {
            color: #f1f1f1;
        }

        .sidebar h2, .sidebar p {
            text-align: center;
        }

        .main-content {
            margin-left: 0;
            padding: 20px;
            flex: 1;
            transition: margin-left 0.3s;
        }

        .logout-btn {
            background-color: #0991cf;
            color: white;
            padding: 10px 15px;
            border: none;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
        }

        .toggle-sidebar-btn {
            display: none;
            background-color: #0991cf;
            color: white;
            padding: 10px;
            border: none;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
            position: fixed;
            top: 10px;
            left: 10px;
        }

        @media screen and (max-width: 768px) {
            .sidebar {
                left: 0;
            }

            .main-content {
                margin-left: 250px;
            }

            .toggle-sidebar-btn {
                display: block;
            }
        }
    </style>
</head>
<body>

    <div class="sidebar" id="sidebar">
        <h2>Dashboard</h2>
        <p>Bienvenido, Usuario</p>
        <a href="dashboard.php">Inicio</a>
        <a href="../contratos/bienvenido.php">Realizar Contrato</a>
        <a href="registro.php">Registrar Nuevo Usuario</a>
        <a href="../contratos/lista_usuarios.php">Lista de Usuarios</a>
        <a href="../contratos/logout.php" class="logout-btn">Cerrar sesión</a>
    </div>

    <div class="main-content">
        <button class="toggle-sidebar-btn" onclick="toggleSidebar()">Despliega el Menú</button>        
    </div>

    <script>
        function toggleSidebar() {
            var sidebar = document.getElementById('sidebar');
            var mainContent = document.querySelector('.main-content');
            var isVisible = sidebar.style.left === '0px';
            
            sidebar.style.left = isVisible ? '-250px' : '0';
            mainContent.style.marginLeft = isVisible ? '0' : '250px';
        }
    </script>
</body>
</html>