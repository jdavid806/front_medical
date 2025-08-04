<?php
include "../header.php";
include "../menu.php";
?>
<style>
    .fixed-size-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .fixed-size-image:hover {
        transform: scale(1.05);
    }

    .image-container {
        height: 200px;
        overflow: hidden;
        border-radius: .25rem;
    }

    .comment-box {
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
    }

    .comment-author {
        font-weight: bold;
    }

    .comment-date {
        color: #777;
    }

    .comment-form {
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid #dee2e6;
    }

    .comment-form textarea {
        resize: vertical;
        min-height: 100px;
    }

    .comment-form .btn {
        margin-top: 10px;
    }

    .image-modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(5px);
    }

    .modal-content {
        position: relative;
        margin: auto;
        padding: 20px;
        width: 90%;
        max-width: 800px;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
    }

    .modal-image {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .modal-close {
        position: absolute;
        top: 15px;
        right: 25px;
        color: #fff;
        font-size: 35px;
        font-weight: bold;
        cursor: pointer;
        transition: color 0.2s ease;
    }

    .modal-close:hover {
        color: #ccc;
    }

    .modal-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        padding: 10px 15px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }

    .modal-nav:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-prev {
        left: 20px;
    }

    .modal-next {
        right: 20px;
    }

    .modal-info {
        color: #fff;
        margin-top: 15px;
        font-size: 14px;
    }

    .modal-counter {
        color: #ccc;
        font-size: 12px;
        margin-top: 5px;
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            padding: 10px;
        }

        .modal-nav {
            font-size: 24px;
            padding: 8px 12px;
        }

        .modal-prev {
            left: 10px;
        }

        .modal-next {
            right: 10px;
        }
    }
</style>

<div class="content">
    <div class="col-sm-12 mb-3">
        <div class="card border border-light">
            <div class="card-body">
                <h4 class="card-title" id="titulo"></h4>
                <small class="text-muted" id="autor"></small>

                <div id="contenido" class="mt-3">
                </div>


                <div class="row mt-3" id="imagenesDiv">

                </div>

                <!-- <div class="text-center mt-3">
                    <button type="button" class="btn btn-outline-secondary" id="likeBtn"><i
                            class="fas far fa-heart"></i> Me
                        gusta</button>
                </div> -->

                <div class="comment-section">
                    <h4 class="mt-4"><i class="fas fa-comments"></i> Comentarios</h4>
                    <hr>

                    <!-- Formulario para nuevo comentario -->
                    <div class="comment-form">
                        <h5><i class="fas fa-comment-dots"></i> Agregar un comentario</h5>
                        <form id="commentForm">
                            <div class="mb-3">
                                <textarea class="form-control" id="commentContent"
                                    placeholder="Escribe tu comentario aquí..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" id="publishBtn" disabled>
                                <i class="fas fa-paper-plane"></i> Publicar comentario
                            </button>
                            <button type="button" class="btn btn-secondary ms-2" id="cancelComment">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </form>
                    </div>

                    <div id="comentariosDiv">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal para vista previa de imágenes -->
<div id="imageModal" class="image-modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <span class="modal-nav modal-prev"> &#8592;</span>
        <span class="modal-nav modal-next">&#8594;</span>
        <img id="modalImage" class="modal-image" src="" alt="">
        <div class="modal-info">
            <div id="modalImageInfo"></div>
            <div id="modalCounter" class="modal-counter"></div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>

