<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
                <li class="breadcrumb-item"><a href="consultas?1">Consultas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consulta Primera vez</li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-12">
                <div class="row align-items-center justify-content-between">
                    <div class="col-md-6">
                        <h2 class="mb-0">Nueva Consulta</h2>
                        <small>
                            Miguel Angel Castro Franco
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-0 g-md-4 g-xl-6 p-3">
            <div class="col-md-7 col-lg-7 col-xl-8">
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Musculatura Craneocervical</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">ATM</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Diagnóstico Maxilofacial</span>
                        </li>
                    </ul>
                </div>


                <div id="form-container" class="form-container">
                    <div class="wizard-content">
                        <div class="wizard-step active" data-step="1">
                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="temporalAnterior" name="temporalAnterior">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="temporalAnterior">Temporal Anterior</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="temporalMedio" name="temporalMedio">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="temporalMedio">Temporal Medio</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="temporalPosterior" name="temporalPosterior">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="temporalPosterior">Temporal Posterior</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="maseteroSuperficial" name="maseteroSuperficial">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="maseteroSuperficial">Masetero Superficial</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="maseteroProfundo" name="maseteroProfundo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="maseteroProfundo">Masetero Profundo</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="tendonTemporal" name="tendonTemporal">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="tendonTemporal">Tendón del Temporal</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="pterigoideoExterno" name="pterigoideoExterno">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="pterigoideoExterno">Pterigoideo Externo</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="esternocleidomastoideo"
                                        name="esternocleidomastoideo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="esternocleidomastoideo">Esternocleidomastoideo</label>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="suboccipital" name="suboccipital">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="suboccipital">Suboccipital</label>
                                </div>
                            </div>
                        </div>
                        <div class="wizard-step" data-step="2">
                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialAnteroinferiorDerecho"
                                        name="sinovialAnteroinferiorDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialAnteroinferiorDerecho">1. Sinovial Anteroinferior
                                        Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialAnteroinferiorIzquierdo"
                                        name="sinovialAnteroinferiorIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialAnteroinferiorIzquierdo">1. Sinovial Anteroinferior
                                        Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialAnterosuperiorDerecho"
                                        name="sinovialAnterosuperiorDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialAnterosuperiorDerecho">2. Sinovial Anterosuperior
                                        Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialAnterosuperiorIzquierdo"
                                        name="sinovialAnterosuperiorIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialAnterosuperiorIzquierdo">2. Sinovial Anterosuperior
                                        Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="ligamentoColateralExternoDerecho"
                                        name="ligamentoColateralExternoDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="ligamentoColateralExternoDerecho">3. Ligamento Colateral Externo
                                        Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="ligamentoColateralExternoIzquierdo"
                                        name="ligamentoColateralExternoIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="ligamentoColateralExternoIzquierdo">3. Ligamento Colateral Externo
                                        Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="ligamentoTemporomandibularDerecho"
                                        name="ligamentoTemporomandibularDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="ligamentoTemporomandibularDerecho">4. Ligamento Temporomandibular
                                        Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="ligamentoTemporomandibularIzquierdo"
                                        name="ligamentoTemporomandibularIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="ligamentoTemporomandibularIzquierdo">4. Ligamento Temporomandibular
                                        Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialPosteroinferiorDerecho"
                                        name="sinovialPosteroinferiorDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialPosteroinferiorDerecho">5. Sinovial Posteroinferior
                                        Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialPosteroinferiorIzquierdo"
                                        name="sinovialPosteroinferiorIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialPosteroinferiorIzquierdo">5. Sinovial Posteroinferior
                                        Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialPosterosuperiorDerecho"
                                        name="sinovialPosterosuperiorDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialPosterosuperiorDerecho">6. Sinovial Posterosuperior
                                        Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="sinovialPosterosuperiorIzquierdo"
                                        name="sinovialPosterosuperiorIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="sinovialPosterosuperiorIzquierdo">6. Sinovial Posterosuperior
                                        Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="ligamentoPosteriorDerecho"
                                        name="ligamentoPosteriorDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="ligamentoPosteriorDerecho">7. Ligamento Posterior Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="ligamentoPosteriorIzquierdo"
                                        name="ligamentoPosteriorIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="ligamentoPosteriorIzquierdo">7. Ligamento Posterior Izquierdo</label>
                                </div>
                            </div>

                            <div class="input-group mb-3">
                                <div class="form-floating">
                                    <select class="form-select" id="zonaRetrodiscalDerecho"
                                        name="zonaRetrodiscalDerecho">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="zonaRetrodiscalDerecho">8. Zona Retrodiscal Derecho</label>
                                </div>
                                <div class="form-floating">
                                    <select class="form-select" id="zonaRetrodiscalIzquierdo"
                                        name="zonaRetrodiscalIzquierdo">
                                        <option value="Normal">Normal</option>
                                        <option value="Sensibilidad">Sensibilidad</option>
                                        <option value="Anterior">Anterior</option>
                                    </select>
                                    <label for="zonaRetrodiscalIzquierdo">8. Zona Retrodiscal Izquierdo</label>
                                </div>
                            </div>

                        </div>
                        <div class="wizard-step" data-step="3">
                            <div class="box-body row">
                                <div class="" style="width: 100%;">



                                    <div class="box-body">
                                        <style>
                                            table {
                                                width: 100%;
                                                background: white;
                                                margin-bottom: 1.25em;
                                                border: solid 1px #dddddd;
                                                border-collapse: collapse;
                                                border-spacing: 0;
                                            }

                                            table tr th,
                                            table tr td {
                                                padding: 0.5625em 0.625em;
                                                font-size: 0.875em;
                                                color: #222222;
                                                border: 1px solid #dddddd;
                                            }

                                            table tr.even,
                                            table tr.alt,
                                            table tr:nth-of-type(even) {
                                                background: #f9f9f9;
                                            }

                                            @media only screen and (max-width: 768px) {

                                                table.resp,
                                                .resp thead,
                                                .resp tbody,
                                                .resp tr,
                                                .resp th,
                                                .resp td,
                                                .resp caption {
                                                    display: block;
                                                }

                                                table.resp {
                                                    border: none
                                                }

                                                .resp thead tr {
                                                    display: none;
                                                }

                                                .resp tbody tr {
                                                    margin: 1em 0;
                                                    border: 1px solid #2ba6cb;
                                                }

                                                .resp td {
                                                    border: none;
                                                    border-bottom: 1px solid #dddddd;
                                                    position: relative;
                                                    padding-left: 45%;
                                                    text-align: left;
                                                }

                                                .resp tr td:last-child {
                                                    border-bottom: 1px double #dddddd;
                                                }

                                                .resp tr:last-child td:last-child {
                                                    border: none;
                                                }

                                                .resp td:before {
                                                    position: absolute;
                                                    top: 6px;
                                                    left: 6px;
                                                    width: 45%;
                                                    padding-right: 10px;
                                                    white-space: nowrap;
                                                    text-align: left;
                                                    font-weight: bold;
                                                }

                                                td:nth-of-type(1):before {
                                                    content: "Elementos";
                                                }
                                            }
                                        </style>

                                        <table class="resp">
                                            <thead>
                                                <tr>
                                                    <th scope="col"
                                                        style="text-align: center; background:#222222; color:#f9f9f9;">
                                                        <h3>Dientes</h3>
                                                    </th>
                                                    <th scope="col" colspan="6"
                                                        style="width: 20px; text-align: center; background:#222222; color:#f9f9f9;">
                                                        <b>
                                                            <h3>Maxilar</h3>
                                                        </b>
                                                    <th scope="col" colspan="4"
                                                        style="text-align: center; background:#222222; color:#f9f9f9;">
                                                        <h3>Mandíbula</h3>
                                                    </th>
                                                </tr>
                                                <tr>

                                                    <th scope="col" style="text-align: center;">
                                                        <h4> Elementos</h4>
                                                    </th>
                                                    <th scope="col" colspan="4" style="text-align: center;">
                                                        <h4>Discrepancia
                                                            Central</h4>
                                                    </th>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <b>O</b>
                                                        <input type="text" name="SI2" id="SI2" class="form-control"
                                                            value="0" step="any" onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                        </td>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <b>C</b>
                                                        <input type="text" name="BL1" id="BL1" class="form-control"
                                                            value="0" step="any" onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                        </td>
                                                    <th scope="col" colspan="2"></th>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <b>O</b>
                                                        <input type="text" name="BL2" id="BL2" class="form-control"
                                                            value="0" step="any" onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                        </td>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <b>C</b>
                                                        <input type="text" name="BL5" id="BL5" class="form-control"
                                                            value="0" step="any" onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                        </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td rowspan="7" style="text-align: center;">
                                                        I,IV
                                                    </td>
                                                    <td colspan="2">
                                                        <h4>AP</h4>
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="AP1" id="AP1"
                                                            class="form-control" value="0" step="any"
                                                            onchange="MULTI();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="AP2" id="AP2"
                                                            class="form-control" value="0" step="any"
                                                            onchange="MULTI();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="AP3" id="AP3"
                                                            class="form-control" value="0" step="0.01"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="AP4" id="AP4"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <script>
                                                        function MULTI() {
                                                            let m1;
                                                            let m2;
                                                            let r;
                                                            let r1;
                                                            m1 = document.getElementById("AP1").value;
                                                            m2 = document.getElementById("AP2").value;
                                                            r = m1 * 2;
                                                            r1 = m2 * 2;



                                                            document.getElementById("AP3").value = r;
                                                            document.getElementById("AP4").value = r1;

                                                        }
                                                    </script>
                                                    <td style="width: 20px;"> <input type="text" name="AP5" id="AP5"
                                                            class="form-control" value="0" step="0.01"
                                                            onchange="MULTI1();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="AP6" id="AP6"
                                                            class="form-control" value="0" step="any"
                                                            onchange="MULTI1();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="AP7" id="AP7"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="AP8" id="AP8"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                </tr>
                                                <script>
                                                    function MULTI1() {
                                                        let m1;
                                                        let m2;
                                                        let r;
                                                        let r1;
                                                        m1 = document.getElementById("AP5").value;
                                                        m2 = document.getElementById("AP6").value;
                                                        r = m1 * 2;
                                                        r1 = m2 * 2;



                                                        document.getElementById("AP7").value = r;
                                                        document.getElementById("AP8").value = r1;

                                                    }
                                                </script>
                                                <tr>
                                                    <td colspan="2">
                                                        <h4>SI</h4>
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="SI1" id="SI1"
                                                            class="form-control" step="any" value="0" onchange="CAL();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="SI3" id="SI3"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>

                                                    <td style="width: 20px;"> <input type="text" name="SI4" id="SI4"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <script type="text/javascript">
                                                        function CAL() {
                                                            let m1;
                                                            let r;

                                                            m1 = document.getElementById("SI1").value;

                                                            if (m1 == 2) {
                                                                r = -1;
                                                            } else if (m1 == 3) {
                                                                r = -2;
                                                            } else if (m1 == 4) {
                                                                r = -3;
                                                            } else if (m1 == 5) {
                                                                r = -5;
                                                            } else if (m1 == 6) {
                                                                r = -7;
                                                            } else {
                                                                r = 0;
                                                            }

                                                            document.getElementById("SI3").value = r;
                                                            document.getElementById("SI4").value = r;
                                                            console.log(r);
                                                        }
                                                    </script>
                                                    <td style="width: 20px;"><input type="text" name="SI5" id="SI5"
                                                            class="form-control" value="0" step="any" onchange="CAL1();"
                                                            size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="SI7" id="SI7"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="SI8" id="SI8"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                </tr>
                                                <script type="text/javascript">
                                                    function CAL1() {
                                                        let m1;
                                                        let r;

                                                        m1 = document.getElementById("SI5").value;

                                                        if (m1 == 2) {
                                                            r = -1;
                                                        } else if (m1 == 3) {
                                                            r = -2;
                                                        } else if (m1 == 4) {
                                                            r = -3;
                                                        } else if (m1 == 5) {
                                                            r = -5;
                                                        } else if (m1 == 6) {
                                                            r = -7;
                                                        } else {
                                                            r = 0;
                                                        }

                                                        document.getElementById("SI7").value = r;
                                                        document.getElementById("SI8").value = r;
                                                        console.log(r);
                                                    }
                                                </script>
                                                <tr>
                                                    <td colspan="2">
                                                        <h4>BL</h4>
                                                    </td>
                                                    <td style="width: 20px;"></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="BL3" id="BL3"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="BL4" id="BL4"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="BL7" id="BL7"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="BL8" id="BL8"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h4>SP</h4>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="SP3" id="SP3"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="SP4" id="SP4"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="SP7" id="SP7"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="SP8" id="SP8"
                                                            class="form-control" value="0" step="0.01"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" style="background: #0486FF; color: white">
                                                        <h4>BL (MAxilar)</h4>
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="BLM1" id="BLM1"
                                                            class="form-control" step="any" value="0"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="BLM2" id="BLM2"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h4>I</h4>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="IDis3" id="IDis3"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" name="IDis4" id="IDis4"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="IDis7" id="IDis7"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="IDis8" id="IDis8"
                                                            class="form-control" value="0" step="any"
                                                            onchange="TotaldeTodo();" size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h4>ICD</h4>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="number" class="form-control"
                                                            step="any" value="0" name="Total_T" id="Total_T"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"><input type="text" class="form-control"
                                                            value="0" step="any" name="Total_O" id="Total_O"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style="width: 20px;"><input type="text" name="Total_R"
                                                            id="Total_R" class="form-control" value="0" step="any"
                                                            size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                    <td style="width: 20px;"> <input type="text" name="Total_G"
                                                            id="Total_G" class="form-control" value="0" step="any"
                                                            size="40"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        <style type="text/css">
                                            table {
                                                width: 100%;
                                                background: white;
                                                margin-bottom: 1.25em;
                                                border: solid 1px #dddddd;
                                                border-collapse: collapse;
                                                border-spacing: 0;
                                            }

                                            table tr th,
                                            table tr td {
                                                padding: 0.5625em 0.625em;
                                                font-size: 0.875em;
                                                color: #222222;
                                                border: 1px solid #dddddd;
                                            }

                                            table tr.even,
                                            table tr.alt,
                                            table tr:nth-of-type(even) {
                                                background: #f9f9f9;
                                            }

                                            @media only screen and (max-width: 768px) {

                                                table.resp,
                                                .resp thead,
                                                .resp tbody,
                                                .resp tr,
                                                .resp th,
                                                .resp td,
                                                .resp caption {
                                                    display: block;
                                                }

                                                table.resp {
                                                    border: none
                                                }

                                                .resp thead tr {
                                                    display: none;
                                                }

                                                .resp tbody tr {
                                                    margin: 1em 0;
                                                    border: 1px solid #2ba6cb;
                                                }

                                                .resp td {
                                                    border: none;
                                                    border-bottom: 1px solid #dddddd;
                                                    position: relative;
                                                    padding-left: 45%;
                                                    text-align: left;
                                                }

                                                .resp tr td:last-child {
                                                    border-bottom: 1px double #dddddd;
                                                }

                                                .resp tr:last-child td:last-child {
                                                    border: none;
                                                }

                                                .resp td:before {
                                                    position: absolute;
                                                    top: 6px;
                                                    left: 6px;
                                                    width: 45%;
                                                    padding-right: 10px;
                                                    white-space: nowrap;
                                                    text-align: left;
                                                    font-weight: bold;
                                                }

                                                td:nth-of-type(1):before {
                                                    content: "Elementos";
                                                }
                                            }
                                        </style>
                                        <table class="resp">
                                            <thead>
                                                <tr>
                                                    <th scope="col"
                                                        style="width: 20px; text-align: center; background:#222222; color:#f9f9f9;">
                                                        <h4> Elemento II</h4>
                                                    </th>
                                                    <th scope="col" colspan="2"
                                                        style="width: 20px; text-align: center;">
                                                        <h4>AP</h4>
                                                    </th>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <h4>O</h4>
                                                        <input type="text" name="ELO1" id="ELO1" class="form-control"
                                                            value="0" step="any"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </th>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <h4>C</h4>
                                                        <input type="text" name="ELO2" id="ELO2" class="form-control"
                                                            value="0" step="any"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </th>
                                                    <th scope="col" colspan="2"
                                                        style="width: 20px; text-align: center;">
                                                        <h4>AP</h4>
                                                    </th>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <h4>O</h4>
                                                        <input type="text" name="ELO3" id="ELO3" class="form-control"
                                                            value="0" step="any"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </th>
                                                    <th scope="col" style="width: 20px; text-align: center;">
                                                        <h4>C</h4>
                                                        <input type="text" name="ELO4" id="ELO4" class="form-control"
                                                            value="0" step="any"
                                                            style="width: 70px;height: 34px;padding: 6px 12px;display: block;">
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="width: 20px; text-align: center; background:#222222; color:#f9f9f9;">
                                                        <h4> Elemento III</h4>
                                                    </td>
                                                    <td colspan="2"
                                                        style="width: 20px; text-align: center; background: #0486FF; color:#f9f9f9;">
                                                        <h4>BL</h4>
                                                    </td>
                                                    <td style="width: 20px; text-align: center;">
                                                        <input type="text" name="ElementoBL" id="ElementoBL"
                                                            class="form-control" value="0" step="any">
                                                    </td>
                                                    <td style="width: 20px; text-align: center;">
                                                        <input type="text" name="ELBL4" id="ELBL4" class="form-control"
                                                            value="0" step="any">
                                                    </td>
                                                    <td colspan="2"></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="width: 20px; text-align: center; background:#222222; color:#f9f9f9;">
                                                        <h4>Elemento IV</h4>
                                                    </td>
                                                    <td colspan="2" style="width: 20px; text-align: center;">
                                                        <h4>SI</h4>
                                                    </td>
                                                    <td><input type="text" name="ELOS1" id="ELOS1" class="form-control"
                                                            value="0" step="any"></td>
                                                    <td><input type="text" name="ELOS2" id="ELOS2" class="form-control"
                                                            value="0" step="any"></td>
                                                    <td colspan="2" style="width: 20px; text-align: center;">
                                                        <h4>SI</h4>
                                                    </td>
                                                    <td><input type="text" name="ELOS3" id="ELOS3" class="form-control"
                                                            value="0" step="any"></td>
                                                    <td><input type="text" name="ELOS4" id="ELOS4" class="form-control"
                                                            value="0" step="any"></td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="width: 20px; text-align: center; background:#222222; color:#f9f9f9;">
                                                        <h4>Elemento V</h4>
                                                    </td>
                                                    <td colspan="4"></td>
                                                    <td colspan="2" style="width: 20px; text-align: center;">
                                                        <h4>PO</h4>
                                                    </td>
                                                    <td><input type="text" name="ELPO1" id="ELPO1" class="form-control"
                                                            value="0" step="any"></td>
                                                    <td><input type="text" name="ELPO2" id="ELPO2" class="form-control"
                                                            value="0" step="any"></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div class="col-md-12">
                                            <table class="table table-responsive table-striped">

                                                <thead>
                                                    <tr>
                                                        <th style="background: #222222; color:#f9f9f9;">
                                                            <h4>Ancho Pre-Tratamiento</h4>
                                                        </th>
                                                        <th style="background: green; color:#f9f9f9;">
                                                            <h4>Ancho Elemento I</h4>
                                                        </th>
                                                        <th style="background: #222222; color:#f9f9f9;">
                                                            <h4>Ancho Pre-Tratamiento</h4>
                                                        </th>
                                                        <th style="background: #E00C0C; color:#f9f9f9;">
                                                            <h4>Ancho Elemento I</h4>
                                                        </th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>

                                                        <td>
                                                            <input type="number" name="LM6" id="LM6"
                                                                class="form-control inputgroup" id="nombrequeyoquiera2"
                                                                value="0" step="any">
                                                        </td>


                                                        <td>
                                                            <input type="number" name="LM7" id="LM7"
                                                                class="form-control inputgroup" id="nombrequeyoquiera2"
                                                                value="0" step="any" onchange="Elementos()">
                                                        </td>

                                                        <td>
                                                            <input type="number" name="LM8" id="LM8"
                                                                class="form-control inputgroup" id="nombrequeyoquiera2"
                                                                value="0" step="any">
                                                        </td>


                                                        <td>
                                                            <input type="number" name="LM5" id="LM5"
                                                                class="form-control inputgroup" id="nombrequeyoquiera2"
                                                                value="0" step="any" onchange="Elementos()">
                                                        </td>

                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary me-2" id="prevStep" type="button" disabled>Anterior</button>
                    <button class="btn btn-primary me-2" id="nextStep" type="button">Siguiente</button>
                    <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                        form="wizardForm">Finalizar</button>
                </div>
            </div>



            <div class="col-md-5 col-lg-5 col-xl-4">
                <div class="sticky-leads-sidebar">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
                        id="productFilterColumn">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle"
                                                src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="" /></div>
                                    </div>
                                    <div class="col-12 col-sm-auto flex-1">
                                        <h3 class="fw-bold mb-2">Miguel Angel Castro Franco</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Genero
                                    </div>
                                    <div>
                                        Masculino
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Edad
                                    </div>
                                    <div>
                                        21 Años
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Tipo de Sangre
                                    </div>
                                    <div>
                                        A Positivo
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Condicion Especial
                                    </div>
                                    <div>
                                        TDHA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Antecedentes
                                    </div>
                                    <div>
                                        TDHA, ASMA, HTA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Whatsapp
                                    </div>
                                    <div>
                                        +57350........
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12 col-lg-12 col-xl-12">
                <div>
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-6">
                                <div class="timer">
                                    Tiempo en consulta: <span id="timer">00:00:00</span>
                                </div>
                            </div>
                            <div class="col-3">
                                <a href="consultas?1" class="btn btn-danger" id="cancelBtn">Cancelar consulta</a>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-primary" id="finishBtn" type="button" data-bs-toggle="modal"
                                    data-bs-target="#finishModal">Terminar consulta</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>


