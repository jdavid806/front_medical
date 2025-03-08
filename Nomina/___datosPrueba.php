<?php
$trabajadores = [
    [
        'nombre' => 'Juan',
        'apellido' => 'Pérez',
        'cargo' => 'Desarrollador Frontend',
        'salario' => 45000,
        'edad' => 29,
        'email' => 'juan.perez@empresa.com',
        'telefono' => '+52 555 123 4567',
        'fecha_nacimiento' => '1994-03-15',
        'numero_documento' => 'MX123456789',
        "isActive" => ((rand(0, 1) == 1) ? true : false),
        "fechaAfiliacionEPS" => "2020-01-01",
        "idBanco" => 1,
        "tipoMetodoPago" => 1,
        "tipoCuenta" => 1,
        "cajaCompensacion" => 1,
        "arl" => 1,
        "fondoPensiones" => 1
    ],
    [
        'nombre' => 'María',
        'apellido' => 'Gómez',
        'cargo' => 'Desarrolladora Backend',
        'salario' => 48000,
        'edad' => 32,
        'email' => 'maria.gomez@empresa.com',
        'telefono' => '+57 301 987 6543',
        'fecha_nacimiento' => '1991-07-22',
        'numero_documento' => 'CO987654321',
        "isActive" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'nombre' => 'Carlos',
        'apellido' => 'López',
        'cargo' => 'DevOps Engineer',
        'salario' => 50000,
        'edad' => 35,
        'email' => 'carlos.lopez@empresa.com',
        'telefono' => '+34 91 876 5432',
        'fecha_nacimiento' => '1988-01-10',
        'numero_documento' => 'ES123987456',
        "isActive" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'nombre' => 'Lucía',
        'apellido' => 'Martínez',
        'cargo' => 'Diseñadora UX/UI',
        'salario' => 42000,
        'edad' => 28,
        'email' => 'lucia.martinez@empresa.com',
        'telefono' => '+44 20 1234 5678',
        'fecha_nacimiento' => '1995-06-05',
        'numero_documento' => 'UK456123789',
        "isActive" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'nombre' => 'Miguel',
        'apellido' => 'Sánchez',
        'cargo' => 'Desarrollador Full Stack',
        'salario' => 47000,
        'edad' => 30,
        'email' => 'miguel.sanchez@empresa.com',
        'telefono' => '+54 11 4321 8765',
        'fecha_nacimiento' => '1993-11-18',
        'numero_documento' => 'AR654321987',
        "isActive" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'nombre' => 'Ana',
        'apellido' => 'Hernández',
        'cargo' => 'Project Manager',
        'salario' => 60000,
        'edad' => 40,
        'email' => 'ana.hernandez@empresa.com',
        'telefono' => '+52 555 987 6543',
        'fecha_nacimiento' => '1983-02-27',
        'numero_documento' => 'MX321654987',
        "isActive" => ((rand(0, 1) == 1) ? true : false)
    ]
];


