<?php
$resumenPaciente = [
    'resumenGeneral' => "Paciente femenino de mediana edad, con cuadro clínico estable, bajo tratamiento por enfermedad cardiovascular crónica. Evolución favorable en los últimos controles.",

    'diagnosticos' => [
        "Angina de pecho estable",
        "Hipertensión arterial esencial",
        "Dislipidemia mixta"
    ],

    'antecedentes' => [
        "Hipertensión diagnosticada hace 8 años",
        "Exfumadora (último consumo hace 2 años)",
        "Antecedentes familiares de cardiopatía isquémica"
    ],

    'medicamentos' => [
        [
            'nombre' => "Aspirina",
            'dosis' => "100 mg",
            'frecuencia' => "1 vez al día"
        ],
        [
            'nombre' => "Atorvastatina",
            'dosis' => "20 mg",
            'frecuencia' => "1 vez al día"
        ],
        [
            'nombre' => "Metoprolol",
            'dosis' => "50 mg",
            'frecuencia' => "2 veces al día"
        ]
    ],

    'planManejo' => "Continuar con tratamiento actual. Control cardiológico trimestral, adherencia al tratamiento, dieta baja en grasas y ejercicio regular."
];
?>

<div class="resumen-paciente-container">
    <!-- Resumen General -->
    <div class="mb-4">
        <h4 class="fw-bold">Resumen general</h4>
        <p class="mb-0"><?= $resumenPaciente['resumenGeneral'] ?></p>
    </div>

    <!-- Diagnósticos -->
    <div class="mb-4">
        <h4 class="fw-bold">Diagnósticos</h4>
        <p class="mb-2">El paciente presenta los siguientes diagnósticos registrados:</p>
        <ul class="ps-3">
            <?php foreach ($resumenPaciente['diagnosticos'] as $diagnostico): ?>
            <li><?= $diagnostico ?></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <!-- Antecedentes -->
    <div class="mb-4">
        <h4 class="fw-bold">Antecedentes relevantes</h4>
        <p class="mb-2">En su historial médico se destacan:</p>
        <ul class="ps-3">
            <?php foreach ($resumenPaciente['antecedentes'] as $antecedente): ?>
            <li><?= $antecedente ?></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <!-- Medicamentos -->
    <div class="mb-4">
        <h4 class="fw-bold">Medicamentos</h4>
        <p class="mb-2">Al paciente se le han recetado los siguientes medicamentos:</p>
        <ul class="ps-3">
            <?php foreach ($resumenPaciente['medicamentos'] as $med): ?>
            <li><?= $med['nombre'] ?> (<?= $med['dosis'] ?>, <?= $med['frecuencia'] ?>)</li>
            <?php endforeach; ?>
        </ul>
    </div>

    <!-- Plan de manejo -->
    <div>
        <h4 class="fw-bold">Plan de seguimiento</h4>
        <p><?= $resumenPaciente['planManejo'] ?></p>
    </div>
</div>