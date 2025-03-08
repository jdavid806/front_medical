
<?php 
//ESTE ARCHIVO NO ESTABA INCLUIDO, SOLAMENTE SE OCUPA PARA TRAER LA VARIABLE $Base
include '../../funciones/funciones.php';

?>
<!DOCTYPE html>
<html>
<?PHP
header('Access-Control-Allow-Origin: *');

clearstatcache();
?>
<?php
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>



<head>
  <meta charset="UTF-8">
  <meta http-equiv='cache-control' content='no-cache'>
  <meta http-equiv='expires' content='-1'>
  <meta http-equiv='pragma' content='no-cache'>
  <link rel="stylesheet" href="../../apiVoz.css">

  <meta name="description" content="Medical viewer using DWV (DICOM Web Viewer) and jQuery UI.">
  <meta name="keywords" content="DICOM,HTML5,JavaScript,medical,imaging,DWV">
  <meta name="theme-color" content="#3ba22f" />
  <!--<link rel="icon" type="image/x-icon" href="favicon.ico">-->
  <link rel="icon" href="https://medicalsoftplus.com/iconoms.ico" type="image/x-icon">
  <link rel="manifest" href="manifest.json">
  <link type="text/css" rel="stylesheet" href="css/style.css">
  <link type="text/css" rel="stylesheet" href="ext/jquery-ui/themes/ui-darkness/jquery-ui-1.12.1.min.css">
  <!-- mobile web app -->
  <meta name="mobile-web-app-capable" content="no" />
  <!-- apple specific -->
  <meta name="apple-mobile-web-app-capable" content="no" />
  <!-- Third party (dwv) -->
  <script type="text/javascript" src="node_modules/i18next/i18next.min.js"></script>
  <script type="text/javascript" src="node_modules/i18next-http-backend/i18nextHttpBackend.min.js"></script>
  <script type="text/javascript" src="node_modules/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js"></script>
  <script type="text/javascript" src="node_modules/jszip/dist/jszip.min.js"></script>
  <script type="text/javascript" src="node_modules/konva/konva.min.js"></script>
  <script type="text/javascript" src="node_modules/magic-wand-tool/dist/magic-wand.min.js"></script>
  <!-- Third party (viewer) -->
  <script type="text/javascript" src="node_modules/jquery/dist/jquery.min.js"></script>
  <script type="text/javascript" src="ext/jquery-ui/jquery-ui-1.12.1.min.js"></script>
  <script type="text/javascript" src="ext/flot/jquery.flot.min.js"></script>
  <!-- decoders -->
  <script type="text/javascript" src="node_modules/dwv/decoders/dwv/rle.js"></script>
  <script type="text/javascript" src="node_modules/dwv/decoders/pdfjs/jpx.js"></script>
  <script type="text/javascript" src="node_modules/dwv/decoders/pdfjs/util.js"></script>
  <script type="text/javascript" src="node_modules/dwv/decoders/pdfjs/arithmetic_decoder.js"></script>
  <script type="text/javascript" src="node_modules/dwv/decoders/pdfjs/jpg.js"></script>
  <script type="text/javascript" src="node_modules/dwv/decoders/rii-mango/lossless-min.js"></script>
  <!-- dwv -->
  <script type="text/javascript" src="node_modules/dwv/dist/dwv.js"></script>

  <!-- browser -->
  <script type="text/javascript" src="src/utils/browser.js"></script>
  <script type="text/javascript" src="src/utils/modernizr.js"></script>

  <!-- gui -->
  <script type="text/javascript" src="src/gui/colourMap.js"></script>
  <script type="text/javascript" src="src/gui/custom.js"></script>
  <script type="text/javascript" src="src/gui/dropboxLoader.js"></script>
  <script type="text/javascript" src="src/gui/filter.js"></script>
  <script type="text/javascript" src="src/gui/generic.js"></script>
  <script type="text/javascript" src="src/gui/help.js"></script>
  <script type="text/javascript" src="src/gui/html.js"></script>
  <script type="text/javascript" src="src/gui/infoController.js"></script>
  <script type="text/javascript" src="src/gui/infoOverlay.js"></script>

  <script>
    //ESTA VARIABLE SE CREA UNICAMENTE PARA SER IMPORTADA EN EL loader.js
    var enlaceBase = '<?= $Base ?>';
  </script>
  <script type="text/javascript" src="src/gui/loader.js"></script>
  <script type="text/javascript" src="src/gui/plot.js"></script>
  <script type="text/javascript" src="src/gui/tools.js"></script>
  <script type="text/javascript" src="src/gui/undo.js"></script>

  <!-- Launch the app -->
  <script type="text/javascript" src="src/register-sw.js"></script>
  <script type="text/javascript" src="src/appgui.js?n=<?php echo rand(1, 99999999); ?>"></script>
  <script type="text/javascript" src="src/applauncher.js"></script>
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="../../plugins/FontAwesomeK Free 6.0/css/all.css">
  <script src="../../js/kit.fontawesome.js" crossorigin="anonymous"></script>

  <title>Visor Dicom</title>