// ?  DATOS SIMULADOS DE NOMINA
$datosNomina = [
    [ // Juan Peréz
        [
            'id' => 1,
            'nombre' => 'Juan Peréz',
            'cargo' => 'Desarrollador Front-End',
            'salario_base' => 3500000,
            'deducciones' => [
                'salud' => 280000,
                'pension' => 280000,
                'fondo_solidaridad' => 0,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 500000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-01-03',
                    'hora' => '',
                    'motivo' => 'Inasistencia',
                    'detalle' => 'Enfermedad',
                    'valor_descuento' => 50000
                ],
                [
                    'fecha' => '2024-01-10',
                    'hora' => '08:15',
                    'motivo' => 'Retardo',
                    'detalle' => '15 minutos tarde',
                    'valor_descuento' => 15000
                ]
            ],
            'salario_neto' => 3535606,
            'fecha_pago' => '2024-01-15'
        ],
        [
            'id' => 2,
            'nombre' => 'Juan Peréz',
            'cargo' => 'Desarrollador Front-End',
            'salario_base' => 4500000,
            'deducciones' => [
                'salud' => 360000,
                'pension' => 360000,
                'fondo_solidaridad' => 225000,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 600000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-02-05',
                    'hora' => '',
                    'motivo' => 'Inasistencia',
                    'detalle' => 'Falta injustificada',
                    'valor_descuento' => 50000
                ],
                [
                    'fecha' => '2024-02-10',
                    'hora' => '08:10',
                    'motivo' => 'Retardo',
                    'detalle' => '10 minutos tarde',
                    'valor_descuento' => 10000
                ]
            ],
            'salario_neto' => 4211606,
            'fecha_pago' => '2024-02-15'
        ]
    ],
    [ // María Gómez
        [
            'id' => 4,
            'nombre' => 'María Gómez',
            'cargo' => 'Desarrolladora Backend',
            'salario_base' => 4000000,
            'deducciones' => [
                'salud' => 320000,
                'pension' => 320000,
                'fondo_solidaridad' => 0,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 400000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-01-04',
                    'hora' => '',
                    'motivo' => 'Inasistencia',
                    'detalle' => 'Enfermedad',
                    'valor_descuento' => 30000
                ],
                [
                    'fecha' => '2024-01-07',
                    'hora' => '08:05',
                    'motivo' => 'Retardo',
                    'detalle' => '5 minutos tarde',
                    'valor_descuento' => 5000
                ],
                [
                    'fecha' => '2024-01-09',
                    'hora' => '08:12',
                    'motivo' => 'Retardo',
                    'detalle' => '12 minutos tarde',
                    'valor_descuento' => 10000
                ]
            ],
            'salario_neto' => 3880606,
            'fecha_pago' => '2024-01-15'
        ],
        [
            'id' => 5,
            'nombre' => 'María Gómez',
            'cargo' => 'Desarrolladora Backend',
            'salario_base' => 4500000,
            'deducciones' => [
                'salud' => 360000,
                'pension' => 360000,
                'fondo_solidaridad' => 225000,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 500000
            ],
            'descuentos' => [],
            'salario_neto' => 4266606,
            'fecha_pago' => '2024-02-15'
        ]
    ],
    [ // Carlos López
        [
            'id' => 6,
            'nombre' => 'Carlos López',
            'cargo' => 'DevOps Engineer',
            'salario_base' => 4800000,
            'deducciones' => [
                'salud' => 384000,
                'pension' => 384000,
                'fondo_solidaridad' => 0,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 600000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-01-30',
                    'hora' => '08:20',
                    'motivo' => 'Retardo',
                    'detalle' => '20 minutos tarde',
                    'valor_descuento' => 20000
                ]
            ],
            'salario_neto' => 4540606,
            'fecha_pago' => '2024-01-30'
        ],
        [
            'id' => 7,
            'nombre' => 'Carlos López',
            'cargo' => 'DevOps Engineer',
            'salario_base' => 5500000,
            'deducciones' => [
                'salud' => 440000,
                'pension' => 440000,
                'fondo_solidaridad' => 275000,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 800000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-02-12',
                    'hora' => '',
                    'motivo' => 'Inasistencia',
                    'detalle' => 'Falta injustificada',
                    'valor_descuento' => 10000
                ],
                [
                    'fecha' => '2024-02-18',
                    'hora' => '08:05',
                    'motivo' => 'Retardo',
                    'detalle' => '5 minutos tarde',
                    'valor_descuento' => 5000
                ]
            ],
            'salario_neto' => 4949606,
            'fecha_pago' => '2024-02-28'
        ]
    ],
    [ // Lucía Martínez
        [
            'id' => 8,
            'nombre' => 'Lucía Martínez',
            'cargo' => 'Diseñadora UX/UI',
            'salario_base' => 3200000,
            'deducciones' => [
                'salud' => 256000,
                'pension' => 256000,
                'fondo_solidaridad' => 0,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 350000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-01-20',
                    'hora' => '08:15',
                    'motivo' => 'Retardo',
                    'detalle' => '15 minutos tarde',
                    'valor_descuento' => 15000
                ]
            ],
            'salario_neto' => 3515606,
            'fecha_pago' => '2024-01-20'
        ],
        [
            'id' => 9,
            'nombre' => 'Lucía Martínez',
            'cargo' => 'Diseñadora UX/UI',
            'salario_base' => 3700000,
            'deducciones' => [
                'salud' => 296000,
                'pension' => 296000,
                'fondo_solidaridad' => 0,
            ],
            'bonificaciones' => [
                'auxilio_transporte' => 140606,
                'bono_productividad' => 400000
            ],
            'descuentos' => [
                [
                    'fecha' => '2024-02-10',
                    'hora' => '',
                    'motivo' => 'Inasistencia',
                    'detalle' => 'Cita médica',
                    'valor_descuento' => 20000
                ],
                [
                    'fecha' => '2024-02-15',
                    'hora' => '08:05',
                    'motivo' => 'Retardo',
                    'detalle' => '5 minutos tarde',
                    'valor_descuento' => 5000
                ]
            ],
            'salario_neto' => 3880606,
            'fecha_pago' => '2024-02-20'
        ]
    ]
];

