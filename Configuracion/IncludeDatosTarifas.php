<?php

$dataRIPS = [
    [
        "nombre" => "Consulta General",
        "codigo" => "001",
        "id" => 1,
        "precio" => 50,
    ],
    [
        "nombre" => "Revisión Dental",
        "codigo" => "002",
        "id" => 2,
        "precio" => 30,
    ],
    [
        "nombre" => "Análisis de Sangre",
        "codigo" => "003",
        "id" => 3,
        "precio" => 100,
    ],
    [
        "nombre" => "Ultrasonido",
        "codigo" => "004",
        "id" => 4,
        "precio" => 150,
    ],
    [
        "nombre" => "Radiografía",
        "codigo" => "005",
        "id" => 5,
        "precio" => 75,
    ],
    [
        "nombre" => "Consulta de Especialista",
        "codigo" => "006",
        "id" => 6,
        "precio" => 200,
    ],
    [
        "nombre" => "Terapia Física",
        "codigo" => "007",
        "id" => 7,
        "precio" => 120,
    ],
    [
        "nombre" => "Vacunación",
        "codigo" => "008",
        "id" => 8,
        "precio" => 25,
    ],
    [
        "nombre" => "Control de Peso",
        "codigo" => "009",
        "id" => 9,
        "precio" => 40,
    ],
    [
        "nombre" => "Consulta Dermatológica",
        "codigo" => "010",
        "id" => 10,
        "precio" => 90,
    ],
    [
        "nombre" => "Revisión Cardíaca",
        "codigo" => "011",
        "id" => 11,
        "precio" => 110,
    ],
    [
        "nombre" => "Examen de Vista",
        "codigo" => "012",
        "id" => 12,
        "precio" => 60,
    ],
    [
        "nombre" => "Chequeo General",
        "codigo" => "013",
        "id" => 13,
        "precio" => 150,
    ],
    [
        "nombre" => "Diagnóstico por Imágenes",
        "codigo" => "014",
        "id" => 14,
        "precio" => 80,
    ],
    [
        "nombre" => "Hormonas",
        "codigo" => "015",
        "id" => 15,
        "precio" => 200,
    ],
    [
        "nombre" => "Check-Up Anual",
        "codigo" => "016",
        "id" => 16,
        "precio" => 250,
    ],
    [
        "nombre" => "Test de Alergias",
        "codigo" => "017",
        "id" => 17,
        "precio" => 70,
    ],
    [
        "nombre" => "Electrocardiograma",
        "codigo" => "018",
        "id" => 18,
        "precio" => 130,
    ],
    [
        "nombre" => "Mamografía",
        "codigo" => "019",
        "id" => 19,
        "precio" => 220,
    ],
    [
        "nombre" => "Citogenética",
        "codigo" => "020",
        "id" => 20,
        "precio" => 190,
    ],
    [
        "nombre" => "Ortopedia",
        "codigo" => "021",
        "id" => 21,
        "precio" => 300,
    ],
    [
        "nombre" => "Neurología",
        "codigo" => "022",
        "id" => 22,
        "precio" => 150,
    ],
    [
        "nombre" => "Oncología",
        "codigo" => "023",
        "id" => 23,
        "precio" => 400,
    ],
    [
        "nombre" => "Psicología",
        "codigo" => "024",
        "id" => 24,
        "precio" => 90,
    ],
    [
        "nombre" => "Fisioterapia",
        "codigo" => "025",
        "id" => 25,
        "precio" => 100,
    ],
    [
        "nombre" => "Ginecología",
        "codigo" => "026",
        "id" => 26,
        "precio" => 130,
    ],
    [
        "nombre" => "Pediatría",
        "codigo" => "027",
        "id" => 27,
        "precio" => 80,
    ],
    [
        "nombre" => "Oftalmología",
        "codigo" => "028",
        "id" => 28,
        "precio" => 120,
    ],
    [
        "nombre" => "Cirugía General",
        "codigo" => "029",
        "id" => 29,
        "precio" => 500,
    ],
    [
        "nombre" => "Dermatología",
        "codigo" => "030",
        "id" => 30,
        "precio" => 140,
    ],
];








