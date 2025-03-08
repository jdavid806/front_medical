<?php

// JSON embebido como cadena en el archivo PHP
$json = '[
    {
        "query": {
            "secuencia_entrevista": {
                "datos_personales": {
                    "nombres_completos": "Jeferson David Dávila Valencia",
                    "fecha_nacimiento": "23 de septiembre 1994",
                    "identificacion": "1019100468",
                    "direccion": "calle 123",
                    "ciudad": "bogota",
                    "estado_civil": "soltero",
                    "ocupacion": "desarrollador",
                    "correo": "jeffersondavila1101@gmail.com"
                },
                "motivo_consulta": {
                    "sintomas": "dolor de cabeza, estres, falta de sueño",
                    "tiempo_evolucion": "hace 1 semana"
                },
                "antecedentes": {
                    "condiciones_medicas": "no",
                    "medicamentos": "no",
                    "cirugias": "no",
                    "alergias": "no"
                },
                "secuencia_habitos": {
                    "alcohol": "Ocasionalmente",
                    "tabaco": "diariamente",
                    "otras_sustancias": "no"
                },
                "antecedentes_familiares": "no",
                "sintomas_actuales": {
                    "mareos": "no",
                    "sudoracion": "no",
                    "cambios_fisiologicos": "no",
                    "peso": "no",
                    "contacto_enfermos": "no",
                    "energia": "3",
                    "automedicacion": "no he tomado nada",
                    "respiracion": "no",
                    "vomito": "no"
                }
            },
            "analisis_medico": {
                "banderas_validacion": {
                    "datos_completos": true,
                    "sintomas_urgentes": false,
                    "requiere_atencion_inmediata": false
                },
                "diagnostico": {
                    "principal": "Cefalea tensional asociada a estrés y trastorno del sueño",
                    "diferenciales": [
                        "Síndrome de burnout",
                        "Trastorno de ansiedad",
                        "Migraña"
                    ],
                    "justificacion": "El paciente presenta un cuadro de cefalea asociado a estrés y alteraciones del sueño de una semana de evolución. Los síntomas son consistentes con cefalea tensional, potenciado por el estrés laboral y hábitos como el tabaquismo diario. El nivel de energía reportado como 3/10 sugiere fatiga significativa."
                },
                "plan_manejo": {
                    "examenes": [
                        {
                            "nombre": "Hemograma completo",
                            "justificacion": "Descartar alteraciones sistémicas",
                            "prioridad": "media"
                        },
                        {
                            "nombre": "TSH",
                            "justificacion": "Evaluar función tiroidea que pueda relacionarse con alteraciones del sueño",
                            "prioridad": "media"
                        }
                    ],
                    "medicamentos": [
                        {
                            "Medicamento": "Acetaminofén",
                            "Presentacion": "Tabletas 500mg",
                            "Posologia": "1 tableta cada 8 horas si hay dolor",
                            "Cantidad": "15 tabletas"
                        }
                    ],
                    "recomendaciones": {
                        "cuidados_generales": [
                            "Establecer horarios regulares de sueño",
                            "Realizar pausas activas durante la jornada laboral",
                            "Reducir gradualmente el consumo de tabaco",
                            "Practicar técnicas de relajación",
                            "Mantener una adecuada hidratación",
                            "Evitar el uso de pantallas 1 hora antes de dormir"
                        ],
                        "signos_alarma": [
                            "Dolor de cabeza severo o súbito",
                            "Alteraciones en la visión",
                            "Mareos intensos",
                            "Dificultad para hablar o caminar"
                        ]
                    },
                    "incapacidad": {
                        "dias": 0,
                        "justificacion": "No se considera necesaria la incapacidad en este momento"
                    },
                    "seguimiento": {
                        "tiempo": "15 días",
                        "tipo": "Control presencial",
                        "indicaciones": "Evaluar evolución de síntomas y respuesta al tratamiento"
                    },
                    "resumen_chat": {
                        "hora_inicio": "2025-01-27T19:52:57.370-05:00",
                        "hora_final": "2025-01-27T19:52:57.370-05:00",
                        "resumen_respuestas_pasciente": "Paciente masculino de 29 años, desarrollador, con cuadro de cefalea, estrés y alteraciones del sueño de una semana de evolución. Sin antecedentes médicos relevantes. Fumador diario, consumo ocasional de alcohol. Nivel de energía 3/10. No presenta síntomas de alarma."
                    }
                }
            }
        }
    }
]';

