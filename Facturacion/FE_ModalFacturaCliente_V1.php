<?php $isRequiredSign = "<font class='text-primary'>*</font>"; ?>
<div class="modal fade" id="modalNuevaFacturaCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content bg-body-highlight p-6">
      <div class="modal-header justify-content-between border-0 p-0 mb-2">
        <h3 class="mb-0" id="header-modal-factura"> <i class="fas fa-user"></i> Facturacion Cliente</h3>
        <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
          <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body px-0" id="modalFacturaCliente_p1">
        <h4 class="mb-0 border-0 p-0 mb-2">Información básica</h4>
        <input type="hidden" id="tipoComprobante">
        <div class="col-md-12 row">
<input type="hidden" id="usuario_id" value="<?= $_SESSION['ID'] ?>">

          <div class="col-md-4">
            <label class="text-body-highlight fw-bold mb-2">Vendedor <?= $isRequiredSign ?></label>
            <select required class="select2Cliente form-select " style="width:100%" id="vendedorId">
            
              <!-- <option value="0">Seleccionar al vendedor</option>
              <option value="1">Ally Aagaard</option>
              <option value="2">Aida Moen</option>
              <option value="3">Niko Koss</option> -->
            </select>
          </div>

          <div class="col-md-4">
            <label class="text-body-highlight fw-bold mb-2">Fecha de elaboración <?= $isRequiredSign ?></label>
            <input required class="form-control" type="date" id="fechaElaboracion" value="<?= date('Y-m-d') ?>" placeholder="Fecha de elaboración">
          </div>

          <div class="col-md-4">
            <label class="text-body-highlight fw-bold mb-2">Fecha de vencimiento <?= $isRequiredSign ?></label>
            <input required class="form-control" type="date" id="fechaVencimiento" value="<?= date('Y-m-d') ?>" placeholder="Fecha de elaboración">
          </div>
          <div class="col-md-4" >
              <label class="text-body-highlight fw-bold mb-2">Entidad <?=$isRequiredSign?></label>
              <select class=" select2Cliente" style="width: 100%;" id="entidadId" required>
               <option value="">Seleccione</option>
             
                <?php 
                echo cargarOptionsEntidades(); 
                ?>
              </select>
            </div>

          <div class="col-md-4" id="content-modal-entidad">
            <label class="text-body-highlight fw-bold mb-2">Centro de costo <?= $isRequiredSign ?></label>
            <select required class="select2Cliente" style="width:100%" id="centroCosto"></select>
          </div>

          <div class="col-md-4" id="content-modal-entidad">
            <label class="text-body-highlight fw-bold mb-2">Numero de Autorizacion </label>
            <input class="form-control" type="text" id="numeroAutorizacion" onchange="$('#modalNuevaFacturaCliente #modal-resumen-n-autorizacion').html( this.value != '' ? this.value : 'No aplica' )" value="<?= rand(10000, 100000) ?>">
          </div>

          <div class="col-md-4">
            <label class="text-body-highlight fw-bold mb-2">Tipo de persona <?= $isRequiredSign ?></label>
            <select required class="select2Cliente form-select" onchange="mostrarCamposTipoPersona(this.value);" style="width:100%" id="tipoPersona">
              <option value="1">Natural</option>
              <option value="2">Juridica</option>
            </select>
          </div>

          <div class="col-md-4" id="content-modal-entidad">
            <label class="text-body-highlight fw-bold mb-2">Cliente <?= $isRequiredSign ?></label>
            <select class="select2Cliente form-select" style="width:100%" onchange="habilitarCampos(this)" id="clienteId"></select>
            <!-- required -->
          </div>


          <?php
          // "Tipo persona" => ["tipoPersona", "", "select", ["Natural", "Juridica"], "required"],
          $camposAdicionalesClienes = [
            /// DATOS PARA PERSONA NATURAL
            "Tipo Identificación" => ["tipoIdentificacion", "", "select", $tiposDocumento, "required"],
            "Identificacion" => ["identificacion", "number", "input", [], "required"],
            "Primer Apellido" => ["primerApellido", "text", "input", [], "required"],
            "Segundo Apellido" => ["segundoApellido", "text", "input", [], ""],
            "Primer Nombre" => ["primerNombre", "text", "input", [], "required"],
            "Segundo Nombre" => ["segundoNombre", "text", "input", [], ""],

            /// DATOS PARA PERSONA JURIDICA
            "Tipo Identificación T." => ["tipoIdentificacionTributaria", "", "select", ["NIT", "RUC", "CIF"], "required"],
            "Identificacion T." => ["identificacionTributaria", "text", "input", [], "required"],
            "Razon Social" => ["razonSocial", "text", "input", [], "required"],
            "Tipo de sociedad" => ["tipoSociedad", "", "select", ["SAS", "SA", "LTDA"], "required"],

            /// DATOS ADICIONALES
            "Direccion" => ["direccion", "text", "input", [], "required"],
            "Numero de Telefono " => ["numeroTelefono", "number", "input", [], "required"],
            "Email" => ["emailFe", "email", "input", [], "required"],

          ];


          foreach ($camposAdicionalesClienes as $key => $datos) {


          ?>
            <div class="col-md-4" id="content-input-cliente-<?= $datos[0] ?>">
              <label class="text-body-highlight fw-bold mb-2"><?= $key ?> <?= (($datos[4] == 'required') ? $isRequiredSign : '') ?></label>
              <?php if ($datos[2] == "select") { ?>
                <select class="select2Cliente datosAdicionaleCliente" <?= $datos[4] ?> style="width:100%" id="<?= $datos[0] ?>">
                  <?php
                  foreach ($datos[3] as $key => $value) {
                    echo "<option value='$key'>$value</option>";
                  }
                  ?>
                </select>
              <?php } else if ($datos[2] == "input") { ?>
                <input class="form-control datosAdicionaleCliente" <?= $datos[4] ?> type="<?= $datos[1] ?>" id="<?= $datos[0] ?>" placeholder="">
              <?php } ?>
            </div>
          <?php } ?>


          <hr style="margin: 20px 0px">


        </div>
      </div>

      <div class="modal-body px-0" id="modalFacturaCliente_p2">
        <h4 class="mb-0 border-0 p-0 mb-2">Información de facturación</h4>
        <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" id="tabla-modal">
          <thead>
            <tr>
              <th style="padding:10px;">Producto/Servicio</th>
              <th style="padding:10px;width:8%">Cantidad</th>
              <th style="padding:10px;">Precio U.</th>
              <th style="padding:10px;width:10%">Descuento</th>
              <th style="padding:10px;">Impuesto C.</th>
              <th style="padding:10px;">Impuesto R.</th>
              <th style="padding:10px;">Valor Total</th>
              <th style="padding:10px;"></th>
            </tr>
          </thead>
          <tbody id="tbody-modal-facturacion"></tbody>
          <tfoot>
            <tr>
              <th colspan="6">Total Neto</th>
              <th class="text-end" id="total-neto-inner">0.00</th>
              <input type="hidden" id="total-neto" value="0">
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="modal-body px-0" id="modalFacturaCliente_p3">
        <div class="col-md-12 row">

          <!-- SECCION DE METODOS DE PAGO -->
          <div class="col-md-6">
            <h4 class="mb-0 border-0 p-0 mb-2">Metodos de pago</h4>
            <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" style="width:100%;border-radius: 15px !important;" id="tabla-modal-mediopago">
              <thead>
                <tr>
                  <th style="padding:10px !important;">Metodo</th>
                  <th style="padding:10px !important;">Valor</th>
                  <th style="padding:10px !important;">N° de Comprobante</th>
                  <th style="padding:10px !important;"></th>
                </tr>
              </thead>
              <tbody id="tbody-modal-medios-pago"></tbody>
            </table>
          </div>
          <!-- SECCION DE METODOS DE PAGO -->
          
          <!-- SECCION DE RESUMEN -->
          <div class="col-md-6">
            <h4 class="mb-0 border-0 p-0 mb-2">Resumen</h4>
            <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" style="width:100%;border-radius: 15px !important;" id="tabla-modal-resumen">
              <!-- <thead>
                <tr>
                  <th style="padding:10px !important;">Item</th>
                  <th style="padding:10px !important;">Valor</th>
                  <th style="padding:10px !important;"></th>
                </tr>
              </thead> -->
              <tbody id="tbody-modal-resumen-f">
                <!-- <tr>
                  <td><b>Total Facturado</b></td>
                  <td id="modal-resumen-total-facturado">0.00</td>
                </tr> -->
                <tr>
                  <td><b>Subtotal</b></td>
                  <td id="modal-resumen-subtotal-facturado">0.00</td>
                  <input type="hidden" id="subTotal" value="0">
                </tr>
                <tr>
                  <td><b>Total Descuentos</b></td>
                  <td id="modal-resumen-descuentos-facturado">0.00</td>
                  <input type="hidden" id="totalDescuentos" value="0">
                </tr>
                <tr>
                  <td><b>Total Impuestos</b></td>
                  <td id="modal-resumen-impuestos-facturado">0.00</td>
                  <input type="hidden" id="totalImpuestos" value="0">
                </tr>
                <tr>
                  <td><b>Total Pagado</b></td>
                  <td id="modal-resumen-total-pagado">0.00</td>
                  <input type="hidden" id="total-pagado" value="0">
                </tr>
                <tr>
                  <td><b>Total Neto</b></td>
                  <td id="modal-resumen-total-neto">0.00</td>
                  <input type="hidden" id="totalNeto" value="0">
                </tr>
                <tr>
                  <td><b>Numero Autorizacion</b></td>
                  <td id="modal-resumen-n-autorizacion"></td>
                </tr>
              </tbody>
            </table>  
          </div>
          <!-- SECCION DE RESUMEN -->
          <input type="hidden" id="facturaTypeModal">
        </div>

      </div>

      <div class="modal-footer border-0 pt-6 px-0 pb-0">
        <div class="col-md-12 row">
          <div class="col-md-6 text-start" id="paginacionModal"></div>
          <div class="col-md-6 text-end">
            <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
            <button class="btn btn-primary my-0" onclick="guardarFacturaCliente()"> <i class="fas fa-bookmark"></i> &nbsp; Crear factura</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  let indiceFilaMP = 0;
  let optionsMetodosPago = `<option value="">Seleccione</option>`;
  let metodosPago = <?= $metodosPago ?>;
  console.log(metodosPago);

  Object.keys(metodosPago).forEach(key => {
    optionsMetodosPago += `<option value="${key}">${metodosPago[key].nombre}</option>`;
  });
