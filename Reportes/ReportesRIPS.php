<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
                <li class="breadcrumb-item"><a href="Menu_reports">Reportes</a></li>
                <li class="breadcrumb-item active" aria-current="page">Reportes RIPS</li>
            </ol>
        </nav>
        <div class="row align-items-center justify-content-between g-3 mb-4">
            <div class="col-auto">
                <h2 class="mb-0">Reportes RIPS</h2>
            </div>
        </div>
        <div>
            <div class="scrollbar">
                <ul class="nav nav-underline fs-9 flex-nowrap mb-3 pb-1" id="myTab" role="tablist">
                    <li class="nav-item"><a class="nav-link text-nowrap active" id="personal-info-tab" data-bs-toggle="tab" href="#tab-personal-info" role="tab" aria-controls="tab-personal-info" aria-selected="true"><span class="fas fa-file-alt me-2"></span></span>Reportes RIPS</a></li>
                </ul>
                <div class="d-flex justify-content-end">
                    <div class="col-6 text-end">
                        <button class="btn btn-primary" type="button" id="dropdownMenuButton1" data-bs-toggle="modal" data-bs-target="#addDealModal" aria-expanded="false">
                            <i class="fas fa-cogs"></i> &nbsp; Generar
                        </button>
                    </div>
                </div>
                <div class="tab-content" id="profileTabContent">
                    <div class="tab-pane fade show active" id="tab-personal-info" role="tabpanel" aria-labelledby="personal-info-tab">
                        <div class="row gx-3 gy-4 mb-5">
                            <div class="col-12 col-lg-6">
                                <div class="row g-2 gy-lg-0">
                                    <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha de Inicial</label>
                                    <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6" id="fecha_inicial">
                                </div>
                            </div>
                            <div class="col-12 col-lg-6">
                                <div class="row g-2 gy-lg-0">
                                    <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha de Final</label>
                                    <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6" id="fecha_final">
                                </div>
                            </div>
                            <div class="col-12 col-lg-6">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="profesional">Profesional</label>
                                <select class="form-select" id="profesional">
                                    <?php
                                    $queryList = mysqli_query($connMedical, "SELECT * FROM usuarios where activo =1 ");
                                    while ($row_recordset32A = mysqli_fetch_array($queryList)) {
                                        $ID = $row_recordset32A['ID'];
                                        $NOMBRE_USUARIO = $row_recordset32A['NOMBRE_USUARIO'];
                                        echo "<option value='$ID'> $NOMBRE_USUARIO </option>";
                                    }
                                    ?>

                                </select>
                            </div>
                            <div class="col-12 col-lg-6">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="admin">Administradora</label>
                                <select class="form-select" id="entidad_administradora" onchange="BuscarConvenio()">
                                    <option value="" selected="selected">Seleccione</option>
                                    <option value="0">Particular</option>
                                    <?php
                                    $queryEntidad = mysqli_query($connMedical, "SELECT * FROM  Rips_Entidades WHERe Activo = 1 ");
                                    while ($RowEntidad = mysqli_fetch_array($queryEntidad)) {
                                        $id = $RowEntidad['id'];
                                        $codigo = $RowEntidad['codigo'];
                                        $Nombre = $RowEntidad['Nombre'];
                                        echo "<option value='$id'>$Nombre</option>";
                                    }
                                    ?>
                                </select>
                            </div>
                            <div class="col-12 col-lg-6">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="convenio">Convenio</label>
                                <select class="form-select" id="convenio">

                                </select>
                            </div>
                            <div class="col-12 col-lg-6">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="nacionalidad">Nacionalidad</label>
                                <select class="form-select" id="paciente">
                                    <option value="1">Colombia</option>
                                    <option value="2">Extranjero</option>

                                </select>
                            </div>
                            <div class="col-12 col-lg-6">
                                <div class="row g-2 gy-lg-0">
                                    <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha de Remisión </label>
                                    <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6" id="fecha_remision">
                                </div>
                            </div>
                            <div class="col-12 col-lg-6">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="n_factura">Nº Factura (opcional)</label>
                                <input class="form-control" id="n_factura" type="number" placeholder="123456788" />
                            </div>
                            <div class="col-12 col-lg-6">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="n_contrato">Nº de Contrato (opcional)</label>
                                <input class="form-control" id="n_contrato" type="number" placeholder="123456788" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end of .container-->
    </div>
    <div class="modal fade" id="addDealModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content bg-body-highlight p-6">
                <div class="modal-header justify-content-between border-0 p-0 mb-2">
                    <h3 class="mb-0">Generar Reporte</h3>
                    <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close"><span class="fas fa-times text-danger"></span></button>
                </div>
                <div class="modal-body px-0">
                    <h4 class="mb-7 border-0 p-0">Información básica</h4>
                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="mb-4">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="tipo_rips">Tipo de soporte RIPS</label>
                                <select class="form-select" id="tipo_rips">
                                    <option value="AF">Facturas</option>
                                    <option value="US">Usuario</option>
                                    <option value="AC">Consulta</option>
                                    <option value="CT">Control</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-4">
                                <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="tipo_rips_2">Tipo de Documento</label>
                                <select class="form-select" id="tipo_rips_2">
                                    <option value="TXT">TXT</option>
                                    <option value="XML">XML</option>
                                    <option value="JSON">JSON</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-6 px-0 pb-0">
                    <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close">Cancelar</button>
                    <button class="btn btn-primary" id="generateReportButton" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent">Generar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include "../footer.php"; ?>

