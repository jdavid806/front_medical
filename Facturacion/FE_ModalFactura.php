<?php 

include "./datosSimuladosFacturas.php";
$dataJsonSimuladaFacturas = json_encode($dataJsonSimuladaFacturas);
$datosSimuladosClientes = json_encode($datosSimuladosClientes);
$tiposDocumento = json_encode($tiposDocumento);
$metodosPago = json_encode($metodosPago);
$dataJsonProcedimientos = json_encode($dataJsonProcedimientos);

?>


<div class="modal fade" id="modalNuevaFactura" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content bg-body-highlight p-6">
      <div class="modal-header justify-content-between border-0 p-0 mb-2">
        <h3 class="mb-0" id="header-modal-factura"></h3>
        <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
          <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body px-0">
        <h4 class="mb-0 border-0 p-0 mb-2">Información básica</h4>
        <input type="hidden" id="documento_tipoComprobante">
        <div class="col-md-12 row">
           
          
          <div class="col-md-6">
              <label class="text-body-highlight fw-bold mb-2">Vendedor</label>
              <select class="form-select " id="documento_vendedorId">
                <option value="0">Seleccionar al vendedor</option>
                <option value="1">Ally Aagaard</option>
                <option value="2">Aida Moen</option>
                <option value="3">Niko Koss</option>
              </select>
            </div>
            
            <div class="col-md-6">
              <label class="text-body-highlight fw-bold mb-2">Fecha de elaboración (fecha de venta)</label>
              <input class="form-control" type="date" id="documento_fechaElaboracion" value="<?= date('Y-m-d')?>" placeholder="Fecha de elaboración">
            </div>
            
            <div class="col-md-12" id="content-modal-cliente">
              <label class="text-body-highlight fw-bold mb-2">Cliente</label>
              <select class="form-select" id="documento_clienteId" onchange="datosAdicionalesCliente(this.value)">
                <option value="">Seleccione</option>
                <option value="0">No registrado</option>
                <option value="1">Ally Aagaard</option>
                <option value="2">Aida Moen</option>
              </select>
            </div>

            <div class="col-md-12" id="content-modal-entidad">
              <label class="text-body-highlight fw-bold mb-2">Entidad</label>
              <select class="form-select" id="documento_entidadId" onchange="filtrarTabla('Factura_Venta_Entidad');filtrarPacientes(this.value)">
                <option value="">Seleccione</option>
                <option value="1">Eficiencia Ineficaz SAS</option>
                <option value="2">Empresa de Prueba SAS</option>
                <option value="3">Hello World SAS</option>
              </select>
            </div>
            
            <div id="content-filtros" class="col-md-12 row"></div>
            
            <!-- <div id="content-campos-adicionales-cliente" class="col-md-12 row"></div> -->

        </div>
      </div>

      <div class="modal-body px-0">
        <h4 class="mb-0 border-0 p-0 mb-2">Información de facturación</h4>
        <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light" id="tabla-modal">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Valor unitario</th>
              <th>%Dscto</th>
              <th>Impuesto cargo</th>
              <th>Impuesto retencion</th>
              <th>Valor Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="tbody-modal-facturacion"></tbody>
          <tfoot>
            <tr>
              <th colspan="7">Total Neto</th>
              <th class="text-end" id="total-neto-inner">0.00</th>
              <input type="hidden" id="total-neto" value="0">
              <input type="hidden" id="facturasSeleccionadas" value="0">
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div class="modal-body px-0">
        <h4 class="mb-0 border-0 p-0 mb-2">Medio de pago</h4>
        <table class="table table-striped table-sm fs-9 mb-0 p-2 bg-light" style="width:50%" id="tabla-modal-mediopago">
          <tbody id="tbody-modal-medios-pago"></tbody>
        </table>
      </div>

      <div class="modal-footer border-0 pt-6 px-0 pb-0">
        <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
        <button class="btn btn-primary my-0" onclick="guardarFactura()"> <i class="fas fa-bookmark"></i> &nbsp; Crear factura</button>
      </div>
    </div>
  </div>
</div>


<?php 
  include "./funcionesJsFacturas.php";
  include "./funcionesJsMetodosPago.php";
  include "./funcionesJsCliente.php";


?>


