<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}


require('tcpdf/tcpdf.php');
require(__DIR__ . '/PHPMailer/src/PHPMailer.php');
require(__DIR__ . '/PHPMailer/src/SMTP.php');
require(__DIR__ . '/PHPMailer/src/Exception.php');



$nombre = strtoupper( $_POST['nombre']);
$apellido1 =strtoupper($_POST['apellido1']);
$apellido2 = strtoupper($_POST['apellido2']);
$calle = strtoupper($_POST['calle']);
$num_ext = $_POST['num_ext'];
$num_int = $_POST['num_int'];
$colonia = strtoupper($_POST['colonia']);
$alcaldia_municipio = strtoupper($_POST['alcaldia_municipio']);
$estado =  strtoupper($_POST['estado']);
$cp = $_POST['cp'];

$tefono = $_POST['telefono'];
$paquete = strtoupper($_POST['paquete']);    
$tarifa = $_POST['tarifa'];      
$marca = strtoupper($_POST['marca']);
$modelo = strtoupper($_POST['modelo']);
$serie = isset($_POST['serie']) ? $_POST['serie'] : 'N/A';





$equipo = strtoupper($_POST['equipo']);
$fecha = $_POST['fecha'];
$hora = $_POST['hora'];
$firmaBase64 = $_POST['firma'];


$opcionSeleccionada = $_POST['opciones'];



$fecha_2 = $_POST['fecha_2'];

$fechaObjeto = new DateTime($fecha_2);


$mesesEspañol = array(
    'January' => 'enero',
    'February' => 'febrero',
    'March' => 'marzo',
    'April' => 'abril',
    'May' => 'mayo',
    'June' => 'junio',
    'July' => 'julio',
    'August' => 'agosto',
    'September' => 'septiembre',
    'October' => 'octubre',
    'November' => 'noviembre',
    'December' => 'diciembre'
);


$mesEnEspañol = $mesesEspañol[$fechaObjeto->format('F')];


$fecha_2 = $fechaObjeto->format('d') . ' ' . $mesEnEspañol . ' ' . $fechaObjeto->format('Y');





$correo = $_POST['correo'];



if (!empty($correo)) {
    echo " $correo";
    $notificacion1 = 'X';
    $notificacion2 = 'X';
    $notificacion3 = 'X';
    
} else {
    echo "";
}

// 





$firmaTmp = tempnam(sys_get_temp_dir(), 'firma');
file_put_contents($firmaTmp, base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $firmaBase64)));


//---------
$servicio1 = strtoupper($_POST['servicio1']);
$descripcion1 = strtoupper($_POST['descripcion1']);
$costo1 = strtoupper($_POST['costo1']);

$servicio2 = strtoupper($_POST['servicio2']);
$descripcion2 = strtoupper($_POST['descripcion2']);
$costo2 = strtoupper($_POST['costo2']);





if ($opcionSeleccionada === 'opcion1') {
    $contenido = 'Carnicería "Sadot"';
             $conte4 ='Av. 27 de septiembre #11 Terrenate' ;
              $conte5 = 'lunes a domingo 09:00 am a 05:00 pm';
                 $contenido2 = 'X';

} elseif ($opcionSeleccionada === 'opcion2') {
    $contenido = 'Yonatan Ugarte Juárez';
                 $conte6 = 'No. de cuenta: 0478144451';
                 $conte7 = 'Tarjeta: 4555113012650786';
                  $contenido3 = 'X';
}



$plantillaPdf = 'CONTRATOEDITABLE.pdf';
$pdfSalida = 'CONTRATOEDITABLE_CON_DATOS.pdf';


$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Tlaxicom');
$pdf->SetTitle('Contrato');





$pdf->AddPage();


$pdf->SetFont('helvetica', '', 10);


$templateImg = 'contrato_en_img/contrato1.jpg';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);






$pdf->SetTextColor(22, 32, 42);


$pdf->SetFillColor(255, 255, 255);


$pdf->SetXY(30, 48);
$pdf->Text(30, 48, $nombre);
$pdf->SetXY(100, 48);
$pdf->Text(100, 48, $apellido1);
$pdf->SetXY(160, 48);
$pdf->Text(160, 48, $apellido2);
$pdf->SetXY(35, 69); 
$pdf->Text(35, 69, $calle);
$pdf->SetXY(82, 69); 
$pdf->Text(82, 69, $num_ext);
$pdf->SetXY(91, 69); 
$pdf->Text(91, 69, $num_int);
$pdf->SetXY(106, 69); 
$pdf->Text(106, 69, $colonia);
$pdf->SetXY(132, 69); 
$pdf->Text(132, 69, $alcaldia_municipio);

$pdf->SetXY(162, 69); 
$pdf->Text(162, 69, $estado);
$pdf->SetXY(190, 69); 
$pdf->Text(190, 69, $cp);
$pdf->SetXY(85, 83); 
$pdf->Text(85, 83, $tefono);


$pdf->SetXY(40, 125); 
$pdf->Text(40, 125, $paquete);
$pdf->SetXY(129, 115); 
$pdf->Text(129, 115, $tarifa);


$pdf->SetXY(60, 162); 
$pdf->Text(60, 162, $marca);
$pdf->SetXY(60, 168); 
$pdf->Text(60, 168, $modelo);
$pdf->SetXY(60, 174); 
$pdf->Text(60, 174, $serie);
$pdf->SetXY(60, 178); 
$pdf->Text(60, 178, $equipo);




$pdf->SetXY(124, 168); 
$pdf->Text(124, 168, $fecha);
$pdf->SetXY(174, 168); 
$pdf->Text(174, 168, $hora);
$pdf->SetXY(150,162);
$pdf->Text(150,162, $calle);
$pdf->SetXY(-50,-50);
$pdf->Text(-50,-50, $opcionSeleccionada);

