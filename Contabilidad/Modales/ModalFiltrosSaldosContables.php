<div class="modal fade" id="modalFiltroSaldosContables" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-fsc"><i class="fas fa-filter"></i> Filtrar saldos contables</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Cuenta Contable</label>
                            <select class="form-select selectModalFilterSC" style="width:100%" id="cContable">
                                <option value="0" selected>Todas</option>
                                <?php foreach ($optionsModalFiltrosSC as $key => $value) {
                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                } ?>
                            </select>
                        </div>
                        <br>
                        <hr>
                        
                        <div class="col-md-12 mb-1">
                            <label class="form-label">Incluye cuenta contable de diferencia fiscal</label><br>
                            <input type="radio" name="incluyeDiffFiscal" class="form-check-input incluyeDiffFiscal" checked value="Si">Si<br>
                            <input type="radio" name="incluyeDiffFiscal" class="form-check-input incluyeDiffFiscal" value="No">No<br>
                        </div>
                        <hr>

                        <h5 class="mb-1" id="header-modal-fsc"> Año fiscal</h5>

                        <div class="col-md-12 mb-1">
                            <select class="form-select selectModalFilterSC" style="width:100%" id="anoFiscal">
                                <?php 
                                    $years = obtenerRangoDesde(1990);
                                    foreach ($years as $year) {
                                    echo '<option value="' . $year . '">' . $year . '</option>';
                                } ?>
                            </select>
                        </div>

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Seleccione maximo dos meses</label>
                            <select class="form-select selectModalFilterSC" onchange="validarMesesFSC()" multiple style="width:100%" id="mesFiscal">
                                <?php 
                                    $months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                                    foreach ($months as $key => $month) {
                                    $indice = intval($key) + 1;
                                    $indice = $indice < 10 ? "0" . $indice : $indice;
                                    echo '<option value="' . $indice . '">' . $month . '</option>';
                                } ?>
                            </select>
                        </div>

                        <br>
                        <hr>
                        
                        <div class="col-md-12 mb-1">
                            <label class="form-label">Incluye cierre</label><br>
                            <input type="checkbox" name="incluyeCierre" class="form-check-input" value="1">Si<br>
                        </div>

                        <!-- <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" /> -->
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-filtersSc" onclick="filtersSc()"><i class="fas fa-filter"></i> &nbsp; Filtrar </button>
            </div>
        </div>
    </div>
</div>

<script>
    function validarMesesFSC() {
        let meses = $("#mesFiscal").val();

        if (meses.length > 2) {
            meses = meses.pop();
            $("#mesFiscal").val(meses).change();
        }
    }


    function filtersSc() {
        $("#button-save-filtersSc").html(`<div class="spinner-border text-light" role="status"></div>`);

        let keys = ["cContable", "anoFiscal" ,"incluyeCierre"];
        // var modalID = '#modalFiltroSaldosContables';
        // $(modalID).find('input, textarea, select').each(function() {
        //     var id = $(this).attr('id');
        //     if (id) {
        //         keys.push(id);
        //     }
        // });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalFiltroSaldosContables #" + keys[key]);
            if (elemento.attr('type') == 'checkbox') {
                data[keys[key]] = elemento.is(":checked") ? "Si" : "No";  
                continue;  
            }
            
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                })
                return false;
            }

            data[keys[key]] = elemento.val();
        }

        let incluyeDiffFiscal = document.querySelectorAll(".incluyeDiffFiscal");
        incluyeDiffFiscal.forEach(element => {
            if (element.checked) {
                data["incluyeDiffFiscal"] = element.value;
            }    
        });

        // console.log($("#mesFiscal").val());

        data["mesFiscal"] = JSON.stringify($("#mesFiscal").val());
        data["action"] = "consultar";

        // console.log("data");
        // console.log(data);
        // return false;

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Contabilidad/Ajax/AjaxSaldosContables.php",
            data,
            success: function(response) {
                let dataJson = JSON.parse(response);
                let keysF = Object.keys(dataJson);
                let contenidoHtml = "";
                keysF.forEach(indice => {
                    let datos = dataJson[indice];

                    contenidoHtml += `<div class="col-md-12">
                                    <table class="table table-sm fs-9 mb-0  tableDataTableSearch2">
                                        <thead>
                                            <tr>
                                                <th>Nivel</th>
                                                <th>Transaccional</th>
                                                <th>Codigo</th>
                                                <th>Cuenta</th>
                                                <th>Saldo Inicial</th>
                                                <th>Movimiento Debito</th>
                                                <th>Movimiento Credito</th>
                                                <th>Saldo Final</th>
                                            </tr>
                                        </thead>
                                        <tbody class="list">`;
                    datos.forEach(datosCuenta => {
                        contenidoHtml += `
                                        <tr>
                                            <td>${datosCuenta.clase}</td>
                                            <td>Si</td>
                                            <td>${datosCuenta.codigo}</td>
                                            <td>${datosCuenta.nombre}</td>
                                            <td>${datosCuenta.saldoIncial}</td>
                                            <td>${datosCuenta.totalDebito}</td>
                                            <td>${datosCuenta.totalCredito}</td>
                                            <td class="${datosCuenta.claseBootstrap}">${datosCuenta.saldoFinal}</td>
                                        </tr>
                        `;    
                    });
                                                    
                contenidoHtml += `</tbody></table></div><hr style="margin-top:20px; margin-bottom:20px;">`;
                });

                $("#contenido-saldos-contables").html(contenidoHtml);
                $.fn.dataTable.ext.errMode = 'none';
                $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) {
                    // Puedes hacer un manejo personalizado del error aquí.
                    console.log('DataTable Error: ', message);
                };


                $('.tableDataTableSearch2').DataTable({
                    paging: true, // Habilita la paginación
                    pageLength: 5, // Número de filas por página
                    searching: true, // Habilita la búsqueda
                    order: [
                        [0, 'asc']
                    ], // Ordena por la primera columna por defecto
                    language: {
                        "sEmptyTable": "No hay datos disponibles en la tabla",
                        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                        "sInfoEmpty": "Mostrando 0 a 0 de 0 entradas",
                        "sInfoFiltered": "(filtrado de _MAX_ entradas totales)",
                        "sInfoPostFix": "",
                        "sInfoThousands": ",",
                        "sLengthMenu": "Mostrar _MENU_ entradas",
                        "sLoadingRecords": "Cargando...",
                        "sProcessing": "Procesando...",
                        "sSearch": "Buscar:",
                        "sZeroRecords": "No se encontraron resultados",
                        "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                        },
                        "oAria": {
                        "sSortAscending": ": activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": activar para ordenar la columna de manera descendente"
                        }
                    },
                    "drawCallback": function(settings) {
                        // Personaliza los botones de paginación después de que DataTables se haya inicializado
                        $('.dataTables_paginate .paginate_button').addClass('btn btn-primary');
                        $('.dataTables_paginate .paginate_button.disabled').addClass('btn btn-primary');
                    }
                });



                $("#button-save-filtersSc").html(`<i class="fas fa-filter"></i> &nbsp; Filtrar `);
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                $("#button-save-filtersSc").html(`<i class="fas fa-info"></i> &nbsp; Ocurrio un error `);

            }
        });

    }


    $(document).ready(function() {
        selectToModal("modalFiltroSaldosContables", "selectModalFilterSC");
    });
</script>

<style>
    .displayNone {
        display: none;
    }
</style>