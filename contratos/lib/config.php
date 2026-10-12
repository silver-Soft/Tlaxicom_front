<?php
declare(strict_types=1);

/**
 * Carga la configuracion privada (credenciales, datos de pago). NUNCA va en el repo.
 * Se busca, en orden:
 *   1. variable de entorno TLAXICOM_CONFIG (ruta al archivo)
 *   2. <carpeta de la cuenta>/config/tlaxicom.php   (fuera de public_html; recomendado en produccion)
 *   3. contratos/config.local.php                  (bloqueado por contratos/.htaccess)
 * Ver config.example.php para el formato.
 *
 * Sin argumento devuelve todo el arreglo; con una ruta "a.b.c" devuelve ese valor (o null).
 */
function tlx_config(?string $path = null)
{
    static $config = null;
    if ($config === null) {
        $candidatos = array_filter([
            getenv('TLAXICOM_CONFIG') ?: null,
            dirname(__DIR__, 3) . '/config/tlaxicom.php',
            dirname(__DIR__) . '/config.local.php',
        ]);
        foreach ($candidatos as $archivo) {
            if (is_file($archivo) && is_readable($archivo)) {
                $config = require $archivo;
                break;
            }
        }
        if (!is_array($config)) {
            error_log('Tlaxicom: no se encontro el archivo de configuracion. Buscado en: ' . implode(', ', $candidatos));
            http_response_code(500);
            exit('El sistema no esta configurado. Contacte al administrador.');
        }
    }
    if ($path === null) {
        return $config;
    }
    $valor = $config;
    foreach (explode('.', $path) as $clave) {
        if (!is_array($valor) || !array_key_exists($clave, $valor)) {
            return null;
        }
        $valor = $valor[$clave];
    }
    return $valor;
}
