<div class="modal fade" id="newBranchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nueva Sucursal</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Formulario principal de la sucursal -->
                <form id="branchForm" class="needs-validation" novalidate>
                    <!-- Sección Sucursal -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title mb-4">Información de la Sucursal</h5>

                            <div class="row g-3">
                                <div class="col-md-12">
                                    <label for="branch_name" class="form-label">Nombre de la Sucursal</label>
                                    <input type="text" class="form-control" id="branch_name" name="name"
                                        placeholder="Ej: Sucursal Norte" required>
                                </div>

                                <div class="col-md-6">
                                    <label for="branch_email" class="form-label">Correo Electrónico</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                        <input type="email" class="form-control" id="branch_email" name="email"
                                            placeholder="Ej: sucursal@consultorio.com" required>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label for="branch_whatsapp" class="form-label">WhatsApp</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                                        <input type="tel" class="form-control" id="branch_whatsapp" name="whatsapp"
                                            placeholder="Ej: +573001234567" required>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <label for="branch_country_id" class="form-label">País</label>
                                    <select class="form-select" id="branch_country_id" name="country_id" required>
                                        <option value="" disabled selected>Seleccionar País</option>
                                        @foreach($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-md-4">
                                    <label for="branch_department_id" class="form-label">Departamento</label>
                                    <select class="form-select" id="branch_department_id" name="department_id" required>
                                        <option value="" disabled selected>Seleccionar Departamento</option>
                                    </select>
                                </div>

                                <div class="col-md-4">
                                    <label for="branch_city_id" class="form-label">Ciudad</label>
                                    <select class="form-select" id="branch_city_id" name="city_id" required>
                                        <option value="" disabled selected>Seleccionar Ciudad</option>
                                    </select>
                                </div>

                                <div class="col-12">
                                    <label for="branch_address" class="form-label">Dirección</label>
                                    <input type="text" class="form-control" id="branch_address" name="address"
                                        placeholder="Ej: Carrera 56 #12-34" required>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección Responsable -->
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-4">Responsable de Sucursal</h5>

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="responsible_document_type" class="form-label">Tipo de Documento</label>
                                    <select class="form-select" id="responsible_document_type" name="responsible[document_type]" required>
                                        <option value="" disabled selected>Seleccionar</option>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="DNI">Documento Nacional de Identidad</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_document_number" class="form-label">Número de Documento</label>
                                    <input type="text" class="form-control" id="responsible_document_number"
                                        name="responsible[document_number]" placeholder="Ej: 123456789" required>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_first_name" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="responsible_first_name"
                                        name="responsible[first_name]" placeholder="Ej: María" required>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_last_name" class="form-label">Apellido</label>
                                    <input type="text" class="form-control" id="responsible_last_name"
                                        name="responsible[last_name]" placeholder="Ej: González" required>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_email" class="form-label">Correo Electrónico</label>
                                    <input type="email" class="form-control" id="responsible_email"
                                        name="responsible[email]" placeholder="Ej: responsable@sucursal.com" required>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_whatsapp" class="form-label">WhatsApp</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                                        <input type="tel" class="form-control" id="responsible_whatsapp"
                                            name="responsible[whatsapp]" placeholder="Ej: +573001234567" required>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_birthdate" class="form-label">Fecha de Nacimiento</label>
                                    <input type="date" class="form-control" id="responsible_birthdate"
                                        name="responsible[birthdate]" max="{{ now()->subYears(18)->format('Y-m-d') }}" required>
                                </div>

                                <div class="col-md-6">
                                    <label for="responsible_gender" class="form-label">Género</label>
                                    <select class="form-select" id="responsible_gender" name="responsible[gender]" required>
                                        <option value="" disabled selected>Seleccionar</option>
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer del Modal -->
                    <div class="modal-footer mt-4">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i>Guardar Sucursal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>