$datosRetardos = [
    [
        'fecha' => '2024-01-03',
        'hora' => '08:10',
        'minutos_retardo' => 10,
        'valor_descuento' => 10000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-01-05',
        'hora' => '08:25',
        'minutos_retardo' => 25,
        'valor_descuento' => 25000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-01-10',
        'hora' => '08:05',
        'minutos_retardo' => 5,
        'valor_descuento' => 5000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-01-15',
        'hora' => '08:18',
        'minutos_retardo' => 18,
        'valor_descuento' => 18000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-01-20',
        'hora' => '08:12',
        'minutos_retardo' => 12,
        'valor_descuento' => 12000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-02-02',
        'hora' => '08:30',
        'minutos_retardo' => 30,
        'valor_descuento' => 30000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-02-05',
        'hora' => '08:08',
        'minutos_retardo' => 8,
        'valor_descuento' => 8000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-02-10',
        'hora' => '08:16',
        'minutos_retardo' => 16,
        'valor_descuento' => 16000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-02-15',
        'hora' => '08:07',
        'minutos_retardo' => 7,
        'valor_descuento' => 7000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ],
    [
        'fecha' => '2024-02-20',
        'hora' => '08:22',
        'minutos_retardo' => 22,
        'valor_descuento' => 22000,
        "cobrado" => ((rand(0, 1) == 1) ? true : false)
    ]
];

$datosInasistencias = [
    [
        'fecha' => '2024-01-03',
        'motivo' => 'Enfermedad',
        'valor_descuento' => 50000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-01-10',
        'motivo' => 'Cita médica',
        'valor_descuento' => 30000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-01-15',
        'motivo' => 'Falta injustificada',
        'valor_descuento' => 70000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-01-25',
        'motivo' => 'Día personal',
        'valor_descuento' => 0,
        'descontado' => false
    ],
    [
        'fecha' => '2024-02-05',
        'motivo' => 'Permiso especial',
        'valor_descuento' => 0,
        'descontado' => false
    ],
    [
        'fecha' => '2024-02-10',
        'motivo' => 'Falta injustificada',
        'valor_descuento' => 60000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-02-15',
        'motivo' => 'Enfermedad',
        'valor_descuento' => 40000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-02-20',
        'motivo' => 'Falta injustificada',
        'valor_descuento' => 80000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-02-25',
        'motivo' => 'Permiso sin goce de sueldo',
        'valor_descuento' => 30000,
        'descontado' => true
    ],
    [
        'fecha' => '2024-03-01',
        'motivo' => 'Enfermedad',
        'valor_descuento' => 0,
        'descontado' => false
    ]
];

$datosVacaciones = [
    [
        'fecha_inicio' => '2024-01-10',
        'dias_solicitados' => 5,
        'fecha_fin' => '2024-01-14',
        'dias_disponibles' => 10,
        'tipo_vacaciones' => 'Regulares',
        'comentarios' => 'Vacaciones anuales regulares'
    ],
    [
        'fecha_inicio' => '2024-02-15',
        'dias_solicitados' => 3,
        'fecha_fin' => '2024-02-17',
        'dias_disponibles' => 7,
        'tipo_vacaciones' => 'Fraccionadas',
        'comentarios' => 'Vacaciones fraccionadas por eventos familiares'
    ],
    [
        'fecha_inicio' => '2024-03-01',
        'dias_solicitados' => 10,
        'fecha_fin' => '2024-03-10',
        'dias_disponibles' => 15,
        'tipo_vacaciones' => 'Extraordinarias',
        'comentarios' => 'Vacaciones por motivos especiales'
    ],
    [
        'fecha_inicio' => '2024-04-20',
        'dias_solicitados' => 7,
        'fecha_fin' => '2024-04-26',
        'dias_disponibles' => 8,
        'tipo_vacaciones' => 'Regulares',
        'comentarios' => 'Vacaciones regulares pendientes del año anterior'
    ],
    [
        'fecha_inicio' => '2024-05-05',
        'dias_solicitados' => 4,
        'fecha_fin' => '2024-05-08',
        'dias_disponibles' => 5,
        'tipo_vacaciones' => 'Fraccionadas',
        'comentarios' => 'Vacaciones fraccionadas solicitadas por reuniones familiares'
    ]
];


