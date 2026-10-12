<?php
// Copie este archivo como /home/<cuenta>/config/tlaxicom.php (FUERA de public_html)
// o como contratos/config.local.php, y llene los valores reales. NO lo suba al repo.
return [
    'debug' => false,
    // 'storage_dir' => '/home/<cuenta>/tlaxicom_storage',   // logs y bloqueos de login; opcional
    'db' => ['host' => 'localhost', 'user' => 'USUARIO_BD', 'pass' => 'CONTRASENA_BD', 'name' => 'tlaxicom_contratos'],
    'smtp' => [
        'host' => 'smtp.titan.email', 'port' => 465, 'auth' => true, 'secure' => 'ssl',
        'user' => 'contratos@tlaxicom.com', 'pass' => 'CONTRASENA_CORREO',
        'from' => 'contratos@tlaxicom.com', 'from_name' => 'Tlaxicom',
        'cc' => 'contratostlaxicom@gmail.com', 'cc_name' => 'Contratos Tlaxicom',
    ],
    // Texto que se imprime en el contrato segun el metodo de pago elegido
    'pagos' => [
        'efectivo' => ['titular' => 'NOMBRE DEL PUNTO DE PAGO', 'linea1' => 'DIRECCION', 'linea2' => 'HORARIO'],
        'transferencia' => ['titular' => 'TITULAR', 'linea1' => 'No. de cuenta: XXXXXXXXXX', 'linea2' => 'Tarjeta: XXXX XXXX XXXX XXXX'],
    ],
];
