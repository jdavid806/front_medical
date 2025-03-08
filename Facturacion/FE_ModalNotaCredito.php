<?php
$isRequiredSign = "<font class='text-primary'>*</font>";
?>


<div class="modal fade" id="modalNuevaNotaCredito" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content bg-body-highlight p-6">
      <div class="modal-header justify-content-between border-0 p-0 mb-2">
        <h3 class="mb-0" id="header-modal-nota-credito"> <i class="fas fa-file-invoice-dollar"></i></h3>
        <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
          <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body px-0" id="modalNotaCredito_p1">
        <h4 class="mb-0 border-0 p-0 mb-2">Información básica</h4>
        <input type="hidden" id="tipoComprobante">
        <div class="col-md-12 row">

          <div class="col-md-4">
            <label class="text-body-highlight fw-bold mb-2">Factura <?= $isRequiredSign ?></label>
            <select class="form-select select2ModalNotaCredito" onchange="cargarDatosFactura_Nota(this)" style="width: 100%;" id="facturaId" required>
              <?php
echo $facturasMedicasParaNc = obtenerDatosFacturasNC();
              echo "<option value=''>Seleccione</option>";
              foreach ($facturasMedicasParaNc as $key => $dataFactura) {
                $dataJSON = json_encode($dataFactura);
                $dataJSON = htmlspecialchars($dataJSON, ENT_QUOTES);
                echo "<option data-json='$dataJSON' value='{$dataFactura["idFactura"]}'>{$dataFactura["fecha"]} - {$dataFactura["nombreCliente"]}</option>";
              }
              ?>
            </select>
          </div>

          <div class="col-md-4" id="">
            <label class="text-body-highlight fw-bold mb-2">Centro de costo <?= $isRequiredSign ?></label>
            <select class="form-select select2ModalNotaCredito" style="width: 100%;" id="centrocosto" required></select>
          </div>

          <?php
          $arrayCamposHeaderNota = [
            "Tipo" => ["select", "", "tipoNota", ["1" => "Nota de Crédito", "2" => "Nota de Debito"], "", "required"],
            "Cliente" => ["input", "text", "cliente", "", "readonly", "required"],
            "Contacto" => ["input", "number", "contacto", "", "", ""],
            "Fecha de elaboracion" => ["input", "date", "fechaElaboracion", date('Y-m-d'), "", "required"],
            "Vendedor" => ["select", "", "idVendedor", $dataVendedores, "", "required"],
            "Numero" => ["input", "number", "numeroNota", rand(1000, 9999), "readonly", "required"],

          ];


          foreach ($arrayCamposHeaderNota as $label => $data) {
            $iconReq  = $data[5] == "required" ? $isRequiredSign : "";
          ?>
            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2"><?= $label ?> <?= $iconReq ?></label>
              <?php if ($data[0] == "input") {  ?>
                <input type="<?= $data[1] ?>" class="form-control" id="<?= $data[2] ?>" value="<?= $data[3] ?>" <?= $data[4] ?> <?= $data[5] ?>>
              <?php } else if ($data[0] == "select") { ?>
                <select <?= (($label == "Tipo") ? "onchange='notaDC(this.value, false)'" : "") ?> class="form-select select2ModalNotaCredito" style="width: 100%;" <?= $data[4] ?> <?= $data[5] ?> id="<?= $data[2] ?>">
                  <?php foreach ($data[3] as $key => $value) {
                    echo "<option value='$key'>$value</option>";
                  } ?>
                </select>
              <?php } ?>
            </div>
          <?php } ?>


          <hr style="margin: 20px 0px">


        </div>
      </div>

      <div class="modal-body px-0" id="modalNotaCredito_p2">
        <h4 class="mb-0 border-0 p-0 mb-2" id="header-info-nota"></h4>
        <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" id="tabla-modal-nota-credito">
          <thead>
            <tr>
              <th style="padding:10px !important;">Descripcion</th>
              <th style="padding:10px !important;">Cantidad</th>
              <th style="padding:10px !important;">Valor Unitario</th>
              <th style="padding:10px !important;">Descuento</th>
              <th style="padding:10px !important;">Impuesto cargo</th>
              <th style="padding:10px !important;">Impuesto retencion</th>
              <th style="padding:10px !important;">Total</th>
              <th style="padding:10px !important;">
                <!-- <input type="checkbox" name="" onchange="selectAllNoneCheckNota('checkbox_multiple_nota_credito', this.checked)" id=""> -->
              </th>
            </tr>
          </thead>
          <tbody id="tbody-modal-nota-credito"></tbody>
          <tfoot>
            <tr>
              <th colspan="6">Total Neto</th>
              <th class="text-end" id="total-neto-inner">0.00</th>
              <input type="hidden" id="total-neto" value="0">
              <input type="hidden" id="detalleFacturaSeleccionados" value="{}">
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="modal-body px-0" id="modalNotaCredito_p3">
        <div class="col-md-12 row">
          
          <div class="col-md-6">
            <h4 class="mb-0 border-0 p-0 mb-2">Métodos de pago</h4>
            <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" style="width:100%;border-radius: 15px !important;" id="tabla-modal-medios-pago-nota-credito">
              <thead>
                <tr>
                  <th style="padding:10px !important;">Método</th>
                  <th style="padding:10px !important;">Valor</th>
                  <th style="padding:10px !important;">N° de Comprobante</th>
                  <th style="padding:10px !important;"></th>
                </tr>
              </thead>
              <tbody id="tbody-modal-medios-pago"></tbody>
            </table>
          </div>

          <div class="col-md-6">
            <h4 class="mb-0 border-0 p-0 mb-2">Resumen</h4>
            <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" style="width:100%;border-radius: 15px !important;" id="tabla-modal-resumen">
              <tbody id="tbody-modal-resumen-f">
                <tr>
                  <td><b>Total Facturado</b></td>
                  <td id="modal-resumen-total-facturado">0.00</td>
                </tr>
                <tr>
                  <td><b>Total Pagado</b></td>
                  <td id="modal-resumen-total-pagado">0.00</td>
                  <input type="hidden" id="total-pagado" value="0">
                </tr>
              </tbody>
            </table>  
          </div>

        </div>
      </div>

      <div class="modal-footer border-0 pt-6 px-0 pb-0">
        <div class="col-md-12 row">
          <div class="col-md-6">
            <div id="paginacionModal"></div>
          </div>
          <div class="col-md-6 text-end">
            <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
            <button class="btn btn-primary my-0" onclick="guardarNotaCredito()" id="btnGuardarNota"> <i class="fas fa-bookmark"></i> &nbsp; Crear Nota de Crédito</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<?php include "./funcionesJsMetodosPago.php"; ?>