$dataRecargos = [
    [
        'pagado' => true,
        'fecha' => '2024-01-15',
        'motivo' => 'Horas extras nocturnas',
        'horas' => 3,
        'valor_recargo' => 45000
    ],
    [
        'pagado' => false,
        'fecha' => '2024-02-01',
        'motivo' => 'Trabajo en día festivo',
        'horas' => 8,
        'valor_recargo' => 120000
    ],
    [
        'pagado' => true,
        'fecha' => '2024-03-05',
        'motivo' => 'Horas extras diurnas',
        'horas' => 4,
        'valor_recargo' => 60000
    ],
    [
        'pagado' => true,
        'fecha' => '2024-03-10',
        'motivo' => 'Horas extras en fin de semana',
        'horas' => 5,
        'valor_recargo' => 75000
    ],
    [
        'pagado' => false,
        'fecha' => '2024-04-20',
        'motivo' => 'Recargo nocturno',
        'horas' => 6,
        'valor_recargo' => 90000
    ],
    [
        'pagado' => true,
        'fecha' => '2024-05-02',
        'motivo' => 'Recargo por trabajo en día festivo',
        'horas' => 8,
        'valor_recargo' => 130000
    ]
];


$datosArchivos = [
    [
        "nombre" => "Contrato",
        "url" => "contrato.pdf"
    ],
    [
        "nombre" => "Hoja de Vida",
        "url" => "hv.pdf"
    ]
];


$tiposMetodoPago = [
    "1" => "Efectivo",
    "2" => "Transferencia",
    "3" => "Cheque",
    "4" => "Deposito en cuenta de nómina",
];

$listaBancos = [
    "1" => "Bancolombia",
    "2" => "Davivienda",
    "3" => "Banco Popular",
    "4" => "Banco de Bogotá",
    "5" => "Banco Agrario",
    "6" => "Nequi",
];

$tipoCuenta = [
    "1" => "Cuenta de Ahorros",
    "2" => "Cuenta corriente",
];

$listaEps = [
    "1" => "Compensar",
    "2" => "Salud Total",
    "3" => "Capital Salud",
    "4" => "Famisanar",
];

$listaCajaCompensacion = [
    "1" => "Colsubsidio",
    "2" => "Cafam",
    "3" => "Compensar",
    "4" => "Comfama",
];

$lista_arl = [
    "1" => "Sura",
    "2" => "Arl Colmena",
    "3" => "Seguros Bolivar",
    "4" => "Seguos Colpatria",
];

$listaPension = [
    "1" => "Colpensiones",
    "2" => "Porvenir",
    "3" => "Proteccion"
];

$tiposParentesco = [ "Padre", "Madre", "Hijo", "Conyuge" ];

