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
                    <div class="col-md-6">
                        <label class="form-label text-body" for="secondName">Segundo Nombre</label>
                        <input class="form-control" type="text" name="secondName" placeholder="Segundo Nombre" id="secondName">
                    </div>
                    <div class="col-6">
                        <label class="form-label text-body" for="lastName">Primer Apellido*</label>
                        <input class="form-control" type="text" name="lastName" placeholder="Primer apellido" id="lastName">
                    </div>
                    <div class="col-6">
                        <label class="form-label text-body" for="secondLastName">Segundo Apellido</label>
                        <input class="form-control" type="text" name="secondLastName" placeholder="Segundo Apellido" id="secondLastName">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="type-document">Tipo de documento</label>
                        <select class="form-select" name="typeDocument" id="type-document">
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
                                <option value="<?= $key ?>"><?= $value ?></option>
                            <?php } ?>
                        </select>
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary save-btn" type="button">Guardar</button>
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
    const modalElement = document.getElementById('newCompanionModal');
    const toastElement = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    let saveClicked = false;

    document.querySelector('.save-btn').addEventListener('click', () => {
        saveClicked = true;
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (saveClicked) {
                toast.show();
                saveClicked = false;
            }
        }, {
            once: true
        });
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
    });
</script>