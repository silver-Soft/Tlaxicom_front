<?php
session_start();
include("conexion.php");

// 🔐 Validar sesión
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}

// 🔐 Validar privilegios
if (!isset($_SESSION['privilegios']) || (int)$_SESSION['privilegios'] !== 1) {
    echo "No tienes permisos para realizar esta acción.";
    exit;
}

// ✅ Validar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: registro.php");
    exit;
}

// ✅ Obtener datos
$nuevo_usuario = trim($_POST['nuevo_usuario']);
$nueva_contrasena = $_POST['nueva_contrasena'];
$estado = $_POST['tipo_usuario'];
$privilegios = (int)$_POST['con_privilegios'];

// ✅ Validaciones básicas
if (empty($nuevo_usuario) || empty($nueva_contrasena)) {
    echo "Datos incompletos. <a href='registro.php'>Volver</a>";
    exit;
}

// 🔐 Hashear contraseña
$contrasena_encriptada = password_hash($nueva_contrasena, PASSWORD_DEFAULT);

// ✅ Insertar directamente (ya confiamos en UNIQUE)
$insert = $conexion->prepare("
    INSERT INTO usuarios (usuario, contrasena, estado, privilegios) 
    VALUES (?, ?, ?, ?)
");

$insert->bind_param("sssi", $nuevo_usuario, $contrasena_encriptada, $estado, $privilegios);

// 🚀 Ejecutar y manejar errores
if ($insert->execute()) {

    echo "<div style='text-align:center; margin-top:50px; font-family:Arial; color:green;'>
            Usuario registrado correctamente.<br>
            <a href='registro.php'>Registrar otro</a>
          </div>";

} else {

    // 🔥 Manejo de usuario duplicado (UNIQUE)
    if ($conexion->errno == 1062) {
        echo "El usuario ya existe. <a href='registro.php'>Volver</a>";
    } else {
        echo "Error al registrar: " . $conexion->error;
    }

}

$insert->close();
$conexion->close();
?>