<?php
include "../menu.php";
include "../header.php";
$arraytest = [
    [
        "Nombre" => "Juan Pérez",
        "Numero de documento" => "108574152",
        "Fecha Consulta" => "2025-10-18",
        "Hora Consulta" => "08:00 AM",
        "Profesional asignado" => "Camilo Villacorte",
        "Entidad" => "Entidad 1",
        "Estado" => "Pendiente"
    ],
];

// Datos de ejemplo
$consultas = [
    ['id' => 1, 'fecha' => '2024-11-20', 'descripcion' => 'Consulta sobre productos', 'estado' => 'Pendientes'],
    ['id' => 2, 'fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos', 'estado' => 'En espera de consulta'],
    ['id' => 3, 'fecha' => '2024-11-26', 'descripcion' => 'Consulta médica', 'estado' => 'En consulta'],
    ['id' => 4, 'fecha' => '2024-11-27', 'descripcion' => 'Seguimiento', 'estado' => 'Consulta finalizada'],
];

$recetas = [
    ['id' => 1, 'nombre' => 'Ibuprofeno', 'presentacion' => 'Tabletas 200mg', 'dosis' => '2 veces al día', 'fecha' => '2024-11-20', 'descripcion' => 'Receta para dolor de cabeza'],
    ['id' => 2, 'nombre' => 'Paracetamol', 'presentacion' => 'Tabletas 500mg', 'dosis' => 'Cada 8 horas', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para fiebre'],
    ['id' => 3, 'nombre' => 'Amoxicilina', 'presentacion' => 'Cápsulas 500mg', 'dosis' => '3 veces al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para infección respiratoria'],
    ['id' => 4, 'nombre' => 'Metformina', 'presentacion' => 'Tabletas 850mg', 'dosis' => '1 vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para diabetes tipo 2'],
    ['id' => 5, 'nombre' => 'Loratadina', 'presentacion' => 'Tabletas 10mg', 'dosis' => 'Una vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para alergias'],
    ['id' => 6, 'nombre' => 'Omeprazol', 'presentacion' => 'Tabletas 20mg', 'dosis' => '1 vez al día antes de las comidas', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para acidez estomacal'],
    ['id' => 7, 'nombre' => 'Fluconazol', 'presentacion' => 'Cápsulas 150mg', 'dosis' => 'Una sola dosis', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para infección vaginal'],
];

// Agrupar consultas por estado
$estados = ['Pendientes', 'En espera de consulta', 'En consulta', 'Consulta finalizada'];
$consultasPorEstado = [];
foreach ($estados as $estado) {
    $consultasPorEstado[$estado] = array_filter($consultas, fn($consulta) => $consulta['estado'] === $estado);
}

$tabs = [
    ['icono' => 'file-invoice-dollar', 'titulo' => 'Facturación', 'texto' => 'Crear facturas para admisionar al paciente', 'url' => 'facturacionAdmisiones'],
    ['icono' => 'person-walking-arrow-right', 'titulo' => 'Pacientes', 'texto' => 'Visualiza los pacientes y accede a su información', 'url' => 'pacientescontrol'],
    ['icono' => 'calendar-days', 'titulo' => 'Citas', 'texto' => 'Gestión y control de citas', 'url' => 'gestioncitas'],
    ['icono' => 'hospital', 'titulo' => 'Sala de Espera', 'texto' => 'Visualiza los pacientes por el estado de su cita', 'url' => 'salaEspera'],
    ['icono' => 'file-prescription', 'titulo' => 'Post - Consulta', 'texto' => 'Visualiza los pacientes que finalizarón consulta', 'url' => 'postconsultaControl'],
    ['icono' => 'house-chimney-medical', 'titulo' => 'Admisiones', 'texto' => 'Visualiza el historial de adminisiones', 'url' => 'controlAdmisiones'],
    ['icono' => 'house-chimney-medical', 'titulo' => 'Consentimientos', 'texto' => 'Visualiza consentimientos pendientes de firma', 'url' => 'controlAdmisiones'],
    ['icono' => 'syringe', 'titulo' => 'Pre-admisiones', 'texto' => 'Visualiza los pacientes que requieren pre-admision', 'url' => 'preadmisionControl'],
];
?>

<link rel="stylesheet" href="./assets/css/styles.css">

<style>
    .componente {
        padding: 1rem 0;
    }
    
    .container-small {
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    .btn-primary{
            color: #ffffff !important;
    background: #1A99FB !important;
    border: 1px solid #1A99FB;
    padding: 0.5rem 0.75rem;
    transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
    border-radius: 0.5rem !important;
    font-family: 'Inter', sans-serif !important;
    box-shadow: 0 7px 8px gray;

    }
    .dashboard-card .btn:hover{
        box-shadow: none !important; 
    }

    
    .dashboard-card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(0, 0, 0, 0.06);
        position: relative;
    }
    
    .dashboard-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #29F6C1;
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }
    
    .dashboard-card:hover {
        transform: translateY(-12px);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .dashboard-card:hover::before {
        transform: scaleX(1);
    }
    
    .dashboard-card .card-body {
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex-grow: 1;
        position: relative;
        z-index: 1;
    }
    
    .dashboard-card .card-icon {
        margin-bottom: 1.2rem;
        color: #4a6cf7;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
    }

    

    .dashboard-card .card-title {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #2d3748;
        line-height: 1.3;
    }
    
    .dashboard-card .card-text {
        color: #718096;
        margin-bottom: 2rem;
        flex-grow: 1;
        line-height: 1.6;
        max-width: 90%;
    }
    
    .dashboard-card .btn {
        background: #132030 ;
        border: none;
        border-radius: 10px;
        padding: 0.75rem 1.5rem;
        transition: all 0.3s ease;
        margin-top: auto;
        font-weight: 600;
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;
    }
    
    .dashboard-card .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .dashboard-card .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(74, 108, 247, 0.4);
        background: linear-gradient(120deg, #1A99FB);
    }
    
    .dashboard-card .btn:hover::before {
        left: 100%;
    }
    
    /* Responsive adjustments */
    @media (max-width: 992px) {
        .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        
        .dashboard-card .card-body {
            padding: 1.5rem 1.25rem;
        }
        
        .dashboard-card .card-icon {
            font-size: 1rem;
            width: 80px;
            height: 80px;
        }
    }
    
    @media (max-width: 768px) {
        .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
        }
        
        .dashboard-card .card-title {
            font-size: 1.2rem;
        }
        
        .dashboard-card .card-text {
            font-size: 0.9rem;
        }
    }
    
    @media (max-width: 576px) {
        .cards-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            gap: 1.25rem;
        }
        
        .dashboard-card .card-body {
            padding: 1.25rem 1rem;
        }
        
        .dashboard-card .card-icon {
            font-size: 1rem;
            width: 70px;
            height: 70px;
        }
    }
    
    /* Estilos para el tema oscuro */
    html[data-bs-theme="dark"] .dashboard-card {
        background: linear-gradient(135deg, #2d3748, #1a202c);
        border-color: #4a5568;
    }
    
    html[data-bs-theme="dark"] .dashboard-card .card-title {
        color: #f7fafc;
    }
    
    html[data-bs-theme="dark"] .dashboard-card .card-text {
        color: #cbd5e0;
    }
    
    html[data-bs-theme="dark"] .dashboard-card .card-icon {
        background: linear-gradient(135deg, rgba(74, 108, 247, 0.2), rgba(108, 142, 255, 0.1));
    }
    
    /* Estilos para el breadcrumb */
    .breadcrumb {
        font-size: 0.9rem;
        padding: 1rem 1.5rem;
        margin: -1rem -1.5rem 2rem -1.5rem;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 8px;
    }
    
    html[data-bs-theme="dark"] .breadcrumb {
        background: rgba(255, 255, 255, 0.05);
    }
    
 
    
</style>


<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-4" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Control de citas</li>
                </ol>
            </nav>
            
            <div class="cards-grid">
                <?php foreach ($tabs as $tab) { ?>
                    <div class="dashboard-card">
                        <div class="card-body">
                            <div class="card-icon">
                                <i class="fas fa-<?= $tab['icono'] ?> fa-2x"></i>
                            </div>
                            <h5 class="card-titles"><?= $tab['titulo'] ?></h5>
                            <p class="card-text"><?= $tab['texto'] ?></p>
                            <a href="<?= $tab['url'] ?>" class="btn btn-primary">
                                <i class="fas fa-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>