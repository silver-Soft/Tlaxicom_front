<?php
require __DIR__ . '/lib/bootstrap.php';
tlx_requiere_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: bienvenido.php');
    exit;
}

// Si el envio supera post_max_size, PHP descarta $_POST y $_FILES por completo.
if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    http_response_code(413);
    exit('Las fotografías pesan demasiado (límite del servidor: ' . e(ini_get('post_max_size')) . ' en total). Use fotos más ligeras e intente de nuevo. <a href="bienvenido.php">Regresar</a>');
}
tlx_csrf_verificar();

// Las fotos de camara se decodifican en memoria (GD): damos margen para imagenes de 20+ megapixeles.
if ((int) ini_get('memory_limit') !== -1 && (int) ini_get('memory_limit') < 384) {
    @ini_set('memory_limit', '384M');
}
@set_time_limit(120);

$usuario = (string) $_SESSION['usuario'];
session_write_close(); // libera el bloqueo de sesion: generar el PDF y enviar el correo puede tardar

require __DIR__ . '/lib/contrato.php';

/** Pagina de error sencilla; $detalle ya viene escapado o es texto fijo. */
function tlx_error_pagina(int $codigo, string $titulo, array $lineas): void
{
    http_response_code($codigo);
    echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
       . '<title>' . e($titulo) . '</title></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;">'
       . '<h2 style="color:#c0392b;">' . e($titulo) . '</h2><ul>';
    foreach ($lineas as $linea) {
        echo '<li>' . e($linea) . '</li>';
    }
    echo '</ul><p><a href="javascript:history.back()">Regresar al formulario</a> (sus datos se conservan)</p></body></html>';
    exit;
}

[$datos, $errores] = tlx_contrato_datos();
if ($errores) {
    tlx_error_pagina(422, 'No se pudo generar el contrato', $errores);
}

try {
    $pdf = tlx_contrato_pdf($datos);
    tlx_contrato_enviar($datos, $pdf, $usuario);
} catch (\Throwable $ex) {
    error_log('Tlaxicom: error al generar/enviar contrato (' . get_class($ex) . '): ' . $ex->getMessage());
    tlx_error_pagina(500, 'Ocurrió un error', [
        'No fue posible generar o enviar el contrato. Intente de nuevo; si el problema continúa, avise al administrador.',
    ]);
}

header('Location: mensaje_exito.php');
exit;
