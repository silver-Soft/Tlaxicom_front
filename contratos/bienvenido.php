<?php
require __DIR__ . '/lib/bootstrap.php';
tlx_requiere_login();

$paquetes = require __DIR__ . '/lib/paquetes.php';
$pagos = tlx_config('pagos');
$leyenda = function (array $p): string {
    return trim($p['titular'] . ' ' . $p['linea1'] . ' ' . $p['linea2']);
};
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido, <?= e($_SESSION['usuario']) ?>!</title>
    <link rel="stylesheet" href="bienvenidos.css">
    <script src="js/signature_pad.umd.js"></script>
    <style>
        form {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        label { display: block; margin-bottom: 8px; color: #555; }
        input[type="file"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 16px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type="file"]:hover { border-color: #333; }
        input[type="file"]:focus { outline: none; border-color: #007bff; box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
        input[type="submit"] {
            background-color: #007bff;
            color: #fff;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin: 0 auto;
            display: block;
        }
        input[type="submit"]:hover { background-color: #0056b3; }
        input[type="submit"]:disabled { background-color: #7aa7d9; cursor: wait; }
        button { background-color: #ff0000; color: #ffffff; border: 1px solid #ff0000; padding: 10px 20px; cursor: pointer; border-radius: 5px; }
        button:hover { color: #ff0000; background-color: #ffffff; }
    </style>
</head>
<body>
<nav>
    <ul>
    <h2>¡Bienvenido al Futuro de Conexión, <?= e($_SESSION['usuario']) ?></h2>
    <li style="float: right; margin-top: -76.5px;"><img src="img/Logo_Tlaxicom.png" width="280" alt="Tlaxicom"></li>
    </ul>
</nav>

    <form id="formContrato" action="procesar_bienvenido.php" method="post" enctype="multipart/form-data">
        <?= tlx_csrf_campo() ?>
    <h1> Suscriptor</h1>
        Nombre: <input type="text" name="nombre" required maxlength="80"><br>
        Apellido Paterno: <input type="text" name="apellido1" required maxlength="80"><br>
        Apellido Materno: <input type="text" name="apellido2" required maxlength="80"><br>

        Calle: <input type="text" name="calle" required maxlength="80"><br>
        #Ext: <input type="text" name="num_ext" required maxlength="10"><br>
        #Int: <input type="text" name="num_int" maxlength="10"><br>
        Colonia: <input type="text" name="colonia" required maxlength="80"><br>
        Alcaldía/Municipio: <input type="text" name="alcaldia_municipio" required maxlength="80"><br>
        Estado: <input type="text" name="estado" required maxlength="40"><br>
        C.P: <input type="text" name="cp" required inputmode="numeric" maxlength="5"><br>

        Telefono: <input type="tel" name="telefono" required maxlength="20"><br>
        <h1>Servicio de Internet Fijo en Casa</h1>

        Paquete:
        <select name="paquete" id="paquete" required>
            <option value="">--- Selecciona un paquete ---</option>
            <?php foreach ($paquetes as $clave => $p): ?>
                <option value="<?= e($clave) ?>" data-megas="<?= e($p['megas']) ?>" data-costo="<?= e($p['costo']) ?>" data-folio="<?= e($p['folio']) ?>"><?= e($p['etiqueta']) ?></option>
            <?php endforeach; ?>
        </select>
        Megas: <input type="text" id="megas_paquete" readonly>
        <br>
        Costo:
        <span>$</span>
        <input type="text" id="costo_paquete" readonly style="width:80px; text-align:right;">
        <span>.00</span>
        <br>
        Folio: <input type="text" id="folio_paquete" readonly>

     <h1>Datos del equipo Compra Venta</h1>

       Marca:<input type="text" name="marca" required maxlength="60"><br>
       Modelo:<input type="text" name="modelo" required maxlength="60"><br>
       Serie:<input type="text" name="serie" maxlength="60"><br>

       NO.Equipos:<input type="number" name="equipo" min="1" required><br>

     <h1>Instalacion del Equipo</h1>

     Fecha: <input type="date" name="fecha" required><br>
     Hora: <input type="time" name="hora" required><br>

<h1>Metodos de Pago</h1>

<label for="opciones">Seleccione un metodo de pago:</label>
<select id="opciones" name="opciones" required>
    <option value="">---seleccione una opcion---</option>
    <option value="opcion1">Efectivo</option>
    <option value="opcion2">Transferencia</option>
</select>

<div id="leyendas">
    <p id="leyenda_opcion1" style="display: none;"><?= e($leyenda($pagos['efectivo'])) ?></p>
    <p id="leyenda_opcion2" style="display: none;"><?= e($leyenda($pagos['transferencia'])) ?></p>
</div>

<label for="opciones_servicios">¿Deseas agregar servicios adicionales?</label>
<select id="opciones_servicios" name="opciones_servicios" required>
    <option value="">---seleccione una opcion---</option>
    <option value="no">No</option>
    <option value="si">Sí</option>
</select>

<div id="cuestionario_servicios" style="display: none;">

    <p>Servicio Adicional</p>
    Servicio1<input type="text" name="servicio1" maxlength="60" placeholder="-------"><br>
    Descripcion: <input type="text" name="descripcion1" maxlength="80" placeholder="-------"><br>

    <div style="display: flex; align-items: center;">
  Tarifa:<input type="number" name="costo1" min="0" step="any" placeholder="-------">
  <span style="margin-left: 5px;">$</span>
</div>

    <p>Servicio Adicional</p>
    Servicio2<input type="text" name="servicio2" maxlength="60" placeholder="-------"><br>
    Descripcion: <input type="text" name="descripcion2" maxlength="80" placeholder="-------"><br>
    <div style="display: flex; align-items: center;">
  Tarifa:<input type="number" name="costo2" min="0" step="any" placeholder="-------">
  <span style="margin-left: 5px;">$</span>
</div>
</div>

<H1>EL SUSCRIPTOR AUTORIZA SE LE ENVIE POR CORREO ELECTRÓNICO:</H1>

<label for="tieneCorreo">¿Cuenta con correo electrónico?</label>
  <select id="tieneCorreo" name="tieneCorreo">
  <option value="">---seleccione una opcion---</option>
    <option value="si">Sí</option>
    <option value="no">No</option>
  </select>
  <br>

  <div id="campoCorreo" style="display:none;">
    <label for="correo">¿Cuál es su correo electrónico?</label>
    <input type="email" id="correo" name="correo" maxlength="120" autocomplete="off">
    <br>
  </div>

<h1>Fotografias del INE</h1>

    <label for="foto1">Foto 1:</label>
    <input type="file" name="foto1" id="foto1" accept="image/jpeg,image/png" required>
    <label for="foto2">Foto 2:</label>
    <input type="file" name="foto2" id="foto2" accept="image/jpeg,image/png" required>

<h1>Firma del suscriptor</h1>

<div id="firmaContainer" style="border: 1px solid #000; width: 320px; height: 200px; position: relative;">
    <canvas id="firmaCanvas" width="320" height="200" style="border: 1px solid #000; position: absolute; left: 0; top: 0; touch-action: none;"></canvas>
</div>
<br>

    <input type="hidden" name="firma" id="firma">

    <button type="button" id="btnBorrarFirma">Borrar Firma</button><br><br>

    <input type="submit" id="btnEnviar" value="Generar PDF">
    </form>

    <script>
        (function () {
            var $ = function (id) { return document.getElementById(id); };

            // Paquete: solo muestra los datos; el servidor vuelve a calcularlos desde su catalogo.
            $('paquete').addEventListener('change', function () {
                var o = this.options[this.selectedIndex];
                $('costo_paquete').value = o.getAttribute('data-costo') || '';
                $('folio_paquete').value = o.getAttribute('data-folio') || '';
                $('megas_paquete').value = o.getAttribute('data-megas') || '';
            });

            // Leyenda del metodo de pago
            $('opciones').addEventListener('change', function () {
                $('leyenda_opcion1').style.display = this.value === 'opcion1' ? 'block' : 'none';
                $('leyenda_opcion2').style.display = this.value === 'opcion2' ? 'block' : 'none';
            });

            // Servicios adicionales
            $('opciones_servicios').addEventListener('change', function () {
                $('cuestionario_servicios').style.display = this.value === 'si' ? 'block' : 'none';
            });

            // Correo
            $('tieneCorreo').addEventListener('change', function () {
                var visible = this.value === 'si';
                $('campoCorreo').style.display = visible ? 'block' : 'none';
                $('correo').required = visible;
                if (!visible) { $('correo').value = ''; }
            });

            // Firma
            var pad = new SignaturePad($('firmaCanvas'));
            $('btnBorrarFirma').addEventListener('click', function () { pad.clear(); });

            $('formContrato').addEventListener('submit', function (event) {
                if (pad.isEmpty()) {
                    event.preventDefault();
                    alert('Falta la firma del suscriptor.');
                    return;
                }
                $('firma').value = pad.toDataURL('image/png');
                // Evita enviar el contrato dos veces por doble clic
                var btn = $('btnEnviar');
                setTimeout(function () { btn.disabled = true; btn.value = 'Generando...'; }, 0);
            });
        })();
    </script>
</body>
</html>