// Decodificar el JSON
$data = json_decode($json, true);  // Con 'true' conviertes el JSON a un array asociativo

// Verificar si la decodificación fue exitosa
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error al decodificar el JSON: " . json_last_error_msg() . "\n");
}

// Recorrer los datos decodificados
foreach ($data as $item) {
    // Acceder a los datos personales
    $datos_personales = $item['query']['secuencia_entrevista']['datos_personales'];
    $nombres = $datos_personales['nombres_completos'];
    $fecha_nacimiento = $datos_personales['fecha_nacimiento'];
    $identificacion = $datos_personales['identificacion'];
    $direccion = $datos_personales['direccion'];
    $ciudad = $datos_personales['ciudad'];
    $estado_civil = $datos_personales['estado_civil'];
    $ocupacion = $datos_personales['ocupacion'];
    $correo = $datos_personales['correo'];

    // Motivo de consulta
    $motivo_consulta = $item['query']['secuencia_entrevista']['motivo_consulta'];
    $sintomas = $motivo_consulta['sintomas'];
    $tiempo_evolucion = $motivo_consulta['tiempo_evolucion'];

    // Antecedentes
    $antecedentes = $item['query']['secuencia_entrevista']['antecedentes'];
    $condiciones_medicas = $antecedentes['condiciones_medicas'];
    $medicamentos = $antecedentes['medicamentos'];
    $cirugias = $antecedentes['cirugias'];
    $alergias = $antecedentes['alergias'];

    // Secuencia de hábitos
    $secuencia_habitos = $item['query']['secuencia_entrevista']['secuencia_habitos'];
    $alcohol = $secuencia_habitos['alcohol'];
    $tabaco = $secuencia_habitos['tabaco'];
    $otras_sustancias = $secuencia_habitos['otras_sustancias'];

    // Antecedentes familiares
    $antecedentes_familiares = $item['query']['secuencia_entrevista']['antecedentes_familiares'];

    // Síntomas actuales
    $sintomas_actuales = $item['query']['secuencia_entrevista']['sintomas_actuales'];
    $mareos = $sintomas_actuales['mareos'];
    $sudoracion = $sintomas_actuales['sudoracion'];
    $cambios_fisiologicos = $sintomas_actuales['cambios_fisiologicos'];
    $peso = $sintomas_actuales['peso'];
    $contacto_enfermos = $sintomas_actuales['contacto_enfermos'];
    $energia = $sintomas_actuales['energia'];
    $automedicacion = $sintomas_actuales['automedicacion'];
    $respiracion = $sintomas_actuales['respiracion'];
    $vomito = $sintomas_actuales['vomito'];

    // Análisis médico
    $analisis_medico = $item['query']['analisis_medico'];
    $banderas_validacion = $analisis_medico['banderas_validacion'];

    $diagnostico_principal = $item['query']['analisis_medico']['diagnostico']['principal'];
    $diferenciales = $item['query']['analisis_medico']['diagnostico']['diferenciales'];
    $justificacion_diagnostico = $item['query']['analisis_medico']['diagnostico']['justificacion'];

    $examenes = $item['query']['analisis_medico']['plan_manejo']['examenes'];
    $medicamentos = $item['query']['analisis_medico']['plan_manejo']['medicamentos'];
    $recomendaciones = $item['query']['analisis_medico']['plan_manejo']['recomendaciones']['cuidados_generales'];
    $cuidados_generales = $recomendaciones['cuidados_generales'];
    $signos_alarma = $recomendaciones['signos_alarma'];

    $incapacidad = $item['query']['analisis_medico']['plan_manejo']['incapacidad']['dias'];
    $seguimiento = $item['query']['analisis_medico']['plan_manejo']['seguimiento'];

    $dias_incapacidad = $incapacidad['dias'];
    $justificacion_incapacidad = $incapacidad['justificacion'];

    $tiempo_seguimiento = $seguimiento['tiempo'];
    $tipo_seguimiento = $seguimiento['tipo'];
    $indicaciones_seguimiento = $seguimiento['indicaciones'];

}

foreach ($examenes as $examen) {
    $nombre_examen = $examen['nombre'];
    $justificacion_examen = $examen['justificacion'];
    $prioridad_examen = $examen['prioridad'];

   
}


?>