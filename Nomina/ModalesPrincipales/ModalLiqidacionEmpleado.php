<?php $isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevaLiquidacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addLiquidacionModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-liquidacion"><i class="fas fa-file-signature"></i> Nueva Liquidación</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        
                        
                        <?php 
                        
                        require_once __DIR__ .  "/FormsLiquidacionNomina/FormLiquidacion_". $ConfigNominaUser["moneda"] .".php"  
                        
                        ?>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="moneda" value="<?=$ConfigNominaUser["moneda"]?>">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">

                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-liquidacion" onclick="guardarLiquidacion()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Liquidación</button>
            </div>
        </div>
    </div>
</div>

<script>

    function resetModalLiquidacion() {
        let keys = ['idTrabajador', 'fechaIngreso', 'fechaSalida', 'salarioBase', 'vacacionesPendientes', 'cesantiasAcumuladas', 'primasPendientes', 'indemnizacion', 'observaciones'];
        for (const key in keys) {
            let elemento = $("#modalNuevaLiquidacion #" + keys[key]);
            elemento.val('');
        }

        $("#modalNuevaLiquidacion #header-modal-liquidacion").html(`<i class="fas fa-file-signature"></i> Nueva Liquidación`);
        $("#modalNuevaLiquidacion #id").val("0");
        $("#modalNuevaLiquidacion #button-save-liquidacion").html(`<i class="fas fa-bookmark"></i> &nbsp; Guardar Liquidación`);
    }

    function guardarLiquidacion() {

        let data = {};
        let jsonDetalle = {};
        let camposFaltantes = false; // Para verificar si faltan campos obligatorios

        // Iteramos sobre todos los inputs, selects y textareas dentro del modal modalNuevaLiquidacion
        $("#modalNuevaLiquidacion").find("input, select, textarea").each(function() {
            let elemento = $(this);
            let idElemento = elemento.attr("id"); // Obtenemos el id del elemento
            let valorElemento = elemento.val(); // Obtenemos el valor del elemento

            if (valorElemento === "" && elemento.attr("required") !== undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos obligatorios deben estar completos!'
                });
                camposFaltantes = true; // Marcamos que hay campos faltantes
                return false; // Salimos del loop
            }


            if (camposJsonLiquidacion.includes(idElemento)) {
                jsonDetalle[idElemento] = valorElemento;
            }else{
                // Guardamos en el objeto data el id del elemento y su valor
                data[idElemento] = valorElemento;

            }


            // Verificamos si el campo es obligatorio y está vacío
        });

        // Si hay campos faltantes, detenemos la ejecución
        if (camposFaltantes) {
            return false;
        }


        data["detalle"] = JSON.stringify(jsonDetalle);
        data["action"] = data.id == 0 ? "crear" : "actualizar";





        // Definimos la acción dependiendo del valor del campo id

        // console.log(data);
        // return false;


        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxLiquidacion.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const { icon, title, text } = dataResponse
                Swal.fire({ icon, title, text, });

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

        // Swal.fire({
        //     "icon": "success",
        //     "title": "Correcto",
        //     "text": "Liquidación guardada correctamente",
        // });

        resetModalLiquidacion();
        $("#modalNuevaLiquidacion").modal("hide");
    }

    function borrarLiquidacion(id) {
        Swal.fire({
            title: '¿Estás seguro de borrar esta liquidación?',
            text: "No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#rowLiquidacion-" + id).remove();
            }
        })
    }

    function editarLiquidacion(id, index) {
        let dataJson = $("#data_liquidacion_" + index).val();
        let data = JSON.parse(dataJson);
        $("#modalNuevaLiquidacion #id").val(id);
        $("#modalNuevaLiquidacion #header-modal-liquidacion").html(`<i class="fas fa-wrench"></i> Actualizar Liquidación`);
        $("#modalNuevaLiquidacion #button-save-liquidacion").html(`<i class="fas fa-wrench"></i> &nbsp; Actualizar Liquidación`);

        for (const key in data) {
            $("#modalNuevaLiquidacion #" + key).val(data[key]).change();
        }

        $("#modalNuevaLiquidacion").modal("show");
    }

    function calcularCesantias() {
        const sueldoBasico = parseFloat(document.getElementById("sueldo_basico").value) || 0;
        const diasLiquidacion = parseInt(document.getElementById("dias_liquidacion").value) || 0;
        const auxilioTransporte = parseFloat(document.getElementById("auxilio_transporte").value) || 0;
        const promedioComisiones = parseFloat(document.getElementById("promedio_comisiones").value) || 0;
        const porcentajeVentas = parseFloat(document.getElementById("porcentaje_ventas").value) || 0;
        const otrosFactores = parseFloat(document.getElementById("otros_factores").value) || 0;

        const totalBaseCesantias = sueldoBasico + auxilioTransporte + promedioComisiones + porcentajeVentas + otrosFactores;
        document.getElementById("total_base_cesantias").value = totalBaseCesantias.toFixed(2);
    }

    function calcularPrima() {
        const sueldoBasicoPrima = parseFloat(document.getElementById("sueldo_basico_prima").value) || 0;
        const horasExtras = parseFloat(document.getElementById("horas_extras").value) || 0;
        const auxilioTransportePrima = parseFloat(document.getElementById("auxilio_transporte_prima").value) || 0;
        const promedioComisionesPrima = parseFloat(document.getElementById("promedio_comisiones_prima").value) || 0;
        const porcentajeVentasPrima = parseFloat(document.getElementById("porcentaje_ventas_prima").value) || 0;
        const otrosFactoresPrima = parseFloat(document.getElementById("otros_factores_prima").value) || 0;

        const totalBasePrima = sueldoBasicoPrima + horasExtras + auxilioTransportePrima + promedioComisionesPrima + porcentajeVentasPrima + otrosFactoresPrima;
        document.getElementById("total_base_prima").value = totalBasePrima.toFixed(2);
    }

    function calcularVacaciones() {
        const sueldoBasicoVacaciones = parseFloat(document.getElementById("sueldo_basico_vacaciones").value) || 0;
        const promedioComisionesVacaciones = parseFloat(document.getElementById("promedio_comisiones_vacaciones").value) || 0;
        const porcentajeVentasVacaciones = parseFloat(document.getElementById("porcentaje_ventas_vacaciones").value) || 0;

        const totalBaseVacaciones = sueldoBasicoVacaciones + promedioComisionesVacaciones + porcentajeVentasVacaciones;
        document.getElementById("total_base_vacaciones").value = totalBaseVacaciones.toFixed(2);
    }

    $(document).ready(function() {
        selectToModal("modalNuevaLiquidacion", "selectModalLiquidacion")
    });
</script>

<style>
    .displayNone {
        display: none;
    }

    .form-control{
        width: 100% !important; 
    }

</style>