$pdf->SetXY(81,212);
$pdf->Text(81,212, $contenido);

$pdf->SetXY(81,216);
$pdf->Text(81,216, $conte4);
$pdf->SetXY(81,220);
$pdf->Text(81,220, $conte5);


$pdf->SetXY(81,216);
$pdf->Text(81,216, $conte6);
$pdf->SetXY(81,220);
$pdf->Text(81,220, $conte7);




$pdf->SetXY(81,218);
$pdf->Text(20,208, $contenido2);
$pdf->SetXY(81,218);
$pdf->Text(20,216, $contenido3);
$pdf->SetXY(150,161);


$pdf->Image($firmaTmp, 90, 235, 35, 25);





// Agregar una página
$pdf->AddPage();

// Configurar fuentes y letra
$pdf->SetFont('helvetica', '', 10);

// Cargar la plantilla como fondo 
$templateImg = 'contrato_en_img/2.jpg';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);






$pdf->SetXY(77,105);
$pdf->Text(77,105, $correo);
// Insertar la imagen de la firma en el PDF
$pdf->Image($firmaTmp, 158, 97, 35, 25);

$pdf->Image($firmaTmp, 168, 115, 35, 25);

// Insertar la imagen de la firma en el PDF
$pdf->Image($firmaTmp, 50, 110, 35, 25);


$pdf->SetXY(88, 213); 
$pdf->Text(88, 213, $alcaldia_municipio);

$pdf->SetXY(113,213);
$pdf->Text(113,213, $fecha_2);
// Insertar la imagen de la firma en el PDF
$pdf->Image($firmaTmp, 112, 220, 50, 30);


$pdf->SetXY(42,100);
$pdf->Text(42,100, $notificacion1);
$pdf->SetXY(115,100);
$pdf->Text(115,100, $notificacion2);
$pdf->SetXY(177,100);
$pdf->Text(177,100, $notificacion3);




$pdf->SetXY(30,47);
$pdf->Text(30,47, $servicio1);

$pdf->SetXY(120,47);
$pdf->Text(120,47, $servicio2);

$pdf->SetXY(25,60);
$pdf->Text(25,60, $descripcion1);

$pdf->SetXY(115,60);
$pdf->Text(115,60, $descripcion2);

$pdf->SetXY(103,53);
$pdf->Text(103,53, $costo1);

$pdf->SetXY(190,53);
$pdf->Text(190,53, $costo2);










$imagenWidth = 85; 
$imagenHeight = 50; 

$pdf->AddPage();

$pdf->SetFont('helvetica', '', 10);

// Cargar la plantilla como fondo 
$templateImg = 'contrato_en_img/3.jpg';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);



$pdf->AddPage();


$pdf->SetFont('helvetica', '', 10);

 
$templateImg = 'contrato_en_img/4.jpg';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);



$pdf->AddPage();


$pdf->SetFont('helvetica', '', 10);

$templateImg = 'contrato_en_img/5.jpg';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);


$pdf->AddPage();

$pdf->SetFont('helvetica', '', 10);


$templateImg = 'contrato_en_img/6.jpg';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);

$pdf->AddPage();


$pdf->SetFont('helvetica', '', 10);


$templateImg = '';  
$pdf->Image($templateImg, 15, 0, $pdf->getPageWidth()*1, $pdf->getPageHeight()-5, '', '', '', false, 300, '', false, false, 0);




if (isset($_FILES['foto1']) && $_FILES['foto1']['error'] == 0) {
    $foto1Tmp = $_FILES['foto1']['tmp_name'];

   
    $pdf->Image($foto1Tmp, 10, 10, 70,80); 
}

if (isset($_FILES['foto2']) && $_FILES['foto2']['error'] == 0) {
    $foto1Tmp = $_FILES['foto2']['tmp_name'];


    $pdf->Image($foto1Tmp, 10, 100, 70,80); 
}





use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


$pdf->SetCompression(true);
$pdf->Output('php://temp/maxmemory', 'F'); 

// Configurar PHPMailer
$mail = new PHPMailer();
$mail->isSMTP();
$mail->Host = 'mail.tlaxicom.com';
$mail->Port = 465;
$mail->SMTPAuth = true;
$mail->Username = 'contratos@tlaxicom.com';
$mail->Password = 'Tlaxicom_2024';
$mail->SMTPSecure = 'ssl'; 


$mail->setFrom('contratos@tlaxicom.com', 'Tlaxicom');
$mail->addAddress($correo);
$mail->addAddress('test@gmail.com'); 
$mail->Subject = 'Bienvenido a Tlaxicom '  ;
$mail->Body = '¡Hola' .$nombre . 'Es un placer informarte que tu contrato de servicio de internet ha sido procesado y está listo. Puedes encontrarlo adjunto a este correo electrónico. Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.¡Bienvenido a bordo y gracias por elegir nuestros servicios!Saludos,Tlaxicom 🌐';





session_start();


$nombreUsuario = $_SESSION['usuario']; 


$nombreArchivo = $nombre . $apellido1 . $apellido2 . '_' . $nombreUsuario . '_' . 'Contrato.pdf';

$mail->addStringAttachment($pdf->Output('', 'S'), $nombreArchivo);

/// Enviar el correo
if (!$mail->send()) {
    echo 'Error al enviar el correo: ' . $mail->ErrorInfo;
} else {

    header("Location: mensaje_exito.php");
    exit(); 
}

// Eliminar los archivos temporales de las fotos
unlink($firmaTmp);
unlink($foto1Tmp);
unlink($foto2Tmp);

 
?>