<?php
$isRequiredSign = "<font class='text-primary'>*</font>";
?>

<div class="modal fade" id="modalNewNoteCredit" tabindex="-1" aria-hidden="true">
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
                  <label class="form-label text-body" for="numberIdentification">Tipo *</label>
                  <input class="form-control" type="number" name="numberIdentification" placeholder="Número de identificación" id="numberIdentification" value="<?php echo $patient['document']; ?>" disabled>
                </div>
              </div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <div class="mb-2 mb-sm-0">
                  <label class="form-label text-body" for="firstName">Cliente *</label>
                  <input class="form-control" type="text" name="firstName" placeholder="Primer Nombre" id="firstName" value="<?php echo $patient['firstName']; ?>" disabled>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="mb-2">
                  <label class="form-label text-body" for="secondName">Contacto</label>
                  <input class="form-control" type="text" name="secondName" placeholder="Segundo Nombre" id="secondName" disabled value="<?php echo $patient['secondName']; ?>">
                </div>
              </div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <div class="mb-2 mb-sm-0">
                  <label class="form-label text-body" for="firstName">Fecha de elaboracion *</label>
                  <input class="form-control" type="text" name="firstName" placeholder="Primer apellido" id="firstName" value="<?php echo $patient['lastName']; ?>" disabled>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="mb-2">
                  <label class="form-label text-body" for="secondLastName">Numero *</label>
                  <input class="form-control" type="text" name="secondLastName" placeholder="Segundo Apellido" id="secondLastName" disabled value="<?php echo $patient['secondLastName']; ?>">
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Información de nota de crédito-->
        <div class="card mt-4">
          <div class=" card-body">
            <h5 class="card-title">Información de nota de crédito</h5>

            <div class="px-0">
              <div class="table-responsive scrollbar">
                <table class="table fs-9 text-body mb-0">
                  <thead class="bg-body-secondary">
                    <tr>
                      <th scope="col" class="small" style="width: 24px;"></th>
                      <th scope="col" class="small" style="min-width: 60px;">Cantidad</th>
                      <th scope="col" class="small" style="min-width: 360px;">Valor Unitario</th>
                      <th class="ps-5 small" scope="col" style="min-width: 150px;">Descuento</th>
                      <th scope="col" class="small" style="width: 60px;">Impuesto cargo</th>
                      <th class="text-end small" scope="col" style="width: 80px;">Impuesto retencion</th>
                      <th class="text-end small" scope="col" style="min-width: 60px;">Total</th>
                      <th scope="col" class="small" style="width: 24px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border-0 small"></td>
                      <td class="align-middle small">1</td>
                      <td class="align-middle small text-body-tertiary fw-semibold">1000</td>
                      <td class="align-middle small text-end text-body-highlight fw-semibold">30 %</td>
                      <td class="align-middle small text-end fw-semibold">15 %</td>
                      <td class="align-middle small text-end">2.5%</td>
                      <td class="align-middle small text-end fw-semibold">$398</td>
                      <td class="border-0"></td>
                    </tr>


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