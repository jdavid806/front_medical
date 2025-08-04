<?php
$documentType = array("CI - Cédula de Identidad", "CR - Carnet de Residencia", "CM - Carnet de Menor de Edad", "AN - Acta de Nacimiento", "LC - Licencia de Conducción", "Otros");
$relations = array("Padre", "Madre", "Hermano (a)", "Tio (a)", "Abuelo (a)", "Primo (a)", "Amigo (a)", "Esposo (a)", "Otro");
?>

<div class="modal fade" id="newPartnerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo acompañante</h5><button class="btn btn-close p-1 closet-btn" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3" id="partnerForm">
                    <div class="col-md-6">
                        <label class="form-label text-body" for="companions[0][first_name]">Primer Nombre*</label>
                        <input class="form-control" type="text" name="first_name" placeholder="Primer Nombre" id="first_name">
                    </div>

                    <div class="col-6">
                        <label class="form-label text-body" for="last_name">Primer Apellido*</label>
                        <input class="form-control" type="text" name="last_name" placeholder="Primer apellido" id="last_name">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="document_type">Tipo de documento</label>
                        <select class="form-select" name="document_type" id="document_type">
                            <option value="">Seleccionar</option>
                            <?php foreach ($documentType as $key => $value) { ?>
                                <option value="<?= $key ?>"><?= $value ?></option>
                            <?php } ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-body" for="document_number">Número de identificación*</label>
                        <input class="form-control" type="text" name="document_number" placeholder="Número de identificación" id="document_number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="mobile">WhatsApp*</label>
                        <input class="form-control" type="tel" name="mobile" placeholder="Whatsapp" id="mobile">
                    </div>
                    <div class="col-md-6">
                        <label for="relationSelect" class="form-label">Parentesco</label>
                        <select class="form-select" id="relationSelect" name="relationship" aria-label="Default select example">
                            <option selected="">Seleccionar</option>
                            <?php foreach ($relations as $key => $value) { ?>
                                <option value="<?= $value ?>"><?= $value ?></option>
                            <?php } ?>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label" for="email">Correo Electronico*</label>
                        <input class="form-control" type="email" name="email" placeholder="Correo Electronico" id="email">
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary closet-btn" type="button" id="saveCompanionButton">Guardar</button>
                <button class="btn btn-outline-primary closet-btn" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>
<script>
    // Esperamos a que el DOM cargue completamente

    document.addEventListener('DOMContentLoaded', function() {

        // Función para agregar una nueva fila a la tabla del primer modal
        const addRowToTable = () => {
            const firstName = document.getElementById('first_name').value;
            const lastName = document.getElementById('last_name').value;
            const relation = document.getElementById('relationSelect').value;
            const idNumber = document.getElementById('document_number').value;
            const whatsapp = document.getElementById('mobile').value;

            if (!firstName || !lastName || !idNumber || !whatsapp || !relation) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            // Seleccionamos el cuerpo de la tabla en el primer modal
            const tableBody = document.querySelector('#modalCrearPaciente tbody');

            // Creamos una nueva fila
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
        <td class="align-middle ps-3">${firstName}</td>
        <td class="align-middle ps-3">${lastName}</td>
        <td class="align-middle">${relation}</td>
        <td class="align-middle">${idNumber}</td>
        <td class="align-middle">${whatsapp}</td>
        <td class="align-middle text-end">
            <button class="btn btn-danger btn-sm me-1 mb-1" type="button" onclick="deleteRow(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

            // Agregamos la nueva fila al cuerpo de la tabla
            tableBody.appendChild(newRow);

            // Limpiamos el formulario después de agregar la fila
            document.querySelector('#newPartnerModal form').reset();

            // Cerramos el modal del formulario
            $('#newPartnerModal').modal('hide');
            $('#modalCrearPaciente').modal('show');
        };

        // Evento para el botón existente de guardar
        document.querySelector('.modal-footer .btn-primary.closet-btn').addEventListener('click', addRowToTable);

        // Función para eliminar una fila
        window.deleteRow = function(button) {
            const row = button.closest('tr');
            row.remove();
        };
    });

    // document.getElementById('saveCompanionButton').addEventListener('click', function() {

    //     const companionForm = document.getElementById('partnerForm');
    //     const companionFormData = new FormData(companionForm);
    //     const companionData = {};

    //     companionFormData.forEach((value, key) => {
    //         companionData[key] = value;
    //     });

    //     // Almacenar los datos temporalmente
    //     companionsTemp.push(companionData);

    //     console.log('Companion Data', companionData);
    //     console.log('Companions Temp', companionsTemp);

    //     // Cerrar el modal de crear acompañante
    //     const createCompanionModal = bootstrap.Modal.getInstance(document.getElementById('newPartnerModal'));
    //     createCompanionModal.hide();
    // });
</script>