<script>


  
  

  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ////////////////////////
  // ? /////////////// ======== ///////////////////////////
  function resetModal() {
    indiceFila = 0;
    indiceFilaMP = 0;
    $("#tbody-modal-facturacion").html("");
    $("#tbody-modal-medios-pago").html("");
    AnadirFila();
    AnadirFilaMetodos()
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


  function tabularDatosFacturaEntidad() {
    let datos  = <?=$dataJsonSimuladaFacturas?>;
    let keysData = Object.keys(datos);


    keysData.forEach(key => {
      let data = datos[key];
      // console.log(data);
      
      let valorTotal = Number(data.valor) * Number(data.cantidad) - Number(data.descuento);
      let fila = `<tr data-empresaid="${data.empresaId}" data-clienteid="${data.clienteId}" data-fecha="${data.fecha}" data-procedimientoid="${data.procedimientoId}">
                    <td>
                      <select class="underline-input">
                        <option value="${data.procedimientoId}">${data.procedimientoNombre}</option>
                      </select>
                    </td> 
                    <td><input class="underline-input" type="number" readonly value="${data.cantidad}"></td> 
                    <td><input class="underline-input" type="number" readonly value="${data.valor}"></td> 
                    <td> <input class="underline-input" type="number" readonly value="${data.descuento}"></td>
                    <td>
                      <select class="underline-input">
                        <option value='0'>No aplica</option>
                      </select>
                    </td> 
                    <td>
                      <select class="underline-input">
                        <option value='0'>No aplica</option>
                      </select>
                    </td> 
                    <td>
                      <input class="underline-input" type="number" readonly value="${data.cantidad}">
                    </td> 
                    <td>
                      <input class=" checkbox_multiple_empresa" onchange="calcularTotalSeleccionado()" type="checkbox" data-idfactura="${data.facturaId}" value="${valorTotal}">
                    </td> 
                  </tr>`;
      $("#tbody-modal-facturacion").append(fila);
    })
  }


  function guardarFactura() {
    let documento_tipoComprobante = $("#documento_tipoComprobante").val();
    if (documento_tipoComprobante == 'Factura_Venta_Entidad') {
      let idS =   ["documento_tipoComprobante", "documento_vendedorId","documento_entidadId", "total-neto","facturasSeleccionadas"];
      let next = true;
      let data = {};
      idS.forEach(element => {
        if(!next) return;
        let key = element.replace("documento_","");
        let value = $("#"+element).val();
        if (value == "") {
          next = false;
          return;
        }
        data[key] = value;
      });

      if (!next) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'No puede dejar campos vacios'});
        return;
      }
      console.log(data);
      return data;
      
    }
  }

  function calcularTotalSeleccionado() {
    let checkboxes = $('.checkbox_multiple_empresa');
    let valortotal = 0;
    let facturasSeleccionadas = [];

    // Usamos each de jQuery para iterar sobre los checkboxes
    checkboxes.each(function() {
        if (this.checked) {
            let idFactura = $(this).data('idfactura');
            facturasSeleccionadas.push(idFactura);
            valortotal += Number($(this).val());
        }
    });

    // Convertir a JSON
    facturasSeleccionadas = JSON.stringify(facturasSeleccionadas);

    // Actualizar el total y el campo oculto
    $("#total-neto-inner").html(valortotal.toFixed(2));
    $("#total-neto").val(valortotal);
    $("#facturasSeleccionadas").val(facturasSeleccionadas);
  }

  function obtenerOptionsCliente() {
    let options = `<option data-empresa="" value="">Todos</option>`;
    let datosCliente = <?=$datosSimuladosClientes?>;
    let keysData = Object.keys(datosCliente);
    keysData.forEach(key => {
      let data = datosCliente[key];
      options += `<option data-empresa="${data[2]}" value="${data[1]}">${data[0]}</option>`;
    })

    return options;
  }
  
  function obtenerOptionsProcedimiento() {
    let options = `<option value="">Todos</option>`;
    let datosProcedimientos = <?=$dataJsonProcedimientos?>;
    let keysData = Object.keys(datosProcedimientos);
    keysData.forEach(key => {
      let data = datosProcedimientos[key];
      options += `<option value="${data.procedimientoId}">${data.procedimientoNombre}</option>`;
    })

    return options;
  }


  function filtrarTabla(tipo) {
    if (tipo === "Factura_Venta_Entidad") {
        let filtroEmpresaId = $("#documento_entidadId").val();
        let filtroEmpresafechaInicio = $("#filtroEmpresafechaInicio").val();
        let filtroEmpresafechaFin = $("#filtroEmpresafechaFin").val();
        let filtroEmpresapaciente = $("#filtroEmpresapaciente").val();
        let filtroEmpresaprocedimiento = $("#filtroEmpresaprocedimiento").val();

        $('#tbody-modal-facturacion tr').each(function() {
            const fila = $(this);
            const data_empresaid = fila.attr("data-empresaid");
            const data_clienteid = fila.attr("data-clienteid");
            const data_fecha = fila.attr("data-fecha");
            const data_procedimientoid = fila.attr("data-procedimientoid");

            console.log("Abributos Data :", data_empresaid, data_clienteid, data_procedimientoid, data_fecha);
            


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

            // Filtrar por paciente
            if (filtroEmpresapaciente !== "" && filtroEmpresapaciente !== "0") {
                if (data_clienteid !== filtroEmpresapaciente) {
                    mostrarFila = false;
                }
            }

            // Filtrar por procedimiento
            if (filtroEmpresaprocedimiento !== "" && filtroEmpresaprocedimiento !== "0") {
                if (data_procedimientoid !== filtroEmpresaprocedimiento) {
                    mostrarFila = false;
                }
            }
            
            if (filtroEmpresaId !== "" && filtroEmpresaId !== "0") {
                if (data_empresaid !== filtroEmpresaId) {
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
}




  function mostrarFiltros(tipo) {
    let contenido = "";
    if (tipo == "Factura_Venta_Entidad") {
      contenido = `<div class="col-md-4 row">
                    <div class="col-md-6">
                      <label>Fecha de Inicio</label>
                      <input type="date" onchange="filtrarTabla('${tipo}')" class="form-control" id="filtroEmpresafechaInicio">
                    </div>
                    <div class="col-md-6">
                      <label>Fecha Fin</label>
                      <input type="date" onchange="filtrarTabla('${tipo}')" class="form-control" id="filtroEmpresafechaFin">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label>Paciente</label>
                    <select class="form-control" onchange="filtrarTabla('${tipo}')" id="filtroEmpresapaciente">
                      ${obtenerOptionsCliente()}
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label>Procedimiento</label>
                    <select class="form-control" onchange="filtrarTabla('${tipo}')" id="filtroEmpresaprocedimiento">
                      ${obtenerOptionsProcedimiento()}
                    </select>
                  </div>
                  `;
    }

    $("#content-filtros").html(contenido);

  }

  function AbrirModalDocumento(id) {
    $("#modalNuevaFactura").modal("show");

    let dataModal = {
      "Factura_Venta_Cliente": " Factura de Venta - Cliente" , 
      "Factura_Venta_Entidad": " Factura de Venta - Entidad" , 
      "Factura_Compra": " Factura de Compra",
      "Documento_Soporte": " Documento de Soporte" 
    }
    
    // Limpiar los valores de los campos
    $("#clienteId").val("").change();
    $("#entidadId").val("").change();

    // Mostrar ambos modales inicialmente
    $("#content-modal-cliente").css("display", "none");
    $("#content-modal-entidad").css("display", "none");
    $("#tbody-modal-facturacion").html("");


    mostrarFiltros(id);
    // Controlar la visibilidad según el valor de dataModal[id]
    if (id == "Factura_Venta_Cliente") {
        $("#content-modal-cliente").css("display", "block");
        $("#content-modal-entidad").css("display", "none");

    } else if (id == "Factura_Venta_Entidad") {
        $("#content-modal-cliente").css("display", "none");
        $("#content-modal-entidad").css("display", "block");
        tabularDatosFacturaEntidad();
    }


    $(`#header-modal-factura`).html("<i class='fas fa-file-invoice'></i>" + dataModal[id] + " No. XXXXXXXXXX" );
    $("#documento_tipoComprobante").val(id).change();
    
  }


  $(document).ready(function() {
    AnadirFila();
    AnadirFilaMetodos()
    $('#modalNuevaFactura').on('hidden.bs.modal', function() {
        // resetModal()
    });
  });

  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ///////////////////////////
  // ? /////////////// ======== ///////////////////////////
</script>




<style>
  .underline-input {
    border: none;
    /* Sin borde */
    border-bottom: 2px solid #D4D4D4;
    /* Línea inferior */
    background-color: transparent;
    /* Fondo transparente */
    outline: none;
    /* Sin borde de enfoque */
    padding: 5px;
    /* Espaciado */
    width: 100%;
    /* Ancho completo */
  }

  .underline-input:focus {
    border-bottom: 2px solid #007bff;
    /* Cambia el color de la línea inferior al hacer foco */
    /* Puedes cambiar el color a lo que prefieras */
  }

  #tabla-modal{
    background-color: #F6F9FC !important;
    padding: 10px !important;
    border-radius: 15px !important;
  }
  
  #tabla-modal td{
    padding: 20px !important;
    margin: 20px !important;
    background-color: white !important;
  }
  
  #tabla-modal th{
    color: #BDC6CF !important;
    padding: 20px !important;
    margin: 20px !important;
    /* background-color: white !important; */
  }
</style>