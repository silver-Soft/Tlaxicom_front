<?php
declare(strict_types=1);

/**
 * Validacion de la solicitud, generacion del PDF del contrato y envio por correo.
 * Las coordenadas del PDF (mm) son las del modulo original: no cambiarlas sin probar contra la plantilla.
 */

use PHPMailer\PHPMailer\PHPMailer;

const TLX_SIN_DATO = '-------';
const TLX_MAX_TEXTO = 120;
const TLX_MAX_FOTO_BYTES = TLX_MAX_FOTO_MB * 1024 * 1024;
const TLX_MAX_FIRMA_BYTES = 2 * 1024 * 1024;

function tlx_mayus(string $texto): string
{
    return function_exists('mb_strtoupper') ? mb_strtoupper($texto, 'UTF-8') : strtoupper($texto);
}

function tlx_texto(string $campo, bool $mayusculas = false): string
{
    $valor = $_POST[$campo] ?? '';
    $valor = is_string($valor) ? trim($valor) : '';
    $valor = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $valor) ?? '';
    $valor = function_exists('mb_substr') ? mb_substr($valor, 0, TLX_MAX_TEXTO, 'UTF-8') : substr($valor, 0, TLX_MAX_TEXTO);
    return $mayusculas ? tlx_mayus($valor) : $valor;
}

