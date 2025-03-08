<?php
include "../menu.php";
include "../header.php";

include "./IncludeDatosTarifas.php";

if (isset($_GET["E"])) {
    
    foreach ($dataEmpresas as $value) {
        $empresaId = base64_decode($_GET["E"]);
        if ($value["nit"] == $empresaId) {
            $datosEmpresa = $value;
            break;
        }
    }
    
}

// $dataRIPS = json_encode($dataRIPS);

?>
<style>
    form {
        margin: 0;
        /* Elimina margen en el formulario */
    }

    .tableDataTableSearch {
        margin-top: 0;
        /* Elimina margen superior en la tabla */
    }

    input.form-control {
        margin-bottom: 0.5rem;
        /* Espaciado específico para inputs */
    }

    .card {
        margin-bottom: 1rem;
        /* Espaciado entre tarjetas */
    }
</style>


<div class="content">
    <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="#!">Inicio</a></li>
            <li class="breadcrumb-item active">Entidades</li>
        </ol>
    </nav>
    <form class="mb-9">
        <div class="col-md-12">
            <div class="col-auto">
                <h2 class="mb-2"><?= (( isset($_GET["E"]) ) ? "Editar Entidad {$datosEmpresa['nombre']}" : "Nueva Entidad" ) ?></h2>
            </div>
        </div>
        <div class="col-md-12 row">
            <div class="col-6 col-xl-6 row">

                <?php
                $array_Campos = [
                    "Nombre de la Entidad" => ["text", "nombreEntidad", $datosEmpresa["nombre"]],
                    "NIT" => ["text", "nit", $datosEmpresa["nit"]],
                    "DV" => ["text", "dv", ""],
                    "Email FE" => ["email", "emailFE", ""],
                    "Dirección" => ["text", "direccion", ""],
                    "Teléfono" => ["text", "telefono", ""],
                    "Celular" => ["text", "celular", ""],
                    "Ciudad" => ["text", "ciudad", ""],
                ];

                foreach ($array_Campos as $key => $value) { ?>
                    <div class="col-md-6 mb-0"> <!-- Ajusta aquí el tamaño y el espaciado -->
                        <label class="mb-0"><?= $key ?></label>
                        <input class="form-control" value="<?= $value[2] ?>" type="<?= $value[0] ?>" id="<?= $value[1] ?>" placeholder="" />
                    </div>
                <?php } ?>

                <div class="col-md-6 mb-0">
                    <label class="mb-0">Actividad Económica</label>
                    <select class="form-select" id="actividadEconomica">
                        <?php
                        $options = ["Agropecuaria", "Desarrollo de Software", "Manufactura", "Comercio", "Servicios"];
                        foreach ($options as $key => $value) {
                            echo "<option value='$key'>$value</option>";
                        }
                        ?>
                    </select>
                </div>

                <div class="col-md-6 mb-0">
                    <label class="mb-0">Tipo Persona</label>
                    <select class="form-select" id="tipoPersona">
                        <?php
                        $options = ["Natural", "Juridica"];
                        foreach ($options as $key => $value) {
                            echo "<option value='$key'>$value</option>";
                        }
                        ?>
                    </select>
                </div>

                <div class="col-md-12 mb-0">
                    <br>
                    <button type="button" style="width:100%" class="btn btn-primary"> <i class="fas fa-save"></i> Guardar</button>

                </div>
            </div>

            <div class="col-6 row">
                <div class="card mb-3">
                    <div class="card-body">
                        <h4 class="card-title mb-4">Tarifas</h4>
                        <div class="row gx-3">
                            <div class="col-12">
                                <table class="table tableDataTableSearch">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Cups</th>
                                            <th class="text-center">Nombre</th>
                                            <th class="text-center">Valor</th>
                                            <th class="text-center">Copago</th>
                                            <th class="text-center">Porcentaje Copago</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-tarifas">
                                        <?php
                                        foreach ($dataRIPS as $value) {
                                            $precio = $value['precio'];
                                            $copago = 0;
                                            if (isset($_GET["E"])) {
                                                $checked = ( ( rand(0,1) == 1 ) ? "checked" : "" );
                                                $precio = rand(1000, 20000);
                                                $copago = rand(0, 100); 
                                            }

                                            echo '<tr id="filaN' . $value['id'] . '">
                                                    <td class="text-left">' . $value['codigo'] . '</td>
                                                    <td class="text-left">' . $value['nombre'] . '</td>
                                                    <td class="text-left"><input class="form-control" type="number" value="' . $precio . '"></td>
                                                    <td class="text-center">
                                                        <div class="form-check form-switch text-center">
                                                            <input class="form-check-input" type="checkbox" '.$checked.' id="flexSwitchCheckDefault">
                                                        </div>
                                                    </td>
                                                    <td class="text-left"><input class="form-control" type="number" min="0" max="100" value="'.$copago.'"></td>
                                                </tr>';
                                        }
                                        ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card mb-3">
                    <div class="card-body">
                        <h4 class="card-title mb-4">Entidades</h4>
                        <div class="row gx-3">
                            <div class="col-12">

                                <table class="table tableDataTableSearch">
                                    <thead>
                                        <tr>
                                            <th class="text-center">NIT</th>
                                            <th class="text-center">Nombre</th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-tarifas">
                                        <?php
                                        foreach ($dataEmpresas as $empresa) {
                                            echo '<tr style="height:25px">
                                                    <td class="text-left">' . $empresa['nit'] . '</td>
                                                    <td class="text-left">' . $empresa['nombre'] . '</td>
                                                    <td class="text-left">
                                                        <i class="fas fas fa-pencil" onclick="window.location.href = \'FE_Entidades?E=' . base64_encode($empresa['nit']) . '\'"></i>
                                                        <i class="fas fa-trash"></i>
                                                    </td>
                                                </tr>';
                                        }
                                        ?>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


</div>
</form>

</div>
<?php
include "../footer.php";
?>

<script>
    // function mostrarCups(id) {
    //     let datosCups = <?= $dataRIPS ?>;
    //     let keys = Object.keys(datosCups);
    //     let contenidoHTML = ``;
    //     keys.forEach((element, index) => {
    //         let data = datosCups[element];
    //         contenidoHTML += `<tr id="filaN${data.id}">
    //                             <th class="text-left">${data.codigo}</th>
    //                             <th class="text-left">${data.nombre}</th>
    //                             <th class="text-left"> <input class="form-control" type="number" value="${data.precio}"></th>
    //                             <th class="text-center">
    //                                 <div class="form-check form-switch text-center">
    //                                     <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
    //                                 </div>
    //                             </th>
    //                             <th class="text-left">
    //                                 <input class="form-control" type="number" min="0" max="100" value="0">
    //                             </th>
    //                         </tr>`;
    //     });

    //     document.getElementById("tbody-tarifas").innerHTML = contenidoHTML;
    // }


    // $(document).ready(function(){
    //     mostrarCups("0");
    // });
</script>