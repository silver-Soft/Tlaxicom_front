<?php
session_start();
include("conexion.php");

// ✅ Validar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: login.php");
    exit;
}

// ✅ Validar datos
if (empty($_POST['usuario']) || empty($_POST['contrasena'])) {
    echo "Datos incompletos. <a href='login.php'>Volver</a>";
    exit;
}

$usuario = trim($_POST['usuario']);
$contrasena = $_POST['contrasena'];

// ✅ Traer solo 1 usuario
$consulta = $conexion->prepare("SELECT * FROM usuarios WHERE usuario = ? LIMIT 1");
$consulta->bind_param("s", $usuario);
$consulta->execute();
$resultado = $consulta->get_result();

if ($resultado->num_rows === 1) {

    $fila = $resultado->fetch_assoc();

    // 🔐 Validar contraseña
    if (password_verify($contrasena, $fila['contrasena'])) {

        // 🔒 Validar estado
        if ($fila['estado'] === 'activo') {

            // 🔐 Seguridad de sesión
            session_regenerate_id(true);

            $_SESSION['usuario'] = $fila['usuario'];
            $_SESSION['privilegios'] = (int)$fila['privilegios'];

            header("Location: dashboard.php");
            exit;

        } else {
            echo "Tu cuenta está inhabilitada. <a href='login.php'>Volver</a>";
        }

    } else {
        echo "Usuario o contraseña incorrectos. <a href='login.php'>Volver</a>";
    }

} else {
    echo "Usuario o contraseña incorrectos. <a href='login.php'>Volver</a>";
}

$consulta->close();
mysqli_close($conexion);