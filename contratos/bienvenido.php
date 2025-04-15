<?php
session_start();

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido, <?php echo $_SESSION['usuario']; ?>!</title>
    <!-- Agrega la biblioteca signature_pad -->
    <script src="https://unpkg.com/signature_pad"></script>
    <link rel="stylesheet" href="bienvenidos.css">
    
    <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js"></script>
  
    <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css">


</head>
<body>
<nav>      
    <ul>
    <h2><?php echo "¡Bienvenido al Futuro de Conexión, " . $_SESSION['usuario'] . ""; ?></h2>        
    <li style="float: right; margin-top: -76.5px;"><img src="img/Logo_Tlaxicom.png" width="280"></li>
    </ul>
</nav>
   
    <form action="procesar_bienvenido.php" method="post" enctype="multipart/form-data">
    <h1> Suscriptor</h1>
        Nombre: <input type="text" name="nombre" required><br>
        Apellido Paterno: <input type="text" name="apellido1" required><br>
        Apellido Materno: <input type="text" name="apellido2" required><br>
      
        Calle: <input type="text" name="calle" required><br>
        #Ext: <input type="text" name="num_ext" required><br>
        #Int: <input type="text" name="num_int"><br>
        Colonia: <input type="text" name="colonia" required><br>
        Alcaldía/Municipio: <input type="text" name="alcaldia_municipio" required><br>
        Estado: <input type="text" name="estado" required><br>
        C.P: <input type="text" name="cp" required><br>
       
        Telefono: <input type="text" name="telefono" required><br>
        <h1>Servicio de Internet Fijo en Casa</h1>

        Paquete: <input type="text" name="paquete" required><br>
      
    <div style="display: flex; align-items: center;">
        Tarifa:<input type="number" name="tarifa" required>
        <span style="margin-left: 5px;">$</span>
    </div>
     
     <h1>Datos del equipo Compra Venta</h1>

       Marca:<input type="text" name="marca" required><br>
       Modelo:<input type="text" name="modelo" required><br>
       Serie:<input type="text" name="serie" ><br>

       
       NO.Equipos:<input type="number" name="equipo" required><br>
       
     <h1>Instalacion del Equipo</h1>

 
     Fecha: <input type="date" name="fecha" required><br>
     Hora: <input type="time" name="hora" required><br>
               
<h1>Metodos de Pago</h1>

<label for="opciones">Seleccione un metodo de pago:</label>
<select id="opciones" name="opciones" require>
    <option value="">---seleccione una opcion---</option>
    <option value="opcion1">Efectivo</option>
    <option value="opcion2">Transferencia</option>  
</select>

<div id="leyendas">
    <p id="leyenda_opcion1" style="display: none;">Carniceria "Sadot" Av. 27 de septiembre #11 Terrenate De lunes a domingo 09:00 am a 05:00 pm</p>
    <p id="leyenda_opcion2" style="display: none;">Yonatan Ugarte Juárez No. de cuenta: 0478144451 Tarjeta: 4555113012650786</p>
</div>

<script>    
    document.getElementById('opciones').addEventListener('change', function() {
        var seleccionado = this.value;
        var leyendas = document.getElementById('leyendas');
        var leyendaOpcion1 = document.getElementById('leyenda_opcion1');
        var leyendaOpcion2 = document.getElementById('leyenda_opcion2');       

        leyendaOpcion1.style.display = (seleccionado === 'opcion1') ? 'block' : 'none';
        leyendaOpcion2.style.display = (seleccionado === 'opcion2') ? 'block' : 'none';
     
        leyendas.style.display = 'block';
    });
</script> 

<label for="opciones_servicios">¿Deseas agregar servicios adicionales?</label>
<select id="opciones_servicios" name="opciones_servicios" required>
    <option value="">---seleccione una opcion---</option>
    <option value="no">No</option>
    <option value="si">Sí</option>
</select>

<div id="cuestionario_servicios" style="display: none;">
  
    <p>Servicio Adicional</p>
    Servicio1<input type="text" name="servicio1" value="-------------------------------------------------------------------"><br>
    Descripcion: <input type="text" name="descripcion1" value="----------------------------------------------------------------------"><br>
    
    <div style="display: flex; align-items: center;">
  Tarifa:<input type="number" name="costo1" >
  <span style="margin-left: 5px;">$</span>
</div>

    <p>Servicio Adicional</p>
    Servicio2<input type="text" name="servicio2" value="--------------------------------------------------------------------"><br>
    Descripcion: <input type="text" name="descripcion2" value="-----------------------------------------------------------------------"><br>
    <div style="display: flex; align-items: center;">
  Tarifa:<input type="number" name="costo2" >
  <span style="margin-left: 5px;">$</span>
