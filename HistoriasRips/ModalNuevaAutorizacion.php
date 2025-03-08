<?php

$isRequiredSign = "<font class='text-primary'>*</font>";

$sedes = [];
foreach ($DatosSedes as $sede) {
    $sedes[$sede["id"]] = $sede["nombreSede"];
}

 $DatosRegimenJson = datosRegimen();
 $DatosRegimen = json_decode($DatosRegimenJson, true);

$regimens = [];
foreach ($DatosRegimen as $regimen) {
   
    $regimens[$regimen["code"]] = $regimen["name"];

}
//var_dump($regimens);

$metodosPago = [];
foreach ($DatosMetodosPago as $metodo) {
    $metodosPago[$metodo["id"]] = $metodo["nombre"];
}



$tipousuarios = [];
foreach ($DatosTiposUsuarios as $tipousuario) {
    $tipousuarios[$tipousuario["id"]] = $tipousuario["nombre"];
}

$tipopagos = [];
foreach ($DatosTiposPagos as $tipopago) {
    $tipopagos[$tipopago["id"]] = $tipopago["nombre"];
}

$tipocoberturas = [];
foreach ($DatosTiposCoberturas as $tipocobertura) {
    $tipocoberturas[$tipocobertura["id"]] = $tipocobertura["nombre"];
}

$tipoidentificaciones = [];
foreach ($DatosTiposIdentificaciones as $tipoidentificacion) {
    $tipoidentificaciones[$tipoidentificacion["id"]] = $tipoidentificacion["nombre"];
}

$tipopersonas = [];
foreach ($DatosTiposPersonas as $tipopersona) {
    $tipopersonas[$tipopersona["id"]] = $tipopersona["nombre"];
}

$tipoempresas = [];
foreach ($DatosTiposEmpresas as $tipoempresa) {
    $tipoempresas[$tipoempresa["id"]] = $tipoempresa["nombre"];
}

?>



<div class="modal fade" id="modalNuevaAutorizacionv2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-Authv2"><i class="fas fa-file-signature"></i> Nueva Admision</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">


                        <div id="sub-content-modal-auth-1">
                            <h4 class="mb-0">Datos principales</h4>
                            <div class="col-md-12 row">

                            <?php

$campos = [
    "Registro N°" => ["input", "numRegistro", "number", "required readonly", 1, "", "3"],
    "Fecha" => ["input", "fecha", "date", "required", date("Y-m-d"), "", "3"],
    
];

