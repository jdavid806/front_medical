<div class="modal fade" id="invoiceElectronicModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Facturación electronica</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card theme-wizard mb-5" data-theme-wizard="data-theme-wizard">
                    <div class="card-header bg-body-highlight pt-3 pb-2 border-bottom-0">
                        <ul class="nav justify-content-between nav-wizard nav-wizard-success">
                            <li class="nav-item"><a class="nav-link active fw-semibold" href="#bootstrap-wizard-tab1" data-bs-toggle="tab" data-wizard-step="1">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle"><span class="fas fa-lock"></span></span></span><span class="d-none d-md-block mt-1 fs-9">Información General</span></div>
                                </a></li>
                            <li class="nav-item"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab2" data-bs-toggle="tab" data-wizard-step="2">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle"><span class="fas fa-user"></span></span></span><span class="d-none d-md-block mt-1 fs-9">Información del Establecimiento</span></div>
                                </a></li>
                            <li class="nav-item"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab3" data-bs-toggle="tab" data-wizard-step="3">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle"><span class="fas fa-file-alt"></span></span></span><span class="d-none d-md-block mt-1 fs-9">Configuraciones de Envío</span></div>
                                </a></li>
                            <li class="nav-item"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab4" data-bs-toggle="tab" data-wizard-step="4">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle"><span class="fas fa-check"></span></span></span><span class="d-none d-md-block mt-1 fs-9">Totales</span></div>
                                </a></li>
                            <li class="nav-item"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab5" data-bs-toggle="tab" data-wizard-step="5">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle"><span class="fas fa-cog"></span></span></span><span class="d-none d-md-block mt-1 fs-9">Líneas de Factura</span></div>
                                </a></li>
                            <li class="nav-item"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab6" data-bs-toggle="tab" data-wizard-step="6">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle"><span class="fas fa-check"></span></span></span><span class="d-none d-md-block mt-1 fs-9">Done</span></div>
                                </a></li>

                    </div>
                    <!-- Wizard Body -->
                    <div class="card-body pt-4 pb-0">
                        <div class="tab-content">
                            <div class="tab-pane active" role="tabpanel" aria-labelledby="bootstrap-wizard-tab1" id="bootstrap-wizard-tab1">
                                <!-- Datos del paciente -->
                                <form id="wizardForm1" novalidate="novalidate" data-wizard-form="1" id="wizardValidationForm1">
                                    <div class="card">

                                        <div class=" card-body">
                                            <h5 class="card-title">Información de la factura</h5>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label" for="bootstrap-wizard-validation-type-document">Tipo de documento</label>
                                                        <select class="form-select" name="typeDocument" id="bootstrap-wizard-validation-type-document" disabled>
                                                            <option value="">Seleccionar</option>
                                                            <option value="CEDULA" <?php echo ($patient['typeDocument'] == 'CEDULA') ? 'selected' : ''; ?>>Cédula</option>
                                                            <option value="PASAPORTE" <?php echo ($patient['typeDocument'] == 'PASAPORTE') ? 'selected' : ''; ?>>Pasaporte</option>
                                                            <option value="OTRO" <?php echo ($patient['typeDocument'] == 'OTRO') ? 'selected' : ''; ?>>Otro</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="numberIdentification">Número*</label>
                                                        <input class="form-control" type="number" name="numberIdentification" placeholder="Número de identificación" id="numberIdentification" value="<?php echo $patient['document']; ?>" disabled>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label" for="dateBirth">Fecha de creación*</label>
                                                        <input class="form-control datetimepicker flatpickr-input" id="dateBirth" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly" disabled value="<?php echo $patient['dateBirth']; ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="secondName">Hora</label>

                                                        <label class="form-label" for="timepicker1">Start Time</label>
                                                        <input class="form-control datetimepicker flatpickr-input" id="timepicker1" type="text" placeholder="hour : minute" data-options="{&quot;enableTime&quot;:true,&quot;noCalendar&quot;:true,&quot;dateFormat&quot;:&quot;H:i&quot;,&quot;disableMobile&quot;:true}" readonly="readonly">

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="firstName">Número de resolución*</label>
                                                        <input class="form-control" type="text" name="firstName" placeholder="Primer apellido" id="firstName" value="<?php echo $patient['lastName']; ?>" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="secondLastName">Notas</label>
                                                        <input class="form-control" type="text" name="secondLastName" placeholder="Segundo Apellido" id="secondLastName" disabled value="<?php echo $patient['secondLastName']; ?>">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label" for="dateBirth">Fecha de nacimiento*</label>
                                                        <input class="form-control datetimepicker flatpickr-input" id="dateBirth" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly" disabled value="<?php echo $patient['dateBirth']; ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="gender">Género</label>
                                                        <select class="form-select" name="gender" id="gender" disabled>
                                                            <option value="">Seleccionar</option>
                                                            <option value="MASCULINO" <?php echo ($patient['gender'] == 'MASCULINO') ? 'selected' : ''; ?>>Masculino</option>
                                                            <option value="FEMENINO" <?php echo ($patient['gender'] == 'FEMENINO') ? 'selected' : ''; ?>>Femenino</option>
                                                            <option value="OTRO" <?php echo ($patient['gender'] == 'OTRO') ? 'selected' : ''; ?>>Otro</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label" for="countrySelect">País</label>
                                                        <select class="form-select" id="countrySelect" data-choices='{"searchPlaceholderValue": "Buscar país..."}' disabled>
                                                            <option value="">Seleccionar</option>
                                                            <option value="ARGENTINA" <?php echo ($patient['country'] == 'ARGENTINA') ? 'selected' : ''; ?>>Argentina</option>
                                                            <option value="COLOMBIA" <?php echo ($patient['country'] == 'COLOMBIA') ? 'selected' : ''; ?>>Colombia</option>
                                                            <option value="MEXICO" <?php echo ($patient['country'] == 'MEXICO') ? 'selected' : ''; ?>>México</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="citySelect">Ciudad</label>
                                                        <select class="form-select" id="citySelect" data-choices='{"searchPlaceholderValue": "Buscar ciudad..."}' disabled>
                                                            <option value="">Seleccionar</option>
                                                            <option value="Barranquilla" <?php echo ($patient['city'] == 'Barranquilla') ? 'selected' : ''; ?>>Barranquilla</option>
                                                            <option value="Bogotá" <?php echo ($patient['city'] == 'Bogotá') ? 'selected' : ''; ?>>Bogotá</option>
                                                            <option value="Medellín" <?php echo ($patient['city'] == 'Medellín') ? 'selected' : ''; ?>>Medellín</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="address">Dirección*</label>
                                                        <input class="form-control" type="text" name="address" placeholder="Dirección" id="address" value="<?php echo $patient['address']; ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="email">Correo electrónico*</label>
                                                        <input class="form-control" type="email" name="email" placeholder="Correo electronico" id="email" value="<?php echo $patient['email']; ?>">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="phone">Teléfono*</label>
                                                        <input class="form-control" type="tel" name="phone" placeholder="Teléfono" id="phone" value="<?php echo $patient['phone']; ?>" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="whatsapp">WhatsApp*</label>
                                                        <input class="form-control" type="text" name="whatsapp" placeholder="Whatsapp" id="whatsapp" value="<?php echo $patient['whatsapp']; ?>">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="card mt-4">

                                        <div class="card-body">
                                            <div class="d-flex">
                                                <div class="form-check form-switch me-3">
                                                    <input class="form-check-input" id="flexSwitchCheckDefault" type="checkbox">
                                                    <label class="form-check-label text-primary" for="flexSwitchCheckDefault">Acompañante</label>
                                                </div>
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="flexSwitchCheckChecked" type="checkbox">
                                                    <label class="form-check-label text-primary" for="flexSwitchCheckChecked">Entidad</label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </form>

                                <!-- Información del acompañante -->
                                <div class="card mt-4" id="infoAcompanante" style="display: none;">

                                    <div class="card-body">
                                        <h5 class="card-title">Parentesco</h5>

                                        <select class="form-select" id="relationSelect" aria-label="Default select example">
                                            <option selected="">Seleccionar</option>
                                            <?php foreach ($relations as $key => $value) { ?>
                                                <option value="<?= $key ?>"><?= $value ?></option>
                                            <?php } ?>
                                        </select>

                                    </div>

                                    <div class="card-body" id="companionForm">
                                        <h5 class="card-title">Información del acompañante</h5>
                                        <div class="row g-3 mb-3">
                                            <div class="col-sm-6">
                                                <div class="mb-2 mb-sm-0">
                                                    <label class="form-label" for="bootstrap-wizard-validation-type-document">Tipo de documento</label>
                                                    <select class="form-select" name="typeDocument" id="bootstrap-wizard-validation-type-document" disabled>
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
                                                    <input class="form-control" type="number" name="numberIdentification" placeholder="Número de identificación" id="numberIdentification" value="<?php echo $companier['document']; ?>" disabled>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-3 mb-3">
                                            <div class="col-sm-6">
                                                <div class="mb-2 mb-sm-0">
                                                    <label class="form-label text-body" for="firstName">Primer Nombre*</label>
                                                    <input class="form-control" type="text" name="firstName" placeholder="Primer Nombre" id="firstName" value="<?php echo $companier['firstName']; ?>" disabled>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-2">
                                                    <label class="form-label text-body" for="secondName">Segundo Nombre</label>
                                                    <input class="form-control" type="text" name="secondName" placeholder="Segundo Nombre" id="secondName" disabled value="<?php echo $companier['secondName']; ?>">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-3 mb-3">
                                            <div class="col-sm-6">
                                                <div class="mb-2 mb-sm-0">
                                                    <label class="form-label text-body" for="firstName">Primer Apellido*</label>
                                                    <input class="form-control" type="text" name="firstName" placeholder="Primer apellido" id="firstName" value="<?php echo $companier['lastName']; ?>" disabled>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-2">
                                                    <label class="form-label text-body" for="secondLastName">Segundo Apellido</label>
                                                    <input class="form-control" type="text" name="secondLastName" placeholder="Segundo Apellido" id="secondLastName" disabled value="<?php echo $companier['secondLastName']; ?>">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row g-3 mb-3">
                                            <div class="col-sm-12">
                                                <div class="mb-2">
                                                    <label class="form-label" for="whatsapp">WhatsApp*</label>
                                                    <input class="form-control" type="text" name="whatsapp" placeholder="Whatsapp" id="whatsapp" value="<?php echo $companier['whatsapp']; ?>">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Entidad -->
                                <div class="card mt-4" id="infoEntidad" style="display: none;">
                                    <div class=" card-body">
                                        <h5 class="card-title">Información de la entidad</h5>
                                        <div class="row g-3 mb-3">
                                            <div class="col-sm-6">
                                                <div class="mb-2 mb-sm-0">
                                                    <label class="form-label" for="relationSelect">Tipo de rips</label>
                                                    <select class="form-select" id="relationSelect" aria-label="Default select example">
                                                        <option selected="">Seleccionar</option>
                                                        <?php foreach ($rips as $key => $value) { ?>
                                                            <option value="<?= $key ?>"><?= $value ?></option>
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-2">
                                                    <label class="form-label" for="typeConsult">Tipo de consulta *</label>
                                                    <select class="form-select" name="seller" id="seller" required="required">
                                                        <option value="">Seleccionar</option>
                                                        <?php foreach ($typeConsults as $key => $value) { ?>
                                                            <option value="<?= $key ?>"><?= $value ?></option>
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-3 mb-3">
                                            <div class="col-sm-6">
                                                <div class="mb-2 mb-sm-0">
                                                    <label class="form-label" for="seller">Finalidad de la consulta *</label>
                                                    <select class="form-select" name="seller" id="seller" required="required">
                                                        <option value="">Seleccionar</option>
                                                        <?php foreach ($purposeConsultation as $key => $value) { ?>
                                                            <option value="<?= $key ?>"><?= $value ?></option>
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-2">
                                                    <label class="form-label" for="seller">Causa externa*</label>
                                                    <select class="form-select" name="seller" id="seller" required="required">
                                                        <option value="">Seleccionar</option>
                                                        <?php foreach ($externalCause as $key => $value) { ?>
                                                            <option value="<?= $key ?>"><?= $value ?></option>
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-2">
                                                    <label class="form-label" for="seller">Entidad*</label>
                                                    <select class="form-select" name="seller" id="seller" required="required">
                                                        <option value="">Seleccionar</option>
                                                        <?php foreach ($entities as $key => $value) { ?>
                                                            <option value="<?= $key ?>"><?= $value ?></option>
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-2">
                                                    <label class="form-label" for="authorisationNumber">Número de autorización*</label>
                                                    <input class="form-control" type="number" name="authorisationNumber" placeholder="111-222-333" id="authorisationNumber">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Sección Productos -->

                            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab2" id="bootstrap-wizard-tab2">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Seleccionar el producto</h5>
                                        <form class="needs-validation" id="wizardValidationForm2" novalidate="novalidate" data-wizard-form="2">
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label" for="subsidiary">Sucursal</label>
                                                        <input class="form-control" type="text" name="subsidiary" placeholder="Sucursal" id="subsidiary" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="bootstrap-wizard-validation-product">Producto</label>
                                                        <select class="form-select" name="product" id="bootstrap-wizard-validation-type-product" required="required">
                                                            <option value="">Seleccionar</option>
                                                            <?php foreach ($products as $key => $value) { ?>
                                                                <option value="<?= $key ?>" data-price="<?= $value['price'] ?>"><?= $value['name'] ?></option>
                                                            <?php } ?>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div id="formProduct">
                                                <div class="row g-3 mb-3">
                                                    <div class="col-sm-4">
                                                        <div class="mb-2 mb-sm-0">
                                                            <label class="form-label" for="price">Precio</label>
                                                            <input class="form-control" type="number" name="price" placeholder="Precio" id="price" disabled>
                                                            <div class="invalid-feedback">El campo es requerido.</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-4">
                                                        <div class="mb-2">
                                                            <label class="form-label" for="quality">Cantidad</label>
                                                            <input class="form-control" type="number" name="quality" placeholder="Cantidad" id="quality" required="required">
                                                            <div class="invalid-feedback">El campo es requerido.</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-4">
                                                        <div class="mb-2">
                                                            <label class="form-label" for="subtotal">Subtotal</label>
                                                            <input class="form-control" type="number" name="subtotal" placeholder="Subtotal" id="subtotal" required="required" disabled>
                                                            <div class="invalid-feedback">El campo es requerido.</div>
                                                        </div>

                                                    </div>
                                                    <div class="col-sm-4">
                                                        <div class="mb-2 mb-sm-0">
                                                            <label class="form-label" for="tax">Impuesto</label>
                                                            <input class="form-control" type="text" name="tax" placeholder="Impuesto" id="tax">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-4">
                                                        <div class="mb-2 mb-sm-0">
                                                            <label class="form-label" for="taxValue">Valor Impuesto</label>
                                                            <input class="form-control" type="number" name="taxValue" placeholder="Valor Impuesto" id="taxValue">
                                                        </div>
                                                    </div>

                                                    <div class="col-sm-2 col-md-6 col-lg-4 d-flex align-items-end">
                                                        <div class="mb-2">
                                                            <button class="btn btn-primary w-100 rounded-pill" type="button" id="addProduct"><i class="far fa-plus-square"></i> Agregar producto</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            <div id="formEntity">
                                                <div class="row g-3 mb-3">
                                                    <div class="col-sm-6">
                                                        <div class="mb-2 mb-sm-0">
                                                            <label class="form-label" for="price">Copago</label>
                                                            <input class="form-control" type="number" name="price" placeholder="Precio" id="price" disabled>
                                                            <div class="invalid-feedback">El campo es requerido.</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="mb-2">
                                                            <label class="form-label" for="quality">Cantidad</label>
                                                            <input class="form-control" type="number" name="quality" placeholder="Cantidad" id="quality" required="required">
                                                            <div class="invalid-feedback">El campo es requerido.</div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>



                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">Lista de productos</h5>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" class="small">#</th>
                                                                <th scope="col" class="small">Descripción del Producto</th>
                                                                <th scope="col" class="small">Precio</th>
                                                                <th scope="col" class="small">Porcentaje Impuesto</th>
                                                                <th scope="col" class="small">Cantidad</th>
                                                                <!-- <th scope="col" class="small">Impuesto</th> -->
                                                                <th scope="col" class="small">Total</th>
                                                                <th scope="col" class="small"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="productsTableBody">
                                                            <tr></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div class="card mt-4">
                                                <div class="card-body">
                                                    <h5 class="card-title">Detalles de la factura</h5>
                                                    <div class="container text-center">
                                                        <div class="row row-cols-2">
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Lista de Método de Pago</h4>
                                                                        <table class="table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col" class="small">#</th>
                                                                                    <th scope="col" class="small">Método de Pago</th>
                                                                                    <th scope="col" class="small">Monto</th>
                                                                                    <th scope="col" class="small"></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody id="paymentTableBody">
                                                                                <tr></tr>
                                                                            </tbody>
                                                                        </table>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Método de Pago</h4>

                                                                        <div class="row g-3">
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="methodPayment">Método de pago</label>
                                                                                <select class="form-select" id="methodPayment">
                                                                                    <option selected="selected">Seleccionar</option>
                                                                                    <?php foreach ($paymentMethods as $key => $value) { ?>
                                                                                        <option value="<?= $key ?>"><?= $value ?></option>
                                                                                    <?php } ?>
                                                                                </select>
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="amount">Monto</label>
                                                                                <input class="form-control" id="amount" type="numeric">
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <button class="btn btn-primary w-100 rounded-pill" type="button" id="payButton"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Observaciones o notas</h4>
                                                                        <textarea class="form-control" rows="5" id="<?php echo $companier['whatsapp']; ?> address" required="required"></textarea>
                                                                        <div class="invalid-feedback">This field is required.</div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Montos</h4>

                                                                        <div class="row g-3">

                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="pending">Monto Pendiente</label>
                                                                                <input class="form-control" id="pending" type="number" disabled>
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">

                                                                                <label class="form-label" for="datepicker">Fecha de vencimiento</label>
                                                                                <input class="form-control datetimepicker flatpickr-input" id="datepicker" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">

                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">

                                                                                <label class="form-label" for="customFile">Documentos</label>
                                                                                <input class="form-control" id="customFile" type="file">

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <!-- Previsualización -->
                            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab3" id="bootstrap-wizard-tab3">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Previsualización</h5>
                                        <div class="bg-body dark__bg-gray-1100 p-4 mb-4 rounded-2">
                                            <div class="row g-4">
                                                <div class="col-12 col-lg-3">
                                                    <div class="row g-4 g-lg-2">
                                                        <div class="col-12 col-sm-6 col-lg-12">
                                                            <div class="row align-items-center g-0">
                                                                <div class="col-auto col-lg-6 col-xl-5">
                                                                    <h6 class="mb-0 me-3">Factura No :</h6>
                                                                </div>
                                                                <div class="col-auto col-lg-6 col-xl-7">
                                                                    <p class="fs-9 text-body-secondary fw-semibold mb-0">#FLR978282</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-12 col-sm-6 col-lg-12">
                                                            <div class="row align-items-center g-0">
                                                                <div class="col-auto col-lg-6 col-xl-5">
                                                                    <h6 class="me-3">Fecha de Factura :</h6>
                                                                </div>
                                                                <div class="col-auto col-lg-6 col-xl-7">
                                                                    <p class="fs-9 text-body-secondary fw-semibold mb-0">19.06.2019</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-6 col-lg-5">
                                                    <div class="row g-4 gy-lg-5">
                                                        <div class="col-12 col-lg-8">
                                                            <h6 class="mb-2 me-3">Comprado por :</h6>
                                                            <p class="fs-9 text-body-secondary fw-semibold mb-0">PhoenixMart<br>36 greendowm road, California, Usa</p>
                                                        </div>
                                                        <div class="col-12 col-lg-4">
                                                            <h6 class="mb-2"> PAN No :</h6>
                                                            <p class="fs-9 text-body-secondary fw-semibold mb-0">XVCJ963782008</p>
                                                        </div>
                                                        <div class="col-12 col-lg-4">
                                                            <h6 class="mb-2"> GST Reg No :</h6>
                                                            <p class="fs-9 text-body-secondary fw-semibold mb-0">IX9878123TC</p>
                                                        </div>
                                                        <div class="col-12 col-lg-4">
                                                            <h6 class="mb-2"> Orden No :</h6>
                                                            <p class="fs-9 text-body-secondary fw-semibold mb-0">A-8934792734</p>
                                                        </div>
                                                        <div class="col-12 col-lg-4">
                                                            <h6 class="mb-2"> Fecha de Orden :</h6>
                                                            <p class="fs-9 text-body-secondary fw-semibold mb-0">19.06.2019</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-6 col-lg-4">
                                                    <div class="row g-4">
                                                        <div class="col-12 col-lg-6">
                                                            <h6 class="mb-2"> Dirección de facturación :</h6>
                                                            <div class="fs-9 text-body-secondary fw-semibold mb-0">
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">John Doe,</p>
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">36, Gree Donwtonwn,<br>Golden road, FL,</p>
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">johndoe@jeemail.com</p>
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">+334933029030</p>
                                                            </div>
                                                        </div>
                                                        <div class="col-12 col-lg-6">
                                                            <h6 class="mb-2"> Dirección de envío :</h6>
                                                            <div class="fs-9 text-body-secondary fw-semibold mb-0">
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">John Doe,</p>
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">36, Gree Donwtonwn,<br>Golden road, FL,</p>
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">johndoe@jeemail.com</p>
                                                                <p class="fs-9 text-body-secondary fw-semibold mb-0">+334933029030</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="px-0">
                                            <div class="table-responsive scrollbar">
                                                <table class="table fs-9 text-body mb-0">
                                                    <thead class="bg-body-secondary">
                                                        <tr>
                                                            <th scope="col" class="small" style="width: 24px;"></th>
                                                            <th scope="col" class="small" style="min-width: 60px;">SL NO.</th>
                                                            <th scope="col" class="small" style="min-width: 360px;">Productos</th>
                                                            <th class="ps-5 small" scope="col" style="min-width: 150px;">Color</th>
                                                            <th scope="col" class="small" style="width: 60px;">Tamaño</th>
                                                            <th class="text-end small" scope="col" style="width: 80px;">Cantidad</th>
                                                            <th class="text-end small" scope="col" style="width: 100px;">Precio</th>
                                                            <th class="text-end small" scope="col" style="width: 138px;">Tax Rate</th>
                                                            <th class="text-center small" scope="col" style="width: 80px;">Tipo impuesto</th>
                                                            <th class="text-end small" scope="col" style="min-width: 92px;">Impuesto</th>
                                                            <th class="text-end small" scope="col" style="min-width: 60px;">Total</th>
                                                            <th scope="col" class="small" style="width: 24px;"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="border-0 small"></td>
                                                            <td class="align-middle small">1</td>
                                                            <td class="align-middle small">
                                                                <p class="line-clamp-1 mb-0 fw-semibold small">Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management &amp; Skin Temperature Trends, Carbon/Graphite, One Size (S &amp; L Bands)</p>
                                                            </td>
                                                            <td class="align-middle small ps-5">Glossy black</td>
                                                            <td class="align-middle small text-body-tertiary fw-semibold">XL</td>
                                                            <td class="align-middle small text-end text-body-highlight fw-semibold">2</td>
                                                            <td class="align-middle small text-end fw-semibold">$299</td>
                                                            <td class="align-middle small text-end">2.5%</td>
                                                            <td class="align-middle small text-center fw-semibold">VAT</td>
                                                            <td class="align-middle small text-end fw-semibold">$199</td>
                                                            <td class="align-middle small text-end fw-semibold">$398</td>
                                                            <td class="border-0"></td>
                                                        </tr>


                                                        <tr class="bg-body-secondary">
                                                            <td></td>
                                                            <td class="small align-middle fw-semibold" colspan="9">Subtotal</td>
                                                            <td class="small align-middle text-end fw-bold">$398</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="small border-0"></td>
                                                            <td colspan="6"></td>
                                                            <td class="small align-middle fw-bold ps-15" colspan="2">Gastos de envío</td>
                                                            <td class="small align-middle text-end fw-semibold" colspan="2">$50</td>
                                                            <td class="border-0"></td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td colspan="6"></td>
                                                            <td class="small align-middle fw-bold ps-15" colspan="2">Descuento/Vale</td>
                                                            <td class="small align-middle text-end fw-semibold text-danger" colspan="2">-$50</td>
                                                            <td></td>
                                                        </tr>
                                                        <tr class="bg-body-secondary">
                                                            <td class="small align-middle ps-4 fw-bold text-body-highlight" colspan="3">Total general</td>
                                                            <td class="small align-middle fw-bold text-body-highlight" colspan="7">Trescientos noventa y ocho USD</td>
                                                            <td class="small align-middle text-end fw-bold">$398</td>
                                                            <td></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="text-end py-9 border-bottom"><img class="mb-3" src="../../../assets/img/logos/phoenix-mart.png" alt="">
                                                <h4 class="small">Firmante autorizado</h4>
                                            </div>

                                        </div>
                                        <div class="d-flex justify-content-between"><button class="btn btn-primary btn-sm small"><svg class="svg-inline--fa fa-bag-shopping me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bag-shopping" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                    <path fill="currentColor" d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path>
                                                </svg><!-- <span class="fa-solid fa-bag-shopping me-2"></span> Font Awesome fontawesome.com -->Ver más artículos</button>
                                            <div><button class="btn btn-phoenix-secondary me-2"><svg class="svg-inline--fa fa-download me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                                        <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                                                    </svg><!-- <span class="fa-solid fa-download me-sm-2"></span> Font Awesome fontawesome.com --><span class="d-none d-sm-inline-block small">Descargar Factura</span></button><button class="btn btn-phoenix-secondary"><svg class="svg-inline--fa fa-print me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="print" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                                        <path fill="currentColor" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                                                    </svg><!-- <span class="fa-solid fa-print me-sm-2"></span> Font Awesome fontawesome.com --><span class="d-none d-sm-inline-block small">Imprimir</span></button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab4" id="bootstrap-wizard-tab4">
                                <div class="row flex-center pb-8 pt-4 gx-3 gy-4">
                                    <div class="col-12 col-sm-auto">
                                        <div class="text-center text-sm-start"><img class="d-dark-none" src="../../assets/img/spot-illustrations/38.webp" alt="" width="220"><img class="d-light-none" src="../../assets/img/spot-illustrations/dark_38.webp" alt="" width="220"></div>
                                    </div>
                                    <div class="col-12 col-sm-auto">
                                        <div class="text-center text-sm-start">
                                            <h5 class="mb-3">You are all set!</h5>
                                            <p class="text-body-emphasis fs-9">Now you can access your account<br>anytime anywhere</p><a class="btn btn-primary px-6" href="../../modules/forms/wizard.html">Start Over</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer border-top-0" data-wizard-footer="data-wizard-footer">
                        <div class="d-flex pager wizard list-inline mb-0"><button class="d-none btn btn-link ps-0" type="button" data-wizard-prev-btn="data-wizard-prev-btn"><svg class="svg-inline--fa fa-chevron-left me-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                                    <g transform="translate(160 256)">
                                        <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                            <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" transform="translate(-160 -256)"></path>
                                        </g>
                                    </g>
                                </svg><!-- <span class="fas fa-chevron-left me-1" data-fa-transform="shrink-3"></span> Font Awesome fontawesome.com -->Anterior</button>
                            <div class="flex-1 text-end"><button class="btn btn-primary px-6 px-sm-6" type="submit" data-wizard-next-btn="data-wizard-next-btn">Siguiente<svg class="svg-inline--fa fa-chevron-right ms-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                                        <g transform="translate(160 256)">
                                            <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                                <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" transform="translate(-160 -256)"></path>
                                            </g>
                                        </g>
                                    </svg><!-- <span class="fas fa-chevron-right ms-1" data-fa-transform="shrink-3"> </span> Font Awesome fontawesome.com --></button></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer"><button class="btn btn-primary" type="button">Okay</button><button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancel</button></div>
        </div>
    </div>
</div>