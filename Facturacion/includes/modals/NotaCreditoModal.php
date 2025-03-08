<?php
$centres = array(
  '1' => 'Centro de costo 1',
  '2' => 'Centro de costo 2',
  '3' => 'Centro de costo 3',
  '4' => 'Centro de costo 4',
  '5' => 'Centro de costo 5',
  '6' => 'Centro de costo 6',
  '7' => 'Centro de costo 7',
  '8' => 'Centro de costo 8',
  '9' => 'Centro de costo 9',
  '10' => 'Centro de costo 10',
);

?>
<div class="modal fade" id="modal-new-note-credit" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Nota de Crédito</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <!-- Información básica-->
        <div class="card">
          <div class=" card-body">
            <h5 class="card-title">Información básica</h5>

            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <div class="mb-2 mb-sm-0">

                  <label class="form-label" for="bootstrap-wizard-validation-type-document">Centro de costo *</label>
                  <select class="form-select" name="typeDocument" id="bootstrap-wizard-validation-type-document">
                    <option value="">Seleccionar</option>
                    <?php foreach ($centres as $key => $value) { ?>
                      <option value="<?= $key ?>"><?= $value ?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="mb-2">
                  <label class="form-label text-body" for="contact">Contacto</label>
                  <input class="form-control" type="text" name="contact" placeholder="Contacto" id="contact" disabled value="<?php echo $companier['contact']; ?>">
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


        <!-- Información de nota de crédito-->
        <div class="card mt-4">
          <div class=" card-body">
            <div class="row">



              <h5 class="card-title">Información de nota de crédito</h5>
              <div class="row g-3 mb-3">
                <div class="col-sm-4">
                  <div class="mb-2 mb-sm-0">
                    <label class="form-label text-body" for="quantity">Cantidad</label>
                    <input class="form-control" type="number" name="quantity" placeholder="Cantidad" id="quantity" value="<?php echo $patient['whatsapp']; ?>">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="mb-2">
                    <label class="form-label text-body" for="unitValue">Valor Unitario</label>
                    <input class="form-control" type="number" name="unitValue" placeholder="Valor Unitario" id="unitValue" value="<?php echo $patient['whatsapp']; ?>">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="mb-2 mb-sm-0">
                    <label class="form-label text-body" for="discount">Descuento</label>
                    <input class="form-control" type="number" name="discount" placeholder="Descuento" id="discount" value="<?php echo $patient['whatsapp']; ?>">
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="mb-2">
                    <label class="form-label text-body" for="taxCharge">Impuesto cargo</label>
                    <input class="form-control" type="text" name="taxCharge" placeholder="Impuesto cargo" id="taxCharge" value="<?php echo $patient['whatsapp']; ?>">
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="mb-2">
                    <label class="form-label text-body" for="taxWithholding">Impuesto retencion</label>
                    <input class="form-control" type="text" name="taxWithholding" placeholder="Impuesto retencion" id="taxWithholding" value="<?php echo $patient['whatsapp']; ?>">
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="mb-2 mb-sm-0">
                    <label class="form-label text-body" for="total">Total</label>
                    <input class="form-control" type="text" name="total" placeholder="Total" id="total" disabled value="<?php echo $patient['whatsapp']; ?>">
                  </div>
                </div>
                <div class="col-sm-3 d-flex align-items-center">
                  <div class="mb-2 mb-sm-0 d-flex">
                    <div class="form-check form-switch">
                      <input class="form-check-input" id="add" type="checkbox">
                      <label class="form-check-label text-primary" for="add">Agregar</label>
                    </div>
                  </div>
                </div>
              </div>


              <div class="px-0">
                <div class="table-responsive scrollbar">
                  <table class="table fs-9 text-body mb-0">
                    <thead class="bg-body-secondary">
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-body-secondary">
                        <td></td>
                        <td class="small align-middle fw-semibold" colspan="9">Total Neto</td>
                        <td class="small align-middle text-end fw-bold">$398</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Métodos de pago-->
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
                            <th scope="col" class="small">Valor</th>
                            <th scope="col" class="small">N° de Comprobante</th>
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
                          <label class="form-label" for="amount">Valor</label>
                          <input class="form-control" id="amount" type="number">
                        </div>
                        <div class="col-sm-3 col-md-6 col-lg-12">
                          <label class="form-label" for="amount">N° de Comprobante</label>
                          <input class="form-control" id="amount" type="number">
                        </div>
                        <div class="col-sm-3 col-md-6 col-lg-12">
                          <button class="btn btn-primary w-100 rounded-pill" type="button" id="payButton"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div class="row row cols-6">
                <div class="col p-2">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Resumen</h4>
                      <div class="px-0">
                        <div class="table-responsive scrollbar">
                          <table class="table fs-9 text-body mb-0">
                            <tbody>
                              <tr>
                                <td class="fw-semibold text-start">Total Facturado</td>
                                <td class="text-end">0.00</td>

                              </tr>
                              <tr>
                                <td class="fw-semibold text-start">Total Pagado</td>
                                <td class="text-end">0.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" type="button">Guardar nota de crédito</button>
        <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
      </div>
    </div>
  </div>
</div>