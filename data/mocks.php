<?php

$userAvailabilities = [
    [
        'id' => 1,
        'user_id' => 1,
        'user' => [
            'id' => 1,
            'username' => 'example_username 1'
        ],
        'appointment_type_id' => 1,
        'appointment_type' => [
            'id' => 1,
            'name' => 'Presencial'
        ],
        'day_of_week' => 1,
        'start_time' => '09:00:00',
        'end_time' => '17:00:00',
        'branch_id' => 1,
        'branch' => [
            'id' => 1,
            'city_id' => 1,
            'address' => 'Avenida Reforma 123, Ciudad de México'
        ]
    ],
    [
        'id' => 2,
        'user_id' => 1,
        'user' => [
            'id' => 1,
            'username' => 'example_username 2'
        ],
        'appointment_type_id' => 2,
        'appointment_type' => [
            'id' => 2,
            'name' => 'Virtual'
        ],
        'day_of_week' => 2,
        'start_time' => '10:00:00',
        'end_time' => '18:00:00',
        'branch_id' => null,
        'branch' => null
    ]
];

$userOptions = array_map(function ($availability) {
    return [
        'id' => $availability['user']['id'],
        'name' => $availability['user']['username']
    ];
}, $userAvailabilities);
$userOptions = array_unique($userOptions, SORT_REGULAR);

$appointmentTypeOptions = array_map(function ($availability) {
    return [
        'id' => $availability['appointment_type']['id'],
        'name' => $availability['appointment_type']['name']
    ];
}, $userAvailabilities);
$appointmentTypeOptions = array_unique($appointmentTypeOptions, SORT_REGULAR);

$branchOptions = array_map(function ($availability) {
    if ($availability['branch'] !== null) {
        return [
            'id' => $availability['branch']['id'],
            'address' => $availability['branch']['address']
        ];
    }
    return null;
}, $userAvailabilities);
$branchOptions = array_filter($branchOptions);
$branchOptions = array_unique($branchOptions, SORT_REGULAR);

$userRoles = [
    ['id' => 1, 'name' => 'Administrador'],
    ['id' => 2, 'name' => 'Médico General'],
    ['id' => 3, 'name' => 'Especialista'],
    ['id' => 4, 'name' => 'Recepcionista'],
    ['id' => 5, 'name' => 'Asistente Médico'],
    ['id' => 6, 'name' => 'Enfermero'],
    ['id' => 7, 'name' => 'Técnico de Laboratorio'],
    ['id' => 8, 'name' => 'Farmacéutico'],
    ['id' => 9, 'name' => 'Gerente de Clínica'],
    ['id' => 10, 'name' => 'Personal de Limpieza']
];

$specialties = [
    ['id' => 1, 'name' => 'Cardiología'],
    ['id' => 2, 'name' => 'Pediatría'],
    ['id' => 3, 'name' => 'Neurología'],
    ['id' => 4, 'name' => 'Dermatología'],
    ['id' => 5, 'name' => 'Ginecología'],
    ['id' => 6, 'name' => 'Oncología'],
    ['id' => 7, 'name' => 'Oftalmología'],
    ['id' => 8, 'name' => 'Psiquiatría']
];

$permissions = [
    ['id' => 1, 'key' => 'view_users', 'description' => 'Ver usuarios'],
    ['id' => 2, 'key' => 'edit_users', 'description' => 'Editar usuarios'],
    ['id' => 3, 'key' => 'delete_users', 'description' => 'Eliminar usuarios'],
    ['id' => 4, 'key' => 'view_appointments', 'description' => 'Ver citas'],
    ['id' => 5, 'key' => 'edit_appointments', 'description' => 'Editar citas'],
    ['id' => 6, 'key' => 'delete_appointments', 'description' => 'Eliminar citas'],
    ['id' => 7, 'key' => 'view_reports', 'description' => 'Ver reportes'],
    ['id' => 8, 'key' => 'generate_reports', 'description' => 'Generar reportes'],
    ['id' => 9, 'key' => 'view_inventory', 'description' => 'Ver inventario'],
    ['id' => 10, 'key' => 'edit_inventory', 'description' => 'Editar inventario']
];