</script>
<script>


$(document).ready(function(){
    $('#clienteId').change(function(){
        var cliente_id = $(this).val();
        //console.log(cliente_id);
        $.ajax({
            type: "POST",
            url: "Facturacion/FE_Ajax_Admisiones.php",
            data: {cliente_id: cliente_id},
            success: function(response){
                var historias = JSON.parse(response);
                console.log(historias);
                optionsProductos = '<option value="" selected>Seleccione...</option>'; // Resetea las opciones
                $.each(historias, function(index, historia){
                    optionsProductos += '<option data-precio="' + historia.precio + '" value="' + historia.id + '">' + historia.nombreProcedimiento + ' - ' + historia.fecha + ' </option>';
                });
                // Actualiza todos los selects existentes con las nuevas opciones
               // Actualiza el <select> con id="optionProductos"
               $('.optionProductos').html(optionsProductos);
            }
        });
    });
});


</script>

<?php include "./funcionesJsFacturas.php"; ?>
<?php include "./funcionesJsMetodosPago.php"; ?>


<script>
  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ////////////////////////
  // ? /////////////// ======== ///////////////////////////
  function resetModalFacturaCliente() {
    indiceFila = 0;
    indiceFilaMP = 0;
    $("#modalNuevaFacturaCliente #tbody-modal-facturacion").html("");
    $("#modalNuevaFacturaCliente #tbody-modal-medios-pago").html("");
    $("#modalNuevaFacturaCliente #modal-resumen-total-pagado").html("0.00");
    $("#modalNuevaFacturaCliente #total-pagado").val("0");
    AnadirFila("modalNuevaFacturaCliente");
    AnadirFilaMetodos("modalNuevaFacturaCliente")
  }

  function habilitarCampos(selectElement) {
    const datosAdicionaleCliente = document.querySelectorAll('#modalNuevaFacturaCliente .datosAdicionaleCliente');

    // Si no hay opción seleccionada o si es una opción "vacía"
    if (selectElement.value == "" || selectElement.value == "0") {
      datosAdicionaleCliente.forEach(element => {
        element.value = "";
        element.disabled = false; // Asegúrate de que se habiliten los campos
      });
      return;
    }

    // Obtener la opción seleccionada
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    const tipoCliente = selectedOption.getAttribute('data-tipopersona');
   // console.log("El tipo de cliente es  => " + tipoCliente);
    
    let object = {};

    if (tipoCliente == 'Natural') {
      // Obtener los atributos data
      const pn = selectedOption.getAttribute('data-pn');
      const sn = selectedOption.getAttribute('data-sn');
      const pa = selectedOption.getAttribute('data-pa');
      const sa = selectedOption.getAttribute('data-sa');
      const dir = selectedOption.getAttribute('data-dir');
      const tipo = selectedOption.getAttribute('data-tipo');
      const doc = selectedOption.getAttribute('data-doc');
      const mail = selectedOption.getAttribute('data-mail');
      const tel = selectedOption.getAttribute('data-tel');

      // Crear el objeto con los datos
      object = {
        tipoIdentificacion: tipo,
        identificacion: doc,
        tipoPersona: "1",
        primerNombre: pn,
        segundoNombre: sn,
        primerApellido: pa,
        segundoApellido: sa,
        direccion: dir,
        numeroTelefono: tel,
        emailFe: mail,
      };
    } else if (tipoCliente == 'Juridica') {
      // Obtener los atributos data
      const nombre = selectedOption.getAttribute('data-nombre');
      const dir = selectedOption.getAttribute('data-dir');
      const tipo = selectedOption.getAttribute('data-tipo');
      const tipoSociedad = selectedOption.getAttribute('data-tiposociedad');
      const doc = selectedOption.getAttribute('data-doc');
      const mail = selectedOption.getAttribute('data-mail');
      const tel = selectedOption.getAttribute('data-tel');

      // Crear el objeto con los datos
      object = {
        tipoIdentificacionTributaria: tipo, 
        identificacionTributaria: doc, 
        razonSocial: nombre, 
        tipoSociedad: tipoSociedad, 
        direccion: dir, 
        numeroTelefono: tel, 
        emailFe: mail
      };
    }

    //console.log("El contenido del objeto");
    //console.log(object);

    // Asignar los valores a los campos
    datosAdicionaleCliente.forEach(element => {
      const key = element.getAttribute('id'); // Suponiendo que el id del campo coincide con la clave del objeto
      let eventChange = new Event('change');
      if (object[key] !== undefined) {
        element.value = object[key];
        element.dispatchEvent(eventChange);
        element.disabled = true; // Deshabilitar el campo después de asignar el valor
      } else {
        element.value = ""; // Limpiar el campo si no hay correspondencia
        element.dispatchEvent(eventChange);
        element.disabled = false; // Asegúrate de que los campos que no se usan estén habilitados
      }

     
    });
  }


  function mostrarCamposTipoPersona(tipo) {
    const listaCampos = ["tipoIdentificacion", "identificacion", "primerApellido", "segundoApellido", "primerNombre", "segundoNombre", "direccion", "numeroTelefono", "emailFe", "tipoIdentificacionTributaria", "identificacionTributaria", "razonSocial", "tipoSociedad"];
    const camposHabilitar = {
      1: ["tipoIdentificacion", "identificacion", "primerApellido", "segundoApellido", "primerNombre", "segundoNombre", "direccion", "numeroTelefono", "emailFe"],
      2: ["tipoIdentificacionTributaria", "identificacionTributaria", "razonSocial", "tipoSociedad", "direccion", "numeroTelefono", "emailFe"],
    }

    let campos = camposHabilitar[tipo];


    for (const key in listaCampos) {
      let elementoInput = $("#modalNuevaFacturaCliente #" + listaCampos[key]);
      if (campos.includes(listaCampos[key])) {
        elementoInput.val("").change();
        elementoInput.attr("required", true);
        $(`#modalNuevaFacturaCliente #content-input-cliente-${listaCampos[key]}`).css("display", "block");
      } else {
        elementoInput.val("").change();
        elementoInput.attr("required", false);
        $(`#modalNuevaFacturaCliente #content-input-cliente-${listaCampos[key]}`).css("display", "none");
      }
    }

    mostrarListadoClientesTipoPersona(tipo)
  }

  function mostrarListadoClientesTipoPersona(tipo) {
    let atributoData = tipo == "1" ? "Natural" : "Juridica";
    let optionsCliente = $("#modalNuevaFacturaCliente #clienteId option");
    optionsCliente.each(function() {

      if ($(this).data("tipopersona") == atributoData || $(this).data("tipopersona") == undefined) {
        // $(this).show();
        $(this).attr("disabled", false);
      } else {
        // $(this).hide();
        $(this).attr("disabled", true);
      }
    });

    $("#modalNuevaFacturaCliente #clienteId").val("").change();
  }



  function guardarFacturaCliente() {
    
    const idS = ["usuario_id","tipoComprobante", "centroCosto", "vendedorId", "clienteId", "subTotal", "totalDescuentos","totalImpuestos","totalNeto", "numeroAutorizacion", "total-pagado","fechaElaboracion","fechaVencimiento","entidadId"];



    let data = {};
    let next = true;

    idS.forEach(element => {
        let elementoInput = $(`#modalNuevaFacturaCliente #${element}`);
        let value = elementoInput.val();

        if (value === "" && elementoInput.attr("required") !== undefined) {
            next = false;
            return false; // Salir del bucle si se encuentra un campo vacío requerido
        }

        data[element] = value;
    });

    if (!next) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor completa todos los datos obligatorios'
        });
        return false;
    }

    let metodosPago = {};
    const filasMP = $("#modalNuevaFacturaCliente #tbody-modal-medios-pago tr");

    filasMP.each(function() {
        let fila = $(this);
        let idFila = fila.attr("id");
        let indice = idFila.replace("filaMP", "");

        let metodoPago = $(`select[name='MetodosPago[${indice}][idMetodoPago]']`).val();
        let valorMetodo = $(`input[name='MetodosPago[${indice}][valorPago]']`).val();
        let numeroComprobante = $(`input[name='MetodosPago[${indice}][numeroComprobante]']`).val();

        if (metodoPago !== "" && valorMetodo !== "0" && valorMetodo !== "") {
            metodosPago[indice] = {
                metodoPago,
                valorMetodo,
                numeroComprobante
            };
        } else {
            next = false;
            return false; // Salir del bucle si algún método de pago es inválido
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

       // Agregar el valor de TipoFactura a data
       let tipoFactura = $("#modalNuevaFacturaCliente #facturaTypeModal").val();
    if (tipoFactura === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tipo de Factura no especificado'
        });
        return false;
    }
    data.TipoFactura = tipoFactura;

    if (!next) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor completa todos los datos obligatorios'
        });
        return false;
    }
    let DatosF ={};
    const filasF = $("#modalNuevaFacturaCliente #tbody-modal-facturacion tr");
    filasF.each(function() {
        let fila = $(this);
        let idFila = fila.attr("id");
        let indice = idFila.replace("fila", "");
        let idProducto = $(`select[name='Productos[${indice}][idProducto]']`).val();
        let cantidad = $(`input[name='Productos[${indice}][cantidad]']`).val();
        let valorUnitario = $(`input[name='Productos[${indice}][valorUnitario]']`).val();
        let porcentajeDesc = $(`input[name='Productos[${indice}][porcentajeDesc]']`).val();
        let impuestoCargo = $(`select[name='Productos[${indice}][impuestoCargo]']`).val();
        let impuestoRetencion =$(`select[name='Productos[${indice}][impuestoRetencion]']`).val();
        
        let totalDescuento = Number($(`select[name='Productos[${indice}][totalDescuento]']`).val());
        let totalImpuestoCargo = Number($(`select[name='Productos[${indice}][totalImpuestoCargo]']`).val());
        let totalImpuestoRetencion = Number($(`select[name='Productos[${indice}][totalImpuestoRetencion]']`).val());
        let totalBruto = Number($(`select[name='Productos[${indice}][totalBruto]']`).val());


        let total = $(`input[name='Productos[${indice}][total]']`).val();
        //if (idProducto !== "" && cantidad !== "" && valorUnitario !== "" && porcentajeDesc !== "" && impuestoCargo !== "" && impuestoRetencion !== "" && total !== "") {
        if (idProducto !== "" && cantidad !== "" && valorUnitario !== "" && porcentajeDesc !== ""  && total !== "") {
            DatosF[indice] = {
                idProducto,
                cantidad,
                valorUnitario,
                porcentajeDesc,
                impuestoCargo,
                impuestoRetencion,
                totalDescuento,
                totalImpuestoCargo,
                totalImpuestoRetencion,
                totalBruto,
                total
            };
        } else {
            next = false;
            return false; // Salir del bucle si todos los campos de facturación son inválido
        }
    })
    data.DatosF = DatosF;

    let dataCliente = {};
    let nextCliente = true;

    if (data.clienteId === "" || data.clienteId === "0") {
        const camposCliente = ["tipoIdentificacion", "identificacion", "tipoPersona", "primerNombre", "segundoNombre", "primerApellido", "segundoApellido", "direccion", "numeroTelefono", "emailFe"];
        
        camposCliente.forEach(element => {
            let elementoInput = $(`#modalNuevaFacturaCliente #${element}`);
            let value = elementoInput.val();

            if (elementoInput.attr("required") !== undefined && value === "") {
                nextCliente = false;
                return false; // Salir del bucle si algún campo de cliente es inválido
            }

            dataCliente[element] = value;
        });
    }

    if (!nextCliente) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Alguno de tus campos de cliente está vacío'
        });
        return false;
    }

    data.dataCliente = dataCliente;

    // Swal.fire({
    //     icon: 'success',
    //     title: 'Correcto',
    //     text: 'Factura generada correctamente'
    // });

    // Enviar los datos por AJAX
    console.log("DATA PARA GUARDAR");
    console.log(data);

    
   
    $.ajax({
        url: 'Facturacion/FE_Ajax_Facturacion.php',
        type: 'POST',
        data: JSON.stringify(data), // Envía la data en formato JSON

      
        success: function(response) {
            console.log('Respuesta del servidor:', response);
            Swal.fire({
        icon: 'success',
        title: 'Correcto',
        text: 'Factura generada correctamente'
    });

    resetModalFacturaCliente();
    $('#modalNuevaFacturaCliente').modal('hide'); // Ocultar el modal después de enviar la cita
         location.reload(); // Recargar la página después de actualizar la cita
        },
        error: function(xhr, status, error) {
            console.error('Error en la petición:', error);
        }
    });

    return data;
}



  function AbrirModalFacturaCliente() {

    $("#modalNuevaFacturaCliente #entidadId").val("").change();
    // $("#modalNuevaFacturaCliente #clienteId").html(obtenerOptionsCliente("Seleccione")).val("").change();
    $("#modalNuevaFacturaCliente #vendedorId").html(obtenerOptionsVendedores("Seleccione")).val("").change();
    //$("#modalNuevaFacturaCliente #centroCosto").html(obtenerOptionsCentrosCosto("Seleccione")).val("").change();
    $("#modalNuevaFacturaCliente #clienteId").html(obtenerOptionsClienteYEmpresa("Seleccione")).val("").change();
    $("#modalNuevaFacturaCliente #tipoComprobante").val("Factura_Entidad").change();
    $("#modalNuevaFacturaCliente #centroCosto").html(obtenerOptionsCentrosCosto()).val("").change();
    $("#modalNuevaFacturaCliente #modal-resumen-n-autorizacion").html(( $("#numeroAutorizacion").val() != '' ? $("#numeroAutorizacion").val() : 'No aplica' ));
    
    mostrarCamposTipoPersona($("#modalNuevaFacturaCliente #tipoPersona").val())


  }


  $(document).ready(function() {
    AnadirFilaMetodos("modalNuevaFacturaCliente")
    AnadirFila("modalNuevaFacturaCliente");
    $('#modalNuevaFacturaCliente').on('hidden.bs.modal', function() {
      resetModalFacturaCliente()
    });

    $('#modalNuevaFacturaCliente').on('shown.bs.modal', function() {
      resetModalFacturaCliente();
      AbrirModalFacturaCliente()
      paginacionModal("modalNuevaFacturaCliente", "modalFacturaCliente_p", 3) /// => includeGeneralesosModalFE.php
    });


    setTimeout(() => {
      selectToModal("modalNuevaFacturaCliente", "select2Cliente")
    }, 1000);


  });

  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ///////////////////////////
  // ? /////////////// ======== ///////////////////////////
</script>

