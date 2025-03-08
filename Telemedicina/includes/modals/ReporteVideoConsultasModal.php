<div class="modal fade" id="modalReporteVideoConsulta" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Reportes de Video Consultas</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <!-- Agregamos los detalles de la cita -->
                        <div class="mb-3">
                            <div class="row mb-3">

                                <div class="row">
                                    <label class="form-label" for="datepicker">Desde:</label>
                                    <input class="form-control datetimepicker flatpickr-input" id="datepicker" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                                </div>

                                <div class="row mt-3
                                ">
                                    <label class="form-label" for="datepicker">Hasta:</label>
                                    <input class="form-control datetimepicker flatpickr-input" id="datepicker" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                                </div>

                            </div>
                            <span class="text text-danger small">Necesitas un reporte nuevo?, Solicítalo por </span> <a href="#" class=" text-danger"><i class="far fa-life-ring"></i> <small>soporte</small></a>

                            <div class="container mt-4">
                                <div class="row g-2">
                                    <!-- Botón Copiar enlace de invitación -->
                                    <div class="col-12">
                                        <button class="btn btn-outline-info w-100 rounded-pill" type="button">
                                        <i class="far fa-file-alt"></i> Generar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button">Aceptar</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>