<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.min.js"></script> -->

<div class="modal fade" id="modalDetailCandidato" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addSedeModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-detallecandidato"></h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina" class="col-md-12 row">

                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
            </div>
        </div>
    </div>
</div>
<script>
    function verCandidato(indice) {
        let dataJson = $("#data_cargopublicado_" + indice).val();
        let data = JSON.parse(dataJson);
        
        console.log("La data es ");
        console.log(data);
        

        let jsonCandidato = $("#data_cargopublicado_candidato_" + indice).val();
        let dataCandidato = JSON.parse(jsonCandidato);

        $("#modalDetailCandidato #header-modal-detallecandidato").html(`<i class="fas fa-user"></i> Detalles del Candidato #000${indice} - Puesto de ${data.titulo}`);

        let contenido = `   <div class="card col-md-12" style="border:5px solid #EEF3F6">
                                <h5 class="card-header">&nbsp; Información del Candidato</h5>
                                <div class="card-body col-md-12 pt-0">
                                    <table class="table table-sm">
                                        <tbody>
                                            <tr>
                                                <td><b>Numero de documento</b></td>
                                                <td>${dataCandidato.numero_documento}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Candidato</b></td>
                                                <td>${dataCandidato.nombre} ${dataCandidato.apellido}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Correo</b></td>
                                                <td>${dataCandidato.email}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Teléfono</b></td>
                                                <td>${dataCandidato.telefono}</td>
                                            </tr>
                                            <tr>
                                                <td><b>CV o archivo adjunto</b></td>
                                                <td>${ data.archivo != "" ? "<i class='fas fa-file-pdf' onclick='abrirPDF(\"" + data.archivo + "\")'></i>" : "No cargado" } </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
`;


        $("#modalDetailCandidato #contenido-pagina").html(contenido);
        console.log("Contenido");
        console.log(contenido);
        // Mostrar el modal
        $("#modalDetailCandidato").modal('show');
    }
</script>