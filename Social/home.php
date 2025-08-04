<?php
include "../header.php";
include "../menu.php";
?>

<style>
    .title-link {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 18px;
    }

    .title-link:hover {
        text-decoration: underline;
        color: inherit;
    }

    .card-title a {
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .card-title a:hover {
        text-decoration: underline;
    }
</style>

<div class="content">
    <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="text-body">Temas publicados</h2>
        <button class="btn btn-primary me-1 mb-1" type="button" id="nuevoTemaBtn" data-bs-toggle="modal"
            data-bs-target="#modalNuevoTema">
            <i class="fas fa-plus me-1"></i>Nuevo tema
        </button>
    </div>

    <div id="temasContainer" class="row">
        <!-- Las cards se cargarán aquí dinámicamente -->
    </div>

    <div class="text-center mt-3" id="cargandoTemas">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando temas...</span>
        </div>
        <p>Cargando temas...</p>
    </div>
</div>

<?php
include "modals/nuevoTema.php";
?>

<script type="module">
    import {
        postService
    } from '../services/api/index.js';

    async function obtenerDatosAutor(id) {
        const response = await consultarDatosDoctor(id);
        return response;
    }

    function truncarContenido(texto, maxCaracteres = 100) {
        if (!texto) return '';

        const primeraLinea = texto.split('\n')[0];

        if (primeraLinea.length > maxCaracteres) {
            return primeraLinea.substring(0, maxCaracteres) + '...';
        }

        if (texto.split('\n').length > 1 && primeraLinea.length > 0) {
            return primeraLinea + '...';
        }

        return primeraLinea;
    }

    async function crearCardPost(post) {
        try {
            const autor = await consultarDatosDoctor(post.attributes.user_id);
            const contenidoResumido = truncarContenido(post.attributes.content);

            return `
            <div class="col-sm-12 mb-3">
                <div class="card border border-light">
                    <div class="card-body">
                    <h4 class="card-title">
                            <a href="/verPublicacion?id=${post.id}" class="title-link">
                                ${post.attributes.title}
                            </a>
                        </h4>
                        <p class="card-text">${contenidoResumido}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Publicado por: ${autor.nombre || 'Usuario'}</small>
                            <small class="text-muted">${post.relationships.comments.data.length} comentarios</small>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } catch (error) {
            console.error("Error al obtener datos del autor:", error);
            const contenidoResumido = truncarContenido(post.attributes.content);

            return `
            <div class="col-sm-12 mb-3">
                <div class="card border border-light">
                    <div class="card-body">
                    <h4 class="card-title">
                            <a href="/verPublicacion?id=${post.id}" class="title-link">
                                ${post.attributes.title}
                            </a>
                        </h4>
                        <p class="card-text">${contenidoResumido}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Publicado por: Usuario ${post.attributes.user_id}</small>
                            <small class="text-muted">${post.relationships.comments.data.length} comentarios</small>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }

    async function cargarPosts() {
        const container = document.getElementById('temasContainer');
        const cargando = document.getElementById('cargandoTemas');

        try {
            cargando.style.display = 'block';
            container.innerHTML = '';

            const response = await postService.getAllPosts();

            if (response && response.data && Array.isArray(response.data)) {
                const postsOrdenados = response.data.sort((a, b) => b.id - a.id);

                const cards = await Promise.all(postsOrdenados.map(post => crearCardPost(post)));

                container.innerHTML = cards.join('');
            } else {
                console.error("La respuesta no contiene datos válidos:", response);
                container.innerHTML = '<p>No se encontraron publicaciones.</p>';
            }
        } catch (error) {
            console.error("Error al cargar los posts:", error);
            container.innerHTML = '<p>Error al cargar las publicaciones.</p>';
        } finally {
            cargando.style.display = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', cargarPosts);
</script>

<?php
include "../footer.php";
?>