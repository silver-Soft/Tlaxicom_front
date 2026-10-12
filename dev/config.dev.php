<?php
// Configuracion SOLO para el entorno local de Docker. Valores de prueba, nada real.
return [
    'debug' => true,
    'db' => ['host' => 'localhost', 'user' => 'tlaxicom_tlaxi', 'pass' => 'dev_password_local', 'name' => 'tlaxicom_contratos'],
    'smtp' => [
        'host' => 'mailpit', 'port' => 1025, 'auth' => false, 'secure' => '',
        'user' => '', 'pass' => '',
        'from' => 'contratos@tlaxicom.test', 'from_name' => 'Tlaxicom',
        'cc' => 'copia@tlaxicom.test', 'cc_name' => 'Contratos Tlaxicom',
    ],
    'pagos' => [
        'efectivo' => ['titular' => 'Punto de pago de prueba', 'linea1' => 'Calle de prueba 123', 'linea2' => 'Lunes a domingo 09:00 am a 05:00 pm'],
        'transferencia' => ['titular' => 'Titular de prueba', 'linea1' => 'No. de cuenta: 0000000000', 'linea2' => 'Tarjeta: 0000 0000 0000 0000'],
    ],
];