</div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {

        mostrarOcultarCuestionario();
        /
        document.getElementById('opciones_servicios').addEventListener('change', mostrarOcultarCuestionario);
        
        document.getElementById('btn_mostrar_cuestionario').addEventListener('click', mostrarOcultarCuestionario);
    });

    function mostrarOcultarCuestionario() {
        var seleccionado = document.getElementById('opciones_servicios').value;
        var cuestionario = document.getElementById('cuestionario_servicios');
     
        cuestionario.style.display = (seleccionado === 'si') ? 'block' : 'none';
        
        if (seleccionado === 'no') {
            document.querySelector('#cuestionario_servicios [name="servicio1"]').value = '-------';
            document.querySelector('#cuestionario_servicios [name="descripcion1"]').value = '-------';
            document.querySelector('#cuestionario_servicios [name="costo1"]').value = '-------';

            document.querySelector('#cuestionario_servicios [name="servicio2"]').value = '-------';
            document.querySelector('#cuestionario_servicios [name="descripcion2"]').value = '-------';
            document.querySelector('#cuestionario_servicios [name="costo2"]').value = '-------';
        }
    }
</script>

<H1>EL SUSCRIPTOR AUTORIZA SE LE ENVIE POR CORREO ELECTRÓNICO:</H1>

<label for="tieneCorreo">¿Cuenta con correo electrónico?</label>
  <select id="tieneCorreo" name="tieneCorreo" onchange="mostrarCampoCorreo()">
  <option value="">---seleccione una opcion---</option>
    <option value="si">Sí</option>
    <option value="no">No</option>
  </select>
  <br>

  <div id="campoCorreo" style="display:none;">
    <label for="correo">¿Cuál es su correo electrónico?</label>
    <input type="text" id="correo" name="correo">
    <br>
  </div>

  <script>
    function mostrarCampoCorreo() {
      var seleccion = document.getElementById("tieneCorreo").value;
      var campoCorreo = document.getElementById("campoCorreo");

      if (seleccion === "si") {
        campoCorreo.style.display = "block";
      } else {
        campoCorreo.style.display = "none";
      }
    }

  </script>

<h1>Fotografias del INE</h1>

<form method="post" action="procesar.php" enctype="multipart/form-data">
    <!-- Otros campos del formulario -->
    <label for="foto1">Foto 1:</label>
    <input type="file" name="foto1" id="foto1" accept="image/*" required>    
    <label for="foto2">Foto 2:</label>
    <input type="file" name="foto2" id="foto2" accept="image/*" required>
    
    <style>      
        form {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
        }

        input[type="file"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 16px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        input[type="file"]:hover {
            border-color: #333;
        }

        input[type="file"]:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        input[type="submit"] {
            background-color: #007bff;
            color: #fff;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }

        input[type="submit"]:hover {
            background-color: #0056b3;
        }
    </style>    

<h1>Firma del suscriptor</h1>

<div id="firmaContainer" style="border: 1px solid #000; width: 320px; height: 200px; position: relative;">
    <canvas id="firmaCanvas" width="320" height="200" style="border: 1px solid #000; position: absolute; left: 0; top: 0;"></canvas>
</div>
<br>

    <input type="hidden" name="firma" id="firma" required>

    <button type="button" onclick="borrarFirma()">Borrar Firma</button><br>
    <style>
        button {
            background-color: #ff0000;
            color: #ffffff;
            border: 1px solid #ff0000; 
            padding: 10px 20px; 
            cursor: pointer; 
            border-radius: 5px;                        
        }        
        button:hover {
            color: #ff0000;
            background-color: #ffffff;
        }
    </style>

    
    <input type="submit" value="Generar PDF">
    <style>
           input[type="submit"] {
            background-color: #007bff;
            color: #fff;
            padding: 10px 15px;
            border-top: 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin: 0 auto; 
            display: block; 
        }
    </style>
    
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var firmaContainer = document.getElementById('firmaContainer');
            var firmaCanvas = document.getElementById('firmaCanvas');
            var firmaPad = new SignaturePad(firmaCanvas);

            firmaContainer.addEventListener('mousedown', function () {
                firmaPad.on();
            });

            firmaContainer.addEventListener('mouseup', function () {
                firmaPad.off();
            });

        
            document.querySelector('form').addEventListener('submit', function (event) {
                document.getElementById('firma').value = firmaPad.toDataURL();
            });
        });

       
        function borrarFirma() {
            var firmaCanvas = document.getElementById('firmaCanvas');
            var firmaPad = new SignaturePad(firmaCanvas);
            firmaPad.clear();
        }
    </script>
        
</body>
</html>