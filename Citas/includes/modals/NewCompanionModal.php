<?php
$documentType = array("CI - Cédula de Identidad", "CR - Carnet de Residencia", "CM - Carnet de Menor de Edad", "AN - Acta de Nacimiento", "LC - Licencia de Conducción", "Otros");
$relations = array("Padre", "Madre", "Hermano (a)", "Tio (a)", "Abuelo (a)", "Primo (a)", "Amigo (a)", "Esposo (a)", "Otro");
?>
<div class="modal fade" id="newCompanionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo acompañante</h5><button class="btn btn-close p-1 closet-btn" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3" id="partnerForm">
                    <div class="col-md-6">
                        <label class="form-label text-body" for="firstName">Primer Nombre*</label>
                        <input class="form-control" type="text" name="firstName" placeholder="Primer Nombre" id="firstName">
                    </div>
                    <div class="col-6">
                        <label class="form-label text-body" for="lastName">Primer Apellido*</label>
                        <input class="form-control" type="text" name="lastName" placeholder="Primer apellido" id="lastName">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="type-document">Tipo de documento</label>
                        <select class="form-select" name="typeDocument" id="docuementType">
                            <option value="">Seleccionar</option>
                            <?php foreach ($documentType as $key => $value) { ?>
                                <option value="<?= $key ?>"><?= $value ?></option>
                            <?php } ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-body" for="numberIdentification">Número de identificación*</label>
                        <input class="form-control" type="number" name="numberIdentification" placeholder="Número de identificación" id="numberIdentification">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="whatsapp">WhatsApp*</label>
                        <input class="form-control" type="text" name="whatsapp" placeholder="Whatsapp" id="whatsapp">
                    </div>
                    <div class="col-md-6">
                        <label for="relationSelect" class="form-label">Parentesco</label>
                        <select class="form-select" id="relationSelect" aria-label="Default select example">
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
                <button class="btn btn-primary closet-btn" type="button">Guardar</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>
<div class="position-relative mb-4" aria-live="polite" aria-atomic="true" style="min-height: 130px;">
    <div class="toast position-absolute top-0 end-0">
        <div class="toast-header">
            <strong class="me-auto">Bootstrap</strong>
            <small class="text-body-secondary">Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">Hello, world! This is a toast message.</div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {

        // Función para agregar una nueva fila a la tabla del primer modal
        const addRowToFormAdmission = () => {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const documentType = document.getElementById('docuementType').value;
            const idNumber = document.getElementById('numberIdentification').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const relation = document.getElementById('relationSelect').value;
            const email = document.getElementById('email').value;

            document.getElementById('firstNameAcompanion').value = firstName;
            document.getElementById('lastNameAcompanion').value = lastName;
            document.getElementById('typeDocumentAcompanion').value = documentType;
            document.getElementById('numberIdentificationAcompanion').value = idNumber;
            document.getElementById('whatsappAcompanion').value = whatsapp;
            document.getElementById('relationshipAcompanion').value = relation;
            document.getElementById('emailCompanion').value = email;

            $('#newCompanionModal').modal('hide');
        };

        // Evento para el botón existente de guardar
        document.querySelector('.modal-footer .btn-primary.closet-btn').addEventListener('click', addRowToFormAdmission);

    });
</script>