<?php $isRequiredSign = "<font class='text-primary'>*</font>"; ?>
<div class="modal fade" id="modalNuevoDocumentoSoporte" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content bg-body-highlight p-6">
      <div class="modal-header justify-content-between border-0 p-0 mb-2">
        <h3 class="mb-0" id="header-modal-factura"> <i class="fas fa-file-lines"></i> Documento Soporte</h3>
        <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
          <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body px-0" id="modal-documentosoporte-pagina-1">
        <h4 class="mb-0 border-0 p-0 mb-2">Información básica</h4>
        <input type="hidden" id="tipoComprobante" value="Documento_Soporte">
        <div class="col-md-12 row">


          <div class="col-md-4">
            <label class="text-body-highlight fw-bold mb-2">Vendedor <?= $isRequiredSign ?></label>
            <select required class="select2DSoporte form-select " style="width:100%" id="id_vendedor">
              <option value="0">Seleccionar al vendedor</option>
              <option value="1">Ally Aagaard</option>
              <option value="2">Aida Moen</option>
              <option value="3">Niko Koss</option>
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


          <div class="col-md-4" id="content-modal-entidad">
            <label class="text-body-highlight fw-bold mb-2">Centro de costo <?= $isRequiredSign ?></label>
            <select required class="select2DSoporte" style="width:100%" id="cCosto"></select>
          </div>


          <div class="col-md-4" id="content-modal-entidad">
            <label class="text-body-highlight fw-bold mb-2">Proveedor <?= $isRequiredSign ?></label>
            <select required class="select2DSoporte form-select" style="width:100%" onchange="habilitarCamposProveedor(this)" id="proveedorId"></select>
          </div>


          <?php
          // "Tipo persona" => ["tipoPersona", "", "select", ["Natural", "Juridica"], "required"],
          $camposAdicionalesClienes = [

            /// DATOS PARA PERSONA JURIDICA
            "Tipo Identificación T." => ["tipoIdTributaria", "", "select", ["NIT", "RUC", "CIF"], "required"],
            "Identificacion T." => ["idTributaria", "text", "input", [], "required"],
            "Razon Social" => ["razonSocial", "text", "input", [], "required"],
            "Tipo de sociedad" => ["tSociedad", "", "select", ["SAS", "SA", "LTDA"], "required"],

            /// DATOS ADICIONALES
            "Direccion" => ["direccion", "text", "input", [], "required"],
            "Numero de Telefono " => ["numeroTelefono", "text", "input", [], "required"],
            "Email" => ["emailFe", "email", "input", [], "required"],

          ];


          foreach ($camposAdicionalesClienes as $key => $datos) {


          ?>
            <div class="col-md-4" id="content-input-cliente-<?= $datos[0] ?>">
              <label class="text-body-highlight fw-bold mb-2"><?= $key ?> <?= (($datos[4] == 'required') ? $isRequiredSign : '') ?></label>
              <?php if ($datos[2] == "select") { ?>
                <select class="select2DSoporte datosAdicionalesProveedor" <?= $datos[4] ?> style="width:100%" id="<?= $datos[0] ?>">
                  <?php
                  foreach ($datos[3] as $key => $value) {
                    echo "<option value='$key'>$value</option>";
                  }
                  ?>
                </select>
              <?php } else if ($datos[2] == "input") { ?>
                <input class="form-control datosAdicionalesProveedor" <?= $datos[4] ?> type="<?= $datos[1] ?>" id="<?= $datos[0] ?>" placeholder="">
              <?php } ?>
            </div>
          <?php } ?>


          <hr style="margin: 20px 0px">


        </div>
      </div>

      <div class="modal-body px-0" id="modal-documentosoporte-pagina-2">
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

      <div class="modal-body px-0" id="modal-documentosoporte-pagina-3">
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
          <!-- SECCION DE RESUMEN -->

        </div>

      </div>

      <div class="modal-footer border-0 pt-6 px-0 pb-0">
        <div class="col-md-12 row">
          <div class="col-md-6 text-start" id="paginacionModal"></div>
          <div class="col-md-6 text-end">
            <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
            <button class="btn btn-primary my-0" onclick="guardarDocumentoSoporte()"> <i class="fas fa-bookmark"></i> &nbsp; Crear factura</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ////////////////////////
  // ? /////////////// ======== ///////////////////////////
  function resetModalDocumentoSoporte() {
    indiceFila = 0;
    indiceFilaMP = 0;
    $("#modalNuevoDocumentoSoporte #tbody-modal-facturacion").html("");
    $("#modalNuevoDocumentoSoporte #tbody-modal-medios-pago").html("");
    $("#modalNuevoDocumentoSoporte #modal-resumen-total-pagado").html("0.00");
    $("#modalNuevoDocumentoSoporte #total-pagado").val("0");
    AnadirFila("modalNuevoDocumentoSoporte");
    AnadirFilaMetodos("modalNuevoDocumentoSoporte")
  }

  function habilitarCamposProveedor(selectElement) {
    const datosAdicionalesProveedor = document.querySelectorAll('#modalNuevoDocumentoSoporte .datosAdicionalesProveedor');
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Si no hay opción seleccionada o si es una opción "vacía"
    if (selectElement.value == "" || selectElement.value == "0") {
      datosAdicionalesProveedor.forEach(element => {
        element.value = "";
        element.disabled = false; // Asegúrate de que se habiliten los campos
      });
      return;
    }


      // Obtener los atributos data
      const nombre = selectedOption.getAttribute('data-nombre');
      const dir = selectedOption.getAttribute('data-dir');
      const tipo = selectedOption.getAttribute('data-tipo');
      const tipoSociedad = selectedOption.getAttribute('data-tiposociedad');
      const doc = selectedOption.getAttribute('data-doc');
      const mail = selectedOption.getAttribute('data-mail');
      const tel = selectedOption.getAttribute('data-tel');

      // Crear el objeto con los datos
      const object = {
        tipoIdTributaria: tipo, 
        idTributaria: doc, 
        razonSocial: nombre, 
        tSociedad: tipoSociedad, 
        direccion: dir, 
        numeroTelefono: tel, 
        emailFe: mail
      };

    console.log("El contenido del objeto");
    console.log(object);

    // Asignar los valores a los campos
    datosAdicionalesProveedor.forEach(element => {
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


  // function mostrarCamposTipoPersona(tipo) {
  //   const listaCampos = ["tipoIdentificacion", "identificacion", "primerApellido", "segundoApellido", "primerNombre", "segundoNombre", "direccion", "numeroTelefono", "emailFe", "tipoIdentificacionTributaria", "identificacionTributaria", "razonSocial", "tipoSociedad"];
  //   const camposHabilitar = {
  //     1: ["tipoIdentificacion", "identificacion", "primerApellido", "segundoApellido", "primerNombre", "segundoNombre", "direccion", "numeroTelefono", "emailFe"],
  //     2: ["tipoIdentificacionTributaria", "identificacionTributaria", "razonSocial", "tipoSociedad", "direccion", "numeroTelefono", "emailFe"],
  //   }

  //   let campos = camposHabilitar[tipo];


  //   for (const key in listaCampos) {
  //     let elementoInput = $("#modalNuevoDocumentoSoporte #" + listaCampos[key]);
  //     if (campos.includes(listaCampos[key])) {
  //       elementoInput.val("").change();
  //       elementoInput.attr("required", true);
  //       $(`#modalNuevoDocumentoSoporte #content-input-cliente-${listaCampos[key]}`).css("display", "block");
  //     } else {
  //       elementoInput.val("").change();
  //       elementoInput.attr("required", false);
  //       $(`#modalNuevoDocumentoSoporte #content-input-cliente-${listaCampos[key]}`).css("display", "none");
  //     }
  //   }

  //   mostrarListadoClientesTipoPersona(tipo)
  // }

  // function mostrarListadoClientesTipoPersona(tipo) {
  //   let atributoData = tipo == "1" ? "Natural" : "Juridica";
  //   let optionsCliente = $("#modalNuevoDocumentoSoporte #proveedorId option");
  //   optionsCliente.each(function() {

  //     if ($(this).data("tipopersona") == atributoData || $(this).data("tipopersona") == undefined) {
  //       // $(this).show();
  //       $(this).attr("disabled", false);
  //     } else {
  //       // $(this).hide();
  //       $(this).attr("disabled", true);
  //     }
  //   });

  //   $("#modalNuevoDocumentoSoporte #proveedorId").val("").change();
  // }




  function guardarDocumentoSoporte() {
    let idS = ["tipoComprobante", "cCosto", "id_vendedor", "proveedorId", "total-neto", "numeroAutorizacion", "total-pagado"];
    let next = true;
    let data = {};
    for (let element of idS) {
      let elementoInput = $("#modalNuevoDocumentoSoporte #" + element);
      let value = elementoInput.val();

      if (value == "" && elementoInput.attr("required") != undefined) {
        next = false;
        break; // Salir del bucle si se encuentra un campo vacío requerido
      }

      data[element] = value; // Guardar el valor, incluso si es vacío
    }
    // idS.forEach(element => {
    //   if (!next) return;
    //   let key = element;
    //   let elementoInput = $("#modalNuevoDocumentoSoporte #" + element);
    //   let value = elementoInput.val();
    //   if (value == "" && elementoInput.attr("required")) {
    //     next = false;
    //     return;
    //   }
    //   data[key] = value;
    // });

    if (!next) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor completa todos los datos obligatorios'
      });
      return false;
    }

    let metodosPago = {};
    next = true;
    const filasMP = $("#modalNuevoDocumentoSoporte #tbody-modal-medios-pago tr")
    filasMP.each(function() {
      // Usar `this` dentro de `each` ya hace referencia a cada fila
      let fila = $(this); // Asegúrate de envolver `this` en `$()`
      let idFila = fila.attr("id");
      let indice = idFila.replace("filaMP", "");

      // Corrige el selector para obtener el valor del método de pago y el valor de pago
      let metodoPago = $(`select[name='MetodosPago[${indice}][idMetodoPago]']`).val();
      let valorMetodo = $(`input[name='MetodosPago[${indice}][valorPago]']`).val();

      if (metodoPago !== "") {
        if (valorMetodo != "0" && valorMetodo != "") {
          let nuevoMP = {
            metodoPago,
            valorMetodo
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
        text: 'Parece que algun metodo de pago está en 0 o vacío'
      });
      return false;
    }

    data.metodosPago = metodosPago;

    let dataCliente = {};
    let nextCliente = true;
    if (data.proveedorId == "" || data.proveedorId == "0") {
      let camposCiente = ["tipoIdTributaria","idTributaria","razonSocial","tSociedad","direccion","numeroTelefono","emailFe"];
      camposCiente.forEach(element => {
        if (!nextCliente) return;
        let elementoInput = $("#modalNuevoDocumentoSoporte #" + element);
        if (elementoInput.attr("required") != undefined && elementoInput.val() == "") {
          nextCliente = false;
          return false;
        }
        dataCliente[element] = elementoInput.val();
      });
    }

    // const dataCienteTieneVacio = Object.values(dataCliente).some(value => value === '');
    if (!nextCliente) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Alguno de tus campos de cliente esta vacío'
      });
      return false;
    }


    data.dataCliente = dataCliente;
    console.log(data);
    return data;


  }



  function AbrirModalDocumentoSoporte() {
    $("#modalNuevoDocumentoSoporte #proveedorId").html(obtenerOptionsProveedores("Seleccione")).val("").change();
    $("#modalNuevoDocumentoSoporte #cCosto").html(obtenerOptionsCentrosCosto()).val("").change();
  }


  $(document).ready(function() {
    AnadirFilaMetodos("modalNuevoDocumentoSoporte")
    AnadirFila("modalNuevoDocumentoSoporte");
    $('#modalNuevoDocumentoSoporte').on('hidden.bs.modal', function() {
      resetModalDocumentoSoporte()
    });

    $('#modalNuevoDocumentoSoporte').on('shown.bs.modal', function() {
      resetModalDocumentoSoporte();
      AbrirModalDocumentoSoporte()
      paginacionModal("modalNuevoDocumentoSoporte", "modal-documentosoporte-pagina-", 3) /// => includeGeneralesosModalFE.php
    });


    setTimeout(() => {
      selectToModal("modalNuevoDocumentoSoporte", "select2DSoporte")
    }, 1000);


  });

  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ///////////////////////////
  // ? /////////////// ======== ///////////////////////////
</script>