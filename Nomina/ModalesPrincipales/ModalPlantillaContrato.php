<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<div class="modal fade" id="modalPlantillaContrato" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addPlantillaContratoModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-PlantillaContrato"><i class="fas fa-briefcase"></i> Nueva Plantilla de Contrato</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <div class="col-md-12 row">
                            <div class="col-md-6">
                                <label for="">Nombre</label>
                                <input type="text" class="form-control" id="nombre">
                            </div>

                            <div class="col-md-6 row">    
                                <div class="col-md-12">
                                    <label for="">Requerimientos</label>
                                </div>
        
                                <div class="col-md-5">
                                    <input type="checkbox" class="" id="aplicaFoto">
                                    <label for="">Foto de perfil</label>
                                </div>
        
                                <div class="col-md-3">
                                    <input type="checkbox" class="" id="aplicaFirma">
                                    <label for="">Firma</label>
                                </div>
        
                                <div class="col-md-4">
                                    <input type="checkbox" class="" id="aplicaDocumento">
                                    <label for="">Documento</label>
                                </div>
                            </div>
                            
                        </div>


                        <hr class="mt-2 mb-2">

                        <?php
                        $tags = ["[FECHA_ACTUAL]", "[FECHA_INICIO_CONTRATO]", "[FECHA_FIN_CONTRATO]", "[TIPO_CONTRATO]", "[NOMBRE_TRABAJADOR]", "[DOCUMENTO_TRABAJADOR]", "[CARGO_TRABAJADOR]", "[SALARIO_TRABAJADOR]","[CIUDAD_TRABAJADOR]","[DIRECCION_TRABAJADOR]", "[FIRMA_TRABAJADOR]","[NOMBRE_EMPLEADOR]", "[DOCUMENTO_EMPLEADOR]","[CIUDAD_EMPLEADOR]","[DIRECCION_EMPLEADOR]" ,"[FIRMA_EMPLEADOR]", "[METODO_PAGO]"];

                        foreach ($tags as $key) { ?>
                            <div class="col-md-3">
                                <button onclick="copiarAlPortapapeles('<?=$key?>')" class="btn btn-info btn-sm mb-1" style="width: 95%; font-size: 10px"> <i class="fas fa-clone"></i> <?= $key ?></button>
                            </div>
                        <?php } ?>


                        <div class="col-md-12 mb-1 mt-3">
                            <label for="">Contenido</label>
                        </div>
                        <div class="card col-md-12">
                            <!-- <textarea class="editorJR" style="height: 200px" id="contenido"></textarea> -->
                            <textarea class="tinymce" style="height: 200px" data-tinymce="{}" id="contenido"></textarea>
                        </div>

                        <input type="hidden" id="Foto">
                        <input type="hidden" id="Firma">
                        <input type="hidden" id="Documento">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">


                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarPlantillaContrato()" id="button-save-PlantillaContrato"><i class="fas fa-bookmark"></i> &nbsp; Crear Plantilla</button>
            </div>
        </div>
    </div>
</div>

<!-- <script src="https://cdn.tiny.cloud/1/udfq4tnq4z827ewlvgv87fets2uhsa2evahbkig2zaaj0m39/tinymce/7/tinymce.min.js" referrerpolicy="origin"></script> -->

<script>
    function copiarAlPortapapeles(texto) {
        // Usar la API del portapapeles moderna
        navigator.clipboard.writeText(texto).then(() => {
            Swal.fire({
                icon: 'info',
                title: `${texto} copiado al portapapeles`,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                timerProgressBar: true,
                position: 'top-end'
            });
        }).catch(err => {
            console.error('Error al copiar al portapapeles: ', err);
        });
    }


    function obtenerContenidoDesdeIframe() {
        const iframe = document.querySelector('#contenido_ifr'); // El iframe generado por TinyMCE
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const contenidoHTML = doc.body.innerHTML; // Obtener el HTML dentro del iframe
        console.log(contenidoHTML);
        return contenidoHTML;
    }

    function insertarContenido(contenidoHTML) {
        const iframe = document.querySelector('#contenido_ifr'); // ID del iframe generado por TinyMCE
        const doc = iframe.contentDocument || iframe.contentWindow.document; // Obtener el documento del iframe
        doc.body.innerHTML = contenidoHTML; // Esto inserta el HTML directamente en el iframe
    }


    function guardarPlantillaContrato() {
        let keys = [];
        var modalID = '#modalPlantillaContrato';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });


        let data = {};
        for (const key in keys) {
            let elemento = $("#modalPlantillaContrato #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                })
                return false;
            }

            if ( keys[key] == "contenido") {
                data["contenido"] = obtenerContenidoDesdeIframe();
                continue;
            }


            let value = elemento.val() ;
            if (elemento.is(':checkbox')) {
                value = elemento.is(':checked') ? true : false;
            }

            data[keys[key]] = value;
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        console.log(data);
        // return data;

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxPlantillasContratos.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {icon,title,text} = dataResponse
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

        $("#modalPlantillaContrato").modal('hide');
        resetModalPlantillaContrato();
        return data;
    }

    function resetModalPlantillaContrato() {
        $("#header-modal-PlantillaContrato").html(`<i class="fas fa-briefcase"></i> Nueva plantilla de contrato`);
        $("#button-save-PlantillaContrato").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear plantilla de contrato`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalPlantillaContrato';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                if (id != "id") {
                    keys.push(id);
                }

            }
        });
        for (const key in keys) {
            let elemento = $("#modalPlantillaContrato #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarPlantillaContrato(id) {
        $("#header-modal-PlantillaContrato").html(`<i class="fas fa-wrench"></i> Editar plantilla de contrato`);
        $("#button-save-PlantillaContrato").html(`<i class="fas fa-wrench"></i> Actualizar plantilla de contrato`);
        $("#modalPlantillaContrato #id").val(id);

        const data = document.getElementById("data_PlantillaContrato_" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalPlantillaContrato #" + key);
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

        $("#modalPlantillaContrato").modal('show');
    }

    function eliminarPlantillaContrato(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este PlantillaContrato?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxPlantillasContratos.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse
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
                })

                $("#filaContrato-" + id).remove();
            }
        })
    }

    $('#modalPlantillaContrato').on('hidden.bs.modal', function() {
        resetModalPlantillaContrato();
    });

    $('#modalPlantillaContrato').on('shown.bs.modal', function() {

    });


</script>

<script>

</script>