$datosContratos = [
    [
        "fechaContrato" => "2023-09-01",
        "tipoContrato" => "Nuevo",
        "duracionContrato" => "fijo",
        "fechaFinContrato" => "2024-09-01",
        "periodoPrueba" => 60,
        "cargo" => "Desarrollador Front-End",
        "jornada" => "Diurna",
        "salario" => 4500000,
        "funcionesCargo" => "Desarrollo de interfaces de usuario con HTML, CSS y JavaScript."
    ],
    [
        "fechaContrato" => "2023-06-15",
        "tipoContrato" => "Renovacion",
        "duracionContrato" => "indefinido",
        "fechaFinContrato" => null,  // Contrato indefinido
        "periodoPrueba" => 30,
        "cargo" => "Gerente de Proyecto",
        "jornada" => "Unica",
        "salario" => 7500000,
        "funcionesCargo" => "Gestión de proyectos, supervisión de equipos y control de tiempos."
    ],
    [
        "fechaContrato" => "2023-10-01",
        "tipoContrato" => "Nuevo",
        "duracionContrato" => "obra-labor",
        "fechaFinContrato" => "2024-02-28",
        "periodoPrueba" => 15,
        "cargo" => "Ingeniero DevOps",
        "jornada" => "Nocturna",
        "salario" => 6000000,
        "funcionesCargo" => "Mantenimiento de infraestructura y automatización de procesos de CI/CD."
    ],
    [
        "fechaContrato" => "2023-07-10",
        "tipoContrato" => "Nuevo",
        "duracionContrato" => "temporal",
        "fechaFinContrato" => "2023-12-31",
        "periodoPrueba" => 30,
        "cargo" => "Analista de Datos",
        "jornada" => "Diurna",
        "salario" => 5000000,
        "funcionesCargo" => "Análisis de grandes volúmenes de datos y creación de reportes."
    ],
    [
        "fechaContrato" => "2022-05-05",
        "tipoContrato" => "Renovacion",
        "duracionContrato" => "indefinido",
        "fechaFinContrato" => null,  // Contrato indefinido
        "periodoPrueba" => 45,
        "cargo" => "Especialista en Seguridad Informática",
        "jornada" => "Unica",
        "salario" => 7000000,
        "funcionesCargo" => "Implementación de medidas de seguridad y análisis de vulnerabilidades."
    ]
];

$datosMonedas = [
    "USD" => "Dólar Estadounidense",
    "EUR" => "Euro",
    "GBP" => "Libra Esterlina",
    "JPY" => "Yen Japonés",
    "CAD" => "Dólar Canadiense",
    "AUD" => "Dólar Australiano",
    "CHF" => "Franco Suizo",
    "CNY" => "Yuan Chino",
    "MXN" => "Peso Mexicano",
    "BRL" => "Real Brasileño",
    "ARS" => "Peso Argentino",
    "CLP" => "Peso Chileno",
    "COP" => "Peso Colombiano",
    "PEN" => "Sol Peruano",
    "INR" => "Rupia India",
    "RUB" => "Rublo Ruso",
    "ZAR" => "Rand Sudafricano",
    "KRW" => "Won Surcoreano",
    "SEK" => "Corona Sueca",
    "NOK" => "Corona Noruega",
    "DKK" => "Corona Danesa"
];

$datosCargos = [
    [
        "nombre" => "Desarrollador Full Stack",
        "codigo" => "DS-001",
        "funciones" => "Diseñar, desarrollar y mantener aplicaciones web tanto en el frontend como en el backend. Colaborar con equipos de diseño y producto."
    ],
    [
        "nombre" => "Ingeniero de DevOps",
        "codigo" => "DS-002",
        "funciones" => "Automatizar procesos de despliegue, monitorear y optimizar la infraestructura, y asegurar la estabilidad del entorno de producción."
    ],
    [
        "nombre" => "Arquitecto de Software",
        "codigo" => "DS-003",
        "funciones" => "Definir la estructura técnica de los sistemas, tomar decisiones sobre tecnologías y supervisar la implementación para garantizar escalabilidad y rendimiento."
    ],
    [
        "nombre" => "Analista QA",
        "codigo" => "DS-004",
        "funciones" => "Diseñar y ejecutar planes de prueba para asegurar la calidad del software, identificar errores y trabajar con los desarrolladores para su resolución."
    ],
    [
        "nombre" => "Scrum Master",
        "codigo" => "DS-005",
        "funciones" => "Facilitar las ceremonias Scrum, eliminar impedimentos y asegurar la correcta implementación de la metodología ágil en el equipo de desarrollo."
    ],
    [
        "nombre" => "Ingeniero de Seguridad de Software",
        "codigo" => "DS-006",
        "funciones" => "Implementar medidas de seguridad en las aplicaciones, realizar pruebas de penetración y monitorear vulnerabilidades."
    ],
    [
        "nombre" => "Desarrollador Móvil",
        "codigo" => "DS-007",
        "funciones" => "Desarrollar y mantener aplicaciones móviles nativas para plataformas Android o iOS, trabajando con equipos de diseño y backend para integrar funcionalidades."
    ],
    [
        "nombre" => "Ingeniero de Machine Learning",
        "codigo" => "DS-008",
        "funciones" => "Diseñar, entrenar e implementar modelos de machine learning, analizar grandes conjuntos de datos para obtener insights y mejorar productos mediante IA."
    ]
];