<script>
    function BuscarConvenio(valorinicial) {
        var valor = $("#entidad_administradora").val();
        //console.log(valor);
        $.ajax({
            type: "POST",
            url: "Reportes/Ajax_RipsDatos.php",
            data: {
                valor: valor,
                Tipo_Consulta: "Busqueda Convenio"
            },
            success: function(response) {
                $('#convenio').html(response);
                // console.log(response);
                if (valorinicial != "") {
                    $("select[id='convenio'] > option[value='" + valorinicial + "']").attr("selected", true);
                    //$("select[id='fe_convenio']").select2();
                }
            }
        });

    }
</script>
<script>
    document.getElementById('generateReportButton').addEventListener('click', function() {
        var tipoRips = document.getElementById('tipo_rips').value;


        var tipoDocumento = document.getElementById('tipo_rips_2').value;

        var doctor = document.getElementById('profesional').value;
        var convenio = document.getElementById('convenio').value;
        var paciente = document.getElementById('paciente').value;
        var desde = document.getElementById('fecha_inicial').value;
        var hasta = document.getElementById('fecha_final').value;
        var fechaRemision = document.getElementById('fecha_remision').value;
        var tipoUsuario = document.getElementById('entidad_administradora').value;
        const partes = fechaRemision.split('-');
        const nuevoFormato = partes[0] + partes[1];
        // Crea un objeto con los datos
        if (tipoRips == 'US') {
            Name = 'US' + nuevoFormato;
        } else if (tipoRips == 'AF') {
            Name = 'AF' + nuevoFormato;
        } else if (tipoRips == 'AC') {
            Name = 'AC' + nuevoFormato;
        } else if (tipoRips == 'CT') {
            Name = 'CT' + nuevoFormato;
        }

        var File;
        if (tipoDocumento == 'TXT') {
            File = 'data:text/plain;charset=utf-8,';
        } else if (tipoDocumento == 'XML') {
            File = 'data:application/xml;charset=utf-8,';
        } else if (tipoDocumento == 'JSON') {
            File = 'data:application/json;charset=utf-8,';
        }
        var datos = {
            doctor: doctor,
            convenio: convenio,
            paciente: paciente,
            desde: desde,
            hasta: hasta,
            fechaRemision: fechaRemision,
            tipoUsuario: tipoUsuario
        };
        //console.log(datos);
        // Envía los datos por AJAX
        $.ajax({
            type: 'POST',
            url: 'Reportes/' + tipoRips + '_' + tipoDocumento + '.php',
            data: datos,
            success: function(response) {
                console.log(response);
                // Crea un nuevo elemento <a>
                var link = document.createElement('a');
                // Establece la URL del enlace como un data URI con el contenido del archivo
                //link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(response);
                link.href = File + encodeURIComponent(response);
                // Establece el nombre del archivo para la descarga
                link.download = Name;
                // Simula un clic en el enlace para abrirlo en una nueva pestaña
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });

    });
</script>