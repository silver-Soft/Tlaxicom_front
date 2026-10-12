<?php
declare(strict_types=1);

/**
 * Limite de intentos de login sin tocar la base de datos: un archivo JSON por clave en la carpeta privada.
 * Ventana de 15 minutos; maximo 5 fallos por usuario+IP y 20 por IP.
 */
const TLX_LOGIN_VENTANA = 900;
const TLX_LOGIN_MAX_USUARIO = 5;
const TLX_LOGIN_MAX_IP = 20;

function tlx_rl_archivo(string $clave): ?string
{
    $dir = tlx_storage_dir();
    return $dir === null ? null : $dir . '/rl_' . hash('sha256', $clave) . '.json';
}

/** @return int[] marcas de tiempo de los fallos dentro de la ventana */
function tlx_rl_leer(string $clave): array
{
    $archivo = tlx_rl_archivo($clave);
    if ($archivo === null || !is_file($archivo)) {
        return [];
    }
    $datos = json_decode((string) @file_get_contents($archivo), true);
    $limite = time() - TLX_LOGIN_VENTANA;
    return is_array($datos) ? array_values(array_filter($datos, fn($t) => is_int($t) && $t > $limite)) : [];
}

function tlx_rl_agregar(string $clave): void
{
    $archivo = tlx_rl_archivo($clave);
    if ($archivo === null) {
        return;
    }
    $fallos = tlx_rl_leer($clave);
    $fallos[] = time();
    @file_put_contents($archivo, json_encode($fallos), LOCK_EX);
}

function tlx_rl_claves(string $usuario): array
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return ['ip:' . $ip, 'usr:' . $ip . '|' . strtolower($usuario)];
}

/** Segundos que faltan para poder reintentar (0 = permitido). */
function tlx_login_bloqueado(string $usuario): int
{
    [$claveIp, $claveUsr] = tlx_rl_claves($usuario);
    foreach ([[$claveIp, TLX_LOGIN_MAX_IP], [$claveUsr, TLX_LOGIN_MAX_USUARIO]] as [$clave, $max]) {
        $fallos = tlx_rl_leer($clave);
        if (count($fallos) >= $max) {
            return max(1, min($fallos) + TLX_LOGIN_VENTANA - time());
        }
    }
    return 0;
}

function tlx_login_fallo(string $usuario): void
{
    foreach (tlx_rl_claves($usuario) as $clave) {
        tlx_rl_agregar($clave);
    }
}

function tlx_login_exito(string $usuario): void
{
    $archivo = tlx_rl_archivo(tlx_rl_claves($usuario)[1]);
    if ($archivo !== null && is_file($archivo)) {
        @unlink($archivo);
    }
}
