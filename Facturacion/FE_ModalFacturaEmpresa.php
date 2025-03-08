<?php  $isRequiredSign = "<font class='text-primary'>*</font>"; ?>

<div class="modal fade" id="modalNuevaFacturaEmpresa" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content bg-body-highlight p-6">
      <div class="modal-header justify-content-between border-0 p-0 mb-2">
        <h3 class="mb-0" id="header-modal-factura"> <i class="fas fa-file-lines"></i> Facturacion Entidad</h3>
        <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
          <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body px-0" id="modalFacturaEmpresa_p1">
        <h4 class="mb-0 border-0 p-0 mb-2">Información básica</h4>
        <input type="hidden" id="tipoComprobante">
        <div class="col-md-12 row">
           
          
            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Vendedor <?=$isRequiredSign?></label>
              <select class="form-select select2ModalEmpresa" style="width: 100%;" required id="vendedor_id">
                <option value="0">Seleccionar al vendedor</option>
                <option value="1">Ally Aagaard</option>
                <option value="2">Aida Moen</option>
                <option value="3">Niko Koss</option>
              </select>
            </div>
            
            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Fecha de elaboración <?=$isRequiredSign?></label>
              <input class="form-control" required type="date" id="fechaElaboracion" value="<?= date('Y-m-d')?>" placeholder="Fecha de elaboración">
            </div>

            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Fecha de vencimiento <?=$isRequiredSign?></label>
              <input class="form-control" required type="date" id="fechaElaboracion" value="<?= date('Y-m-d')?>" placeholder="Fecha de elaboración">
            </div>
            
            
            <div class="col-md-4" id="content-modal-entidad">
              <label class="text-body-highlight fw-bold mb-2">Entidad <?=$isRequiredSign?></label>
              <select class="form-select select2ModalEmpresa" style="width: 100%;" id="entidadId" required onchange="filtrarTablaModalEmpresa();filtrarPacientes(this.value)">
                <option value="">Seleccione</option>
                <option value="1">Eficiencia Ineficaz SAS</option>
                <option value="2">Empresa de Prueba SAS</option>
                <option value="3">Hello World SAS</option>
              </select>
            </div>
            
            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Numero de Autorizacion</label>
              <input class="form-control" type="text" id="numeroAutorizacion" onchange="$('#modalNuevaFacturaEmpresa #modal-resumen-n-autorizacion').html( this.value != '' ? this.value : 'No aplica' )" placeholder="">
            </div>

            <div class="col-md-4" id="content-modal-entidad">
              <label class="text-body-highlight fw-bold mb-2">Centro de costo <?=$isRequiredSign?></label>
              <select class="form-select select2ModalEmpresa" style="width: 100%;" id="centro_costo" required></select>
            </div>
            
            <hr style="margin: 20px 0px">
            <div class="col-md-12">
                <label class="text-body-highlight fw-bold mb-2">Filtrar</label>
            </div>
            
            
            <!-- <h4 class="mb-0 border-0 p-0 mb-2">Filtrar</h4> -->
            <div class="col-md-4">
                <label class="text-body-highlight fw-bold mb-2">Fecha de Inicio - Procedimiento</label>
                <input type="date" onchange="filtrarTablaModalEmpresa()" class="form-control" id="filtroEmpresafechaInicio">
            </div>
            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Fecha Fin - Procedimiento</label>
              <input type="date" onchange="filtrarTablaModalEmpresa()" class="form-control" id="filtroEmpresafechaFin">
            </div>

            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Paciente</label>
              <select class="form-control select2ModalEmpresa" multiple style="width: 100%;" onchange="filtrarTablaModalEmpresa()" id="filtroEmpresapaciente"></select>
            </div>

            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Procedimiento</label>
              <select class="form-control select2ModalEmpresa" multiple style="width: 100%;" onchange="filtrarTablaModalEmpresa()" id="filtroEmpresaprocedimiento"></select>
            </div>
            
            <div class="col-md-4">
              <label class="text-body-highlight fw-bold mb-2">Especialista</label>
              <select class="form-control select2ModalEmpresa"  style="width: 100%;" onchange="filtrarTablaModalEmpresa()" id="filtroEmpresaespecialista"></select>
            </div>


            <!-- <div id="content-filtros" class="col-md-12 row"></div> -->
            
            <!-- <div id="content-campos-adicionales-cliente" class="col-md-12 row"></div> -->

        </div>
      </div>

      <div class="modal-body px-0" id="modalFacturaEmpresa_p2">
        <h4 class="mb-0 border-0 p-0 mb-2">Información de facturación</h4>
        <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" id="tabla-modal">
          <thead>
            <tr>
              <th style="padding:10px !important; width:15%">Paciente</th>
              <th style="padding:10px !important; width:5%">Fecha</th>
              <th style="padding:10px !important; width:20%">Procedimiento</th>
              <th style="padding:10px !important">Autorizacion</th>
              <th style="padding:10px !important">Valor unitario</th>
              <th style="padding:10px !important">Valor Total</th>
              <th style="padding:10px !important;width:5%"> <input type="checkbox" name="" onchange="seleccionarCheckboxMultiple(this.checked, 'checkbox_multiple_empresa')" id=""> </th>
              <!-- <th>Cantidad</th> -->
              <!-- <th>Especialista</th> -->
              <!-- <th>Impuesto cargo</th>
              <th>Impuesto retencion</th> -->
              <!-- <th> <input type="checkbox" name="" onchange="seleccionarTodoCheckbox('checkbox_multiple_empresa')" id=""> </th> -->
            </tr>
          </thead>
          <tbody id="tbody-modal-facturacion"></tbody>
          <tfoot>
            <tr>
              <th colspan="6">Total Neto</th>
              <th class="text-end" id="total-neto-inner">0.00</th>
              <input type="hidden" id="total-neto" value="0">
              <input type="hidden" id="facturasSeleccionadas" value="{}">
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div class="modal-body px-0" id="modalFacturaEmpresa_p3">
        <div class="col-md-12 row">

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

          <div class="col-md-6">
            <h4 class="mb-0 border-0 p-0 mb-2">Resumen</h4>
            <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light table-modal" style="width:100%;border-radius: 15px !important;" id="tabla-modal-resumen">
              <tbody id="tbody-modal-resumen-f">
                <tr>
                  <td><b>Total Facturado</b></td>
                  <td id="modal-resumen-total-facturado"></td>
                </tr>
                <tr>
                  <td><b>Total Pagado</b></td>
                  <td id="modal-resumen-total-pagado">0.00</td>
                  <input type="hidden" id="total-pagado" value="0">
                </tr>
                <tr>
                  <td><b>Numero Autorizacion</b></td>
                  <td id="modal-resumen-n-autorizacion"></td>
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
            <button class="btn btn-primary my-0" onclick="guardarFacturaEmpresa()"> <i class="fas fa-bookmark"></i> &nbsp; Crear factura</button>
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
  function resetModalFacturaEmpresa () {
    indiceFila = 0;
    indiceFilaMP = 0;
    $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion").html("");
    $("#modalNuevaFacturaEmpresa #tbody-modal-medios-pago").html("");
    
    $("#modalNuevaFacturaEmpresa #modal-resumen-total-pagado").html("0.00");
    $("#modalNuevaFacturaEmpresa #total-pagado").val(0);


    // AnadirFila();
    AnadirFilaMetodos("modalNuevaFacturaEmpresa")
  }

  function seleccionarCheckboxMultiple(checked, clase) {
    let elementos = $(`.${clase}`);
    elementos.each(function() {
      this.checked = checked;
    });
    calcularTotalSeleccionado();
  }


  function filtrarPacientes(idEmpresa) {
    let selectPacientes = $("#filtroEmpresapaciente option");

    // Si idEmpresa es 0 o está vacío, mostrar todas las opciones
    if (idEmpresa === "0" || idEmpresa === "") {
        selectPacientes.show();
    } else {
        selectPacientes.each(function() {
            const dataEmpresa = $(this).data("empresa");
            // Mostrar la opción si coincide con idEmpresa, ocultar si no
            if (dataEmpresa == idEmpresa || dataEmpresa == "") {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

 // ? AQUI FORMAMOS UN ARRAY PARA CREAR EL LISTADO DE FACTURAS CON NUMEROS DE AUTORIZACION
 function obtenerJsonFacturasEmpresa() {
    const filas = $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion tr");
    let data = {};
    let isValid = true;

    filas.each(function() {
        if (!isValid) return;

        const fila = $(this);
        const idFila = fila.attr("id");
        const indice = idFila.replace("filaF", "");

        const numeroAutorizacion = $(`input[name='FacturasSeleccionadas[${indice}][nAutorizacion]']`);
        const facturaId = $(`input[name='FacturasSeleccionadas[${indice}][facturaId]']`);
        


        console.log("numeroAutorizacion =>" + numeroAutorizacion );
        console.log("facturaId =>" + facturaId );
        


        if (facturaId.is(":checked")) {
            if (numeroAutorizacion.val() === '') {
                isValid = false; // Validation fails
                return false; // Exit the loop
            } else {
                const procedimiento = {
                    facturaId: Number(facturaId.attr("data-idfactura")),
                    numeroAutorizacion: numeroAutorizacion.val()
                };

                data[indice] = procedimiento;
            }
        }
    });

    return isValid ? JSON.stringify(data) : false; // Return data or false
}



  function tabularDatosFacturaEntidad() {
    let datos  = <?=$dataJsonSimuladaFacturas?>;
    let keysData = Object.keys(datos);


    keysData.forEach(key => {
      let data = datos[key];
      
      let valorTotal = Number(data.valor) * Number(data.cantidad) - Number(data.descuento);
      let fila = `<tr id="filaF${data.facturaId}" data-empresaid="${data.empresaId}" data-especialista="${data.especialistaId}" data-clienteid="${data.clienteId}" data-fecha="${data.fecha}" data-procedimientoid="${data.procedimientoId}">
                    <td style="padding:10px !important">
                      <select class="underline-input">
                        <option value="${data.clienteId}">${data.nombreCliente}</option>
                      </select>
                    </td> 
                    <td style="padding:10px !important"><input class="underline-input" type="date" readonly value="${data.fecha}"></td> 
                    <td style="padding:10px !important">
                      <select class="underline-input">
                        <option value="${data.procedimientoId}">${data.procedimientoNombre}</option>
                      </select>
                    </td> 
                    <td style="padding:10px !important"><input class="underline-input" onkeyup="calcularTotalSeleccionado()" name="FacturasSeleccionadas[${data.facturaId}][nAutorizacion]" type="text" value=""></td>                     
                    <td style="padding:10px !important"><input class="underline-input" type="number" readonly value="${data.valor}"></td> 
                    <td style="padding:10px !important">
                      <input class="underline-input" type="number" readonly value="${valorTotal}">
                    </td> 
                    <td style="padding:10px !important">
                      <input class="checkbox_multiple_empresa" name="FacturasSeleccionadas[${data.facturaId}][facturaId]" onchange="calcularTotalSeleccionado()" type="checkbox" data-idfactura="${data.facturaId}" value="${valorTotal}">
                    </td> 
                  </tr>`;
                $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion").append(fila);
    })

  }


  function guardarFacturaEmpresa() {
      if ($("#facturasSeleccionadas").val() == 'false' || $("#facturasSeleccionadas").val() == '' || $("#facturasSeleccionadas").val() == false) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Debe completar los numeros de autorizacion de las facturas seleccionada'});
        return false;
      }


      let idS =   ["tipoComprobante", "centro_costo" ,  "vendedor_id","entidadId", "numeroAutorizacion" ,"total-neto","facturasSeleccionadas", "total-pagado"];
      let next = true;
      let data = {};
      idS.forEach(element => {
        if(!next) return;
        let key = element;
        let selector = $("#modalNuevaFacturaEmpresa #"+element);
        let value = selector.val();
        
        if (selector.attr("required") && value == "") {
            next = false;
            return;
        }



        data[key] = key == "facturasSeleccionadas" ? JSON.parse(value) : value;
      });

      if (!next) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'No puede dejar campos vacios'});
        return false;
      }

      let metodosPago = {};
      next = true; 
      const filasMP = $("#modalNuevaFacturaEmpresa #tbody-modal-medios-pago tr")
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
                    valorMetodo
                };

                metodosPago[indice] = nuevoMP;
            } else {
                return false;
            }
        }
      });


    if (!next) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Parece que algun metodo de pago está en 0 o vacío'});
      return false;
    }
    
    
    data.metodosPago = metodosPago;
    
    console.log(data);
    Swal.fire({ icon: 'success', title: 'Correcto', text: 'Factura generada correctamente'});
    return data;
      
  
  }

 


  function calcularTotalSeleccionado() {
    let checkboxes = $('.checkbox_multiple_empresa');
    let valortotal = 0;

    console.log("checkboxes");
    console.log(checkboxes);
    

    // Usamos each de jQuery para iterar sobre los checkboxes
    checkboxes.each(function() {
        if (this.checked) {
            valortotal += Number($(this).val());
            console.log("Iterando en calcularTotalSeleccionado" + Number($(this).val()));
            console.log("valorSumar => " + valortotal);
            console.log("valortotal => " + valortotal);
            
        }
    });

    console.log("El json es: ");
    console.log(obtenerJsonFacturasEmpresa());
    
    
    // Actualizar el total y el campo oculto
    $("#modalNuevaFacturaEmpresa #total-neto-inner").html(valortotal.toFixed(2));
    $("#modalNuevaFacturaEmpresa #modal-resumen-total-facturado").html(valortotal.toFixed(2));
    $("#modalNuevaFacturaEmpresa #total-neto").val(valortotal);
    $("#modalNuevaFacturaEmpresa #facturasSeleccionadas").val(obtenerJsonFacturasEmpresa());
  }


  function filtrarTablaModalEmpresa() {

    let filtroEmpresaId = $("#entidadId").val();
    let filtroEmpresafechaInicio = $("#filtroEmpresafechaInicio").val();
    let filtroEmpresafechaFin = $("#filtroEmpresafechaFin").val();
    let filtroEmpresapaciente = $("#filtroEmpresapaciente").val();
    let filtroEmpresaprocedimiento = $("#filtroEmpresaprocedimiento").val();
    let filtroEmpresaespecialista = $("#filtroEmpresaespecialista").val();

    // seleccionarNadaCheckbox("checkbox_multiple_empresa");
    seleccionarCheckboxMultiple(false, "checkbox_multiple_empresa");

    console.log(filtroEmpresapaciente);
    console.log(filtroEmpresaprocedimiento);


    $('#modalNuevaFacturaEmpresa #tbody-modal-facturacion tr').each(function() {
        const fila = $(this);
        const data_empresaid = fila.attr("data-empresaid");
        const data_clienteid = fila.attr("data-clienteid");
        const data_especialista = fila.attr("data-especialista");
        const data_fecha = fila.attr("data-fecha");
        const data_procedimientoid = fila.attr("data-procedimientoid");

        // Obtener la fecha de la fila
        const fechaFila = new Date(data_fecha);
        const fechaInicio = new Date(filtroEmpresafechaInicio);
        const fechaFin = new Date(filtroEmpresafechaFin);

        // Inicializar visibilidad de la fila
        let mostrarFila = true;

        // Filtrar por fecha
        if (filtroEmpresafechaInicio !== "" && filtroEmpresafechaFin !== "") {
            if (fechaFila < fechaInicio || fechaFila > fechaFin) {
                mostrarFila = false;
            }
        }

        // console.log(`filtroEmpresapaciente.length > 0 => ` + (filtroEmpresapaciente.length > 0));
        // console.log(`!filtroEmpresapaciente.includes("0") => ` + !filtroEmpresapaciente.includes("0"));
        // console.log(`!filtroEmpresapaciente.includes("") => ` + !filtroEmpresapaciente.includes(""));

        // Filtrar por paciente
        if (filtroEmpresapaciente.length > 0 && !filtroEmpresapaciente.includes("0") && !filtroEmpresapaciente.includes("")) {             
            if (!filtroEmpresapaciente.includes(data_clienteid)) {
                mostrarFila = false;
            }
        }


        // Filtrar por procedimiento
        // if (filtroEmpresaprocedimiento !== "" && filtroEmpresaprocedimiento !== "0") {
        if (filtroEmpresaprocedimiento.length > 0 && !filtroEmpresaprocedimiento.includes("0") && !filtroEmpresaprocedimiento.includes("")) {
            // if (data_procedimientoid !== filtroEmpresaprocedimiento) {
            if (!filtroEmpresaprocedimiento.includes(data_procedimientoid)) {
                mostrarFila = false;
            }
        }
        
        if (filtroEmpresaId !== "" && filtroEmpresaId !== "0") {
            if (data_empresaid !== filtroEmpresaId) {
                mostrarFila = false;
            }
        }
        
        if (filtroEmpresaespecialista !== "" && filtroEmpresaespecialista !== "0") {
            if (data_especialista !== filtroEmpresaespecialista) {
                mostrarFila = false;
            }
        }

        // Mostrar u ocultar la fila según los filtros
        if (mostrarFila) {
            fila.show();
        } else {
            fila.hide();
        }
    });
}

  function AbrirModalFacuraEmpresa() {
    $("#modalNuevaFacturaEmpresa #entidadId").val("").change();
    $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion").html("");
    $("#modalNuevaFacturaEmpresa #tipoComprobante").val("Factura_Entidad").change();
    $("#filtroEmpresapaciente").html(obtenerOptionsCliente());
    $("#filtroEmpresaprocedimiento").html(obtenerOptionsProcedimiento());
    $("#filtroEmpresaespecialista").html(obtenerOptionsEspecialista());
    $("#modalNuevaFacturaEmpresa #centro_costo").html(obtenerOptionsCentrosCosto());
    $("#modalNuevaFacturaEmpresa #modal-resumen-n-autorizacion").html(( $("#numeroAutorizacion").val() != '' ? $("#numeroAutorizacion").val() : 'No aplica' ));

    tabularDatosFacturaEntidad()
    filtrarTablaModalEmpresa();
    paginacionModal("modalNuevaFacturaEmpresa", "modalFacturaEmpresa_p", 3) /// funcion para generar las paginaciones del modal => se encuentra en includeGeneralesModalFE.php

  }



  $(document).ready(function() {
    // AnadirFila();
    $('#modalNuevaFacturaEmpresa').on('hidden.bs.modal', function() {
      resetModalFacturaEmpresa()
    });
    
    $('#modalNuevaFacturaEmpresa').on('shown.bs.modal', function () {
        AnadirFilaMetodos("modalNuevaFacturaEmpresa");
        AbrirModalFacuraEmpresa();
    });

    selectToModal("modalNuevaFacturaEmpresa", "select2ModalEmpresa");


  });

  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ///////////////////////////
  // ? /////////////// ======== ///////////////////////////
</script>
