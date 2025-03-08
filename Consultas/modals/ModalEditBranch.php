<div class="modal fade" id="editBranchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar Sucursal</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <!-- Informacion de la sucursal -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Información de la sucursal</h5>
                        <form class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label" for="name_branch">Nombre de la Sucursal</label>
                                <input class="form-control" id="name_branch" type="text" name="name_branch" placeholder="Nombre de la Sucursal">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="email">Correo Electrónico</label>
                                <input class="form-control" id="email" type="email" name="email" placeholder="Correo Electrónico">
                            </div>
                            <div class="col-6">
                                <label class="form-label" for="whatsApp">WhatsApp</label>
                                <input class="form-control" id="whatsApp" type="tel" name="whatsApp" placeholder="WhatsApp">
                            </div>

                            <div class="col-md-6">
                                <label class="form-label" for="country">País</label>
                                <select class="form-select" id="country" name="country">
                                    <option disabled>Seleccionar</option>
                                    <option value="1">Colombia</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="deparment">Departamento</label>
                                <select class="form-select" id="deparment" name="deparment" required>
                                    <option disabled>Seleccionar</option>
                                    <option value="1">Valle del Cauca</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="city">Ciudad</label>
                                <select class="form-select" id="city" name="city" required>
                                    <option disabled>Seleccionar</option>
                                    <option value="1">Cali</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Informacion del responsable -->

                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Información de responsable</h5>
                        <form class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label" for="manager">Responsable</label>
                                <input class="form-control" id="manager" type="text" name="manager" placeholder="Responsable" requires>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="email">Correo Electrómico</label>
                                <input class="form-control" id="email" type="email" name="email" placeholder="Correo Electrónico" requires>
                            </div>
                            <div class="col-6">
                                <label class="form-label" for="whatsApp">WhatsApp</label>
                                <input class="form-control" id="whatsApp" name="whatsApp" type="tel" placeholder="WhatsApp">
                            </div>
                            <div class="col-6">

                                <label class="form-label" for="date_of_birth">Fecha de nacimiento</label>
                                <input class="form-control datetimepicker flatpickr-input" id="date_of_birth" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly" name="date_of_birth">

                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button">Guardar</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>