function tlx_fecha_es(DateTimeInterface $fecha): string
{
    $meses = [1 => 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return $fecha->format('d') . ' ' . $meses[(int) $fecha->format('n')] . ' ' . $fecha->format('Y');
}

/**
 * Lee y valida $_POST/$_FILES.
 * @return array{0: array, 1: string[]} [datos, errores]
 */
function tlx_contrato_datos(): array
{
    $errores = [];
    $paquetes = require __DIR__ . '/paquetes.php';
    $pagos = tlx_config('pagos') ?? [];

    $d = [
        'nombre' => tlx_texto('nombre', true),
        'apellido1' => tlx_texto('apellido1', true),
        'apellido2' => tlx_texto('apellido2', true),
        'calle' => tlx_texto('calle', true),
        'num_ext' => tlx_texto('num_ext'),
        'num_int' => tlx_texto('num_int'),
        'colonia' => tlx_texto('colonia', true),
        'municipio' => tlx_texto('alcaldia_municipio', true),
        'estado' => tlx_texto('estado', true),
        'cp' => tlx_texto('cp'),
        'telefono' => tlx_texto('telefono'),
        'marca' => tlx_texto('marca', true),
        'modelo' => tlx_texto('modelo', true),
        'serie' => tlx_texto('serie') ?: 'N/A',
        'equipo' => tlx_texto('equipo', true),
        'fecha' => tlx_texto('fecha'),
        'hora' => tlx_texto('hora'),
        'correo' => tlx_texto('correo'),
    ];

    foreach (['nombre' => 'Nombre', 'apellido1' => 'Apellido paterno', 'apellido2' => 'Apellido materno', 'calle' => 'Calle',
              'num_ext' => 'Número exterior', 'colonia' => 'Colonia', 'municipio' => 'Alcaldía/Municipio', 'estado' => 'Estado',
              'cp' => 'C.P.', 'telefono' => 'Teléfono', 'marca' => 'Marca', 'modelo' => 'Modelo', 'equipo' => 'No. de equipos'] as $k => $etiqueta) {
        if ($d[$k] === '') {
            $errores[] = "Falta el campo: $etiqueta.";
        }
    }

    // Paquete: megas, costo y folio salen del catalogo del servidor, no del navegador.
    $clave = tlx_texto('paquete');
    if (!isset($paquetes[$clave])) {
        $errores[] = 'Seleccione un paquete válido.';
        $paquete = ['megas' => '', 'costo' => 0, 'folio' => ''];
    } else {
        $paquete = $paquetes[$clave];
    }
    $d['paquete'] = tlx_mayus($clave);
    $d['megas'] = $paquete['megas'];
    $d['tarifa'] = (string) $paquete['costo'];
    $d['folio'] = $paquete['folio'];

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $d['fecha']) || !checkdate((int) substr($d['fecha'], 5, 2), (int) substr($d['fecha'], 8, 2), (int) substr($d['fecha'], 0, 4))) {
        $errores[] = 'La fecha de instalación no es válida.';
    }
    // "N de cada mes": el dia de pago es el dia de la instalacion (sin cero a la izquierda)
    $d['dia_pago'] = (int) substr($d['fecha'], 8, 2);
    if (!preg_match('/^\d{2}:\d{2}$/', $d['hora'])) {
        $errores[] = 'La hora de instalación no es válida.';
    }

    // Fecha del contrato ("lugar y fecha" de la pagina 2): la del formulario si viene y es valida; si no, hoy.
    $fechaContrato = new DateTimeImmutable('today');
    $f2 = tlx_texto('fecha_2');
    if ($f2 !== '') {
        $obj = DateTimeImmutable::createFromFormat('!Y-m-d', $f2);
        if ($obj instanceof DateTimeImmutable && $obj->format('Y-m-d') === $f2) {
            $fechaContrato = $obj;
        }
    }
    $d['fecha_contrato'] = tlx_fecha_es($fechaContrato);

    // Metodo de pago -> textos del recuadro (configurados fuera del repo). Sin seleccion = efectivo, como antes.
    $opcion = tlx_texto('opciones');
    $d['opcion'] = $opcion === 'opcion2' ? 'opcion2' : 'opcion1';
    $pago = $pagos[$d['opcion'] === 'opcion2' ? 'transferencia' : 'efectivo'] ?? null;
    if (!is_array($pago)) {
        $errores[] = 'El método de pago no está configurado en el servidor.';
        $pago = ['titular' => '', 'linea1' => '', 'linea2' => ''];
    }
    $d['pago'] = $pago;

    // Servicios adicionales
    $d['servicios'] = [];
    for ($i = 1; $i <= 2; $i++) {
        $d['servicios'][$i] = [
            'servicio' => tlx_texto("servicio$i", true) ?: TLX_SIN_DATO,
            'descripcion' => tlx_texto("descripcion$i", true) ?: TLX_SIN_DATO,
            'costo' => tlx_texto("costo$i", true) ?: TLX_SIN_DATO,
        ];
    }
    if (tlx_texto('opciones_servicios') !== 'si') {
        foreach ($d['servicios'] as $i => $_) {
            $d['servicios'][$i] = ['servicio' => TLX_SIN_DATO, 'descripcion' => TLX_SIN_DATO, 'costo' => TLX_SIN_DATO];
        }
    }

    // Correo (opcional: sin correo el contrato solo se envia a la copia interna)
    if ($d['correo'] !== '' && !filter_var($d['correo'], FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'El correo electrónico no es válido.';
    }

    // Firma (PNG en data URL)
    $d['firma'] = null;
    $firma = $_POST['firma'] ?? '';
    if (is_string($firma) && preg_match('#^data:image/png;base64,([A-Za-z0-9+/=\s]+)$#', $firma, $m)) {
        $bin = base64_decode($m[1], true);
        if ($bin !== false && strlen($bin) <= TLX_MAX_FIRMA_BYTES && @getimagesizefromstring($bin) !== false) {
            $d['firma'] = $bin;
        }
    }
    if ($d['firma'] === null) {
        $errores[] = 'Falta la firma del suscriptor (o no es válida).';
    }

    // Fotos del INE (opcionales a nivel servidor, como antes; si se envian deben ser imagenes validas)
    $d['fotos'] = [];
    foreach (['foto1', 'foto2'] as $campo) {
        $f = $_FILES[$campo] ?? null;
        if (!is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($f['error'] !== UPLOAD_ERR_OK) {
            $motivo = in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
                ? 'pesa más de lo que permite el servidor (' . ini_get('upload_max_filesize') . ')'
                : "no se recibió completa (error de carga {$f['error']})";
            $errores[] = ucfirst($campo) . " $motivo. Use una foto más ligera.";
            continue;
        }
        $info = is_uploaded_file($f['tmp_name']) && $f['size'] <= TLX_MAX_FOTO_BYTES ? @getimagesize($f['tmp_name']) : false;
        if ($info === false || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG], true)) {
            $errores[] = "$campo debe ser una imagen JPG o PNG de hasta " . TLX_MAX_FOTO_MB . ' MB. Tome una nueva foto o reduzca la calidad de la cámara.';
            continue;
        }
        $d['fotos'][$campo] = tlx_foto_optimizada($f['tmp_name'], $info[2]);
    }

    return [$d, $errores];
}

/**
 * Reduce fotos de camara (varios MB) a un tamano suficiente para el contrato y corrige la rotacion EXIF.
 * Devuelve los bytes de la imagen para pasarlos a TCPDF con el prefijo "@".
 */
function tlx_foto_optimizada(string $ruta, int $tipo): string
{
    $original = (string) file_get_contents($ruta);
    if (!function_exists('imagecreatefromstring')) {
        return $original;
    }
    $img = @imagecreatefromstring($original);
    if ($img === false) {
        return $original;
    }
    if ($tipo === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $exif = @exif_read_data($ruta);
        $giro = [3 => 180, 6 => -90, 8 => 90][$exif['Orientation'] ?? 0] ?? 0;
        if ($giro !== 0 && ($rotada = imagerotate($img, $giro, 0)) !== false) {
            $img = $rotada;
        }
    }
    $maxLado = 1600;
    $w = imagesx($img);
    $h = imagesy($img);
    if (max($w, $h) > $maxLado) {
        $escala = $maxLado / max($w, $h);
        $nueva = imagecreatetruecolor((int) round($w * $escala), (int) round($h * $escala));
        imagecopyresampled($nueva, $img, 0, 0, 0, 0, imagesx($nueva), imagesy($nueva), $w, $h);
        $img = $nueva;
    }
    ob_start();
    imagejpeg($img, null, 85);
    return (string) ob_get_clean();
}

