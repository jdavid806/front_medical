<div class="modal fade" id="modalNuevoTema" tabindex="-1" aria-labelledby="modalNuevoTema" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalNuevoTemaLabel">Nuevo tema</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="card">
                    <div class="card-body">
                        <label for="title" class="form-label">Titulo</label>
                        <input type="text" class="form-control" id="title" placeholder="Ingrese el titulo del tema">

                        <label for="content" class="form-label mt-3">Contenido</label>
                        <textarea class="form-control" id="content"
                            placeholder="Ingrese el contenido del tema"></textarea>

                        <!-- <div class="mt-3">
                            <label for="imageUpload" class="form-label">Imágenes (opcional)</label>
                            <input class="form-control" type="file" id="imageUpload" accept="image/*" multiple>
                            <div id="imagePreview" class="mt-2 d-flex flex-wrap gap-2"></div>
                            <small class="text-muted">Puedes seleccionar múltiples imágenes</small>
                        </div> -->

                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="publicarBtn" type="button">Publicar</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6.3.1-12/skins/ui/oxide/skin.min.css" referrerpolicy="origin">
</script>

<script type="module">
    import {
        postService
    } from '../services/api/index.js';
    import {
        userService
    } from './services/api/index.js';
    import {
        getJWTPayload
    } from "./services/utilidades.js";
    import UserManager from './services/userManager.js';

    let user = {};

    document.addEventListener('DOMContentLoaded', async function() {

        user = await userService.getByExternalId(getJWTPayload().sub);
        console.log("user", user);

    });


    // document.getElementById('imageUpload').addEventListener('change', function(event) {
    //     const preview = document.getElementById('imagePreview');
    //     preview.innerHTML = '';

    //     const files = event.target.files;
    //     if (files && files.length > 0) {
    //         Array.from(files).forEach((file, index) => {
    //             if (file.type.match('image.*')) {
    //                 const reader = new FileReader();

    //                 reader.onload = function(e) {
    //                     const imgContainer = document.createElement('div');
    //                     imgContainer.className = 'position-relative';
    //                     imgContainer.style.width = '100px';
    //                     imgContainer.style.height = '100px';

    //                     const img = document.createElement('img');
    //                     img.src = e.target.result;
    //                     img.className = 'img-thumbnail h-100 w-100 object-fit-cover';
    //                     img.dataset.index = index;

    //                     const btnRemove = document.createElement('button');
    //                     btnRemove.className = 'btn btn-danger btn-sm position-absolute top-0 end-0';
    //                     btnRemove.innerHTML = '&times;';
    //                     btnRemove.onclick = function() {
    //                         imgContainer.remove();

    //                         const dataTransfer = new DataTransfer();
    //                         const input = document.getElementById('imageUpload');

    //                         Array.from(input.files).forEach((file, i) => {
    //                             if (i !== parseInt(img.dataset.index)) {
    //                                 dataTransfer.items.add(file);
    //                             }
    //                         });

    //                         input.files = dataTransfer.files;
    //                     };

    //                     imgContainer.appendChild(img);
    //                     imgContainer.appendChild(btnRemove);
    //                     preview.appendChild(imgContainer);
    //                 }

    //                 reader.readAsDataURL(file);
    //             }
    //         });
    //     }
    // });

    document.getElementById('publicarBtn').addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        // const imageUpload = document.getElementById('imageUpload');
        // const files = imageUpload.files;

        // Validar campos requeridos
        if (!title.trim() || !content.trim()) {
            alert('Por favor, complete el título y contenido');
            return;
        }

        // Crear FormData para enviar archivos
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('title', title);
        formData.append('content', content);

        // Agregar todas las imágenes al FormData
        // for (let i = 0; i < files.length; i++) {
        //     formData.append('images', files[i]);
        // }

        const dataTema = {
            user_id: user.id,
            title: title,
            content: content
        };

        // Mostrar indicador de carga
        const publicarBtn = document.getElementById('publicarBtn');
        publicarBtn.disabled = true;
        publicarBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Publicando...';

        // Enviar con FormData
        postService.createPost(dataTema).then((response) => {
            console.log("Respuesta del servicio:", response);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch((error) => {
            console.error("Error al publicar:", error);
            alert("Ocurrió un error al publicar. Por favor, inténtelo de nuevo.");

            publicarBtn.disabled = false;
            publicarBtn.innerHTML = 'Publicar';
        });
    });
</script>