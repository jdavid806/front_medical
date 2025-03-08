<!-- /// PARA CARGAR EL ARCHIVO DE EXCEL -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
<!-- /// PARA CARGAR EL ARCHIVO DE EXCEL -->


<div class="modal fade" id="modalCargueMasivo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content bg-body-highlight p-6">
      <div class="modal-header justify-content-between border-0 p-0 mb-2">
        <h3 class="mb-0" id="header-modal-factura"> <i class="fas fa-file-csv"></i> Cargue masivo autorizaciones</h3>
        <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
          <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body px-0">
        <h4 class="mb-0 border-0 p-0 mb-2">Cargar archivo</h4>
        <p>Para cargar de manera masiva las autorizaciones, por favor realice los siguientes pasos.</p>
        <ol>
          <li>Descargue el <a href="./HistoriasRips/modeloExcelCargueMasivoHistorias.xlsx" target="_blank" class="text-decoration-underline" download="modeloExcelCargueMasivoHistorias.xlsx">modelo de excel de masivo de autorizacionee.</a> </li>
          <li>Modifique el archivo segun sus necesidades <a class="text-decoration-underline">(No modificar el encabezado)</a> </li>
          <li>Anexe nuevamente el archivo en la seccion de archivo/documento.</li>
          <li>Presione el boton de cargar archivo</li>
        </ol>

        <form action="ActionCargarExcel.php" class="col-md-12 row" method="post">
          <div class="col-md-9">
            <label class="text-body-highlight fw-bold mb-2">Archivo / Documento</label>
            <input class="form-control" type="file" id="fileInput" accept=".xlsx" required>
          </div>

          <div class="col-md-3">
            <label class="text-body-highlight fw-bold mb-2"> &nbsp;</label>
            <button class="btn btn-success" style="width:100%" id="processButton" type="button"><i class="fas fa-upload"></i> Cargar archivo</button>
          </div>
        </form>

        <div id="output"></div>


      </div>


      <div class="modal-footer border-0 pt-6 px-0 pb-0">
        <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
        <!-- <button class="btn btn-primary my-0" onclick="guardarFacturaEmpresa()"> <i class="fas fa-bookmark"></i> &nbsp; Crear factura</button> -->
      </div>
    </div>
  </div>
</div>


<script>
  document.getElementById('processButton').onclick = function() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: 'warning',
      title: 'Atencion',
      text: 'No ha cargado ningun archivo aun'
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {
      type: 'array'
    });

    // Procesar la primera hoja
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convertir la hoja a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    // Array con las columnas esperadas
    const columnsOb = ["Nombre", "Fecha_de_Atencion", "Procedimiento", "CUPS", "No_Historia"];
    
    if (!jsonData[0]) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El archivo no contiene informacion'
        });
        return false;
     }    

    // Obtener las claves (headers) del primer objeto en jsonData
    const headers = Object.keys(jsonData[0]); // Asegúrate de obtener las claves



    console.log(headers); // Mostrar los headers

    // Verificar que todas las columnas esperadas estén presentes en los headers
    for (const key of columnsOb) {
      if (!headers.includes(key)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El archivo no tiene la columna: ' + key
        });
        return false;
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Correcto',
      text: 'Archivo cargado y leído correctamente '
    });

    console.log("Data Json");
    console.log(jsonData);
    cargarJsonTabla(jsonData);
    $("#modalCargueMasivo").modal("hide");

  };

  reader.readAsArrayBuffer(file);
};

function cargarJsonTabla(data) {
  let tbody = $("#tbody-lista-autorizaciones");
  // tbody.html("");
  let keysData = Object.keys(data);
  for (const key in keysData) {
    indiceTabla +=1;
    let dataFila = data[keysData[key]];
    console.log("Key " + key);
    console.log("Data");
    console.log(dataFila);
    
    let fila = `<tr id="filaAuth${indiceTabla}">
                  <td> <input readonly class="form-control" name="ArrayProcedimientos[${indiceTabla}][Fecha]" value="<?=date("Y-m-d")?>"> </td>
                  <td><input readonly class="form-control" name="ArrayProcedimientos[${indiceTabla}][Fecha_de_Atencion]" value="${dataFila["Fecha_de_Atencion"]}"> </td>
                  <td><input readonly class="form-control" name="ArrayProcedimientos[${indiceTabla}][Nombre]" value="${dataFila["Nombre"]}"> </td>
                  <td><input readonly class="form-control" name="ArrayProcedimientos[${indiceTabla}][Procedimiento]" value="${dataFila["Procedimiento"]}"> </td>
                  <td><input readonly class="form-control" name="ArrayProcedimientos[${indiceTabla}][CUPS]" value="${dataFila["CUPS"]}"> </td>
                  <td><input readonly class="form-control" name="ArrayProcedimientos[${indiceTabla}][No_Historia]" value="${dataFila["No_Historia"]}"> </td>
                  <td><input          class="form-control" name="ArrayProcedimientos[${indiceTabla}][autorizacion]" type="text"></td>
                </tr>`;
    tbody.append(fila);


  }

}

</script>