</head>
<style>
    body {
      height: 1225px;
    }
  </style>
<style>
  h1 {
    color: black !important;
  }

  .ui-widget-content {
    background-color: #ffffff;
    background-image: url();
  }

  .ui-widget-header {
    border: 1px solid #3c8dbc;
    background: #3c8dbc;
    color: #fff;
    font-weight: bold;
  }

  .ui-state-default,
  .ui-widget-content .ui-state-default,
  .ui-widget-header .ui-state-default,
  .ui-button,
  html .ui-button.ui-state-disabled:hover,
  html .ui-button.ui-state-disabled:active {
    border: 1px solid black;
    background: black;
    font-weight: bold;
    color: #fff;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #ecf0f5;
    color: black !important;
    font-size: 80%;
  }

  #pageMain {
    position: absolute;
    height: 92%;
    width: 99%;
    bottom: -5px;
    left: 5px;
    background-color: transparent !important;
  }

  .layerGroup {
  width: 100%;
  height: 100%;
  /* Otros estilos para layerGroup */
}
#pageHeader{
  text-align-last: center;
  height: 41px;
  background-color: #3c8dbc;
  border-radius: 10px;
}

#dwv-toolbar{
  margin-right: 10px;
}


.layerContainer{
  /*zoom:1.8;*/
  width:900px;
  height:900px;
}


  .botonclase_guardar{
    width: 100%;
    margin-top: -10px;
    background-color: #3c8dbc;
  }
</style>

<body>

  <div id="pageHeader">

    <!-- Title -->
    <img src="https://medicalsoftplus.com/iconoms.ico" style="width:25px;height:25px;top: 3px;position: relative;margin-top: 3px;"></img>
    <h1 style="color:white!important;">Visor Dicom</h1>

    <!-- Toolbar -->
    <div id="dwv-toolbar"></div>

  </div><!-- /pageHeader -->

  <div id="pageMain">

    <!-- DWV -->
    <div id="dwv">

      <!-- Open file -->
      <div id="openData" title="Archivos">
        <div id="dwv-loaderlist"></div>
        <div id="progressbar"></div>
      </div>

      <!-- Toolbox -->
      <div id="dwv-toolList" title="Herramientas"></div>

      <!-- History -->
      <div id="dwv-history" title="Historial"></div>

      <!-- Help -->
      <div id="dwv-informes" title="Informes">

        <form id="formInforme">
        <div class="" style="margin-top: -10px;">
          <span style="color:black;">Paciente: </span>
          <input name="datos[Nombre_P]" id="Nombre_P" style="border: none;top: 14px;position: unset;" value="<?php echo $_GET['Nombre_P']; ?>" readonly><br>
          <span style="color:black;">Cédula: </span>
          <input name="datos[Numero]" id="Numero" value="<?php echo $_GET['Numero']; ?>" style="border: none;top: 14px;position: unset;" readonly><br>
          <span style="color:black;">Fecha.N: </span>
          <input name="datos[Fecha_N]" id="Fecha_N" style="border: none;top: 14px;position: unset;" readonly>


          <textarea class="dicom_voz" name="datos[informe]" id="informe" cols="20" rows="8" style="width:90%;"></textarea>
          <input type="hidden" name="datos[Numero]" id="Numero" value="<?php echo $_GET['Numero']; ?>">
          <input type="hidden" name="datos[Nombre]" id="Nombre" value="<?php echo $_GET['Nombre']; ?>">
          <!-- para el boton para volver a medical -->
          <input type="hidden" id="cliente_id" value="<?php echo $_GET['ci']; ?>">
          <button type="button" class="botonclase_guardar" onclick="procesarInforme();">Guardar</button>
        </form>
      </div>

      <!-- Tags -->
      <div id="dwv-tags" title="Tags"></div>

      <!-- DrawList -->
      <div id="dwv-drawList" title="Lista de Trazados"></div>

      <!-- Help -->
      <div id="dwv-help" title="Ayuda"></div>

      <!-- Layer Container -->
      <div id="dwv-image" class="layerDialog" title="Imagen">

        <div class="layerContainer">
          <!-- layer group -->
          <div id="layerGroup0" class="layerGroup">
            <div id="dropBox"></div>
            <div id="infoLayer">
              <div id="infotl" class="infotl info"></div>
              <div id="infotc" class="infotc infoc"></div>
              <div id="infotr" class="infotr info"></div>
              <div id="infocl" class="infocl infoc"></div>
              <div id="infocr" class="infocr infoc"></div>
              <div id="infobl" class="infobl info"></div>
              <div id="infobc" class="infobc infoc"></div>
              <!-- offset for plot -->
              <div id="infobr" class="infobr info" style="bottom: 64px;"></div>
              <div id="plot"></div>
              <div id="infocm"></div>
            </div><!-- /infoLayer -->
          </div><!-- /layerGroup0 -->
        </div><!-- /layerContainer -->

      </div><!-- /layerDialog -->

    </div><!-- /dwv -->

  </div><!-- /pageMain -->