$prices = [
    [
        "id" => 1,
        "item_type" => "Examen",
        "item_id" => 1,
        "item" => ["name" => "Examen A"],
        "price" => 10000.00
    ],
    [
        "id" => 2,
        "item_type" => "Consulta",
        "item_id" => 2,
        "item" => ["name" => "Consulta B"],
        "price" => 20000.00
    ],
    [
        "id" => 3,
        "item_type" => "Examen",
        "item_id" => 3,
        "item" => ["name" => "Examen C"],
        "price" => 15000.00
    ],
    [
        "id" => 4,
        "item_type" => "Consulta",
        "item_id" => 4,
        "item" => ["name" => "Consulta D"],
        "price" => 25000.00
    ]
];

$consents = [
    [
        "id" => 1,
        "name_" => "Consentimiento 1",
        "description" => "esta plantilla e creo como ejemplo para la capacitación del software",
    ],
    [
        "id" => 2,
        "name_" => "Consentimiento 2",
        "description" => "esta plantilla e creo como ejemplo para la capacitación del software",
    ],
    [
        "id" => 3,
        "name_" => "Consentimiento 3",
        "description" => "esta plantilla e creo como ejemplo para la capacitación del software",
    ],
    [
        "id" => 4,
        "name_" => "Consentimiento 4",
        "description" => "esta plantilla e creo como ejemplo para la capacitación del software",
    ]
];

$itemTypes = [
    ['id' => 1, 'name' => 'Examen'],
    ['id' => 2, 'name' => 'Consulta']
];

$itemsGroupedByType = [
    '1' => [
        ["name" => "Examen A"],
        ["name" => "Examen C"]
    ],
    '2' => [
        ["name" => "Consulta B"],
        ["name" => "Consulta D"]
    ]
];

$jsonItemsGroupedByType = json_encode($itemsGroupedByType);

$templates = [
    "Consentimiento_Informado" => "CONSENTIMIENTO INFORMADO\n\nFecha: " . date("d-m-Y") . "\n\nYo, HOY ddd Prueba NNN con número de documento: 111111111\nFecha de Nacimiento: 2024-09-05, Edad: 4 Meses, 28 Días.\nCelular: 4141765181.\n\nDECLARO: Que, en pleno uso de mis facultades mentales...",

    "Acta_de_salida" => "ACTA DE SALIDA\n\nFecha: " . date("d-m-Y") . "\n\nYo, ____________________, identificado con C.C. No. ______________, declaro haber recibido satisfactoriamente la atención y entiendo..."
];

$jsonTemplates = json_encode($templates);


$arrayMensajes = [
    [
        "titulo" => "Promoción de Cardiología",
        "mensaje" => "Consulta con nuestros especialistas en cardiología y obtén un 20% de descuento.",
        "filtro" => "Cardiología"
    ],
    [
        "titulo" => "Cuidado de la Piel",
        "mensaje" => "Aprovecha nuestras promociones en tratamientos dermatológicos.",
        "filtro" => "Dermatología"
    ],
    [
        "titulo" => "Vacunación Infantil",
        "mensaje" => "Protege a tus hijos con nuestro servicio de vacunación infantil.",
        "filtro" => "Pediatría"
    ],
    [
        "titulo" => "Consulta General",
        "mensaje" => "Agenda tu consulta general con nuestros médicos especialistas.",
        "filtro" => "General"
    ]
];

$basicTemplates = [
    [
        "id" => 1,
        "name" => "Plantilla 1",
        "content" => "<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>",
    ],
    [
        "id" => 2,
        "name" => "Plantilla 2",
        "content" => "<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>",
    ],
    [
        "id" => 3,
        "name" => "Plantilla 3",
        "content" => "<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>",
    ]
];