/** Genera el PDF del contrato y devuelve su contenido binario. */
function tlx_contrato_pdf(array $d): string
{
    require_once dirname(__DIR__) . '/TCPDF/tcpdf.php';
    $dirImg = dirname(__DIR__) . '/contrato_en_img/';

    $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Tlaxicom');
    $pdf->SetTitle('Contrato');
    $pdf->SetCompression(true);
    $pdf->SetTextColor(22, 32, 42);
    $pdf->SetFillColor(255, 255, 255);

    // Pagina de fondo = imagen de la plantilla; luego se imprimen los textos [x, y, texto].
    $pagina = function (string $plantilla, array $textos = []) use ($pdf, $dirImg): void {
        $pdf->AddPage();
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Image($dirImg . $plantilla, 15, 0, $pdf->getPageWidth(), $pdf->getPageHeight() - 5, '', '', '', false, 300, '', false, false, 0);
        foreach ($textos as [$x, $y, $texto]) {
            $pdf->Text($x, $y, (string) $texto);
        }
    };
    $firma = '@' . $d['firma'];

    // ---- Pagina 1 ----
    $pagina('contrato1.jpg', [
        [30, 48, $d['nombre']], [100, 48, $d['apellido1']], [160, 48, $d['apellido2']],
        [17, 69, $d['calle']], [82, 69, $d['num_ext']], [91, 69, $d['num_int']], [106, 69, $d['colonia']],
        [132, 69, $d['municipio']], [162, 69, $d['estado']], [190, 69, $d['cp']],
        [85, 83, $d['telefono']],
        [20, 125, $d['paquete'] . ' ' . $d['megas']],
        [129, 115, $d['tarifa']],
        [100, 99.5, '$' . $d['tarifa'] . '.00'],
        [103, 103.5, $d['folio']],
        [60, 162, $d['marca']], [60, 168, $d['modelo']], [60, 174, $d['serie']], [60, 178, $d['equipo']],
        [124, 168, $d['fecha']], [174, 168, $d['hora']],
        [150, 162, $d['calle']],
        // Recuadro del metodo de pago: casilla "X" + titular y dos lineas
        [81, 212, $d['pago']['titular']], [81, 216, $d['pago']['linea1']], [81, 220, $d['pago']['linea2']],
        [20, $d['opcion'] === 'opcion2' ? 216 : 208, 'X'],
    ]);
    // La plantilla trae impreso "10 DE CADA MES": se tapa la celda y se escribe el dia real de instalacion.
    $pdf->Rect(182.1, 96.6, 21.4, 14.6, 'F');
    $pdf->SetFont('helvetica', 'B', 9);
    $pdf->Text(183.9, 99.8, $d['dia_pago'] . ' de cada');
    $pdf->Text(183.9, 104.0, 'mes');
    $pdf->SetFont('helvetica', '', 10);
    $pdf->Image($firma, 90, 235, 35, 25);

    // ---- Pagina 2 ----
    $notifica = $d['correo'] !== '' ? 'X' : '';
    $s1 = $d['servicios'][1];
    $s2 = $d['servicios'][2];
    $pagina('2.jpg', [
        [77, 105, $d['correo']],
        [88, 213, $d['municipio']], [113, 213, $d['fecha_contrato']],
        [42, 100, $notifica], [115, 100, $notifica], [177, 100, $notifica],
        [30, 47, $s1['servicio']], [120, 47, $s2['servicio']],
        [25, 60, $s1['descripcion']], [115, 60, $s2['descripcion']],
        [103, 53, $s1['costo']], [190, 53, $s2['costo']],
    ]);
    foreach ([[158, 97, 35, 25], [168, 115, 35, 25], [50, 110, 35, 25], [112, 220, 50, 30]] as [$x, $y, $w, $h]) {
        $pdf->Image($firma, $x, $y, $w, $h);
    }

    // ---- Paginas 3 a 6: solo plantilla ----
    foreach (['3.jpg', '4.jpg', '5.jpg', '6.jpg'] as $plantilla) {
        $pagina($plantilla);
    }

    // ---- Pagina 7: fotos del INE ----
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 10);
    // Cada foto se ajusta DENTRO de su recuadro (70 x 80 mm) conservando su proporcion, anclada arriba a la izquierda.
    foreach (['foto1' => 10, 'foto2' => 100] as $campo => $y) {
        if (isset($d['fotos'][$campo])) {
            $pdf->Image('@' . $d['fotos'][$campo], 10, $y, 70, 80, '', '', '', false, 300, '', false, false, 0, 'LT');
        }
    }

    return $pdf->Output('', 'S');
}