</body>

</html>
<script>
  $(document).ready(function() {
    $('#openData').append('<div class="divBody"><input type="hidden" id="Numero" value="<?php echo $_GET['Numero']; ?>"> <input type="hidden" id="Nombre" value="<?php echo $_GET['Nombre']; ?>"> <button onClick=" var toggleSaveState = document.createElement(\'input\');toggleSaveState.id = \'AutorizacionState\'; toggleSaveState.type = \'hidden\'; toggleSaveState.value = \'1\';  node = document.getElementById(\'openData\'); node.appendChild(toggleSaveState);  document.getElementsByClassName(\'imageurl\')[0].value=\'<?= $Base ?>ArchivosDicom/<?php echo $_GET["ci"] ?>/<?php echo $_GET["Nombre"] ?>/state_dicom.json\'; setTimeout(function(){ document.getElementsByClassName(\'imageurl\')[0].onchange(); }, 1000);" > Cargar Ediciones </button></button></button> </div>');

    //$('#openData').append('<div class="divBody"><input type="hidden" id="Numero" value="<?php echo $_GET['Numero']; ?>"> <input type="hidden" id="Nombre" value="<?php echo $_GET['Nombre']; ?>"> <button onClick=" var toggleSaveState = document.createElement(\'input\');toggleSaveState.id = \'AutorizacionState\'; toggleSaveState.type = \'hidden\'; toggleSaveState.value = \'1\';  node = document.getElementById(\'openData\'); node.appendChild(toggleSaveState);  document.getElementsByClassName(\'imageurl\')[0].value=\'https://medicalsoftplus.com/baseDev/ArchivosDicom/<?php echo $_GET["ci"] ?>/<?php echo $_GET["Nombre"] ?>/state_dicom.json\'; setTimeout(function(){ document.getElementsByClassName(\'imageurl\')[0].onchange(); }, 1000);" > Cargar Ediciones </button></button></button> </div>');

    
  });
  $('#dwv-image').ready(function() {
    setTimeout(function() {
      $(document).ready(function() {
        var campos  = $('#dwv-image').parent()
        campos.css('left', '27%');
        campos.css('top', '0');
      });
    }, 2000);
    
  });
  
</script>
<script>
  function procesarInforme() {
    let informe, Numero, Nombre;
    informe = document.getElementById("informe").value;
    Nombre = document.getElementById("Nombre").value;
    Numero = document.getElementById("Numero").value;
    clienteID = '<?= $_GET['ci'] ?>';
    // console.log(informe, Nombre, Numero);

    const data = {
      informe: informe,
      Numero: Numero,
      Nombre: Nombre,
      clienteID: clienteID
    };
    const params = new URLSearchParams(data);
    fetch(`ajax_informeDicom.php?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function cargarInforme() {
    let informe, Numero, Nombre;
    informe = document.getElementById("informe").value;
    Nombre = document.getElementById("Nombre").value;
    Numero = document.getElementById("Numero").value;
    clienteID = '<?= $_GET['ci'] ?>';
    // console.log(informe, Nombre, Numero,Nombre_P, Fecha_N);

    const data = {
      informe: informe,
      Numero: Numero,
      Nombre: Nombre,
      clienteID: clienteID
    };
 
    const params = new URLSearchParams(data);
    fetch(`ajax_informeDicomConsulta.php?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        document.getElementById("informe").value = data.Informe,
        document.getElementById("Nombre_P").value = data.nombre_cliente,
        document.getElementById("Fecha_N").value = data.fechaNacimiento;
      })
      .catch(error => {
        console.error(error);
      });

  }

  window.onload = function() {
    cargarInforme();
  }
</script>

<script src="../../apiVoz_dicom.js"></script>