foreach ($campos as $label => $datos) { ?>
    <div class="col-md-<?= $datos[6] ?> mb-1">
        <label class="form-label"><?= $label ?> <?= (($datos[3] <> '') ? '<span class="text-primary">*</span>' : '') ?></label>
        <?php if ($datos[0] == "select") { ?>
            <select onchange="<?= $datos[5] ?>" class="form-select selectModalAuthv2" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                <option value="" selected>Seleccione...</option>
                <?php foreach ($datos[4] as $key => $value) {
                    echo '<option value="' . $key . '">' . $value . '</option>';
                } ?>
            </select>
        <?php } elseif ($datos[0] == "input") { ?>
            <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
        <?php } ?>
    </div>
<?php } ?>

                                <div class="col-md-6 mb-1">
                                    <label class="form-label"> Cliente <span class="text-primary">*</span></label>
                                    <select class="form-select selectModalAuthv2" onchange="addDocumentoCliente()" style="width:100%" id="clienteId" required>
                                        <option value="" selected>Seleccione...</option>
                                        <option value="crear">Crear cliente</option>
                                        <?php

                                        $datosClientes = obtenerDatosClientes();
                                        $datosClientes = json_decode($datosClientes, true); // convierte el JSON a un array


                                        foreach ($datosClientes as $key => $value) {
                                            echo '<option data-documento="' . $value["CODI_CLIENTE"] . '" value="' . $value["cliente_id"] . '">' . $value["CODI_CLIENTE"] . ' - ' . $value["nombre_cliente"] . '</option>';
                                        }


                                        ?>
                                    </select>
                                </div>
                                <!-- <div class="col-md-6 mb-1">
                                    <label class="form-label"> Citas <span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="CitasId">
                                        <option value="" selected>Seleccione...</option>
                                        <?php


                                    

                                        ?>
                                    </select>
                                </div> -->


                                <?php

                                $campos = [
                                    // "Registro N°" => ["input", "numRegistro", "number", "required readonly", 1, "", "3"],
                                    // "Fecha" => ["input", "fecha", "date", "required", date("Y-m-d"), "", "3"],
                                    "Identificacion" => ["input", "identificacion", "number", "required", "", "", "3"],
                                    "Autorización N°" => ["input", "numAutorizacion", "text", "required", "", "", "3"],
                                    "Regimen del paciente" => ["select", "regimenPaciene", "", "required", $regimens, "", "3"],
                                    // "Fecha de Consulta" => ["input", "fechaConsulta", "date", "required", date("Y-m-d"), "", "6"],
                                    "Sede" => ["select", "sede", "", "required", $sedes, "", "3"],
                                ];

                                foreach ($campos as $label => $datos) { ?>
                                    <div class="col-md-<?= $datos[6] ?> mb-1">
                                        <label class="form-label"><?= $label ?> <?= (($datos[3] <> '') ? '<span class="text-primary">*</span>' : '') ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select onchange="<?= $datos[5] ?>" class="form-select selectModalAuthv2" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                                <option value="" selected>Seleccione...</option>
                                                <?php foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                } ?>
                                            </select>
                                        <?php } elseif ($datos[0] == "input") { ?>
                                            <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>

                                <div class="col-md-4 mb-1">
                                    <label class="form-label"> Profesional que realizo <span class="text-primary">*</span></label>
                                    <select onchange="" class="form-select selectModalAuthv2" style="width:100%" id="profesionalRealizo" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php

                                       echo $datosUsuarios = obtenerDatosUsuarios();
                                    
                                      echo  $datosUsuarios = json_decode($datosUsuarios, true); // convierte el JSON a un array

                                        foreach ($datosUsuarios as $key => $value) {
                                            echo '<option data-documento="' . $value["nit"] . '" value="' . $value["ID"] . '">' . $value["nit"] . ' - ' . $value["NOMBRE_USUARIO"] . '</option>';
                                        }


                                        ?>

                                    </select>
                                </div>

                                <div class="col-md-4 mb-1">
                                    <label class="form-label"> Entidad a facturar <span class="text-primary">*</span></label>
                                    <select onchange="procededimientosIndiceUno();addNit();" class="form-select selectModalAuthv2" style="width:100%" id="entidadFacturar" required>
                                        <option value="" data-jsonprocedimientos="[]" selected>Seleccione...</option>
                                        <?php

                                        // obtenerPorEntidad($entidadId);

                                        foreach ($DatosEntidades as $entidad) {
                                            $procedimientosEntidad = $ControllerProcedimientosEntidades->obtenerPorEntidad($entidad["id"]);
                                            $procedimientos = [];
                                            foreach ($procedimientosEntidad as $procedimiento) {
                                                $datosCups = $ControllerProcedimientos->obtenerPorId($procedimiento["idProcedimiento"]);
                                                $procedimiento["nombre"] = $datosCups["nombreProcedimiento"];
                                                $procedimiento["codigoCups"] = $datosCups["codigo_cups"];
                                                array_push($procedimientos, $procedimiento);
                                            }
                                            $procedimientos = htmlspecialchars(json_encode($procedimientos), ENT_QUOTES);
                                            echo '<option data-nit="' . $entidad["nit"] . '" data-jsonprocedimientos="' . $procedimientos . '" value="' . $entidad["id"] . '">' . $entidad["nit"] . ' - ' .  $entidad["nombreEntidad"] . '</option>';
                                        }


                                        ?>
                                    </select>
                                </div>

                                <?php

                                $campos2 = [
                                    // "Entidad a facturar" => ["select", "entidadFacturar", "", "required", $entidades, "", "4"],
                                    // "Sgsss" => ["input", "sgsss", "", "", "", "", "2"],
                                    // "Cod" => ["input", "cod", "", "", "", "", "2"],
                                    // "Nit Tercero" => ["input", "nitTercero", "", "", "", "", "2"],
                                    "Forma de pago" => ["select", "formaPago", "", "required", $metodosPago, "", "4"],
                                ];

                                foreach ($campos2 as $label => $datos) { ?>
                                    <div class="col-md-<?= $datos[6] ?> mb-1">
                                        <label class="form-label"><?= $label ?> <?= (($datos[3] <> '') ? '<span class="text-primary">*</span>' : '') ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select onchange="<?= $datos[5] ?>" class="form-select selectModalAuthv2" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                                <option value="" selected>Seleccione...</option>
                                                <?php foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                } ?>
                                            </select>
                                        <?php } elseif ($datos[0] == "input") { ?>
                                            <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>
                                <!-- <div class="col-md-4 mb-1" >
                                    <label class="form-label"> Tipo de Usuario <span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="healthtypeuser" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php
                                        $datosTipoUsuarios = datosTiposUsuarios();
                                        $datosTipoUsuarios = json_decode($datosTipoUsuarios, true); // convierte el JSON a un array

                                        foreach ($datosTipoUsuarios as $key => $value) {
                                            echo '<option data-documento="' . $value["id"] . '" value="' . $value["code"] . '"> ' . $value["name"] . '</option>';
                                        }
                                      
                                        ?>
                                    </select>
                                </div> -->

                                <!-- <div class="col-md-4 mb-1" >
                                    <label class="form-label"> Tipo de Pago <span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="tipopagohealt" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php
                                       $datosTipoPagos = datosTiposPagos();
                                      $datosTipoPagos = json_decode($datosTipoPagos, true); // convierte el JSON a un array

                                      foreach ($datosTipoPagos as $key => $value) {
                                          echo '<option data-documento="' . $value["id"] . '" value="' . $value["code"] . '"> ' . $value["name"] . '</option>';
                                      }
                                      
                                        ?>
                                    </select>
                                    </div> -->
                                    <!-- <div class="col-md-4 mb-1" >
                                    <label class="form-label"> Tipo de Cobertura <span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="tipocobertura" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php
                                        
                                        $datosTiposCoberturas = datosTiposCoberturas();
                                        $datosTiposCoberturas = json_decode($datosTiposCoberturas, true); // convierte el JSON a un array
  
                                        foreach ($datosTiposCoberturas as $key => $value) {
                                            echo '<option data-documento="' . $value["id"] . '" value="' . $value["code"] . '"> ' . $value["name"] . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div> -->
                                    <div class="col-md-4 mb-1" >
                                    <label class="form-label"> Tipo de Identificacion<span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="tipodocumento" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php
                                       
                                       $datosTiposIdentificacion = datosTiposIdentificacion();
                                        $datosTiposIdentificacion = json_decode($datosTiposIdentificacion, true); // convierte el JSON a un array
  
                                        foreach ($datosTiposIdentificacion as $key => $value) {
                                            echo '<option data-documento="' . $value["id"] . '" value="' . $value["code"] . '"> ' . $value["name"] . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>
                                    <div class="col-md-4 mb-1" >
                                    <label class="form-label"> Tipo de Persona<span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="tipopersona" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php
                                      $datosTiposPersonas = datosTiposPersonas();
                                      $datosTiposPersonas = json_decode($datosTiposPersonas, true); // convierte el JSON a un array

                                      foreach ($datosTiposPersonas as $key => $value) {
                                          echo '<option data-documento="' . $value["id"] . '" value="' . $value["code"] . '"> ' . $value["name"] . '</option>';
                                      }
                                        ?>
                                    </select>
                                </div>
                                    <div class="col-md-4 mb-1" >
                                    <label class="form-label"> Tipo de Empresa<span class="text-primary"></span></label>
                                    <select class="form-select selectModalAuthv2" style="width:100%" id="tipoempresa" required>
                                        <option value="" selected>Seleccione...</option>
                                        <?php
                                      $datosTiposEmpresas = datosTiposEmpresas();
                                      $datosTiposEmpresas = json_decode($datosTiposEmpresas, true); // convierte el JSON a un array

                                      foreach ($datosTiposEmpresas as $key => $value) {
                                          echo '<option data-documento="' . $value["id"] . '" value="' . $value["code"] . '"> ' . $value["name"] . '</option>';
                                      }
                                        ?>
                                    </select>
                                </div>
                                <!-- <div class="col-md-4 mb-1">
                                    <label class="form-label"> Mipres <span class="text-primary">*</span></label>
                                    <input type="text" class="form-control" id="mipres">
                                  
                                </div> -->
                                <!-- <div class="col-md-4 mb-1">
                                    <label class="form-label"> Mipres Direccion <span class="text-primary">*</span></label>
                                    <input type="text" class="form-control" id="mipresdireccion">
                                  
                                </div> -->
                                <!-- <div class="col-md-4 mb-1">
                                    <label class="form-label"> Numero de Poliza <span class="text-primary">*</span></label>
                                    <input type="text" class="form-control" id="numeropoliza">
                                  
                                </div> -->
                                  


                            </div>
                        </div>

                        <div class="col-md-12" id="sub-content-modal-auth-2">
                            <h4 class="mb-0">Detalle</h4>
                            <table class="table table-striped table-sm fs-9 mt-2 p-2 bg-light table-modal" id="tabla-modal">
                                <thead>
                                    <tr>
                                        <th style="padding:10px; width:25%">CUPS</th>
                                        <th style="padding:10px; width:10%">Cantidad</th>
                                        <th style="padding:10px; width:10%">V. Servicio</th>
                                        <th style="padding:10px; width:10%">C. Moderadora</th>
                                        <th style="padding:10px; width:10%">Copago %</th>
                                        <th style="padding:10px; width:10%">Total</th>
                                        <th style="padding:10px; width:10%"></th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-modal-detalle-admision"></tbody>
                            </table>
                        </div>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <div class="col-md-12 row">
                    <div class="col-md-6 text-start">
                        <div id="paginacionModal"></div>
                    </div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                        <button class="btn btn-primary my-0" id="button-save-Authv2" onclick="guardarAuthv2()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Autorizacion</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<script>
    function procededimientosIndiceUno() {
        let numFilas = $("#tbody-modal-detalle-admision tr").length;
        if (numFilas > 1) return;
        let options = optionsCupsPorEntidad();
        let idCups = $(`select[name='Detalle[0][idCups]']`);
        idCups.html(options);
    }

    function addDocumentoCliente() {
        let identificacionCliente = $('#modalNuevaAutorizacionv2 #identificacion');
        let idCliente = $('#modalNuevaAutorizacionv2 #clienteId');

        // console.log("identificacionCliente => ", identificacionCliente);
        // console.log("idCliente => ", idCliente);

        identificacionCliente.val(idCliente.find(":selected").data("documento"));

    }


    function addNit() {
        let entidadFacturar = $("#modalNuevaAutorizacionv2 #entidadFacturar");
        let nit = $("#modalNuevaAutorizacionv2 #nitTercero");
        nit.val(entidadFacturar.find(":selected").data("nit"));
    }


    function guardarAuthv2() {
        let keys = [];
        var modalID = '#modalNuevaAutorizacionv2';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevaAutorizacionv2 #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos marcados con (*)',
                })
                return false;
            }

            data[keys[key]] = elemento.val();
        }

        let detalle = [];
        let detailIsValid = true;
        $("#modalNuevaAutorizacionv2 #tbody-modal-detalle-admision tr").each(function() {
            if (!detailIsValid) return;
            let idFila = $(this).attr("id");
            let indice = idFila.replace("fila", "");

            let id = $(`input[name='Detalle[${indice}][id]']`);
            let idCups = $(`select[name='Detalle[${indice}][idCups]']`);
            let cantidad = $(`input[name='Detalle[${indice}][cantidad]']`);
            let valor = $(`input[name='Detalle[${indice}][valor]']`);
            let cuotaModeradora = $(`input[name='Detalle[${indice}][cuotaModeradora]']`);
            let copago = $(`input[name='Detalle[${indice}][copago]']`);
            let total = $(`input[name='Detalle[${indice}][total]']`);

            if (idCups.val() != "") {
                const objetoDetalle = {
                    id: id.val(),
                    idCups: idCups.val(),
                    nombreCups: idCups.find(":selected").data("nombre"),
                    cantidad: cantidad.val(),
                    valor: valor.val(),
                    cuotaModeradora: cuotaModeradora.val(),
                    copago: copago.val(),
                    total: total.val()
                };

                const hasEmptyValue = Object.values(objetoDetalle).some(value => !value);
                if (hasEmptyValue) {
                    // console.log("Se encuentra vacio");
                    // console.log(objetoDetalle);
                    detailIsValid = false;
                    return;
                }

                detalle.push(objetoDetalle);
            }

        });




        if (!detailIsValid) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algun campo de la tabla detalle se encuentra vacío, si no quieres que una fila sea tenida en cuenta elimina la fila o vacía el campo de codigo cups',
            })
            return false;

        }


        data["detalle"] = detalle;
        data["action"] = data.id == 0 ? "crear" : "actualizar";


        console.log(data);
        //throw new Error("Funcion ajax de AjaxAutorizacion.php aun no esta implementada por: Deivyd R");

        // return false;

        $.ajax({
            type: "POST",
            //url: "HistoriasRips/Ajax/AjaxAutorizacion.php",
            url: 'HistoriasRips/AjaxAutorizacion.php',
            data: JSON.stringify(data), // Envía la data en formato JSON
            success: function(response) {
                //console.log('Respuesta del servidor:', response);
                Swal.fire({
                    icon: 'success',
                    title: 'Correcto',
                    text: 'Factura generada correctamente'
                });
                //resetmodalNuevaAutorizacionv2();
                $("#modalNuevaAutorizacionv2").modal('hide');

                location.reload(); // Recargar la página después de actualizar la cita




            },
            error: function(xhr, status, error) {
                console.error('Error en la petición:', error);
            }
        });


        return data;
    }

    let indiceFilaDD = 0;

    function AnadirFilaDD(modalId) {
        let btnDelete = indiceFilaDD != 0 ? `<i class="fas fa-trash mt-2" onclick="EliminarFilaDD(${indiceFilaDD})"></i>` : ``;
        let nuevaFila = `<tr id="fila${indiceFilaDD}">">
                            <input  type="hidden" class='form-control underline-input' name='Detalle[${indiceFilaDD}][id]' value='0'>
                            <td style="padding:5px 10px !important"><select style="width:100%" onchange="obtenerPrecio(${indiceFilaDD});calcularFila(${indiceFilaDD});filaAutomaticaDD(${indiceFilaDD})" class='form-control underline-input selectModalAuthv2' name='Detalle[${indiceFilaDD}][idCups]'>${optionsCupsPorEntidad()}</select></td>

                            <td style="padding:5px 10px !important"><input onchange="calcularFila(${indiceFilaDD});filaAutomaticaDD(${indiceFilaDD})" type="number" class='form-control underline-input' value='1' name='Detalle[${indiceFilaDD}][cantidad]'></td>
                            
                            <td style="padding:5px 10px !important"><input onchange="calcularFila(${indiceFilaDD});filaAutomaticaDD(${indiceFilaDD})" type="number" class='form-control underline-input' value='0' name='Detalle[${indiceFilaDD}][valor]'></td>

                            <td style="padding:5px 10px !important"><input onchange="calcularFila(${indiceFilaDD});filaAutomaticaDD(${indiceFilaDD})" type="number" class='form-control underline-input' value='0' name='Detalle[${indiceFilaDD}][cuotaModeradora]'></td>

                            <td style="padding:5px 10px !important"><input onchange="calcularFila(${indiceFilaDD});filaAutomaticaDD(${indiceFilaDD})" type="number" class='form-control underline-input' value='0' name='Detalle[${indiceFilaDD}][copago]'></td>

                            <td style="padding:5px 10px !important"><input onchange="calcularFila(${indiceFilaDD});filaAutomaticaDD(${indiceFilaDD})" type="number" class='form-control underline-input' value='0' name='Detalle[${indiceFilaDD}][total]'></td>

                            <td style="padding:5px 10px !important">${btnDelete} </td>
                        </tr>`;
        $(`#${modalId} #tbody-modal-detalle-admision`).append(nuevaFila);
        selectToModal("modalNuevaAutorizacionv2", "selectModalAuthv2");
        indiceFilaDD += 1;


    }

    function obtenerPrecio(indice) {
        // Selecciona los elementos según el índice proporcionado
        let idCups = $(`select[name='Detalle[${indice}][idCups]']`);
        let valor = $(`input[name='Detalle[${indice}][valor]']`);
        let copago = $(`input[name='Detalle[${indice}][copago]']`);


        // Verifica que los elementos existan antes de continuar
        if (idCups.length && valor.length) {
            let value = idCups.find(":selected").data("precio");
            let valorCopago = idCups.find(":selected").data("copago");
            valor.val(value);
            copago.val(valorCopago);
            calcularFila(indice)
        } else {
            console.warn("Elementos no encontrados para el índice proporcionado:", indice);
        }
    }



    function filaAutomaticaDD(indice) {
        let siguienteFila = document.getElementById(`fila${indice + 1}`);
        if (!siguienteFila) {
            AnadirFilaDD("modalNuevaAutorizacionv2");
        }
    }

    function EliminarFilaDD(indice) {
        $(`#fila${indice}`).remove();
    }

    function calcularFila(indice) {
        let id = $(`input[name='Detalle[${indice}][id]']`);
        let idCups = $(`select[name='Detalle[${indice}][idCups]']`);
        let cantidad = $(`input[name='Detalle[${indice}][cantidad]']`);
        let valor = $(`input[name='Detalle[${indice}][valor]']`);
        let cuotaModeradora = $(`input[name='Detalle[${indice}][cuotaModeradora]']`);
        let copago = $(`input[name='Detalle[${indice}][copago]']`);
        let total = $(`input[name='Detalle[${indice}][total]']`);

        let copagoTotal = (Number(copago.val()) * Number(valor.val()) * Number(cantidad.val())) / 100;
        let valorTotal = (Number(cantidad.val()) * Number(valor.val())) + Number(cuotaModeradora.val()) + copagoTotal;

        console.log("copagoTotal => ", copagoTotal);
        console.log("valorTotal => ", valorTotal);

        total.val(valorTotal);
    }


    function resetmodalNuevaAutorizacionv2() {
        $("#modalNuevaAutorizacionv2 #tbody-modal-detalle-admision").html(``);
        indiceFilaCC = 0;
        AnadirFilaCC("modalNuevaAutorizacionv2");

        $("#header-modal-Authv2").html(`<i class="fas fa-briefcase"></i> Nueva Autorizacion`);
        $("#button-save-Authv2").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Autorizacion`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevaAutorizacionv2';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevaAutorizacionv2 #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarAuthv2(id) {
        $("#header-modal-Authv2").html(`<i class="fas fa-wrench"></i> Editar Admision`);
        $("#button-save-Authv2").html(`<i class="fas fa-wrench"></i> Actualizar Admision`);
        $("#modalNuevaAutorizacionv2 #id").val(id);

        const data = document.getElementById("data_Authv2" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevaAutorizacionv2 #" + key);
            if (elemento.is(':checkbox')) {
                elemento.prop('checked', dataPrincipal[key] == 'true' ? true : false);
                continue;
            }

            if (key == 'contenido') {
                insertarContenido(dataPrincipal[key]);
                continue;
            }

            elemento.val(dataPrincipal[key]).change();
        }
        $("#modalNuevaAutorizacionv2").modal('show');
    }

    function borrarAuthv2(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Autorizacion?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $BASE ?>HistoriasRips/Ajax/AjaxAutorizacion.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {
                            icon,
                            title,
                            text
                        } = dataResponse;
                        Swal.fire({
                            icon,
                            title,
                            text,
                        });
                        if (icon == "success") {
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        }
                        if (dataResponse.error) {
                            console.log(dataResponse.error);
                            return;
                        }
                    }
                });
                $("#filaAuthv2" + id).remove();
            }
        });
    }

    $('#modalNuevaAutorizacionv2').on('hidden.bs.modal', function() {
        resetmodalNuevaAutorizacionv2();
    });

    $('#modalNuevaAutorizacionv2').on('shown.bs.modal', function() {});

    $(document).ready(function() {
        selectToModal("modalNuevaAutorizacionv2", "selectModalAuthv2");
        paginacionModal("modalNuevaAutorizacionv2", "sub-content-modal-auth-", 2);
        AnadirFilaDD("modalNuevaAutorizacionv2");
    });
</script>

<script>
    $(document).ready(function() {
        $('#clienteId').change(function() {
            var cliente_id = $(this).val();
            if (cliente_id == "crear") {
                $('#modalNuevaAutorizacionv2').modal('hide');
                $('#crearPaciente').modal('show');
            }
            $.ajax({
                type: "POST",
                url: "HistoriasRips/Ajax_GetHistorias.php",
                data: {
                    cliente_id: cliente_id
                },
                success: function(response) {
                    var historias = JSON.parse(response);
                    $('#CitasId').empty();
                    $('#CitasId').append('<option value="" selected>Seleccione...</option>');
                    $.each(historias, function(index, historia) {
                        $('#CitasId').append('<option value="' + historia.id + '">' + historia.Fecha_Cita + ' - ' + historia.Nombre_Historia + '</option>');
                    });
                }
            });
        });
    });
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

    .table-modal {
        background-color: #F6F9FC !important;
        padding: 10px !important;
        border-radius: 15px !important;
    }

    .table-modal td {
        padding: 20px !important;
        margin: 20px !important;
        background-color: white !important;
    }

    .table-modal th {
        color: #767C82 !important;
        padding: 20px !important;
        margin: 20px !important;
        /* background-color: white !important; */
    }

    .table-modal-mediopago {
        background-color: #FFFFFF !important;
        padding: 10px !important;
        border-radius: 15px !important;
    }

    .table-modal-mediopago td {
        padding: 20px !important;
        margin: 20px !important;
        background-color: white !important;
    }

    .table-modal-mediopago th {
        color: #767C82 !important;
        padding: 20px !important;
        margin: 20px !important;
        /* background-color: white !important; */
    }
</style>

<?php
$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="crearPaciente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo cliente</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <div class="col-md-6 mb-1">
                            <label class="form-label">Tipo Identificación<span class="text-primary">*</span></label>
                            <select class="form-select select-Busca" style="width:100%" id="tDocumento" onchange="toggleIdentificationFields()" required>
                                <option value="" selected>Seleccione...</option>
                                <?php
                                $tipoPersona = [
                                    ["code" => 11, "name" => "Registro civil"],
                                    ["code" => 12, "name" => "Tarjeta de identidad"],
                                    ["code" => 13, "name" => "Cédula de ciudadanía"],
                                    ["code" => 21, "name" => "Tarjeta de extranjería"],
                                    ["code" => 22, "name" => "Cédula de extranjería"],
                                    ["code" => 31, "name" => "NIT"],
                                    ["code" => 41, "name" => "Pasaporte"],
                                    ["code" => 42, "name" => "Documento de identificación extranjero"],
                                    ["code" => 50, "name" => "NIT de otro país"],
                                    ["code" => 91, "name" => "NUIP *"],
                                    ["code" => 47, "name" => "PEP (Permiso Especial de Permanencia)"],
                                    ["code" => 48, "name" => "PPT (Permiso Protección Temporal)"],
                                ];

                                foreach ($tipoPersona as $key => $value) {
                                    echo '<option data-documento="' . $value["code"] . '" value="' . $value["code"] . '">' . $value["name"] . '</option>';
                                }
                                ?>
                            </select>
                        </div>

                        <div class="col-md-6 mb-1">
                            <div id="personaNatural">
                                <label class="form-label"># Identificación<span class="text-primary">*</span></label>
                                <input class="form-control" type="number"  id="numeroDocumento" placeholder="# Identificación">
                            </div>
                            <div class="d-none" id="personaJuridica">
                                <div class="d-flex gap-2">
                                    <div class="col-md-9">
                                        <label class="form-label"># Nit<span class="text-primary">*</span></label>
                                        <input class="form-control" type="number" id="numeroDocumentoE" placeholder="# Identificación">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">DV<span class="text-primary">*</span></label>
                                        <input class="form-control" type="number" id="dv" placeholder="DV">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <script>
                            function toggleIdentificationFields() {
                                const select = document.getElementById('tDocumento');

                                console.log(select.value);


                                const personaNatural = document.getElementById('personaNatural');
                                const personaJuridica = document.getElementById('personaJuridica');
                                const tEmpresa = document.getElementById('tEmpresa');
                                const tituloDr = document.getElementById('tituloDr');

                                if (select.value === "31") {
                                    personaNatural.classList.add('d-none');
                                    personaJuridica.classList.remove('d-none');
                                    tEmpresa.classList.remove('d-none');
                                    tituloDr.classList.remove('d-none');
                                } else {
                                    personaNatural.classList.remove('d-none');
                                    personaJuridica.classList.add('d-none');
                                    tEmpresa.classList.add('d-none');
                                    tituloDr.classList.add('d-none');
                                }
                            }
                        </script>



                        <div class="col-md-6 mb-1">
                            <label class="form-label"> Tipo Persona <span class="text-primary">*</span></label>
                            <select class="form-select select-Busca" style="width:100%" id="tipoPersona" required>
                                <option value="" selected>Seleccione...</option>
                                <?php

                                $tipoPersona = [
                                    ["code" => 1, "name" => "Persona Jurídica y asimiladas"],
                                    ["code" => 2, "name" => "Persona Natural y asimiladas"],
                                ];

                                foreach ($tipoPersona as $key => $value) {
                                    echo '<option data-documento="' . $value["code"] . '" value="' . $value["code"] . '">' . $value["name"] . '</option>';
                                }


                                ?>
                            </select>
                        </div>

                        <div class="col-md-6 mb-1 d-none" id="tEmpresa">
                            <label class="form-label"> Tipo de Empresa <span class="text-primary">*</span></label>
                            <select class="form-select select-Busca" onchange="" style="width:100%" id="tipoEmpresa">
                                <option value="" selected>Seleccione...</option>
                                <?php

                                $tiposContribuyente = [
                                    ["code" => "O-13", "name" => "Gran contribuyente"],
                                    ["code" => "O-15", "name" => "Autorretenedor"],
                                    ["code" => "O-23", "name" => "Agente de retención en el impuesto sobre las ventas"],
                                    ["code" => "O-47", "name" => "Régimen Simple de Tributación – SIMPLE"],
                                    ["code" => "R-99-PN", "name" => "No responsable"],
                                ];

                                foreach ($tiposContribuyente as $key => $value) {
                                    echo '<option data-documento="' . $value["code"] . '" value="' . $value["code"] . '">' . $value["name"] . '</option>';
                                }


                                ?>
                            </select>
                        </div>

                        <div class="col-md-12 mb-1 mt-2 d-none" id="tituloDr">
                            <h3>Datos responsable</h3>
                        </div>

                        <?php $campos = [
                            "Primer Apellido" => ["input", "primerApellido", "text", "required", "", "", ""],
                            "Segundo Apellido" => ["input", "segundoApellido", "text", "", "", "", ""],
                            "Primer Nombre" => ["input", "primerNombre", "text", "required", "", "", ""],
                            "Segundo Nombre" => ["input", "segundoNombre", "text", "", "", "", ""],
                            "Direccion" => ["input", "direccion", "text", "required", "", "", ""],
                            // "" => ["", "", "", "", "", "", ""],
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select select-Busca selectModalCiente" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option value="" selected>Seleccione...</option>
                                        <?php foreach ($datos[4] as $key => $value) {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?>
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <div class="col-md-6 mb-1">
                            <label class="form-label "> Departamento </label>
                            <select class="form-select select-Busca" style="width:100%" id="departamento" >
                                <option value="" selected>Seleccione...</option>
                                <?php

                                $datosDepartamentos = obtenerDatosPais();
                                $datosDepartamentos = json_decode($datosDepartamentos, true); // convierte el JSON a un array


                                foreach ($datosDepartamentos as $key => $value) {
                                    echo '<option data-documento="' . $value["id"] . '" value="' . $value["id"] . '">' . $value["name"] . '</option>';
                                }



                                ?>
                            </select>
                        </div>

                        <div class="col-md-6 mb-1">
                            <label class="form-label"> Municipio </label>
                            <select class="form-select" style="width:100%" id="municipio">
                                <option value="" selected>Seleccione...</option>
                            </select>
                        </div>

                        <?php $campos = [
                            "Telefono" => ["input", "telefono", "number", "required", "", "", ""],
                            "Email" => ["input", "email", "mail", "required", "", "", ""],
                            // "" => ["", "", "", "", "", "", ""],
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalCiente select-Busca" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option value="" selected>Seleccione...</option>
                                        <?php foreach ($datos[4] as $key => $value) {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?>
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" onclick="Volver()"></button><i class="fas fa-arrow-left"></i> &nbsp; Volver</button>
                <button class="btn btn-primary my-0" id="button-save-Ciente" onclick="guardarCiente()"><i class="fas fa-bookmark"></i> &nbsp; Guardar cliente</button>
            </div>
        </div>
    </div>
</div>

<script>
    function volver() {
        $('#crearPaciente').modal('hide');
        $('#modalNuevaAutorizacionv2').modal('show');
    }

    function guardarCiente() {
        let keys = [];
        var modalID = '#crearPaciente';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#crearPaciente #" + keys[key]);
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

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>HistoriasRips/AjaxGuadarCliente.php",
            data,
            success: function(response) {
                console.log(data);
                
                // let dataResponse = JSON.parse(response);
                // const {
                //     icon,
                //     title,
                //     text
                // } = dataResponse;
                // Swal.fire({
                //     icon,
                //     title,
                //     text,
                // });

                // if (dataResponse.error) {
                //     console.log(dataResponse.error);
                //     return;
                // }

                // if (icon == "success") {
                //     setTimeout(() => {
                //         location.reload();
                //     }, 500);
                // }
            }
        });

        $("#crearPaciente").modal('hide');
        resetcrearPaciente();
        return data;
    }

    function resetcrearPaciente() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo cliente`);
        $("#button-save-Ciente").html(`<i class="fas fa-bookmark"></i> &nbsp; Nuevo cliente`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#crearPaciente';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#crearPaciente #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarCiente(id) {
        $("#header-modal-Ciente").html(`<i class="fas fa-wrench"></i> ENuevo cliente`);
        $("#button-save-Ciente").html(`<i class="fas fa-wrench"></i> ActuaNuevo cliente`);
        $("#crearPaciente #id").val(id);

        const data = document.getElementById("data_Ciente" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#crearPaciente #" + key);
            if (elemento.is(':checkbox')) {
                elemento.prop('checked', dataPrincipal[key] == 'true' ? true : false);
                continue;
            }

            if (key == 'contenido') {
                insertarContenido(dataPrincipal[key]);
                continue;
            }

            elemento.val(dataPrincipal[key]).change();
        }
        $("#crearPaciente").modal('show');
    }

    function borrarCiente(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminarNuevo cliente?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085D6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $BASE ?>Nomina/Ajax/Ajax.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {
                            icon,
                            title,
                            text
                        } = dataResponse;
                        Swal.fire({
                            icon,
                            title,
                            text,
                        });
                        if (icon == "success") {
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        }
                        if (dataResponse.error) {
                            console.log(dataResponse.error);
                            return;
                        }
                    }
                });
                $("#filaCiente" + id).remove();
            }
        });
    }

    $('#crearPaciente').on('hidden.bs.modal', function() {
        resetcrearPaciente();
    });

    $('#crearPaciente').on('shown.bs.modal', function() {});

    $(document).ready(function() {
        selectToModal("crearPaciente", "selectModalCiente");
    });
</script>

<script>
    $(document).ready(function() {
        $('#departamento').change(function() {
            var departamento = $(this).val();
            var municipio = document.getElementById('municipio');

            $.ajax({
                type: "POST",
                url: "HistoriasRips/Ajax_GetMunicipios.php",
                data: {
                    departamento: departamento
                },
                success: function(response) {
                    var municipios = JSON.parse(response);
                    $('#municipio').empty();
                    $('#municipio').append('<option value="" selected>Seleccione...</option>');
                    $.each(municipios, function(index, municipioData) {
                        $('#municipio').append('<option value="' + municipioData.code + '">' + municipioData.name + '</option>');
                    });
                }
            });
        });
    });
</script>
