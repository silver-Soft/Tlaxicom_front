<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$usuario_db = "tlaxicom_tlaxi";
$contrasena_db = "Test12345$#A";
$base_datos = "tlaxicom_contratos";

$conexion = mysqli_connect($host, $usuario_db, $contrasena_db, $base_datos);

if (!$conexion) {
    die("❌ Error al conectar a la base de datos: " . mysqli_connect_error());
}

echo "✅ Conexión exitosa a la base de datos.";
?>
