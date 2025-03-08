<div class="modal fade" id="modalNewInvoiceSale" tabindex="-1" aria-labelledby="scrollingLongModalLabel2" style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="scrollingLongModalLabel2">Nueva Factura de Venta</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="col-sm-3 col-md-6 col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Seleccionar el producto </h4>
                            <form class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="inputState">Depósito</label>
                                    <select class="form-select" id="inputState">
                                        <option selected="selected">Seleccionar</option>
                                        <option value="1" class="medium">Depósito 1</option>
                                        <option value="2" class="medium">Depósito 2</option>
                                        <option value="3" class="medium">Depósito 3</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="inputState">Producto o Servicio</label>
                                    <select class="form-select" id="inputState">
                                        <option selected="selected">Seleccionar</option>
                                        <option value="1" class="medium">Gasas</option>
                                        <option value="2" class="medium">Consulta por Seguimiento</option>
                                    </select>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-2">
                                    <label class="form-label" for="price">Precio</label>
                                    <input class="form-control" id="price" type="number" placeholder="10.000">
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-2">
                                    <label class="form-label" for="aquality">Cantidad</label>
                                    <input class="form-control" id="aquality" type="number" placeholder="1">
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-2">
                                    <label class="form-label" for="discount">Descuento</label>
                                    <input class="form-control" id="discount" type="number">
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-2">
                                    <label class="form-label" for="subtotal">Subtotal</label>
                                    <input class="form-control" id="subtotal" type="number" disabled>
                                </div>
                                <div class="col-sm-12 col-md-6 col-lg-4 d-flex align-items-end">
                                    <button class="btn btn-primary w-100 rounded-pill" type="submit"><i class="far fa-plus-square"></i> Agregar</button>
                                </div>

                                <span class="text-info small text-center">Si desea el descuento en % deberá colocar al final del numero el símbolo %, si es valor numérico solo colocar números</span>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-sm-3 col-md-6 col-lg-12 mt-2">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Lista de productos </h4>

                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="small">#</th>
                                        <th scope="col" class="small">Descripción del Producto</th>
                                        <th scope="col" class="small">Porcentaje IVA</th>
                                        <th scope="col" class="small">Precio</th>
                                        <th scope="col" class="small">Cantidad</th>
                                        <th scope="col" class="small">Descuento</th>
                                        <th scope="col" class="small">Total</th>
                                        <th scope="col" class="small"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th class="small" scope="row">1</th>
                                        <td class="small">Gasas</td>
                                        <td class="small">0 %</td>
                                        <td class="small">50,000.00$ COP</td>
                                        <td class="small">1000</td>
                                        <td class="small">20,000.00$ COP</td>
                                        <td class="small">49,980,000.00$ COP</td>
                                        <td class="small"><i class="far fa-trash-alt text-danger"></i></td>
                                    </tr>
                                    <tr>
                                        <th class="small" scope="row">2</th>
                                        <td class="small">Consulta por Seguimiento</td>
                                        <td class="small">0 %</td>
                                        <td class="small">50,000.00$ COP</td>
                                        <td class="small">1000</td>
                                        <td class="small">20,000.00$ COP</td>
                                        <td class="small">49,980,000.00$ COP </td>
                                        <td class="small"><i class="far fa-trash-alt text-danger"></i></td>
                                    </tr>

                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                <div class="col-sm-3 col-md-6 col-lg-12 mt-2">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Detalles de la factura </h4>

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
                                                    <tbody>
                                                        <tr>
                                                            <th class="small" scope="row">1</th>
                                                            <td class="small">Crédito</td>
                                                            <td class="small">1,000,000.00$ COP</td>
                                                            <td class="small"><i class="far fa-trash-alt text-danger"></i></td>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th class="small" scope="row">2</th>
                                                            <td class="small">Efectivo</td>
                                                            <td class="small">50,000.00$ COP</td>
                                                            <td class="small"><i class="far fa-trash-alt text-danger"></i></td>
                                                        </tr>

                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="col p-2">
                                        <div class="card">
                                            <div class="card-body">
                                                <h4 class="card-title">Método de Pago</h4>

                                                <form class="row g-3">

                                                    <div class="col-sm-3 col-md-6 col-lg-12">
                                                        <label class="form-label" for="methodPayment">Método de pago</label>
                                                        <select class="form-select" id="methodPayment">
                                                            <option selected="selected">Seleccionar</option>
                                                            <option value="1" class="medium">Efectivo</option>
                                                            <option value="2" class="medium">Crédito</option>
                                                            <option value="2" class="medium">Cheque</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-sm-3 col-md-6 col-lg-12">
                                                        <label class="form-label" for="amount">Monto</label>
                                                        <input class="form-control" id="amount" type="numeric">
                                                    </div>
                                                    <div class="col-sm-3 col-md-6 col-lg-12">
                                                        <button class="btn btn-primary w-100 rounded-pill" type="submit"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="col p-2">
                                        <div class="card">
                                            <div class="card-body">
                                                <h4 class="card-title">Observaciones o notas</h4>

                                                <form class="row g-3">
                                                    <div class="col-sm-3 col-md-6 col-lg-12">
                                                        <textarea name="" id="" class="form-control" rows="10"></textarea>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="col p-2">
                                        <div class="card">
                                            <div class="card-body">
                                                <h4 class="card-title">Montos</h4>

                                                <form class="row g-3">

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
                                                </form>

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
                <button class="btn btn-primary" type="button">Guardar</button>
                <button class="btn btn-success" type="button">Guardar y emitir</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>

