<div class="modal fade modal-xl" id="modalNotaCredito" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Realizar nota crédito</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <div class="card">
                    <div class=" card-body">
                        <h5 class="card-title">Información de factura</h5>

                        <div class="row g-3 mb-3">
                            <div class="col-sm-6">
                                <div class="mb-2">
                                    <label class="form-label text-body" for="numeroFactura"># Factura</label>
                                    <input class="form-control" type="text" name="numeroFactura" id="numeroFactura" disabled>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-sm-6">
                                <div class="mb-2 mb-sm-0">
                                    <label class="form-label" for="dateManufacture">Fecha de elaboración*</label>
                                    <input class="form-control datetimepicker flatpickr-input" id="dateManufacture" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="mb-2">
                                    <label class="form-label text-body" for="number">Numero *</label>
                                    <input class="form-control" type="text" name="number" placeholder="Número" id="number" disabled value="<?php echo $entity['number']; ?>">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="enviar" type="button">Enviar</button>
            </div>
        </div>
    </div>
</div>