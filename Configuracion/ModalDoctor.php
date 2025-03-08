<?php

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="createDoctor" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="mb-0" id="header-modal-ncontrado">Nuevo Usuario</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="col-md-12 mb-1 mt-1">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Información Básica</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Nombre <span class="text-primary">*</span></label>
                                    <input class="form-control" type="text" id="firstName" placeholder="Nombre" required />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Apellido <span class="text-primary">*</span></label>
                                    <input class="form-control" type="text" id="lastName" placeholder="Apellido" required />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label" for="usuarios_country_id">País <span class="text-primary">*</span></label>
                                    <select class="form-select" id="usuarios_country_id" required>
                                        <option selected>Seleccione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label" for="usuarios_city_id">Ciudad <span class="text-primary">*</span></label>
                                    <select class="form-select" id="usuarios_city_id" required>
                                        <option selected>Seleccione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Lugar o direccion de atención <span class="text-primary">*</span></label>
                                    <input class="form-control" type="text" id="direccionAtencion" placeholder="Lugar o direccion de atención" required />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Especialidad <span class="text-primary">*</span></label>
                                    <input class="form-control" type="text" id="especialidad" placeholder="Especialidad" required />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Genero <span class="text-primary">*</span></label>
                                    <select class="form-select" id="genero" required>
                                        <option selected>Seleccione...</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Numero de Contacto <span class="text-primary">*</span></label>
                                    <input class="form-control" type="text" id="numeroContacto" placeholder="Numero de Contacto" required />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Correo <span class="text-primary">*</span></label>
                                    <input class="form-control" type="email" id="correoContacto" placeholder="Correo" required />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Años de Experiencia <span class="text-primary">*</span></label>
                                    <input class="form-control" type="number" id="anosExperiencia" placeholder="Años de Experiencia" required />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12 mb-1 mt-1">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Credenciales</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Username <span class="text-primary">*</span></label>
                                    <input class="form-control" type="text" required id="username" placeholder="Username" />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="form-label">Contraseña <span class="text-primary">*</span></label>
                                    <input class="form-control" type="password" required id="password" placeholder="Contraseña" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" id="id" value="0">
                <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
            </div>

            <div class="modal-footer">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-Doctors" onclick="guardarDoctors()"><i class="fas fa-bookmark"></i> &nbsp; Guardar</button>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        countriesSelect,
        citiesSelect
    } from "./services/selects.js";

    function guardarDoctors() {
        let keys = [];
        var modalID = '#createDoctor';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#createDoctor #" + keys[key]);
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
            url: "<?= $BASE ?>Configuracion/Ajax/AjaxDoctor.php",
            data,
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

        $("#createDoctor").modal('hide');
        resetcreateDoctor();
        return data;
    }

    function resetcreateDoctor() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Usuario`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#createDoctor';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#createDoctor #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarDoctors(id) {
        $("#header-modal-Doctors").html(`<i class="fas fa-wrench"></i> Editar Usuario`);
        $("#createDoctor #id").val(id);

        const data = document.getElementById("data_Doctors" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#createDoctor #" + key);
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
        $("#createDoctor").modal('show');
    }

    function borrarDoctors(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Doctor?',
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
                    url: "<?= $BASE ?>Configuracion/Ajax/AjaxDoctor.php",
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
                $("#filaDoctors" + id).remove();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        countriesSelect(document.getElementById('usuarios_country_id'));
        citiesSelect(document.getElementById('usuarios_city_id'));
    })

    $('#createDoctor').on('hidden.bs.modal', function() {
        resetcreateDoctor();
    });

    $('#createDoctor').on('shown.bs.modal', function() {});

    $(document).ready(function() {
        selectToModal("createDoctor", "selectModalDoctors");
    });
</script>

<style>
    .displayNone {
        display: none;
    }
</style>