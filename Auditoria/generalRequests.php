<?php
include "../menu.php";
include "../header.php";
?>
<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Estados de las solicitudes</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-0">Estados de las solicitudes</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div id="solvedRequestsReact"></div>
        </div>
    </div>

    <script>
        function aceptarAnulacion(id) {
            console.log('Aceptando anulación para historia clinica con ID:', id);

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, aceptar anulación',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Anulacion aceptada con ID:', id);
                    Swal.fire(
                        '¡Aceptado!',
                        'Se ha aceptado la anulación de la historia clinica.',
                        'success'
                    );
                }
            });
        }

        function rechazarAnulacion(id) {
            console.log('Rechazando anulación para historia clinica con ID:', id);

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, rechazar anulación',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Anulación rechazada con ID:', id);
                    Swal.fire(
                        '¡Rechazado!',
                        'Se ha rechazado la anulación de la historia clinica.',
                        'success'
                    );
                }
            });
        }
    </script>

    <script type="module">
        import React from "react";
        import ReactDOMClient from "react-dom/client";
        import {
            SolvedRequestsTable
        } from './react-dist/general-request/components/SolvedRequestsTable.js';

        const rootElement = document.getElementById('solvedRequestsReact');
        ReactDOMClient.createRoot(rootElement).render(React.createElement(SolvedRequestsTable));
    </script>

    <?php include "../footer.php"; ?>
</div>