<script type="module">
    import {
        postService
    } from '../services/api/index.js';
    import {
        commentsService
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
        // console.log("user", user);

    });

    async function comentarios() {
        const com = await commentsService.getCommentsByPost();
        // console.log("Comentarios", com);
    }

    // Variables globales
    let tema = null;
    let autor = {};
    let currentImageIndex = 0;
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    // Función para formatear la fecha actual
    function getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async function renderizarContenidoCompleto() {
        try {
            document.getElementById('contenido').innerHTML =
                '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p>Cargando contenido...</p></div>';

            tema = await postService.get(postId);
            autor = await consultarDatosDoctor(tema.data.attributes.user_id);

            console.log("Datos del tema:", tema);
            // console.log("Datos del autor:", autor);

            document.getElementById('titulo').textContent = tema.data.attributes.title;
            document.getElementById('autor').textContent = `Por ${autor.nombre || 'Usuario'} ${autor.apellido || ''}`;
            const contenidoConSaltos = tema.data.attributes.content
                .replace(/\n/g, '<br>')
                .replace(/\\n/g, '<br>');

            document.getElementById('contenido').innerHTML = contenidoConSaltos;

            const imagesContainer = document.getElementById('imagenesDiv');
            if (tema.data.attributes.images && tema.data.attributes.images.length > 0) {
                imagesContainer.innerHTML =
                    '<h4 class="mt-4"><i class="fas fa-images"></i> Imágenes adjuntas</h4><hr><div class="row">';

                tema.data.attributes.images.forEach((imageUrl, index) => {
                    const altText = `Imagen ${index + 1} del artículo: ${tema.data.attributes.title}`;
                    imagesContainer.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="image-container">
                                <img src="${imageUrl}" 
                                     class="img-fluid rounded fixed-size-image" 
                                     alt="${altText}"
                                     onclick="openImageModal(${index})"
                                     data-index="${index}">
                            </div>
                        </div>
                    `;
                });

                imagesContainer.innerHTML += '</div>';

            } else {
                imagesContainer.innerHTML = '';
            }

            await renderComments();

        } catch (error) {
            console.error("Error al cargar el contenido:", error);
            document.getElementById('contenido').innerHTML =
                '<div class="alert alert-danger">Error al cargar el contenido. Por favor, inténtelo de nuevo más tarde.</div>';
        }
    }

    let loadedComments = [];

    async function renderComments(append = false) {
        const commentsContainer = document.getElementById('comentariosDiv');

        if (!append) {
            commentsContainer.innerHTML =
                '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
        }

        try {
            const includedComments = tema.data.include[0] || [];

            const postComments = includedComments.filter(comment => {
                return comment.attributes.post_id == postId;
            });

            if (!append) {
                loadedComments = postComments;
            } else {
                postComments.forEach(newComment => {
                    const exists = loadedComments.some(c => c.id === newComment.id);
                    if (!exists) {
                        loadedComments.unshift(newComment);
                    }
                });
            }

            commentsContainer.innerHTML = '';

            if (loadedComments && loadedComments.length > 0) {
                for (const comment of loadedComments) {
                    const commentAuthor = await consultarDatosDoctor(comment.attributes.user_id);
                    const commentDate = new Date(comment.attributes.created_at);
                    const formattedDate = commentDate.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    const commentContent = comment.attributes.content
                        .replace(/\n/g, '<br>')
                        .replace(/\\n/g, '<br>');

                    commentsContainer.innerHTML += `
                <div class="comment-box mb-3">
                    <div class="d-flex justify-content-between">
                        <span class="comment-author">${commentAuthor.nombre || 'Usuario'} ${commentAuthor.apellido || ''}</span>
                        <small class="comment-date">${formattedDate}</small>
                    </div>
                    <p class="mt-2">${commentContent}</p>
                </div>
                `;
                }
            } else {
                commentsContainer.innerHTML = '<p>No hay comentarios aún. ¡Sé el primero en comentar!</p>';
            }
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
            commentsContainer.innerHTML =
                '<div class="alert alert-danger">Error al cargar los comentarios. Por favor, inténtelo de nuevo más tarde.</div>';
        }
    }

    async function addComment(content) {
        const commentInput = document.getElementById('commentContent');
        const comment = commentInput.value.trim();

        if (!comment) return;

        try {
            const publishBtn = document.getElementById('publishBtn');
            publishBtn.disabled = true;
            publishBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Publicando...';

            const dataComment = {
                post_id: postId,
                user_id: user.id,
                content: comment
            };

            const response = await commentsService.createComment(dataComment);
            const newComment = response.data;

            clearCommentForm();

            const commentAuthor = `${user.first_name} ${user.middle_name} ${user.last_name} ${user.second_last_name}`;

            const formattedDate = getCurrentDate();

            const commentHtml = `
            <div class="comment-box mb-3">
                <div class="d-flex justify-content-between">
                    <span class="comment-author">Dr(a). ${commentAuthor}</span>
                    <small class="comment-date">${formattedDate}</small>
                </div>
                <p class="mt-2">${newComment.attributes.content}</p>
            </div>
        `;

            const commentsContainer = document.getElementById('comentariosDiv');

            if (loadedComments.length === 0) {
                commentsContainer.innerHTML = commentHtml;
            } else {
                commentsContainer.insertAdjacentHTML('afterbegin', commentHtml);
            }

            loadedComments.unshift(newComment);

            publishBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar comentario';
        } catch (error) {
            console.error("Error al publicar comentario:", error);
            alert("Ocurrió un error al publicar el comentario. Por favor, inténtelo de nuevo.");
            document.getElementById('publishBtn').innerHTML = '<i class="fas fa-paper-plane"></i> Publicar comentario';
            document.getElementById('publishBtn').disabled = false;
        }
    }

    function clearCommentForm() {
        document.getElementById('commentContent').value = '';
        document.getElementById('publishBtn').disabled = true;
    }

    function checkPublishButton() {
        const content = document.getElementById('commentContent').value.trim();
        const publishBtn = document.getElementById('publishBtn');
        publishBtn.disabled = content === '';
    }

    function openImageModal(index) {
        currentImageIndex = index;
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalInfo = document.getElementById('modalImageInfo');
        const modalCounter = document.getElementById('modalCounter');

        modal.style.display = 'block';
        modalImage.src = tema.data.attributes.images[index];
        modalImage.alt = `Imagen ${index + 1} del artículo: ${tema.data.attributes.title}`;
        modalInfo.textContent = `Imagen ${index + 1} del artículo: ${tema.data.attributes.title}`;
        modalCounter.textContent = `${index + 1} de ${tema.data.attributes.images.length}`;

        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        const modal = document.getElementById('imageModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + tema.data.attributes.images.length) % tema.data.attributes.images
            .length;
        openImageModal(currentImageIndex);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % tema.data.attributes.images.length;
        openImageModal(currentImageIndex);
    }

    document.addEventListener('DOMContentLoaded', function() {
        comentarios();
        renderizarContenidoCompleto();

        const commentForm = document.getElementById('commentForm');
        const cancelButton = document.getElementById('cancelComment');
        const commentContent = document.getElementById('commentContent');

        commentContent.addEventListener('input', checkPublishButton);

        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const content = document.getElementById('commentContent').value.trim();
            await addComment(content);
        });


        cancelButton.addEventListener('click', function() {
            clearCommentForm();
        });

        const modal = document.getElementById('imageModal');
        const closeBtn = document.querySelector('.modal-close');
        const prevBtn = document.querySelector('.modal-prev');
        const nextBtn = document.querySelector('.modal-next');

        closeBtn.addEventListener('click', closeImageModal);
        prevBtn.addEventListener('click', showPreviousImage);
        nextBtn.addEventListener('click', showNextImage);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch (e.key) {
                    case 'Escape':
                        closeImageModal();
                        break;
                    case 'ArrowLeft':
                        showPreviousImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });
    });
</script>