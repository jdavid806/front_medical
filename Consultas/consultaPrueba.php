<?php
include "../menu.php";
include "../header.php";

$recetas = [
    ['id' => 1, 'nombre' => 'Ibuprofeno', 'presentacion' => 'Tabletas 200mg', 'dosis' => '2 veces al día', 'fecha' => '2024-11-20', 'descripcion' => 'Receta para dolor de cabeza'],
    ['id' => 2, 'nombre' => 'Paracetamol', 'presentacion' => 'Tabletas 500mg', 'dosis' => 'Cada 8 horas', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para fiebre'],
    ['id' => 3, 'nombre' => 'Amoxicilina', 'presentacion' => 'Cápsulas 500mg', 'dosis' => '3 veces al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para infección respiratoria'],
    ['id' => 4, 'nombre' => 'Metformina', 'presentacion' => 'Tabletas 850mg', 'dosis' => '1 vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para diabetes tipo 2'],
    ['id' => 5, 'nombre' => 'Loratadina', 'presentacion' => 'Tabletas 10mg', 'dosis' => 'Una vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para alergias'],
    ['id' => 6, 'nombre' => 'Omeprazol', 'presentacion' => 'Tabletas 20mg', 'dosis' => '1 vez al día antes de las comidas', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para acidez estomacal'],
    ['id' => 7, 'nombre' => 'Fluconazol', 'presentacion' => 'Cápsulas 150mg', 'dosis' => 'Una sola dosis', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para infección vaginal'],
];

$paraclinicos = [
    [
        'id' => 1,
        'tipo' => 'Hemograma',
        'fecha' => '2024-11-20',
        'comentarios' => 'Valores dentro de los rangos normales'
    ],
    [
        'id' => 2,
        'tipo' => 'Química sanguínea',
        'fecha' => '2024-11-25',
        'comentarios' => 'Valores dentro de los rangos normales'
    ],
    [
        'id' => 3,
        'tipo' => 'Examen de orina',
        'fecha' => '2024-11-25',
        'comentarios' => 'Sin hallazgos patológicos'
    ],
    [
        'id' => 4,
        'tipo' => 'Ecografía abdominal',
        'fecha' => '2024-11-26',
        'comentarios' => 'Estudio sin hallazgos patológicos'
    ],
    [
        'id' => 5,
        'tipo' => 'Radiografía de tórax',
        'fecha' => '2024-11-26',
        'comentarios' => 'Estudio sin hallazgos patológicos'
    ],
];

?>

<style type="text/css">
    .custom-btn {
        width: 150px;
        /* Establece el ancho fijo */
        height: 40px;
        /* Establece la altura fija */
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 5px;
        /* Espaciado opcional entre botones */
    }

    .custom-btn i {
        margin-right: 5px;
        /* Espaciado entre el ícono y el texto */
    }
</style>
<div class="content">
    <div class="">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
                <li class="breadcrumb-item"><a href="consultas?1">Consultas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Nueva Consulta</li>
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
                            <span class="step-label">Signos Vitales y Medidas</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Examen Físico</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Examen Físico</span>
                        </li>
                    </ul>
                </div>

                <form class="needs-validation">
                    <div class="wizard-step active" data-step="1">
                        <div class="row">
                            <div class="col-6 col-sm-6">
                                <div class="input-group mb-3">
                                    <div class="form-floating">
                                        <input type="number" class="form-control" min="0" id="temperatura"
                                            name="temperatura">
                                        <label for="temperatura" class="form-label">Temperatura corporal</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="number" class="form-control" min="0" id="saturacion"
                                            name="saturacion">
                                        <label for="saturacion" class="form-label">Saturación de oxigeno</label>
                                    </div>
                                </div>

                                <div class="input-group mb-3">
                                    <div class="form-floating">
                                        <input type="number" class="form-control" min="0" id="frecuenciaCardiaca"
                                            name="frecuenciaCardiaca">
                                        <label for="frecuenciaCardiaca" class="form-label">Frecuencia Cardiaca</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="number" class="form-control" min="0" id="frecuenciaRespiratoria"
                                            name="frecuenciaRespiratoria">
                                        <label for="frecuenciaRespiratoria" class="form-label">Frecuencia
                                            Respiratoria</label>
                                    </div>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="PAsistolica"
                                        name="PAsistolica">
                                    <label for="PAsistolica" class="form-label">Sistolica</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="PADiastolica"
                                        name="PADiastolica">
                                    <label for="PADiastolica" class="form-label">Diastólica</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="TAMedia" name="TAMedia">
                                    <label for="TAMedia" class="form-label">Tensión Arterial Media</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="pesoCorporal"
                                        name="pesoCorporal">
                                    <label for="pesoCorporal" class="form-label">Peso Corporal (KG)</label>
                                </div>


                            </div>
                            <div class="col-6 col-sm-6">
                                <div class="mb-2 form-floating">
                                    <input type="text" readonly class="form-control" min="0" id="imc" name="imc">
                                    <label for="imc" class="form-label">IMC</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" readonly class="form-control" min="0" id="composicionCorporal"
                                        name="composicionCorporal">
                                    <label for="composicionCorporal" class="form-label">Composición Corporal</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="circuferenciaAbdominal"
                                        name="circuferenciaAbdominal">
                                    <label for="circuferenciaAbdominal" class="form-label">Circunferencia
                                        Abdominal</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="perimetroCefalico"
                                        name="perimetroCefalico">
                                    <label for="perimetroCefalico" class="form-label">Perímetro Cefálico</label>
                                </div>

                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="porcertanjeGrasaCorporal"
                                        name="porcertanjeGrasaCorporal">
                                    <label for="porcertanjeGrasaCorporal" class="form-label">Porcentaje de Grasa
                                        Corporal</label>
                                </div>
                                <div class="mb-2 form-floating">
                                    <input type="number" class="form-control" min="0" id="altura" name="altura">
                                    <label for="altura" class="form-label">Altura (CM)</label>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="wizard-step" data-step="2">
                        <div class="row">
                            <div class="col-6 col-sm-6">
                                <!-- Cabeza -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoCabezaCheck">Cabeza</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoCabezaCheck"
                                            onchange="setupToggleSwitch('examenFisicoCabezaCheck', ['hallazgosCabeza']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosCabeza" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoCabeza"
                                                name="examenFisicoEstadoCabeza">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoCabeza" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoCabeza"
                                                name="examenFisicoCabeza" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoCabeza">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ojos -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoOjosCheck">Ojos</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoOjosCheck"
                                            onchange="setupToggleSwitch('examenFisicoOjosCheck', ['hallazgosOjos']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosOjos" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoOjos"
                                                name="examenFisicoEstadoOjos">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoOjos" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoOjos" name="examenFisicoOjos"
                                                style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoOjos">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Oídos -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoOidosCheck">Oídos</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoOidosCheck"
                                            onchange="setupToggleSwitch('examenFisicoOidosCheck', ['hallazgosOidos']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosOidos" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoOidos"
                                                name="examenFisicoEstadoOidos">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoOidos" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoOidos"
                                                name="examenFisicoOidos" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoOidos">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Nariz -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoNarizCheck">Nariz</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoNarizCheck"
                                            onchange="setupToggleSwitch('examenFisicoNarizCheck', ['hallazgosNariz']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosNariz" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoNariz"
                                                name="examenFisicoEstadoNariz">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoNariz" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoNariz"
                                                name="examenFisicoNariz" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoNariz">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Boca y Faringe -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoBocaFaringeCheck">Boca y
                                        Faringe</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoBocaFaringeCheck"
                                            onchange="setupToggleSwitch('examenFisicoBocaFaringeCheck', ['hallazgosBocaFaringe']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosBocaFaringe" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoBocaFaringe"
                                                name="examenFisicoEstadoBocaFaringe">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoBocaFaringe" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoBocaFaringe"
                                                name="examenFisicoBocaFaringe"
                                                style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoBocaFaringe">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Cuello -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoCuelloCheck">Cuello</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoCuelloCheck"
                                            onchange="setupToggleSwitch('examenFisicoCuelloCheck', ['hallazgosCuello']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosCuello" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoCuello"
                                                name="examenFisicoEstadoCuello">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoCuello" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoCuello"
                                                name="examenFisicoCuello" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoCuello">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tórax -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoToraxCheck">Tórax</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoToraxCheck"
                                            onchange="setupToggleSwitch('examenFisicoToraxCheck', ['hallazgosTorax']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosTorax" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoTorax"
                                                name="examenFisicoEstadoTorax">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoTorax" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoTorax"
                                                name="examenFisicoTorax" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoTorax">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Corazón -->


                            </div>
                            <div class="col-6">
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoCorazonCheck">Corazón</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoCorazonCheck"
                                            onchange="setupToggleSwitch('examenFisicoCorazonCheck', ['hallazgosCorazon']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosCorazon" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoCorazon"
                                                name="examenFisicoEstadoCorazon">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoCorazon" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoCorazon"
                                                name="examenFisicoCorazon" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoCorazon">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Abdomen -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoAbdomenCheck">Abdomen</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoAbdomenCheck"
                                            onchange="setupToggleSwitch('examenFisicoAbdomenCheck', ['hallazgosAbdomen']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosAbdomen" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoAbdomen"
                                                name="examenFisicoEstadoAbdomen">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoAbdomen" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoAbdomen"
                                                name="examenFisicoAbdomen" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoAbdomen">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Columna -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoColumnaCheck">Columna</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoColumnaCheck"
                                            onchange="setupToggleSwitch('examenFisicoColumnaCheck', ['hallazgosColumna']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosColumna" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoColumna"
                                                name="examenFisicoEstadoColumna">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoColumna" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoColumna"
                                                name="examenFisicoColumna" style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoColumna">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Extremidades Superiores -->
                                <div class="mb-2">
                                    <label class="form-check-label"
                                        for="examenFisicoExtremidadesSuperioresCheck">Extremidades
                                        Superiores</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoExtremidadesSuperioresCheck"
                                            onchange="setupToggleSwitch('examenFisicoExtremidadesSuperioresCheck', ['hallazgosExtremidadesSuperiores']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosExtremidadesSuperiores" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoExtremidadesSuperiores"
                                                name="examenFisicoEstadoExtremidadesSuperiores">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoExtremidadesSuperiores"
                                                class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoExtremidadesSuperiores"
                                                name="examenFisicoExtremidadesSuperiores"
                                                style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoExtremidadesSuperiores">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <label class="form-check-label"
                                        for="examenFisicoExtremidadesInferioresCheck">Extremidades
                                        Inferiores</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoExtremidadesInferioresCheck"
                                            onchange="setupToggleSwitch('examenFisicoExtremidadesInferioresCheck', ['hallazgosExtremidadesInferiores']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosExtremidadesInferiores" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoExtremidadesInferiores"
                                                name="examenFisicoEstadoExtremidadesInferiores">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoExtremidadesInferiores"
                                                class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoExtremidadesInferiores"
                                                name="examenFisicoExtremidadesInferiores"
                                                style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoExtremidadesInferiores">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Piel -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoPielCheck">Piel</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoPielCheck"
                                            onchange="setupToggleSwitch('examenFisicoPielCheck', ['hallazgosPiel']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosPiel" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoPiel"
                                                name="examenFisicoEstadoPiel">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoPiel" class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoPiel" name="examenFisicoPiel"
                                                style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoPiel">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sistema Neurológico -->
                                <div class="mb-2">
                                    <label class="form-check-label" for="examenFisicoSistemaNeurologicoCheck">Sistema
                                        Neurológico</label>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" id="examenFisicoSistemaNeurologicoCheck"
                                            onchange="setupToggleSwitch('examenFisicoSistemaNeurologicoCheck', ['hallazgosSistemaNeurologico']);"
                                            type="checkbox" />
                                    </div>
                                    <div id="hallazgosSistemaNeurologico" class="d-none">
                                        <div class="mb-2 form-floating">
                                            <select class="form-select" id="examenFisicoEstadoSistemaNeurologico"
                                                name="examenFisicoEstadoSistemaNeurologico">
                                                <option selected value="Normal">Normal</option>
                                                <option value="Anormal">Anormal</option>
                                            </select>
                                            <label for="examenFisicoEstadoSistemaNeurologico"
                                                class="form-label">Estado</label>
                                        </div>
                                        <div class="form-floating">
                                            <textarea class="form-control" id="examenFisicoSistemaNeurologico"
                                                name="examenFisicoSistemaNeurologico"
                                                style="height: 100px">No Aplica</textarea>
                                            <label for="examenFisicoSistemaNeurologico">Hallazgos</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Observaciones Generales -->
                            <div class="mb-2 col-12 mt-3">
                                <div class="form-floating">
                                    <textarea class="form-control" id="observacionesGenerales"
                                        name="observacionesGenerales" style="height: 100px"></textarea>
                                    <label for="observacionesGenerales">Observaciones Generales</label>
                                </div>
                                <button class="btn btn-primary mt-3 " type="button"
                                    onclick="enviarDatosAlWebhook()">generar resumen con IA</button>
                            </div>

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary me-2" id="prevStep" type="button" disabled>Anterior</button>
                        <button class="btn btn-primary me-2" id="nextStep" type="button">Siguiente</button>
                        <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                            form="wizardForm">Finalizar</button>
                    </div>
                </form>




                <form class="needs-validation">
                    <div class="tab-content mt-3" id="myTabContent">
                        <div class="tab-pane fade" id="prescripcionesTab" role="tabpanel"
                            aria-labelledby="prescripciones-tab">
                            <div class="d-flex justify-content-between gap-2">
                                <div class="col-md-3">
                                    <ul class="nav flex-column nav-underline fs-9" id="myTab" role="tablist">
                                        <li class="nav-item" role="presentation"><a class="nav-link active"
                                                id="examenes-tab" data-bs-toggle="tab" href="#examenesClinicosTab"
                                                role="tab" aria-controls="examenesClinicosTab"
                                                aria-selected="true"><span
                                                    class="text-primary uil uil-file-alt"></span>Exámenes
                                                clínicos</a></a></li>
                                        <li class="nav-item" role="presentation"><a class="nav-link"
                                                id="incapacidades-tab" data-bs-toggle="tab"
                                                href="#incapacidadesClinicasTab" role="tab"
                                                aria-controls="incapacidadesClinicasTab" aria-selected="false"
                                                tabindex="-1"><span
                                                    class="text-primary uil uil-wheelchair"></span>Incapacidades
                                                clínicas</a></a>
                                        </li>
                                        <li class="nav-item" role="presentation"><a class="nav-link" id="recetas-tab"
                                                data-bs-toggle="tab" href="#recetasTab" role="tab"
                                                aria-controls="recetasTab" aria-selected="false" tabindex="-1"><span
                                                    class="text-primary uil-clipboard"></span>Recetas médicas</a></a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-md-9 p-3">
                                    <div class="tab-content" id="myTabContent">
                                        <div class="tab-pane fade show active" id="examenesClinicosTab" role="tabpanel"
                                            aria-labelledby="examenes-tab">
                                            <h4>
                                                Exámenes clínicos
                                            </h4>
                                            <div class="mb-2 form-floating">
                                                <select class="form-select" id="examenesImageneologia"
                                                    name="examenesImageneologia">
                                                    <option selected disabled value="">Seleccione</option>
                                                    <option value="Artereografia">Artereografia</option>
                                                    <option value="Rayox x simple">Rayox X simple</option>
                                                    <option value="Rayos X Contratado">Rayos X Contratado</option>
                                                    <option value="Otro">Otro</option>
                                                </select>
                                                <label for="examenesImageneologia" class="form-label">Examen de
                                                    Imageneología</label>
                                            </div>
                                            <div class="mb-2 form-floating">
                                                <select class="form-select" id="examenesLaboratorio"
                                                    name="examenesLaboratorio">
                                                    <option selected disabled value="">Seleccione</option>
                                                    <option value="Hematologia">Hematologia</option>
                                                    <option value="Coombs Directo">Coombs Directo</option>
                                                    <option value="Coombs Indirecto">Coombs Indirecto</option>
                                                    <option value="Otro">Otro</option>
                                                </select>
                                                <label for="examenesLaboratorio" class="form-label">Examen de
                                                    laboratorio</label>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="incapacidadesClinicasTab" role="tabpanel"
                                            aria-labelledby="incapacidades-tab">
                                            <div class="row mb-3 align-items-end">
                                                <div class="col p-2">
                                                    <h4>Incapacidades clínicas</h4>
                                                </div>
                                                <div class="col p-2 text-end"><button class="btn btn-primary"
                                                        type="button" data-bs-toggle="modal"
                                                        data-bs-target="#modalCrearIncapacidad"> <span
                                                            class="fa-solid fa-plus me-2 fs-9"></span> Nueva
                                                        incapacidad</button></div>
                                            </div>
                                            <div>
                                                <div class="row">
                                                    <div class="col-md-6 mb-4">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <h5 class="card-title">Única</h5>
                                                                <h6 class="card-subtitle mb-2 text-muted">Estómago</h6>
                                                                <p class="card-text fs-9">31/06/2024 → 31/12/2024</p>
                                                                <p class="card-text fs-9">Se prescribe una incapacidad
                                                                    por su fuerte dolor de estómago.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-md-6 mb-4">
                                                        <div class="card h-100">
                                                            <div class="card-body">
                                                                <h5 class="card-title">Recurrente</h5>
                                                                <h6 class="card-subtitle mb-2 text-muted">Artrosis
                                                                    severa</h6>
                                                                <p class="card-text fs-9">11/07/2024 → 31/10/2024</p>
                                                                <p class="card-text fs-9">Debido a la artrosis que tiene
                                                                    el paciente se le incapacita.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="recetasTab" role="tabpanel"
                                            aria-labelledby="recetas-tab">
                                            <div class="row mb-3 align-items-end">
                                                <div class="col p-2">
                                                    <h4>Recetas médicas</h4>
                                                </div>
                                                <div class="col p-2 text-end"><button class="btn btn-primary"
                                                        type="button" data-bs-toggle="modal"
                                                        data-bs-target="#modalCrearReceta"> <span
                                                            class="fa-solid fa-plus me-2 fs-9"></span> Nuevo
                                                        Medicamento</button></div>
                                            </div>

                                            <div>
                                                <div class="d-flex align-items-center justify-content-end my-3">
                                                    <div class="ms-3" id="bulk-select-actions">
                                                        <div class="d-flex">
                                                            <button class="btn btn-phoenix-danger btn-sm ms-2 d-none"
                                                                type="button" id="apply-action">Eliminar</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div id="recetasGeneradas"
                                                    data-list='{"valueNames":["nombre","presentacion","dosis"],"page":5,"pagination":true}'>
                                                    <div class="table-responsive mx-n1 px-1">
                                                        <table
                                                            class="table table-sm border-top border-translucent fs-9 mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th class="white-space-nowrap fs-9 align-middle ps-0"
                                                                        style="max-width:20px; width:18px;">
                                                                        <div class="form-check mb-0 fs-8">
                                                                            <input class="form-check-input"
                                                                                id="bulk-select-example"
                                                                                type="checkbox">
                                                                        </div>
                                                                    </th>
                                                                    <th class="sort align-middle ps-3"
                                                                        data-sort="nombre">Nombre</th>
                                                                    <th class="sort align-middle"
                                                                        data-sort="presentacion">Presentación</th>
                                                                    <th class="sort align-middle" data-sort="dosis">
                                                                        Dosis</th>
                                                                    <th class="sort text-end align-middle pe-0"
                                                                        scope="col">Acciones</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="list" id="bulk-select-body">
                                                                <?php foreach ($recetas as $receta) { ?>
                                                                    <tr>
                                                                        <td class="fs-9 align-middle">
                                                                            <div class="form-check mb-0 fs-8">
                                                                                <input class="form-check-input"
                                                                                    type="checkbox">
                                                                            </div>
                                                                        </td>
                                                                        <td class="align-middle ps-3 nombre">
                                                                            <?= $receta['nombre'] ?></td>
                                                                        <td class="align-middle presentacion">
                                                                            <?= $receta['presentacion'] ?></td>
                                                                        <td class="align-middle dosis">
                                                                            <?= $receta['dosis'] ?></td>
                                                                        <td
                                                                            class="align-middle white-space-nowrap text-end pe-0">
                                                                            <div class="d-flex justify-content-around fs-9">
                                                                                <button class="btn text-primary p-0"
                                                                                    title="editar receta"
                                                                                    data-value="mostrar" type="button"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#editarRecetaModal">
                                                                                    <i class="fa fa-pencil-alt"></i>
                                                                                </button>
                                                                                <button class="btn text-primary p-0"
                                                                                    title="ver detalles de receta"
                                                                                    data-value="mostrar" type="button"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#modalDetalleReceta">
                                                                                    <i class="fa fa-eye"></i>
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                <?php } ?>

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="paraclinicosTab" role="tabpanel"
                            aria-labelledby="paraclinicos-tab">

                            <div class="row mb-3 align-items-end">
                                <div class="col p-2">
                                    <h4>Paraclínicos</h4>
                                </div>
                                <div class="col p-2 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal"
                                        data-bs-target="#modalAgregarParaclinico">
                                        <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar Paraclínico
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div class="d-flex align-items-center justify-content-end my-3">
                                </div>
                                <div id="paraclinicosGenerados"
                                    data-list='{"valueNames":["fechaHora","tipo"],"page":5,"pagination":true}'>
                                    <div class="table-responsive mx-n1 px-1">
                                        <table class="table table-sm border-top border-translucent fs-9 mb-0">
                                            <thead>
                                                <tr>
                                                    <th class="sort align-middle" data-sort="fechaHora">Fecha y Hora
                                                    </th>
                                                    <th class="sort align-middle" data-sort="tipo">Tipo</th>
                                                    <th class="sort align-middle" data-sort="comentarios">Comentarios
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="list">
                                                <?php foreach ($paraclinicos as $paraclinico) { ?>
                                                    <tr>
                                                        <td class="align-middle"><?= $paraclinico['fecha'] ?></td>
                                                        <td class="align-middle"><?= $paraclinico['tipo'] ?></td>
                                                        <td class="align-middle"><?= $paraclinico['comentarios'] ?></td>
                                                    </tr>
                                                <?php } ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

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


    <script>
        function enviarDatosAlWebhook() {
            // Capturar los valores del formulario
            const profesionalMedico = "Jeferson Davila"; // Puedes cambiar esto si es dinámico

            const examenFisico = {
                cabeza: {
                    estado: document.getElementById("examenFisicoEstadoCabeza").value,
                    hallazgos: document.getElementById("examenFisicoCabeza").value,
                },
                ojos: {
                    estado: document.getElementById("examenFisicoEstadoOjos").value,
                    hallazgos: document.getElementById("examenFisicoOjos").value,
                },
                oídos: {
                    estado: document.getElementById("examenFisicoEstadoOidos").value,
                    hallazgos: document.getElementById("examenFisicoOidos").value,
                },
                nariz: {
                    estado: document.getElementById("examenFisicoEstadoNariz").value,
                    hallazgos: document.getElementById("examenFisicoNariz").value,
                },
                boca_y_faringe: {
                    estado: document.getElementById("examenFisicoEstadoBocaFaringe").value,
                    hallazgos: document.getElementById("examenFisicoBocaFaringe").value,
                },
                cuello: {
                    estado: document.getElementById("examenFisicoEstadoCuello").value,
                    hallazgos: document.getElementById("examenFisicoCuello").value,
                },
                torax: {
                    estado: document.getElementById("examenFisicoEstadoTorax").value,
                    hallazgos: document.getElementById("examenFisicoTorax").value,
                },
                corazon: {
                    estado: document.getElementById("examenFisicoEstadoCorazon").value,
                    hallazgos: document.getElementById("examenFisicoCorazon").value,
                },
                abdomen: {
                    estado: document.getElementById("examenFisicoEstadoAbdomen").value,
                    hallazgos: document.getElementById("examenFisicoAbdomen").value,
                },
                columna: {
                    estado: document.getElementById("examenFisicoEstadoColumna").value,
                    hallazgos: document.getElementById("examenFisicoColumna").value,
                },
                extremidades_superiores: {
                    estado: document.getElementById("examenFisicoEstadoExtremidadesSuperiores").value,
                    hallazgos: document.getElementById("examenFisicoExtremidadesSuperiores").value,
                },
                extremidades_inferiores: {
                    estado: document.getElementById("examenFisicoEstadoExtremidadesInferiores").value,
                    hallazgos: document.getElementById("examenFisicoExtremidadesInferiores").value,
                },
                piel: {
                    estado: document.getElementById("examenFisicoEstadoPiel").value,
                    hallazgos: document.getElementById("examenFisicoPiel").value,
                },
                sistema_neurologico: {
                    estado: document.getElementById("examenFisicoEstadoSistemaNeurologico").value,
                    hallazgos: document.getElementById("examenFisicoSistemaNeurologico").value,
                },
            };

            const observacionesGenerales = {
                resumen: document.getElementById("observacionesGenerales").value,
            };

            // Construir el objeto JSON
            const datos = {
                profesional_medico: profesionalMedico,
                examenFisico: examenFisico,
                observaciones_generales: observacionesGenerales,
            };

            // Enviar los datos al webhook
            fetch("https://hooks.medicalsoft.ai/webhook/examenfisico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                
                },
                body: JSON.stringify(datos),
                mode: "cors",
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Respuesta del webhook:", data);

                    const campoObservaciones = document.getElementById("observacionesGenerales");
                    campoObservaciones.value = data.resumen || "No se recibió un resumen válido.";

                    alert("Resumen generado con IA y actualizado correctamente.");
                })
                .catch((error) => {
                    console.error("Error al enviar los datos:", error);
                    alert("Hubo un error al generar el resumen con IA.");
                });
        }
    </script>




    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const timerElement = document.getElementById('timer');
            const finishBtn = document.getElementById('finishBtn');
            const modalTimer = document.getElementById('modalTimer');

            let startTime = new Date();

            function updateTimer() {
                const now = new Date();
                const elapsedTime = now - startTime;
                const hours = Math.floor(elapsedTime / 3600000);
                const minutes = Math.floor((elapsedTime % 3600000) / 60000);
                const seconds = Math.floor((elapsedTime % 60000) / 1000);
                timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            setInterval(updateTimer, 1000);

            finishBtn.addEventListener('click', () => {
                if (modalTimer) {
                    modalTimer.value = timerElement.textContent; // Asignar valor al modal
                } else {
                    console.log('Error al buscar el temporizador del modal.');
                }
            });
        });

    </script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const deleteButton = document.getElementById('apply-action'); // Botón "Eliminar"
            const checkboxes = document.querySelectorAll('#bulk-select-body .form-check-input'); // Todos los checkboxes de las filas
            const bulkSelect = document.getElementById('bulk-select-example'); // Checkbox general para seleccionar todos

            // Habilitar/deshabilitar botón "Eliminar" según selección
            const toggleDeleteButton = () => {
                const selectedCheckboxes = document.querySelectorAll('#bulk-select-body .form-check-input:checked');
                deleteButton.classList.toggle('d-none', selectedCheckboxes.length === 0);
            };

            // Seleccionar/deseleccionar todos los checkboxes
            bulkSelect.addEventListener('change', () => {
                const isChecked = bulkSelect.checked;
                checkboxes.forEach(checkbox => checkbox.checked = isChecked);
                toggleDeleteButton();
            });

            // Verificar cambios en cada checkbox
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', toggleDeleteButton);
            });

            // Eliminar filas seleccionadas
            deleteButton.addEventListener('click', () => {
                const selectedCheckboxes = document.querySelectorAll('#bulk-select-body .form-check-input:checked');
                const idsToDelete = [];

                selectedCheckboxes.forEach(checkbox => {
                    idsToDelete.push(checkbox.dataset.id); // Obtener el ID del medicamento
                    const row = checkbox.closest('tr'); // Fila correspondiente
                    row.remove(); // Eliminar fila de la tabla
                });

                console.log('IDs eliminados:', idsToDelete); // Mostrar IDs en la consola

                // Reiniciar el checkbox general y botón
                bulkSelect.checked = false;
                toggleDeleteButton();
            });
        });
    </script>


    <?php include "../footer.php";
    include "../Incapacidades/modalIncapacidad.php";
    include "../Recetas/modalReceta.php";
    include "../Paraclinicos/modalParaclinico.php";
    include "./modalTerminarConsulta.php";
    ?>

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