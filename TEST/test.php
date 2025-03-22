<?php
include "../menu.php";
include "../header.php";
?>
<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
        <li class="breadcrumb-item"><a href="verRecetas?1">Recetas</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Nueva Receta</li>
      </ol>
    </nav>

    <form id="uploadForm">
      <label for="file">Selecciona una imagen:</label>
      <input type="file" name="file" id="file" required>
      <button type="submit">Subir Imagen</button>
    </form>

    <div id="uploadStatus"></div>    


    <!-- Botón para cargar la imagen -->
    <button id="cargarImagenBtn" onclick="cargarImagen2(12)">Cargar Imagen</button>
    <div id="imageContainer"></div>

    <script>

     
      document.getElementById("uploadForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita la recarga de la página

        let fileInput = document.getElementById("file");
        if (fileInput.files.length === 0) {
          alert("Por favor, selecciona un archivo.");
          return;
        }

        let file = fileInput.files[0];
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\Models\Patient"); // Cambia según el tipo de modelo
        formData.append("model_id", "2"); 
        formData.append("tenant_id", "dev");// Cambia según el ID del modelo

        try {
          let url = obtenerRutaPrincipal() + `/api/v1/files/`;
          let response = await fetch(url, {
            method: "POST",
            body: formData
          });

          let result = await response.json();        

          if (response.ok) {
            document.getElementById("uploadStatus").innerText = "Archivo subido correctamente.";
          } else {
            document.getElementById("uploadStatus").innerText = "Error al subir archivo.";
          }
        } catch (error) {
          console.error("Error en la subida del archivo:", error);
          document.getElementById("uploadStatus").innerText = "Error en la subida del archivo.";
        }
      });



      document.getElementById("cargarImagenBtn").addEventListener("click", function (event) {
        event.preventDefault();  // Evita recargar la página si está dentro de un formulario
        cargarImagen(12);
      });


      async function cargarImagen2(imagenId) {

        let url = obtenerRutaPrincipal() + `/api/v1/files/${imagenId}/view`;
        console.log("URL generada:", url); // Verificar la URL generada

        try {
          let datosImagen = await obtenerDatos(url);       

          if (datosImagen.file_url) {
            mostrarImagen(datosImagen.file_url);
          } else {
            console.error("No se encontró la URL de la imagen.");
          }
        } catch (error) {
          console.error("Error en la carga de imagen:", error);
        }
      }


      function mostrarImagen(url) {  
        let container = document.getElementById("imageContainer");

        // Limpiar el contenedor antes de agregar la nueva imagen
        container.innerHTML = "";

        // Crear la etiqueta <img>
        let img = document.createElement("img");
        img.src = url;
        img.alt = "Imagen cargada";
        img.style.maxWidth = "100%"; // Para que se adapte al contenedor
        img.style.border = "2px solid #ddd";
        img.style.borderRadius = "10px";

        // Agregar la imagen al contenedor
        container.appendChild(img);
      }
    </script>

    <?php
    include "../footer.php";
    ?>