$dataEmpresas = [
    [
        "nombre" => "Empresa Uno S.A.S.",
        "nit" => "123456789-0",
        "email" => "contacto@empresau.com",
        "actividadEconomica" => "Servicios de Consultoría",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => true
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => true,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => true
            ]

        ]
    ],
    [
        "nombre" => "Soluciones Tech S.A.",
        "nit" => "987654321-1",
        "email" => "info@solucionestech.com",
        "actividadEconomica" => "Desarrollo de Software",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Construcciones ABC Ltda.",
        "nit" => "234567890-2",
        "email" => "contacto@abcconstrucciones.com",
        "actividadEconomica" => "Construcción e Infraestructura",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Alimentos y Bebidas S.A.",
        "nit" => "345678901-3",
        "email" => "ventas@alimentosybebidas.com",
        "actividadEconomica" => "Producción y Distribución de Alimentos",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Servicios Generales S.A.S.",
        "nit" => "456789012-4",
        "email" => "info@serviciosgenerales.com",
        "actividadEconomica" => "Servicios de Mantenimiento",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Transporte Rápido S.A.",
        "nit" => "567890123-5",
        "email" => "info@transporterapido.com",
        "actividadEconomica" => "Transporte de Carga",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Consultoría Integral Ltda.",
        "nit" => "678901234-6",
        "email" => "consultas@consultoriaintegral.com",
        "actividadEconomica" => "Consultoría Empresarial",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Tecnología Avanzada S.A.S.",
        "nit" => "789012345-7",
        "email" => "soporte@tecnologiaavanzada.com",
        "actividadEconomica" => "Innovación Tecnológica",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Producciones Creativas S.A.",
        "nit" => "890123456-8",
        "email" => "contacto@produccionescreativas.com",
        "actividadEconomica" => "Producción Audiovisual",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
    [
        "nombre" => "Distribuciones Nacionales S.A.",
        "nit" => "901234567-9",
        "email" => "ventas@distribucionesnacionales.com",
        "actividadEconomica" => "Distribución y Logística",
        "dataProcedimientos" => [
            "1" => [
                "id" => "1",
                "precio" => "50",
                "valorEntidad" => "25",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "5" => [
                "id" => "5",
                "precio" => "75",
                "valorEntidad" => "37.5",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ],
            "12" => [
                "id" => "12",
                "precio" => "60",
                "valorEntidad" => "30",
                "procentajeCopago" => "0",
                "aplicaCopago" => false,
                "copagoDescuenta" => false
            ]

        ]
    ],
];

$dataVendedores = [
    [
        "id" => "1",
        "nombre" => "Vendedor A",
    ],
    [
        "id" => "2",
        "nombre" => "Vendedor B",
    ],
    [
        "id" => "3",
        "nombre" => "Vendedor C",
    ],
    [
        "id" => "4",
        "nombre" => "Vendedor D",
    ],
];



$centrosCostos = [
    [
        "id" => "1",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo A",
    ],
    [
        "id" => "2",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo B",
    ],
    [
        "id" => "3",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo C",
    ],
    [
        "id" => "4",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo D",
    ],
    [
        "id" => "5",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo E",
    ],
    [
        "id" => "6",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo F",
    ],
    [
        "id" => "7",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo G",
    ],
    [
        "id" => "8",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo H",
    ],
    [
        "id" => "9",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo I",
    ],
    [
        "id" => "10",
        "codigo" => rand(1000, 5000),
        "nombre" => "Centro de Costo J",
    ],
];


$dataJsonImpuestoCargo = [
    ["id" => 0, "nombre" => "Ninguno", "tasaImpuesto" => 0],
    ["id" => 1, "nombre" => "IVA", "tasaImpuesto" => 16],
    ["id" => 2, "nombre" => "IEPS", "tasaImpuesto" => 8],
    ["id" => 3, "nombre" => "ISR", "tasaImpuesto" => 30]
];


$dataJsonImpuestoRetencion = [
    ["id" => 0,"nombre" => "Ninguno", "tasaRetencion" => rand(0,100) ],
    ["id" => 1,"nombre" => "IR", "tasaRetencion" => rand(0,100) ],
    ["id" => 2,"nombre" => "IVA", "tasaRetencion" => rand(0,100) ],
    ["id" => 3,"nombre" => "ISR", "tasaRetencion" => rand(0,100) ],
    ["id" => 4,"nombre" => "IS", "tasaRetencion" => rand(0,100) ],
    ["id" => 5,"nombre" => "RT", "tasaRetencion" => rand(0,100) ],
    ["id" => 6,"nombre" => "IVA-R", "tasaRetencion" => rand(0,100) ],
    ["id" => 7,"nombre" => "IETU", "tasaRetencion" => rand(0,100) ],
    ["id" => 8,"nombre" => "CREE", "tasaRetencion" => rand(0,100) ],
    ["id" => 9,"nombre" => "ITBI", "tasaRetencion" => rand(0,100) ],
];

$dataActividadEconomica = [
    ["codigo" => "111", "nombre" =>	"Cultivo de cereales (excepto arroz), legumbres y semillas oleaginosas"],
    ["codigo" => "112", "nombre" =>	"Cultivo de arroz"],
    ["codigo" => "113", "nombre" =>	"Cultivo de hortalizas, raíces y tubérculos"],
    ["codigo" => "114", "nombre" =>	"Cultivo de tabaco"],
    ["codigo" => "115", "nombre" =>	"Cultivo de plantas textiles"],
    ["codigo" => "119", "nombre" =>	"Otros cultivos transitorios n.c.p."],
    ["codigo" => "121", "nombre" =>	"Cultivo de frutas tropicales y subtropicales"],
    ["codigo" => "122", "nombre" =>	"Cultivo de plátano y banano"],
    ["codigo" => "123", "nombre" =>	"Cultivo de café"],
    ["codigo" => "124", "nombre" =>	"Cultivo de caña de azúcar"],
    ["codigo" => "125", "nombre" =>	"Cultivo de flor de corte"],
    ["codigo" => "126", "nombre" =>	"Cultivo de palma para aceite (palma africana) y otros frutos oleaginosos"],
    ["codigo" => "127", "nombre" =>	"Cultivo de plantas con las que se prepararan bebidas"],
    ["codigo" => "128", "nombre" =>	"Cultivo de especias y de plantas aromáticas y medicinales"],
    ["codigo" => "129", "nombre" =>	"Otros cultivos permanentes n.c.p."],
    ["codigo" => "130", "nombre" =>	"Propagación de plantas (actividades de los viveros, excepto viveros,forestales)"],
    ["codigo" => "141", "nombre" =>	"Cría de ganado bovino y bufalino"],
    ["codigo" => "142", "nombre" =>	"Cría de caballos y otros equinos"],
    ["codigo" => "143", "nombre" =>	"Cría de ovejas y cabras"],
    ["codigo" => "144", "nombre" =>	"Cría de ganado porcino"],
    ["codigo" => "145", "nombre" =>	"Cría de aves de corral"],
    ["codigo" => "149", "nombre" =>	"Cría de otros animales n.c.p."],
    ["codigo" => "150", "nombre" =>	"Explotación primaria mixta (agrícola y pecuaria)"],
    ["codigo" => "163", "nombre" =>	"Actividades posteriores a la cosecha"],
    ["codigo" => "170", "nombre" =>	"Caza ordinaria y mediante trampas y actividades de servicios conexas"],
    ["codigo" => "210", "nombre" =>	"Silvicultura y otras actividades forestales"],
    ["codigo" => "220", "nombre" =>	"Extracción de madera"],
    ["codigo" => "230", "nombre" =>	"Recolección de productos forestales diferentes a la madera"],
    ["codigo" => "311", "nombre" =>	"Pesca marítima"],
    ["codigo" => "312", "nombre" =>	"Pesca de agua dulce"],
    ["codigo" => "321", "nombre" =>	"Acuicultura marítima"],
    ["codigo" => "322", "nombre" =>	"Acuicultura de agua dulce"],
    ["codigo" => "6531", "nombre" =>	"Régimen de prima media con prestación definida (RPM)"],
    ["codigo" => "8411", "nombre" =>	"Actividades legislativas de la administración pública"],
    ["codigo" => "8412", "nombre" =>	"Actividades ejecutivas de la administración pública"],
    ["codigo" => "8413", "nombre" =>	"Regulación de las actividades de organismos que prestan servicios de salud, educativos, culturales y otros servicios sociales, excepto servicios de seguridad social"],
    ["codigo" => "8414", "nombre" =>	"Actividades reguladoras y facilitadoras de la actividad económica"],
    ["codigo" => "8415", "nombre" =>	"Actividades de los órganos de control y otras instituciones."],
    ["codigo" => "8421", "nombre" =>	"Relaciones exteriores"],
    ["codigo" => "8422", "nombre" =>	"Actividades de defensa"],
    ["codigo" => "8423", "nombre" =>	"Orden público y actividades de seguridad publica"],
    ["codigo" => "8424", "nombre" =>	"Administración de justicia"],
    ["codigo" => "8430", "nombre" =>	"Actividades de planes de Seguridad Social de afiliación obligatoria"],
    ["codigo" => "9001", "nombre" =>	"Creación literaria"],
    ["codigo" => "9002", "nombre" =>	"Creación musical"],
    ["codigo" => "9003", "nombre" =>	"Creación teatral"],
    ["codigo" => "9004", "nombre" =>	"Creación audiovisual"],
    ["codigo" => "9005", "nombre" =>	"Artes plásticas y visuales"],
    ["codigo" => "9006", "nombre" =>	"Actividades teatrales"],
    ["codigo" => "9007", "nombre" =>	"Actividades de espectáculos musicales en vivo"],
    ["codigo" => "9008", "nombre" =>	"Otras actividades de espectáculos en vivo n.c.p"],
    ["codigo" => "9101", "nombre" =>	"Actividades de Bibliotecas y archivos"],
    ["codigo" => "9102", "nombre" =>	"Actividades y funcionamiento de museos, conservación de edificios y sitios históricos"],
    ["codigo" => "9103", "nombre" =>	"Actividades de jardines botánicos, zoológicos y reservas naturales"],
    ["codigo" => "9311", "nombre" =>	"Gestión de instalaciones deportivas"],
    ["codigo" => "9312", "nombre" =>	"Actividades de clubes deportivos"],
    ["codigo" => "9319", "nombre" =>	"Otras actividades deportivas"],
    ["codigo" => "9412", "nombre" =>	"Actividades de asociaciones profesionales y gremiales sin ánimo de lucro"],
    ["codigo" => "9420", "nombre" =>	"Actividades de sindicatos"],
    ["codigo" => "9491", "nombre" =>	"Actividades de asociaciones religiosas"],
    ["codigo" => "9492", "nombre" =>	"Actividades de partidos políticos"],
    ["codigo" => "9700", "nombre" =>	"Actividades de los hogares individuales como empleadores de personal doméstico"],
    ["codigo" => "9810", "nombre" =>	"Actividades no diferenciadas de los hogares individuales como productores de bienes para uso propio"],
    ["codigo" => "9820", "nombre" =>	"Actividades no diferenciadas de los hogares individuales como productores de servicios para uso propio"],
    ["codigo" => "9900", "nombre" =>	"Actividades de organizaciones y entidades extraterritoriales signatarios de la Convención de Viena"]
];


$metodosPago = [
    [
        'id' => 1,
        'nombre' => 'Tarjeta de Crédito',
        'descripcion' => 'Pago con tarjeta de crédito de cualquier banco',
        'tasa_descuento' => 2.5,
        'moneda' => 'MXN',
        'cuentaContable' => rand(1,10)
    ],
    [
        'id' => 2,
        'nombre' => 'Tarjeta de Débito',
        'descripcion' => 'Pago con tarjeta de débito de cualquier banco',
        'tasa_descuento' => 1.8,
        'moneda' => 'MXN',
        'cuentaContable' => rand(1,10)
    ],
    [
        'id' => 3,
        'nombre' => 'PayPal',
        'descripcion' => 'Pago a través de la plataforma de PayPal',
        'tasa_descuento' => 3.0,
        'moneda' => 'USD',
        'cuentaContable' => rand(1,10)
    ],
    [
        'id' => 4,
        'nombre' => 'Transferencia Bancaria',
        'descripcion' => 'Pago mediante transferencia bancaria',
        'tasa_descuento' => 0.0,
        'moneda' => 'MXN',
        'cuentaContable' => rand(1,10)
    ],
    [
        'id' => 5,
        'nombre' => 'Efectivo',
        'descripcion' => 'Pago en efectivo al momento de la entrega',
        'tasa_descuento' => 0.0,
        'moneda' => 'MXN',
        'cuentaContable' => rand(1,10)
    ],
    [
        'id' => 6,
        'nombre' => 'Criptomonedas',
        'descripcion' => 'Pago con criptomonedas como Bitcoin o Ethereum',
        'tasa_descuento' => 1.5,
        'moneda' => 'BTC',
        'cuentaContable' => rand(1,10)
    ]
];

$cuentasContables = [
    [
        'id' => 1,
        'codigo' => '110505',
        'nombre' => 'Caja',
        'descripcion' => 'Dinero en efectivo y en poder de la empresa',
        'naturaleza' => 'Débito'
    ],
    [
        'id' => 2,
        'codigo' => '110510',
        'nombre' => 'Bancos',
        'descripcion' => 'Dinero depositado en cuentas corrientes de bancos',
        'naturaleza' => 'Débito'
    ],
    [
        'id' => 3,
        'codigo' => '130505',
        'nombre' => 'Clientes Nacionales',
        'descripcion' => 'Cuentas por cobrar a clientes en el territorio nacional',
        'naturaleza' => 'Débito'
    ],
    [
        'id' => 4,
        'codigo' => '130510',
        'nombre' => 'Clientes del Exterior',
        'descripcion' => 'Cuentas por cobrar a clientes internacionales',
        'naturaleza' => 'Débito'
    ],
    [
        'id' => 5,
        'codigo' => '220505',
        'nombre' => 'Proveedores Nacionales',
        'descripcion' => 'Obligaciones con proveedores dentro del territorio nacional',
        'naturaleza' => 'Crédito'
    ],
    [
        'id' => 6,
        'codigo' => '220510',
        'nombre' => 'Proveedores del Exterior',
        'descripcion' => 'Obligaciones con proveedores internacionales',
        'naturaleza' => 'Crédito'
    ],
    [
        'id' => 7,
        'codigo' => '240805',
        'nombre' => 'Impuesto a las Ventas por Pagar',
        'descripcion' => 'IVA generado en las ventas por pagar',
        'naturaleza' => 'Crédito'
    ],
    [
        'id' => 8,
        'codigo' => '250505',
        'nombre' => 'Obligaciones Bancarias Nacionales',
        'descripcion' => 'Préstamos y otras obligaciones con bancos en el país',
        'naturaleza' => 'Crédito'
    ],
    [
        'id' => 9,
        'codigo' => '311505',
        'nombre' => 'Capital Social',
        'descripcion' => 'Capital aportado por los socios o accionistas',
        'naturaleza' => 'Crédito'
    ],
    [
        'id' => 10,
        'codigo' => '413505',
        'nombre' => 'Ingresos Operacionales',
        'descripcion' => 'Ingresos generados por la actividad económica principal',
        'naturaleza' => 'Crédito'
    ]
];

?>
