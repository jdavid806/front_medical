<?php
include "../menu.php";
include "../header.php";
?>
<div class="content">
    < class="container-small">
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
        <button id="cargarImagenBtn" onclick="cargarImagen2(65)">Cargar Imagen</button>
        <div id="imageContainer"></div>

        <script>
        document.getElementById("uploadForm").addEventListener("submit", async function(event) {
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
            formData.append("tenant_id", "dev"); // Cambia según el ID del modelo

            try {
                let url = obtenerRutaPrincipal() + `/api/v1/files/`;
                let response = await fetch(url, {
                    method: "POST",
                    body: formData
                });

                let result = await response.json();
                console.log(result);
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



        document.getElementById("cargarImagenBtn").addEventListener("click", function(event) {
            event.preventDefault(); // Evita recargar la página si está dentro de un formulario
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


        <hr>

        <html lang="es">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Subir PDF</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
            }

            .upload-container {
                border: 2px dashed #ccc;
                padding: 30px;
                text-align: center;
                margin-bottom: 20px;
                border-radius: 5px;
            }

            .upload-container:hover {
                border-color: #4CAF50;
            }

            #file-input {
                display: none;
            }

            .upload-btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }

            .upload-btn:hover {
                background-color: #45a049;
            }

            #file-info {
                margin-top: 15px;
                font-style: italic;
            }

            #preview {
                margin-top: 20px;
                display: none;
            }

            #pdf-preview {
                width: 100%;
                height: 500px;
                border: 1px solid #ddd;
            }

            .status {
                margin-top: 20px;
                padding: 10px;
                border-radius: 4px;
                display: none;
            }

            .success {
                background-color: #dff0d8;
                color: #3c763d;
            }

            .error {
                background-color: #f2dede;
                color: #a94442;
            }
            </style>
        </head>

        <body>
            <h1>Subir Archivo PDF</h1>

            <div class="upload-container">
                <h2>Arrastra y suelta tu PDF aquí o</h2>
                <input type="file" id="file-input" accept=".pdf">
                <button class="upload-btn" onclick="document.getElementById('file-input').click()">
                    Seleccionar Archivo
                </button>
                <div id="file-info">No se ha seleccionado ningún archivo</div>
            </div>

            <div id="preview">
                <h3>Vista Previa del PDF:</h3>
                <iframe id="pdf-preview"></iframe>
            </div>

            <button id="upload-btn" class="upload-btn" disabled>Subir PDF</button>

            <div id="status-message" class="status"></div>

            <script src="script.js"></script>
        </body>


        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const fileInput = document.getElementById('file-input');
            const fileInfo = document.getElementById('file-info');
            const preview = document.getElementById('preview');
            const pdfPreview = document.getElementById('pdf-preview');
            const uploadBtn = document.getElementById('upload-btn');
            const statusMessage = document.getElementById('status-message');

            // Manejar la selección de archivos
            fileInput.addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileSelection(file);
                }
            });

            // Manejar arrastrar y soltar
            const uploadContainer = document.querySelector('.upload-container');

            uploadContainer.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.borderColor = '#4CAF50';
            });

            uploadContainer.addEventListener('dragleave', function() {
                this.style.borderColor = '#ccc';
            });

            uploadContainer.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.borderColor = '#ccc';

                const file = e.dataTransfer.files[0];
                if (file) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileSelection(file);
                }
            });

            // Manejar el botón de subir
            uploadBtn.addEventListener('click', function() {

                let urlPdf = obtenerRutaPrincipal() + `/medical/exam-orders/3`;

                guardarArchivoExamen("file-input", 3)
                    .then(resultado => {

                        let jsonData = {
                            minio_id: resultado,
                        };
                        console.log("JSON DATA:", actualizarDatos(urlPdf, jsonData));
                        // const file = fileInput.files[0];
                        // if (file) {
                        //   uploadFile(file);
                        // }

                    })
                    .catch(error => {
                        console.error("Error al guardar el PDF:", error);
                        showStatus('Error al guardar el PDF', 'error');
                    });
            });
            // Función para manejar la selección de archivos
            function handleFileSelection(file) {
                // Verificar si es un PDF
                if (file.type !== 'application/pdf') {
                    showStatus('Por favor, selecciona un archivo PDF válido.', 'error');
                    return;
                }

                // Mostrar información del archivo
                fileInfo.textContent = `Archivo seleccionado: ${file.name} (${formatFileSize(file.size)})`;

                // Mostrar vista previa
                const fileURL = URL.createObjectURL(file);
                pdfPreview.src = fileURL;
                preview.style.display = 'block';

                uploadBtn.disabled = false;

                // Ocultar mensajes anteriores
                statusMessage.style.display = 'none';
            }

            // Función para subir el archivo (simulada)
            function uploadFile(file) {
                // Aquí iría el código real para subir el archivo a un servidor
                // Por ahora solo simulamos la subida

                showStatus('Subiendo archivo...', 'info');
                uploadBtn.disabled = true;

                // Simular una subida con retraso
                setTimeout(function() {
                    // Simular éxito o error aleatorio para demostración
                    const success = Math.random() > 0.2;

                    if (success) {
                        showStatus(`Archivo "${file.name}" subido correctamente!`, 'success');
                    } else {
                        uploadBtn.disabled = false;
                    }
                }, 2000);
            }

            // Función para mostrar mensajes de estado
            function showStatus(message, type) {
                statusMessage.textContent = message;
                statusMessage.className = 'status ' + type;
                statusMessage.style.display = 'block';
            }

            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
            }


        });
        </script>

        <hr>
        <title>Modal con Imagen</title>

        <style>
        .modal-img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        .modal-content {
            background-color: #f8f9fa;
        }
        </style>
        </head>

        <body>
            <div class="container mt-5">
                <h1 class="mb-4">Ejemplo de Modal con Imagen</h1>
                <!-- Botón para abrir el modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#imagenModal"
                    onclick="mostrarImagenIdModa(2)">
                    Mostrar Imagen en Modal
                </button>

                <!-- Modal -->
                <div class="modal fade" id="imagenModal" tabindex="-1" aria-labelledby="imagenModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="imagenModalLabel">Título de la Imagen</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center">
                                <iframe src="" id="imagenModalBody" width="100%" height="600px"></iframe>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>

        <script>
        // function mostrarImagenModal(urlImage, titulo) {

        //   const modalImagen = document.getElementById('imagenModal');
        //   const modalTitulo = document.getElementById('imagenModalLabel');

        //   //asignar valores de variables de imagen
        //   modal.Imagen.src = urlImage;
        //   modalTitulo.textContent = titulo;
        //   modalImagen.style.display = 'block';

        //   //mostrar modal 
        //   const modal = new bootstrap.Modal(document.getElementById('imagenModal'));
        //   modal.show();
        // }

        async function mostrarImagenIdModa(id) {
            let urlPdf = obtenerRutaPrincipal() + `/medical/exam-orders/${id}`;
            let datosExamen = await obtenerDatos(urlPdf);
            let idImagen = datosExamen.minio_id;

            if (!idImagen) {
                alert("No se encontró el ID del archivo en el examen.");
                return;
            }
            //Nota Importante:
            // Ya estamos guardando, actualizando y visualizando, me borraron la funcion en el react del boton donde se hacia esa gestion.
            // Nota importante esto devuelve un http y por eso hay que hacer un replace
            // pedirle al backend que rdevuelva mejor el https o si son muy llorones me
            // tocara a mi
            // atencion: Recordar que el minio_id No se esta guardar y actualizando en base de datos
            //  :/ att: M.Castro

            let urlArchivo = (await getFileUrl(idImagen)).replace("http://", "https://");
            const modalImagen = document.getElementById('imagenModalBody');
            console.log("URL de la imagen:", urlArchivo);

            modalImagen.src = urlArchivo;
            // Mostrar el modal (asumiendo que tienes alguna lógica para esto)
            modalImagen.style.display = "block";
        }
        </script>
        <?php
    include "../footer.php";
    ?>