$datosRetencionesSalariales = [
    [
        "rangoSalarialDesde" => 1000,
        "rangoSalarialHasta" => 2000,
        "nombreRetencion" => "Retención de Seguridad Social",
        "porcentajeRetencion" => 12
    ],
    [
        "rangoSalarialDesde" => 2001,
        "rangoSalarialHasta" => 3000,
        "nombreRetencion" => "Retención de Impuesto sobre la Renta",
        "porcentajeRetencion" => 15
    ],
    [
        "rangoSalarialDesde" => 3001,
        "rangoSalarialHasta" => 4000,
        "nombreRetencion" => "Retención de Seguro Médico",
        "porcentajeRetencion" => 5
    ],
    [
        "rangoSalarialDesde" => 4001,
        "rangoSalarialHasta" => 5000,
        "nombreRetencion" => "Retención de Fondo de Pensiones",
        "porcentajeRetencion" => 10
    ],
    [
        "rangoSalarialDesde" => 5001,
        "rangoSalarialHasta" => 6000,
        "nombreRetencion" => "Retención de Impuesto sobre la Riqueza",
        "porcentajeRetencion" => 18
    ],
    [
        "rangoSalarialDesde" => 6001,
        "rangoSalarialHasta" => 7000,
        "nombreRetencion" => "Retención de Seguro de Desempleo",
        "porcentajeRetencion" => 7
    ]
];


$datosSedes = [
    [
        "id" => 1,
        "nombreSede" => "Sede Central",
        "codigoSede" => "SC001",
        "direccionSede" => "Av. Principal 123, Ciudad Central",
        "ciudadSede" => "Ciudad Central",
        "telefonoSede" => "+1 234 567 890",
        "descripcionSede" => "Sede principal de la compañía"
    ],
    [
        "id" => 2,
        "nombreSede" => "Sede Norte",
        "codigoSede" => "SN002",
        "direccionSede" => "Calle Norte 45, Ciudad Norte",
        "ciudadSede" => "Ciudad Norte",
        "telefonoSede" => "+1 987 654 321",
        "descripcionSede" => "Sucursal ubicada en la zona norte"
    ],
    [
        "id" => 3,
        "nombreSede" => "Sede Sur",
        "codigoSede" => "SS003",
        "direccionSede" => "Calle Sur 89, Ciudad Sur",
        "ciudadSede" => "Ciudad Sur",
        "telefonoSede" => "+1 654 321 987",
        "descripcionSede" => "Sucursal ubicada en la zona sur"
    ],
    [
        "id" => 4,
        "nombreSede" => "Sede Este",
        "codigoSede" => "SE004",
        "direccionSede" => "Av. Este 67, Ciudad Este",
        "ciudadSede" => "Ciudad Este",
        "telefonoSede" => "+1 321 987 654",
        "descripcionSede" => "Sucursal ubicada en la zona este"
    ],
    [
        "id" => 5,
        "nombreSede" => "Sede Oeste",
        "codigoSede" => "SO005",
        "direccionSede" => "Av. Oeste 34, Ciudad Oeste",
        "ciudadSede" => "Ciudad Oeste",
        "telefonoSede" => "+1 567 890 123",
        "descripcionSede" => "Sucursal ubicada en la zona oeste"
    ]
];

