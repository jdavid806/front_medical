<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div class="main-content">
            <div class="component-container">
                <button id="generarOrden">Generar orden</button>
                <button id="consultarOrden">Consultar orden</button>
                <button id="anularOrden">Anular orden</button>
                <button id="obtenerOrdenPDF">Obtener orden PDF</button>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
include "../Pacientes/modalPacientes.php";
?>

<script type="module">
    import {
        labplusService
    } from './services/labplus/labplusService.js';

    const generarOrden = document.getElementById('generarOrden');
    const consultarOrden = document.getElementById('consultarOrden');
    const anularOrden = document.getElementById('anularOrden');
    const obtenerOrdenPDF = document.getElementById('obtenerOrdenPDF');

    generarOrden.addEventListener('click', () => {
        console.log('Generar orden');

        labplusService.createAndUpdateLaboratoryOrderByAdmissionId({
            admissionId: 27
        });
    });

    consultarOrden.addEventListener('click', () => {
        console.log('Consultar orden');
    });

    anularOrden.addEventListener('click', () => {
        console.log('Anular orden');

        labplusService.cancelOrder({
            numero_orden: "1-35241"
        });
    });

    obtenerOrdenPDF.addEventListener('click', () => {
        console.log('Obtener orden PDF');

        labplusService.getOrderPDF({
            numero_orden: "27"
        });
    });
</script>