<script>
  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ////////////////////////
  // ? /////////////// ======== ///////////////////////////
  function resetModalNotaCredito() {
    indiceFila = 0;
    indiceFilaMP = 0;
    $("#modalNuevaNotaCredito #tbody-modal-nota-credito").html("");
    $("#modalNuevaNotaCredito #tbody-modal-medios-pago").html("");
    AnadirFilaMetodos("modalNuevaNotaCredito");
  }

  function cargarDatosFactura_Nota(elemento) {
    $("#modalNuevaNotaCredito #tbody-modal-nota-credito").html("");
    let dataJson = $(elemento).find("option:selected").attr("data-json");
    dataJson = JSON.parse(dataJson);
    console.log(dataJson);

    const { detalle, nombreCliente } = dataJson;
    const keysDetalle = Object.keys(detalle);
    const optionsImpuestoCargo = obtenerOptionsImpuestoCargo();
    const optionsImpuestoRetencion = obtenerOptionsImpuestoRetencion();

    console.log("El detalle es ");
    console.log(detalle);
    


   $("#modalNuevaNotaCredito #cliente").val(nombreCliente); 
   $("#modalNuevaNotaCredito #contacto").val(nombreCliente); 

    keysDetalle.forEach(key => {
      let data = detalle[key];
      let ind = data.idDetalle;

      let fila = `<tr id="filaNota${ind}">
                      <input type="hidden" data-valordefault="${data.idDetalle}" readonly name="ArrayDatosNota[${ind}][idDetalle]" class="form-control" value="${data.idDetalle}">
                      <td style="padding:10px !important;">${data.nombreProcedimiento}</td>
                      <td style="padding:10px !important;"><input type="number" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.cantidad}" readonly name="ArrayDatosNota[${ind}][cantidad]" class="form-control" value="1"></td>
                      <td style="padding:10px !important;"><input type="number" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.valor}" readonly name="ArrayDatosNota[${ind}][valorUnitario]" class="form-control" value="${data.valor}"></td>
                      <td style="padding:10px !important;"><input type="number" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.descuento}" readonly name="ArrayDatosNota[${ind}][descuento]" class="form-control" value="${data.descuento}"> </td>
                      <td style="padding:10px !important;">
                        <select class="form-select select2ModalNotaCredito" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.impuestoId}" style="width: 100%;" disabled name="ArrayDatosNota[${ind}][impuestoCargo]" required>
                          ${optionsImpuestoCargo}
                        </select>
                      </td>
                      <td style="padding:10px !important;">
                        <select class="form-select select2ModalNotaCredito" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.impuestoRetencion}" style="width: 100%;" disabled name="ArrayDatosNota[${ind}][impuestoRetencion]" required>
                          ${optionsImpuestoRetencion}
                        </select>
                      </td>
                      <td style="padding:10px !important;">
                        <input type="number" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.total}" readonly name="ArrayDatosNota[${ind}][total]" value="${data.total}" class="form-control"> 

                        <input type="hidden" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.total}" readonly name="ArrayDatosNota[${ind}][totalBruto]" value="${data.total}" class="form-control"> 
                        <input type="hidden" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.total}" readonly name="ArrayDatosNota[${ind}][totalImpuestoCargo]" value="${data.total}" class="form-control"> 
                        <input type="hidden" onchange="calcularTotalSeleccionadoNota(${ind})" data-valordefault="${data.total}" readonly name="ArrayDatosNota[${ind}][totalImpuestoRetencion]" value="${data.total}" class="form-control"> 

                      </td>
                      <td style="padding:10px !important;"><input type="checkbox" class="checkbox_multiple_nota_credito" name="ArrayDatosNota[${ind}][check]" value="${data.total}" onchange="habilitarFilaNota(this.checked, ${ind}); calcularTotalSeleccionadoNota(${ind})"> </td>
                    </tr>`;


      $(`select[name='ArrayDatosNota[${ind}][impuestoCargo]']`).val(data.impuestoId ? data.impuestoId : '').change();
      $(`select[name='ArrayDatosNota[${ind}][impuestoRetencion]']`).val(data.impuestoRetencion ? data.impuestoRetencion : '').change();
      $("#modalNuevaNotaCredito #tbody-modal-nota-credito").append(fila);
      
    });

    // selectToModal("modalNuevaNotaCredito", "select2ModalNotaCredito");


    // console.log(dataJson);
  }

  function selectAllNoneCheckNota(clase, checked) {
    let checkboxes = $(`.${clase}`);
    checkboxes.each(function() {
      this.checked = checked;
    });
  }

  // function calcularTotalSeleccionadoNota() {
  //   let total = 0;
  //   $("#modalNuevaNotaCredito #tabla-modal-nota-credito tr").each(function() {
  //     let indice = $(this).attr("id").replace("filaNota", "");
  //     let checked = $(`input[name='ArrayDatosNota[${indice}][check]']`).is(":checked");
  //     if (checked) {
  //       total += parseFloat($(`input[name='ArrayDatosNota[${indice}][total]']`).val());
  //     }
  //   });

  //   $("#modalNuevaNotaCredito #modal-resumen-total-facturado").html(total.toFixed(2));
  // }

  function habilitarFilaNota(idChecked, idFila) {
    let cantidad = $(`input[name="ArrayDatosNota[${idFila}][cantidad]"]`);
    let input_valorUnitario = $(`input[name="ArrayDatosNota[${idFila}][valorUnitario]"]`);
    let input_descuento = $(`input[name="ArrayDatosNota[${idFila}][descuento]"]`);
    let select_impuestoCargo = $(`select[name="ArrayDatosNota[${idFila}][impuestoCargo]"]`);
    let select_impuestoRetencion = $(`select[name="ArrayDatosNota[${idFila}][impuestoRetencion]"]`);
    let input_total = $(`input[name="ArrayDatosNota[${idFila}][total]"]`);
    if (idChecked) {
      input_valorUnitario.attr("readonly", false);
      input_descuento.attr("readonly", false);
      select_impuestoCargo.attr("disabled", false);
      select_impuestoRetencion.attr("disabled", false);
      input_total.attr("readonly", false);
      cantidad.attr("readonly", false);
    } else {
      input_valorUnitario.attr("readonly", true);
      cantidad.attr("readonly", true);
      input_descuento.attr("readonly", true);
      select_impuestoCargo.attr("disabled", true);
      select_impuestoRetencion.attr("disabled", true);
      input_total.attr("readonly", true);

      input_valorUnitario.val(input_valorUnitario.attr("data-valordefault")).change();
      input_descuento.val(input_descuento.attr("data-valordefault")).change();
      select_impuestoCargo.val(select_impuestoCargo.attr("data-valordefault")).change();
      select_impuestoRetencion.val(select_impuestoRetencion.attr("data-valordefault")).change();
      input_total.val(input_total.attr("data-valordefault")).change();
      cantidad.val(cantidad.attr("data-valordefault")).change();
    }

    
    calcularTotalSeleccionadoNota(idFila);
  }



  function obtenerJsonNotasCredito() {
    const filas = $("#modalNuevaNotaCredito #tbody-modal-nota-credito tr");
    let data = {};
    let isValid = true;

    filas.each(function() {
      if (!isValid) return;

      const fila = $(this);
      const idFila = fila.attr("id");
      const indice = idFila.replace("filaNota", "");

      const checked = $(`input[name='ArrayDatosNota[${indice}][check]']`).is(":checked");
      if (!checked) return;

      const objeto = {
        "idDetalle": $(`input[name='ArrayDatosNota[${indice}][idDetalle]']`).val(),
        "valorUnitario": $(`input[name='ArrayDatosNota[${indice}][valorUnitario]']`).val(),
        "descuento": $(`input[name='ArrayDatosNota[${indice}][descuento]']`).val(),
        "totalBruto" : $(`input[name="ArrayDatosNota[${indice}][totalBruto]"]`).val(),
        "totalImpuestoCargo" : $(`input[name="ArrayDatosNota[${indice}][totalImpuestoCargo]"]`).val(),
        "totalImpuestoRetencion" : $(`input[name="ArrayDatosNota[${indice}][totalImpuestoRetencion]"]`).val(),
        "total": $(`input[name='ArrayDatosNota[${indice}][total]']`).val(),
      };

      const tieneVacio = Object.values(objeto).some(valor => !valor);

      if (tieneVacio) {
          isValid = false;
          console.log("El objeto "+ indice +" tiene al menos un campo vacío.");
          console.log(objeto);
          return;
      }

      objeto.impuestoCargo =  $(`select[name='ArrayDatosNota[${indice}][impuestoCargo]']`).val(),
      objeto.impuestoRetencion =  $(`select[name='ArrayDatosNota[${indice}][impuestoRetencion]']`).val(),

      data[indice] = objeto;


    });

    return isValid ? JSON.stringify(data) : false; // Return data or false
  }

  function guardarNotaCredito() {
    if ($("#detalleFacturaSeleccionados").val() == 'false' || $("#detalleFacturaSeleccionados").val() == '' || $("#detalleFacturaSeleccionados").val() == false) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pueden dejar vacios en las filas seleccionadas'
      });
      return false;
    }

    let idS = ["tipoComprobante", "centrocosto", "idVendedor", "entidadId", "numeroAutorizacion", "total-neto", "detalleFacturaSeleccionados", "total-pagado"];
    let next = true;
    let data = {};
    idS.forEach(element => {
      if (!next) return;
      let key = element;
      let selector = $("#modalNuevaNotaCredito #" + element);
      let value = selector.val();

      if (selector.attr("required") && value == "") {
        next = false;
        return;
      }

      data[key] = key == "detalleFacturaSeleccionados" ? JSON.parse(value) : value;

    });

    if (!next) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No puede dejar campos vacíos'
      });
      return false;
    }



    let metodosPago = {};
    next = true;
    const filasMP = $("#modalNuevaNotaCredito #tbody-modal-medios-pago tr");
    filasMP.each(function() {
        // Usar `this` dentro de `each` ya hace referencia a cada fila
        let fila = $(this); // Asegúrate de envolver `this` en `$()`
        let idFila = fila.attr("id");
        let indice = idFila.replace("filaMP", "");

        // Corrige el selector para obtener el valor del método de pago y el valor de pago
        let metodoPago = $(`select[name='MetodosPago[${indice}][idMetodoPago]']`).val();
        let valorMetodo = $(`input[name='MetodosPago[${indice}][valorPago]']`).val();
        let numeroComprobante = $(`input[name='MetodosPago[${indice}][numeroComprobante]']`).val();


        if (metodoPago !== "") {
            if (valorMetodo != "0" && valorMetodo != "") {
                let nuevoMP = {
                    metodoPago,
                    valorMetodo,
                    numeroComprobante
                };

                metodosPago[indice] = nuevoMP;
            } else {
                return false;
            }
        }
      });

    if (!next) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que algún método de pago está en 0 o vacío'
      });
      return false;
    }

    data.metodosPago = metodosPago;
    
    console.log("DATA PARA GUARDAR");
    console.log(data);
    // Swal.fire({ icon: 'success', title: 'Correcto', text: 'Factura generada correctamente'});
    // return data;
    $.ajax({
        url: 'Facturacion/FE_Ajax_FacturaNC.php',
        type: 'POST',
        data: JSON.stringify(data), // Envía la data en formato JSON

      
        success: function(response) {
            console.log('Respuesta del servidor:', response);
             Swal.fire({
         icon: 'success',
         title: 'Correcto',
         text: 'Factura generada correctamente'
     });

     resetModalFacturaEmpresa();
     $('#modalNuevaNotaCredito').modal('hide'); // Ocultar el modal después de enviar la cita
         //location.reload(); // Recargar la página después de actualizar la cita
        },
        error: function(xhr, status, error) {
            console.error('Error en la petición:', error);
        }
    });

    return data;
  }

  function calcularTotalSeleccionadoNota(indice) {
    // Selecciona todas las filas de la tabla
    const filas = document.querySelectorAll("#modalNuevaNotaCredito #tbody-modal-nota-credito tr");
    
    filas.forEach(function(fila) {
        let idFila = fila.id;
        let indiceFila = idFila.replace("filaNota", "");

        // Selecciona los elementos dentro de la fila
        let idDetalle = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][idDetalle]"]`);
        let cantidad = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][cantidad]"]`);
        let valorUnitario = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][valorUnitario]"]`);
        let descuento = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][descuento]"]`);
        let impuestoCargo = fila.querySelector(`select[name="ArrayDatosNota[${indiceFila}][impuestoCargo]"]`);
        let impuestoRetencion = fila.querySelector(`select[name="ArrayDatosNota[${indiceFila}][impuestoRetencion]"]`);
        let total = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][total]"]`);
        let totalBruto = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][totalBruto]"]`);
        let totalImpuestoCargo = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][totalImpuestoCargo]"]`);
        let totalImpuestoRetencion = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][totalImpuestoRetencion]"]`);
        let check = fila.querySelector(`input[name="ArrayDatosNota[${indiceFila}][check]"]`);

        console.log("impuestoCargo", impuestoCargo);
        console.log("impuestoRetencion", impuestoRetencion);
        
        if (check && check.checked) {
            idDetalle = idDetalle.value;
            cantidad = cantidad.value;
            valorUnitario = valorUnitario.value;
            descuento = descuento.value;
            let impuestoRetencionValor = impuestoRetencion.value;

            let totalB = Number(cantidad) * Number(valorUnitario);
            totalBruto.value = totalB.toFixed(2);

            let totalD = 0;
            if (descuento === "") {
                totalD = 0;
            } else if (descuento.includes("%")) {
                let porcentajeDesc = Number(descuento.replace('%', '').trim());
                totalD = (porcentajeDesc / 100) * totalB;
            } else {
                totalD = Number(descuento);
            }

            let totalImpuestoC = 0;
            if (impuestoCargo) {
                let porcentajeImpuestoCargo = impuestoCargo.options[impuestoCargo.selectedIndex].dataset.tasaimpuesto;
                totalImpuestoC = (porcentajeImpuestoCargo / 100) * totalB;
            }

            let totalImpuestoR = 0;
            if (impuestoRetencionValor !== "" && impuestoRetencionValor !== "0" && impuestoRetencionValor !== null) {
                let porcentajeImpuestoRetencion = impuestoRetencion.options[impuestoRetencion.selectedIndex].dataset.tasaretencion;
                totalImpuestoR = (porcentajeImpuestoRetencion / 100) * totalB;
            }

            totalImpuestoCargo.value = totalImpuestoC.toFixed(2);
            totalImpuestoRetencion.value = totalImpuestoR.toFixed(2);

            total.value = (totalB - totalD + totalImpuestoC - totalImpuestoR).toFixed(2);
        }
    });

    let checkboxes = document.querySelectorAll('.checkbox_multiple_nota_credito');
    let valorTotal = 0;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            valorTotal += Number(checkbox.value);
            console.log("El valor total es: " + valorTotal);
        }
    });

    let jsonNotasCredito = obtenerJsonNotasCredito();
    console.log("jsonNotasCredito");
    console.log(jsonNotasCredito);
    console.log("jsonNotasCredito");
    document.querySelector("#modalNuevaNotaCredito #total-neto-inner").innerHTML = valorTotal.toFixed(2);
    document.querySelector("#modalNuevaNotaCredito #modal-resumen-total-facturado").innerHTML = valorTotal.toFixed(2);
    document.querySelector("#modalNuevaNotaCredito #total-neto").value = valorTotal;
    document.querySelector("#modalNuevaNotaCredito #detalleFacturaSeleccionados").value = jsonNotasCredito;
}


  // function calcularTotalSeleccionadoNota(indice) {
  //   // console.log("Funcion calcularTotalSeleccionadoNota() seleccionadas: ");
    
  //   $("#modalNuevaNotaCredito #tbody-modal-nota-credito tr").each(function() {
  //     let idFila = $(this).attr("id");
  //     let indiceFila = idFila.replace("filaNota", "");

  //     let idDetalle = $(`input[name="ArrayDatosNota[${indiceFila}][idDetalle]"]`);
  //     let cantidad = $(`input[name="ArrayDatosNota[${indiceFila}][cantidad]"]`);
  //     let valorUnitario = $(`input[name="ArrayDatosNota[${indiceFila}][valorUnitario]"]`);
  //     let descuento = $(`input[name="ArrayDatosNota[${indiceFila}][descuento]"]`);
  //     let impuestoCargo = $(`select[name="ArrayDatosNota[${indiceFila}][impuestoCargo]"]`);
  //     let impuestoRetencion = $(`select[name="ArrayDatosNota[${indiceFila}][impuestoRetencion]"]`);
  //     let total = $(`input[name="ArrayDatosNota[${indiceFila}][total]"]`);
  //     let totalBruto = $(`input[name="ArrayDatosNota[${indiceFila}][totalBrutol]"]`);
  //     let totalImpuestoCargo = $(`input[name="ArrayDatosNota[${indiceFila}][totalImpuestoCargo]"]`);
  //     let totalImpuestoRetencion = $(`input[name="ArrayDatosNota[${indiceFila}][totalImpuestoRetencion]"]`);
  //     let check = $(`input[name="ArrayDatosNota[${indiceFila}][check]"]`);
      
  //     console.log("impuestoCargo");
  //     console.log(impuestoCargo);
  //     console.log("impuestoRetencion");
  //     console.log(impuestoRetencion);
      
  //     if (check.is(":checked")) {
  //       idDetalle = idDetalle.val();
  //       cantidad = cantidad.val();
  //       valorUnitario = valorUnitario.val();
  //       descuento = descuento.val();
  //       impuestoRetencion = impuestoRetencion.val();

  //       let totalB = Number(cantidad) * Number(valorUnitario);
  //       totalBruto.val(totalB.toFixed(2));

  //       let totalD = 0;
  //       if(descuento == "") {
  //         totalD = 0;
  //       }else if (descuento.includes("%")) {
  //         let porcentajeDesc = Number(descuento.replace('%', '').trim());
  //         totalD = (porcentajeDesc / 100) * totalB;
  //       }else {
  //         totalD = Number(descuento);
  //       }

  //       let totalImpuestoC = 0;
  //       // if (impuestoCargo.val() != "" && impuestoCargo.val() != 0 && impuestoCargo.val() != null) {
  //       if (impuestoRetencion.length)  {
  //         let porcentajeImpuestoCargo = impuestoCargo.find('option:selected').data('tasaimpuesto');
  //         totalImpuestoC = (porcentajeImpuestoCargo / 100) * totalB;
  //       }
        
  //       let totalImpuestoR = 0;
  //       if (impuestoRetencion.val() != "" && impuestoRetencion.val() != 0 && impuestoRetencion.val() != null) {
  //         let porcentajeImpuestoRetencion = impuestoRetencion.find('option:selected').data('tasaretencion');
  //         totalImpuestoR = (porcentajeImpuestoRetencion / 100) * totalB;
  //       }

  //       totalImpuestoCargo.val(totalImpuestoC);
  //       totalImpuestoRetencion.val(totalImpuestoR);
        
  //       total.val((totalB - totalD + totalImpuestoCargo - totalImpuestoRetencion).toFixed(2));


  //     }

  //   })


  //   let checkboxes = $('.checkbox_multiple_nota_credito');
  //   let valorTotal = 0;

  //   checkboxes.each(function() {
  //     if (this.checked) {
  //       valorTotal += Number($(this).val());
  //       console.log("El valor total es: " + valorTotal);
        
  //     }
  //   });

  //   let jsonNotasCredito = obtenerJsonNotasCredito();
  //   // console.log("El json es: ");
  //   // console.log(jsonNotasCredito);

  //   $("#modalNuevaNotaCredito #total-neto-inner").html(valorTotal.toFixed(2));
  //   $("#modalNuevaNotaCredito #modal-resumen-total-facturado").html(valorTotal.toFixed(2));
  //   $("#modalNuevaNotaCredito #total-neto").val(valorTotal);
  //   $("#modalNuevaNotaCredito #detalleFacturaSeleccionados").val(jsonNotasCredito);

  // }


  function AbrirModalNotaCredito() {
    // $("#modalNuevaNotaCredito #entidadId").val("").change();
    $("#modalNuevaNotaCredito #tbody-modal-nota-credito").html("");
    $("#modalNuevaNotaCredito #tipoComprobante").val("Nota_Credito").change();
    // $("#filtroNotaCreditoPaciente").html(obtenerOptionsCliente());
    $("#filtroNotaCreditoProcedimiento").html(obtenerOptionsProcedimiento());
    $("#filtroNotaCreditoEspecialista").html(obtenerOptionsEspecialista());
    $("#modalNuevaNotaCredito #centrocosto").html(obtenerOptionsCentrosCosto());
    $("#modalNuevaNotaCredito #idVendedor").html(obtenerOptionsVendedores());
    // tabularDatosNotaCreditoEntidad();


    paginacionModal("modalNuevaNotaCredito", "modalNotaCredito_p", 3) /// funcion para generar las paginaciones del modal => se encuentra en includeGeneralesModalFE.php

  }


  function notaDC(tipo, abrirModal = false) {
    if (tipo == '1') {
      $("#header-modal-nota-credito").html("<i class='fas fa-file-invoice-dollar'></i> Nota de Crédito");
      $("#btnGuardarNota").html("<i class='fas fa-bookmark'></i> Guardar Nota de Crédito");
      $("#header-info-nota").html("Información de nota de crédito");
    } else if (tipo == '2') {
      $("#header-modal-nota-credito").html("<i class='fas fa-file-invoice-dollar'></i> Nota de Débito");
      $("#btnGuardarNota").html("<i class='fas fa-bookmark'></i> Guardar Nota de Débito");
      $("#header-info-nota").html("Información de nota de débito");
    }

    const tipoNotaElement = $("#modalNuevaNotaCredito #tipoNota");
    if(tipoNotaElement.val() != tipo) { // ES NECESARIO VALIDARLO PARA QUE NO HAGA UN BUCLE INFINITO
      tipoNotaElement.val(tipo).trigger('change');
    }

    if (abrirModal) {
      $("#modalNuevaNotaCredito").modal("show");
    }
  }



  $(document).ready(function() {
    $('#modalNuevaNotaCredito').on('hidden.bs.modal', function() {
      resetModalNotaCredito();
    });
    
    $('#modalNuevaNotaCredito').on('shown.bs.modal', function() {
      // console.log("modalNuevaNotaCredito => Abierto");
      // AnadirFilaMetodos("modalNuevaNotaCredito");
      AbrirModalNotaCredito();
    });
    
    selectToModal("modalNuevaNotaCredito", "select2ModalNotaCredito");
    resetModalNotaCredito();
  });

  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ///////////////////////////
  // ? /////////////// ======== ///////////////////////////
</script>
<!-- 
<style>


  .underline-input {
    border: none;
    border-bottom: 2px solid #D4D4D4;
    background-color: transparent;
    outline: none;
    padding: 5px;
    width: 100%;
  }

  .underline-input:focus {
    border-bottom: 2px solid #007bff;
  }

  #tabla-modal-nota-credito {
    background-color: #F6F9FC !important;
    padding: 10px !important;
    border-radius: 15px !important;
  }

  #tabla-modal-nota-credito td {
    padding: 20px !important;
    margin: 20px !important;
    background-color: white !important;
  }

  #tabla-modal-nota-credito th {
    color: #767C82 !important;
    padding: 20px !important;
    margin: 20px !important;
  }

  #tabla-modal-medios-pago-nota-credito {
    background-color: #FFFFFF !important;
    padding: 10px !important;
    border-radius: 15px !important;
  }

  #tabla-modal-medios-pago-nota-credito td {
    padding: 20px !important;
    margin: 20px !important;
    background-color: white !important;
  }

  #tabla-modal-medios-pago-nota-credito th {
    color: #767C82 !important;
    padding: 20px !important;
    margin: 20px !important;
  }

</style> -->