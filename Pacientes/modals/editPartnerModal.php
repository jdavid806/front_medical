<div class="modal fade" id="editPartnerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar acompañante</h5><button class="btn btn-close p-1 closet-btn" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <div class="mb-2 mb-sm-0">
                            <label for="relationSelect" class="form-label">Parentesco</label>
                            <select class="form-select" id="relationSelect" name="relationship" aria-label="Default select example">
                                <option selected="">Seleccionar</option>
                                <?php foreach ($relations as $key => $value) { ?>
                                    <option value="<?= $key ?>"><?= $value ?></option>
                                <?php } ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-2">
                            <label class="form-label" for="whatsapp">WhatsApp*</label>
                            <input class="form-control" type="text" name="whatsapp" placeholder="Whatsapp" id="whatsapp" value="<?php echo $companier['whatsapp']; ?>">
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="mb-2 mb-sm-0">
                            <label class="form-label" for="bootstrap-wizard-validation-type-document">Tipo de documento</label>
                            <select class="form-select" name="typeDocument" id="bootstrap-wizard-validation-type-document">
                                <option value="">Seleccionar</option>
                                <option value="CEDULA" <?php echo ($companier['typeDocument'] == 'CEDULA') ? 'selected' : ''; ?>>Cédula</option>
                                <option value="PASAPORTE" <?php echo ($companier['typeDocument'] == 'PASAPORTE') ? 'selected' : ''; ?>>Pasaporte</option>
                                <option value="OTRO" <?php echo ($companier['typeDocument'] == 'OTRO') ? 'selected' : ''; ?>>Otro</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-2">
                            <label class="form-label text-body" for="numberIdentification">Número de identificación*</label>
                            <input class="form-control" type="number" name="numberIdentification" placeholder="Número de identificación" id="numberIdentification" value="<?php echo $companier['document']; ?>">
                        </div>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="firstName">Primer Nombre*</label>
                            <input class="form-control" type="text" name="firstName" placeholder="Primer Nombre" id="firstName" value="<?php echo $companier['firstName']; ?>">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-2">
                            <label class="form-label text-body" for="secondName">Segundo Nombre</label>
                            <input class="form-control" type="text" name="secondName" placeholder="Segundo Nombre" id="secondName" value="<?php echo $companier['secondName']; ?>">
                        </div>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                        <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="firstName">Primer Apellido*</label>
                            <input class="form-control" type="text" name="firstName" placeholder="Primer apellido" id="firstName" value="<?php echo $companier['lastName']; ?>">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-2">
                            <label class="form-label text-body" for="secondLastName">Segundo Apellido</label>
                            <input class="form-control" type="text" name="secondLastName" placeholder="Segundo Apellido" id="secondLastName" value="<?php echo $companier['secondLastName']; ?>">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer"><button class="btn btn-primary closet-btn" type="button">Guardar</button><button class="btn btn-outline-primary closet-btn" type="button" data-bs-dismiss="modal">Cancelar</button></div>
        </div>
    </div>
</div>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const secondModal = document.getElementById('editPartnerModal');
        const firstModal = document.getElementById('modalCrearPaciente'); // Asegúrate de que este ID es correcto

        // Función para cerrar el segundo modal y abrir el primero
        const switchToFirstModal = () => {
            $('#editPartnerModal').modal('hide'); // Cierra el segundo modal
            $('#modalCrearPaciente').modal('show'); // Abre el primer modal
        };

        // Asigna la función a todos los botones con la clase "closet-btn"
        document.querySelectorAll('.closet-btn').forEach(button => {
            button.addEventListener('click', switchToFirstModal);
        });
    });
</script>