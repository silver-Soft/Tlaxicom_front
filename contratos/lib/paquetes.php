<?php
declare(strict_types=1);

/**
 * Catalogo unico de paquetes. Lo usan el formulario (bienvenido.php) y el generador del contrato
 * (procesar_bienvenido.php), asi que megas, costo y folio ya no dependen de lo que envie el navegador.
 * Para cambiar un folio o una tarifa, edite SOLO este archivo.
 *
 * clave (valor del <option>) => etiqueta visible, megas, costo mensual, folio
 */
return [
    'Basico Wireless'      => ['etiqueta' => 'Básico Wireless',       'megas' => '10mb', 'costo' => 300, 'folio' => '2095208'],
    'Premium Wireless'     => ['etiqueta' => 'Premium Wireless',      'megas' => '20mb', 'costo' => 500, 'folio' => '2095289'],
    'Turbo Wireless'       => ['etiqueta' => 'Turbo Wireless',        'megas' => '30mb', 'costo' => 700, 'folio' => '2095343'],
    'Basico Fibra Optica'  => ['etiqueta' => 'Básico Fibra Óptica',   'megas' => '10mb', 'costo' => 300, 'folio' => '2099081'],
    'Premium Fibra Optica' => ['etiqueta' => 'Premium Fibra Óptica',  'megas' => '20mb', 'costo' => 500, 'folio' => '2099094'],
    'Turbo Fibra Optica'   => ['etiqueta' => 'Turbo Fibra Óptica',    'megas' => '30mb', 'costo' => 700, 'folio' => '2099119'],
];