/** Nombre de archivo seguro: sin acentos, espacios ni caracteres raros. */
function tlx_nombre_archivo(string ...$partes): string
{
    $texto = implode('', $partes);
    $limpio = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $texto) : $texto;
    return preg_replace('/[^A-Za-z0-9_-]+/', '', (string) $limpio) ?? '';
}

/**
 * Envia el contrato. Sin correo del cliente se manda solo a la copia interna (comportamiento original).
 * @throws \PHPMailer\PHPMailer\Exception
 */
function tlx_contrato_enviar(array $d, string $pdf, string $usuario): void
{
    require_once dirname(__DIR__) . '/PHPMailer/src/PHPMailer.php';
    require_once dirname(__DIR__) . '/PHPMailer/src/SMTP.php';
    require_once dirname(__DIR__) . '/PHPMailer/src/Exception.php';

    $smtp = tlx_config('smtp');
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtp['host'];
    $mail->Port = (int) $smtp['port'];
    $mail->SMTPAuth = (bool) $smtp['auth'];
    $mail->SMTPSecure = $smtp['secure'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : ($smtp['secure'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : '');
    $mail->SMTPAutoTLS = $smtp['secure'] !== '';
    if ($mail->SMTPAuth) {
        $mail->Username = $smtp['user'];
        $mail->Password = $smtp['pass'];
    }
    $mail->Timeout = 20;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    $mail->setFrom($smtp['from'], $smtp['from_name']);
    if ($d['correo'] !== '') {
        $mail->addAddress($d['correo']);
    }
    $mail->addCC($smtp['cc'], $smtp['cc_name']);
    $mail->Subject = 'Bienvenido a Tlaxicom';
    $mail->isHTML(true);

    $nombreCompleto = e(trim($d['nombre'] . ' ' . $d['apellido1'] . ' ' . $d['apellido2']));
    $mail->Body = '
<p>¡Hola ' . $nombreCompleto . '!</p>

<p style="text-align: justify">Es un placer informarte que tu contrato de servicio de internet ha sido procesado y está listo. Puedes encontrarlo adjunto a este correo electrónico. <br> Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.</p>

<p style="text-align: center">¡Bienvenido a bordo y gracias por elegir nuestros servicios!</p>

<p style="text-align: center">Saludos, Tlaxicom 🌐</p>

<hr style="margin: 20px 0;">

<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
    <tbody valign="middle">
        <tr valign="inherit">
            <td style="padding-right: 15px;" valign="inherit">
                <img src="https://tlaxicom.com/img/logo_tlaxicom.png" width="100" style="border-radius: 50%;" alt="Tlaxicom">
            </td>
            <td valign="inherit">
                <p style="margin: 8px 0 0 0; font-size: 14px;">📧
                    <a href="mailto:atencionaclientes@tlaxicom.com" style="color: #1a73e8; text-decoration: none;">atencionaclientes@tlaxicom.com</a>
                </p>
                <p style="margin: 0; font-size: 14px;">📞 241 137 8113</p>
                <p style="margin: 0; font-size: 14px;">🏢 Tlaxicom</p>
                <p style="margin: 0; font-size: 14px;">🌐
                    <a href="https://tlaxicom.com" style="color: #1a73e8; text-decoration: none;">www.tlaxicom.com</a>
                </p>
            </td>
        </tr>
    </tbody>
</table>
';
    $mail->AltBody = 'Hola ' . trim($d['nombre'] . ' ' . $d['apellido1'] . ' ' . $d['apellido2'])
        . ': tu contrato de servicio de internet de Tlaxicom está listo y va adjunto a este correo. Atención a clientes: atencionaclientes@tlaxicom.com, 241 137 8113.';

    $mail->addStringAttachment($pdf, tlx_nombre_archivo($d['nombre'], $d['apellido1'], $d['apellido2']) . '_' . tlx_nombre_archivo($usuario) . '_Contrato.pdf');

    // Derechos de usuario (archivo fisico del sitio)
    $derechos = realpath(dirname(__DIR__, 2) . '/docs/DerechosDeUsuario.pdf');
    if ($derechos !== false) {
        $mail->addAttachment($derechos, 'DerechosDeUsuario.pdf');
    } else {
        error_log('Tlaxicom: no se encontro docs/DerechosDeUsuario.pdf; el correo se envia sin ese adjunto.');
    }

    $mail->send();
}