$datosCargosPublicados = [
    [
        "idCargo" => 1,
        "titulo" => "Desarrollador Full Stack",
        "tipoTrabajo" => "Tiempo Completo",
        "designacion" => "Ingeniero de Software",
        "numPosiciones" => 3,
        "estadoPublicado" => "Publicado",
        "fechaCierre" => "2024-12-31",
        "genero" => "Cualquiera",
        "experienciaMinima" => "2 Años",
        "descripcionBreve" => "Responsable del desarrollo tanto en el frontend como en el backend.",
        "descripcionLarga" => "El Desarrollador Full Stack será responsable del desarrollo de nuevas funcionalidades y mantenimiento del código existente. Trabajará con diferentes tecnologías tanto en el lado del cliente como en el servidor."
    ],
    [
        "idCargo" => 2,
        "titulo" => "Administrador de Bases de Datos",
        "tipoTrabajo" => "Medio Tiempo",
        "designacion" => "Administrador de Sistemas",
        "numPosiciones" => 1,
        "estadoPublicado" => "Publicado",
        "fechaCierre" => "2024-11-30",
        "genero" => "Cualquiera",
        "experienciaMinima" => "3 Años",
        "descripcionBreve" => "Encargado de la gestión, monitoreo y optimización de bases de datos.",
        "descripcionLarga" => "El Administrador de Bases de Datos será responsable de asegurar la integridad, disponibilidad y rendimiento óptimo de las bases de datos de la organización."
    ],
    [
        "idCargo" => 3,
        "titulo" => "Diseñador UX/UI",
        "tipoTrabajo" => "Freelance",
        "designacion" => "Diseñador Gráfico",
        "numPosiciones" => 2,
        "estadoPublicado" => "No Publicado",
        "fechaCierre" => "2024-10-15",
        "genero" => "Cualquiera",
        "experienciaMinima" => "1 Año",
        "descripcionBreve" => "Diseño de interfaces de usuario y experiencia de usuario para aplicaciones web y móviles.",
        "descripcionLarga" => "El Diseñador UX/UI será responsable de diseñar interfaces amigables y atractivas para los usuarios, asegurando una experiencia de usuario intuitiva. Deberá trabajar de la mano con los equipos de desarrollo y producto."
    ],
    [
        "idCargo" => 4,
        "titulo" => "Gerente de Proyectos",
        "tipoTrabajo" => "Tiempo Completo",
        "designacion" => "Gerente",
        "numPosiciones" => 1,
        "estadoPublicado" => "Publicado",
        "fechaCierre" => "2024-12-01",
        "genero" => "Cualquiera",
        "experienciaMinima" => "5 Años",
        "descripcionBreve" => "Supervisar y gestionar proyectos de TI desde la planificación hasta la implementación.",
        "descripcionLarga" => "El Gerente de Proyectos será responsable de gestionar todos los aspectos de los proyectos de TI, incluyendo la planificación, ejecución, monitoreo y finalización. Deberá coordinar con los diferentes equipos para asegurar el cumplimiento de plazos y objetivos."
    ],
    [
        "idCargo" => 5,
        "titulo" => "Analista de Seguridad Informática",
        "tipoTrabajo" => "Tiempo Completo",
        "designacion" => "Especialista en Seguridad",
        "numPosiciones" => 2,
        "estadoPublicado" => "Publicado",
        "fechaCierre" => "2024-12-31",
        "genero" => "Cualquiera",
        "experienciaMinima" => "3 Años",
        "descripcionBreve" => "Encargado de la protección de la infraestructura y los datos de la empresa.",
        "descripcionLarga" => "El Analista de Seguridad Informática será responsable de implementar y supervisar políticas y medidas de seguridad para proteger la información y los sistemas de la empresa. Deberá realizar auditorías y análisis de vulnerabilidades regularmente."
    ]
];

$datosCandidatos = [
    [
        "id" => 1,
        "nombre" => "Laura Gómez",
        "correo" => "laura.gomez@example.com",
        "telefono" => "555-1234",
        "experiencia" => "3 Años en desarrollo de software",
        "titulo" => "Desarrollador Full Stack",
        "idCargo" => 1,
        "estadoAplicacion" => "En Proceso"
    ],
    [
        "id" => 2,
        "nombre" => "Carlos Pérez",
        "correo" => "carlos.perez@example.com",
        "telefono" => "555-5678",
        "experiencia" => "4 Años en administración de bases de datos",
        "titulo" => "Administrador de Bases de Datos",
        "idCargo" => 2,
        "estadoAplicacion" => "Aceptado"
    ],
    [
        "id" => 3,
        "nombre" => "Ana Torres",
        "correo" => "ana.torres@example.com",
        "telefono" => "555-8765",
        "experiencia" => "2 Años en diseño UX/UI",
        "titulo" => "Diseñador UX/UI",
        "idCargo" => 3,
        "estadoAplicacion" => "No Publicado"
    ],
    [
        "id" => 4,
        "nombre" => "José Martínez",
        "correo" => "jose.martinez@example.com",
        "telefono" => "555-4321",
        "experiencia" => "6 Años en gestión de proyectos",
        "titulo" => "Gerente de Proyectos",
        "idCargo" => 4,
        "estadoAplicacion" => "Aceptado"
    ],
    [
        "id" => 5,
        "nombre" => "Sofía Fernández",
        "correo" => "sofia.fernandez@example.com",
        "telefono" => "555-0987",
        "experiencia" => "3 Años en seguridad informática",
        "titulo" => "Analista de Seguridad Informática",
        "idCargo" => 5,
        "estadoAplicacion" => "En Proceso"
    ]
];


