<div class="modal fade" id="modalDetalleNomina" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addTrabajadorModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-detallenomina"></h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-modal-detallenomina" class="col-md-12 row">

                </div>
            </div>

            <input type="hidden" id="idTrabajadorActualizar" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0"><i class="fas fa-print"></i> &nbsp; Imprimir</button>
            </div>
        </div>
    </div>
</div>


<script>
    function formatearMiles(numero) {
        return new Intl.NumberFormat('es-ES').format(numero);
    }


    function verDetalleNomina(indice) {
        let dataJson = $("#data_detalle_nomina" + indice).val();
        if (!JSON.parse(dataJson)) {
            Swal.fire({
                "icon": "error",
                "title": "Error",
                "text": "Ocurrio un error al mostrar datos"
            })
            return;
        }




        let data = JSON.parse(dataJson);
        console.log(data);

        let {deducciones,descuentos,extras} = data;

        extras = JSON.parse(extras);
        deducciones = JSON.parse(deducciones);
        descuentos = JSON.parse(descuentos);

        //? GENERANDO CONTENIDO DE LA TABLA DE BONIFICACIONES [INICIO]
        let contenidoBonificaciones = ``;
        let totalBonificaciones = 0;
        for (const key in extras) {
            contenidoBonificaciones += ` <tr>
                                            <td><b>${key}</b></td>
                                            <td>$${formatearMiles(extras[key])}</td>
                                        </tr>`;
            totalBonificaciones += Number(extras[key]);
        }

        totalBonificaciones = formatearMiles(totalBonificaciones);
        contenidoBonificaciones += ` <tr>
                                        <td><b>Total</b></td>
                                        <td>$${totalBonificaciones}</td>
                                    </tr>`;

        //? GENERANDO CONTENIDO DE LA TABLA DE BONIFICACIONES [FIN]

        //? GENERANDO CONTENIDO DE LA TABLA DE DEDUCCIONES [INICIO]
        let contenidoDeducciones = ``;
        let totalDeducciones = 0;
        for (const key in deducciones) {
            let valorDeduccion = deducciones[key];
            totalDeducciones += Number(valorDeduccion);
            contenidoDeducciones += ` <tr>
                                            <td><b>${key}</b></td>
                                            <td>$${formatearMiles(valorDeduccion)}</td>
                                        </tr>`;

        }

        totalDeducciones = formatearMiles(totalDeducciones);
        contenidoDeducciones += ` <tr>
                                        <td><b>Total</b></td>
                                        <td>$${totalDeducciones}</td>
                                    </tr>`;
        //? GENERANDO CONTENIDO DE LA TABLA DE DEDUCCIONES [FIN]

        //? GENERANDO CONTENIDO DE LA TABLA DE DEDUCCIONES [INICIO]
        let contenidoDescuentos = ``;
        let totalDescuentos = 0;
        for (const key in descuentos) {
            let {
                fecha,
                hora,
                motivo,
                detalle,
                valor_descuento
            } = descuentos[key];

            totalDescuentos += Number(valor_descuento);
            contenidoDescuentos += `<tr>
                                        <td>${fecha} - ${hora}</td>
                                        <td>${motivo} <br> ${detalle}</td>
                                        <td>$${formatearMiles(valor_descuento)}</td>
                                    </tr>
                                        `;



        }

        totalDescuentos = formatearMiles(totalDescuentos);
        contenidoDescuentos += ` <tr>
                                        <td><b>Total</b></td>
                                        <td colspan="2">$${totalDescuentos}</td>
                                    </tr>`;
        //? GENERANDO CONTENIDO DE LA TABLA DE DEDUCCIONES [FIN]



        $("#header-modal-detallenomina").html(`<i class='fas fa-info fa-sm'></i> Detalles de Nomina #00${data.id} | ${data.nombre}`);
        let contenidoModal = `  <div class="card col-md-6" style="border:5px solid #EEF3F6">
                                    <h5 class="card-header"><i class='fas fa-table'></i>&nbsp; Datos Generales</h5>
                                    <div class="card-body col-md-12 row pt-0">
                                        <table style="margin:10px" class='table table-sm'>
                                            <thead>
                                                <tr>
                                                    <td><b>Persona</b></td>
                                                    <td><?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?></td>
                                                </tr>
                                                <tr>
                                                    <td><b>Salario base</b></td>
                                                    <td>${data.totalBase}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Cargo</b></td>
                                                    <td><?= $cargoTrabajador ?></td>
                                                </tr>
                                                <tr>
                                                    <td><b>Fecha</b></td>
                                                    <td>${data.fechaRegistro}</td>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="card col-md-6" style="border:5px solid #EEF3F6">
                                    <h5 class="card-header"><i class='fas fa-coins'></i>&nbsp; Bonificaciones y Extras</h5>
                                    <div class="card-body col-md-12 row pt-0">
                                        <table style="margin:10px" class='table table-sm'>
                                            <thead>
                                                ${contenidoBonificaciones}
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="card col-md-6" style="border:5px solid #EEF3F6">
                                    <h5 class="card-header"><i class='fas fa-down-long'></i>&nbsp; Deducciones</h5>
                                    <div class="card-body col-md-12 row pt-0">
                                        <table style="margin:10px" class='table table-sm'>
                                            <thead>
                                                ${contenidoDeducciones}
                                            </thead>
                                        </table>
                                    </div>
                                </div>

                                <div class="card col-md-6" style="border:5px solid #EEF3F6">
                                    <h5 class="card-header"><i class='fas fa-down-long'></i>&nbsp; Descuentos</h5>
                                    <div class="card-body col-md-12 row pt-0">
                                        <table style="margin:10px" class='table table-sm'>
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Motivo/Detalle</th>   
                                                    <th>Descuento</th>   
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${contenidoDescuentos}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="card col-md-12">
                                    <div class="card-body col-md-12 row pt-0">
                                        <table style="margin:10px" class='table table-sm'>
                                            <tbody>
                                                <tr>
                                                    <td><b>Total Neto</b></td>
                                                    <td class="text-end">$${formatearMiles(data.total)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                `;

        $("#contenido-modal-detallenomina").html(contenidoModal);
        $("#modalDetalleNomina").modal("show");
    }
</script>