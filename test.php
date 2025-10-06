<iframe 
   src="https://dev.monaros.co/Landing" 
   width="100%" 
   height="100%" 
   style="border:0;">
</iframe>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Iframe con botón</title>
  <style>
    #iframeContainer {
      display: none; /* Oculto por defecto */
      margin-top: 20px;
    }

    iframe {
      width: 100%;
      height: 600px;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <!-- Botón para activar el iframe -->
  <button id="btnMostrarIframe">Mostrar Calendario</button>

  <!-- Contenedor del iframe -->
  <div id="iframeContainer">
    <iframe id="calendarIframe" src=""></iframe>
  </div>

  <script>
    document.getElementById("btnMostrarIframe").addEventListener("click", function () {
      const iframe = document.getElementById("calendarIframe");

      // Si aún no se ha cargado, asignamos la URL
      if (!iframe.src) {
        iframe.src = "https://dev.monaros.co/test.php"; // <-- aquí pones la ruta de tu página con el calendario
      }

      // Mostramos el contenedor
      document.getElementById("iframeContainer").style.display = "block";
    });
  </script>
</body>
</html>