$datosEstadosCandidato = [
    [
        "id" => 1,
        "nombre" => "En Proceso",
        "color" => "#3D5A91"
    ],
    [
        "id" => 2,
        "nombre" => "Aceptado",
        "color" => "#5BFF8C"
    ],
    [
        "id" => 3,
        "nombre" => "Rechazado",
        "color" => "#FF566D"
    ]
];

$datosEntrevistas = [
    [
        "id" => 1,
        "idCandidato" => 101,
        "cargoAplica" => "Desarrollador Full Stack",
        "fecha" => "2024-10-05",
        "hora" => "10:00",
        "fechaIngreso" => date("Y-m-d"),
        "contenidoEmail" => "Estimado candidato,\n\nLe informamos que ha sido seleccionado para una entrevista para el puesto de Desarrollador Full Stack.\n\nAtentamente,\nEl equipo de Recursos Humanos."
    ],
    [
        "id" => 2,
        "idCandidato" => 102,
        "cargoAplica" => "Administrador de Bases de Datos",
        "fecha" => "2024-10-07",
        "hora" => "11:00",
        "fechaIngreso" => date("Y-m-d"),
        "contenidoEmail" => "Estimado candidato,\n\nNos complace informarle que ha sido invitado a una entrevista para el puesto de Administrador de Bases de Datos.\n\nSaludos cordiales,\nEl equipo de Recursos Humanos."
    ],
    [
        "id" => 3,
        "idCandidato" => 103,
        "cargoAplica" => "Diseñador UX/UI",
        "fecha" => "2024-10-10",
        "hora" => "09:30",
        "fechaIngreso" => date("Y-m-d"),
        "contenidoEmail" => "Estimado candidato,\n\nEstamos encantados de invitarlo a una entrevista para el puesto de Diseñador UX/UI.\n\nAtentamente,\nEl equipo de Recursos Humanos."
    ]
    // Agrega más entrevistas según sea necesario
];


$datosNominaGrupal = [
    [
        "fecha_inicio" => "2024-09-01",
        "fecha_fin" => "2024-09-30",
        "num_empleados" => 10,
        "base" => 5000.00,
        "descuentos" => 200.00,
        "extras" => 150.00,
        "total" => 4950.00,
        "pendiente" => 0.00
    ],
    [
        "fecha_inicio" => "2024-08-01",
        "fecha_fin" => "2024-08-31",
        "num_empleados" => 8,
        "base" => 4000.00,
        "descuentos" => 180.00,
        "extras" => 100.00,
        "total" => 3920.00,
        "pendiente" => 100.00
    ],
    [
        "fecha_inicio" => "2024-07-01",
        "fecha_fin" => "2024-07-31",
        "num_empleados" => 12,
        "base" => 6000.00,
        "descuentos" => 250.00,
        "extras" => 200.00,
        "total" => 5950.00,
        "pendiente" => 50.00
    ],
    [
        "fecha_inicio" => "2024-06-01",
        "fecha_fin" => "2024-06-30",
        "num_empleados" => 15,
        "base" => 7500.00,
        "descuentos" => 300.00,
        "extras" => 300.00,
        "total" => 7500.00,
        "pendiente" => 0.00
    ],
    [
        "fecha_inicio" => "2024-05-01",
        "fecha_fin" => "2024-05-31",
        "num_empleados" => 9,
        "base" => 4500.00,
        "descuentos" => 220.00,
        "extras" => 120.00,
        "total" => 4400.00,
        "pendiente" => 50.00
    ]
];



?>