<?php
include "../footer.php";
include "./modalTerminarConsulta.php";
?>

<script>
    function Elementos() {
        var m1;
        var m2;
        var r;
        var r1;

        // m1 = document.getElementById("LM7").value;
        // m2 = document.getElementById("LM5").value;
        m1 = parseInt(document.getElementById("LM7").value);
        m2 = parseInt(document.getElementById("LM5").value);

        if (m1 == m2) {
            r = 0;
            r1 = "G";
        } else if (m1 > m2) {
            r = m1 - m2;
            r1 = "R" + r;
        } else if (m1 < m2) {
            r = m2 - m1;
            r1 = "B" + r;
        } else {
            r = "G";
            r1 = "G";
        }

        document.getElementById("ElementoBL").value = r;
        document.getElementById("ElementoBL").value = r1;
        document.getElementById("BLM1").value = r;
        console.log(r);
        console.log(r1)
        return;
    }
</script>


<script>
    //Emma
    function TotaldeTodo() {
        //Primero Fila (O)
        let SI2 = Number(document.getElementById("SI2").value);
        let AP3 = Number(document.getElementById("AP3").value);
        let SI3 = Number(document.getElementById("SI3").value);
        let BL3 = Number(document.getElementById("BL3").value);
        let SP3 = Number(document.getElementById("SP3").value);
        let BLM1 = Number(document.getElementById("BLM1")
            .value);
        let IDis3 = Number(document.getElementById("IDis3")
            .value);
        //Segunda Fila (C)
        let BL1 = Number(document.getElementById("BL1").value);
        let AP4 = Number(document.getElementById("AP4").value);
        let SI4 = Number(document.getElementById("SI4").value);
        let BL4 = Number(document.getElementById("BL4").value);
        let SP4 = Number(document.getElementById("SP4").value);
        let BLM2 = Number(document.getElementById("BLM2")
            .value);
        let IDis4 = Number(document.getElementById("IDis4")
            .value);
        //Tercera Fila (O)
        let BL2 = Number(document.getElementById("BL2").value);
        let AP7 = Number(document.getElementById("AP7").value);
        let SI7 = Number(document.getElementById("SI7").value);
        let BL7 = Number(document.getElementById("BL7").value);
        let SP7 = Number(document.getElementById("SP7").value);
        let IDis7 = Number(document.getElementById("IDis7")
            .value);
        //Cuarta Fila (C)
        let BL5 = Number(document.getElementById("BL5").value);
        let AP8 = Number(document.getElementById("AP8").value);
        let SI8 = Number(document.getElementById("SI8").value);
        let BL8 = Number(document.getElementById("BL8").value);
        let SP8 = Number(document.getElementById("SP8").value);
        let IDis8 = Number(document.getElementById("IDis8")
            .value);
        //Primera Fila
        let resultadoTotal = SI2 + AP3 + SI3 + BL3 + SP3 +
            BLM1 + IDis3;
        document.getElementById("Total_T").value =
            resultadoTotal;
        // Segundo Fila
        let resultadoTotal_O = BL1 + AP4 + SI4 + BL4 + SP4 +
            BLM2 + IDis4;
        document.getElementById("Total_O").value =
            resultadoTotal_O;
        // Tercera Fila
        let resultadoTotal_R = BL2 + AP7 + SI7 + BL7 + SP7 +
            IDis7;
        document.getElementById("Total_R").value =
            resultadoTotal_R;
        // Cuarta Fila
        let resultadoTotal_G = BL5 + AP8 + SI8 + BL8 + SP8 +
            IDis8;
        document.getElementById("Total_G").value =
            resultadoTotal_G;
    }
</script>

<script>
    let currentStep = 1;

    const updateWizard = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Controlar los botones
        document.getElementById('prevStep').disabled = currentStep === 1;
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 3);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 3);
    };

    document.getElementById('nextStep').addEventListener('click', () => {
        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            currentStep++;
            updateWizard();
        }
    });

    document.getElementById('prevStep').addEventListener('click', () => {
        currentStep--;
        updateWizard();
    });

    document.getElementById('modalCrearPaciente').addEventListener('submit', function (event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            this.classList.add('was-validated');
        }
    });

    updateWizard();
</script>


<style>
    .profile-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ddd;
    }

    video {
        display: none;
        width: 100%;
        max-width: 300px;
        border-radius: 10px;
        border: 2px solid #ddd;
    }

    .steps-container {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .steps {
        list-style: none;
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
    }

    .step {
        text-align: center;
        position: relative;
        flex: 1;
    }

    .step-number {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        background-color: #e9ecef;
        color: #0d6efd;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .step.active .step-number {
        background-color: #0d6efd;
        color: #fff;
    }

    .wizard-step {
        display: none;
    }

    .wizard-step.active {
        display: block;
    }
</style>