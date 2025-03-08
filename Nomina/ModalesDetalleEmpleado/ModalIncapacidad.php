<?php 

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalIncapacidad" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo Incapacidad</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php $campos = [
                            "Fecha Inicio" => ["input", "fechaIncio", "date", "required", date("Y-m-d") , "", ""],
                            "Fecha Fin" => ["input", "fechaFin", "date", "required", date("Y-m-d") , "", ""],
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalIncapacidad" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
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

                        <div class="col-md-12">
                            <label for="">Archivo</label>
                            <input type="file" class="form-control" id="archivo">
                        </div>


                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idTrabajador" value="<?=$idTrabajador?>">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-Incapacidad" onclick="guardarIncapacidad()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Incapacidad</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarIncapacidad() {
        let keys = [];
        var modalID = '#modalIncapacidad';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        // let data = {};
        // let data = new FormData();
        // for (const key in keys) {
        //     let elemento = $("#modalIncapacidad #" + keys[key]);
        //     let type = elemento.attr("type");
            
        //     if (type == "file") {
        //         data[keys[key]] = $("#modalIncapacidad #" + keys[key]).prop("files")[0];
        //         continue;
        //     }

        //     if (elemento.val() == "" && elemento.attr("required") != undefined) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Oops...',
        //             text: 'Debes rellenar todos los campos',
        //         })
        //         return false;
        //     }

        //     data[keys[key]] = elemento.val();
        // }

        // data["action"] = data.id == 0 ? "crear" : "actualizar";

        let data = new FormData(); // Inicializa FormData correctamente
        for (const key in keys) {
            let elemento = $("#modalIncapacidad #" + keys[key]);
            let type = elemento.attr("type");

            // Si el elemento es de tipo "file"
            if (type === "file") {
                let file = elemento.prop("files")[0];
                if (file) {
                    data.append(keys[key], file); // Agrega el archivo al FormData
                } else if (elemento.attr("required") !== undefined) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Debes seleccionar un archivo',
                    });
                    return false;
                }
                continue;
            }

            // Si el campo es obligatorio pero está vacío
            if (elemento.val() === "" && elemento.attr("required") !== undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                });
                return false;
            }

            // Agregar otros valores al FormData
            data.append(keys[key], elemento.val());
        }

        // Agrega el campo de acción
        data.append("action", data.get("id") === "0" ? "crear" : "actualizar");


        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxIncapacidad.php",
            data,
            processData: false,
            contentType: false,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {icon,title,text} = dataResponse;
                Swal.fire({icon,title,text,});

                if (dataResponse.error) {
                    console.log(dataResponse.error);
                    return;
                }

                if (icon == "success") {
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                }
            }
        });

        $("#modalIncapacidad").modal('hide');
        resetmodalIncapacidad();
        return data;
    }

    function resetmodalIncapacidad() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Incapacidad`);
        $("#button-save-Incapacidad").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Incapacidad`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalIncapacidad';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalIncapacidad #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarIncapacidad(id) {
        $("#header-modal-Incapacidad").html(`<i class="fas fa-wrench"></i> Editar Incapacidad`);
        $("#button-save-Incapacidad").html(`<i class="fas fa-wrench"></i> Actualizar Incapacidad`);
        $("#modalIncapacidad #id").val(id);

        const data = document.getElementById("data_Incapacidad" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalIncapacidad #" + key);
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
        $("#modalIncapacidad").modal('show');
    }

    function borrarIncapacidad(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Incapacidad?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxIncapacidad.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse;
                        Swal.fire({icon,title,text,});
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
                $("#filaIncapacidad" + id).remove();
            }
        });
    }

    $('#modalIncapacidad').on('hidden.bs.modal', function() {
        resetmodalIncapacidad();
    });

    $('#modalIncapacidad').on('shown.bs.modal', function() {
    });

    $(document).ready(function() {
        selectToModal("modalIncapacidad", "selectModalIncapacidad");
    });

</script>

<style>
    .displayNone {
        display: none;
    }
</style>
