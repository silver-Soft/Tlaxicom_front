<?php
session_start();
include("conexion.php");


if (isset($_SESSION['privilegios']) && $_SESSION['privilegios'] == true) {
    
    if (isset($_GET['id']) && isset($_GET['accion'])) {
        $id_usuario = $_GET['id'];
        $accion = $_GET['accion'];

     
        switch ($accion) {
            case 'habilitar':
                $consulta_accion = "UPDATE usuarios SET estado='activo' WHERE id=$id_usuario";
                break;

            case 'deshabilitar':
                $consulta_accion = "UPDATE usuarios SET estado='inactivo' WHERE id=$id_usuario";
                break;

            case 'eliminar':
                $consulta_accion = "DELETE FROM usuarios WHERE id=$id_usuario";
                break;

            default:
                echo "Acción no válida.";
                exit();
        }

        $resultado_accion = mysqli_query($conexion, $consulta_accion);

       
        if ($resultado_accion) {
            echo "Acción realizada correctamente.";
        } else {
            echo "Error al realizar la acción: " . mysqli_error($conexion);
        }
    } else {
        echo "Falta el ID del usuario o la acción.";
    }
} else {
    echo "No tienes permisos para acceder a esta página. <a href='../contratos/dashboard.php'>Volver al inicio</a>";
}

mysqli_close($conexion);
?>
