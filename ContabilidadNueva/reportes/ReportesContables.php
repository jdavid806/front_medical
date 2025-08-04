<?php
include "../../menu.php";
include "../../header.php";

$reportes = [
    ['icono' => 'chart-line', 'titulo' => 'Estado de Resultados', 'texto' => 'Visualiza ingresos, costos y gastos del periodo', 'url' => 'ReportesEstadoResultados'],
    ['icono' => 'balance-scale', 'titulo' => 'Balance General', 'texto' => 'Activos, pasivos y patrimonio de la empresa', 'url' => 'ReportesBalanceGeneral'],
    ['icono' => 'file-invoice-dollar', 'titulo' => 'Balance de prueba x Cuenta Contable', 'texto' => 'Saldos agrupados por cuenta contable', 'url' => 'ReportesBalanceCuentaContable'],
    ['icono' => 'user-tie', 'titulo' => 'Balance de Prueba x Tercero', 'texto' => 'Saldos agrupados por proveedores/clientes', 'url' => 'ReportesBalancePruebaTercero'],
    ['icono' => 'search-dollar', 'titulo' => 'Movimiento Auxiliar x Cuenta Contable', 'texto' => 'Movimientos contables detallados', 'url' => 'ReportesMovimientoAuxiliar'],
    ['icono' => 'book', 'titulo' => 'Libro diario', 'texto' => 'Ver libro diario', 'url' => 'ReporteLibroDiario'],
    ['icono' => 'book-open', 'titulo' => 'Libro mayor de balance', 'texto' => 'Ver libro mayor', 'url' => 'ReporteLibroMayorBalance'],
    ['icono' => 'cash-register', 'titulo' => 'Control de caja', 'texto' => 'Ver control de caja', 'url' => 'ReporteControlCaja'],
];

?>

<style>
    .report-card {
        width: 85%;
        height: 100%;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        margin-bottom: 15px;
    }

    .report-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .report-card .card-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .report-icon {
        color: #132030;
        margin-bottom: 0.8rem;
    }

    .report-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .report-text {
        font-size: 0.85rem;
        color: #666;
        flex-grow: 1;
        margin-bottom: 0.8rem;
    }

    .report-btn {
        margin-top: 0.5rem;
        background: #132030;
        border: none;
        width: 100%;
        padding: 0.4rem;
        font-size: 0.9rem;
    }

    .report-btn:hover {
        background: #1a2a3a;
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.2rem;
        color: #333;
        margin-top: 2rem;
    }

    /* Ajustes para el grid */
    .cards-container {
        margin: 10px 20px;
    }

    .card-col {
        padding: 8px !important;
        /* Espacio reducido entre cards */
    }
</style>

<div class="componete">
    <div class="content">
        <nav class="mb-2" aria-label="breadcrumb">
            <ol class="breadcrumb mb-1">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active">Reportes Contables</li>
            </ol>
        </nav>

        <div class="container-fluid px-2">
            <h1 class="section-title">Reportes Contables</h1>

            <div class="row cards-container">
                <?php foreach ($reportes as $reporte) { ?>
                    <div class="col-md-6 col-lg-4 col-xl-3 card-col">
                        <div class="card report-card h-100">
                            <div class="card-body text-center">
                                <div class="report-icon">
                                    <i class="fas fa-<?= $reporte['icono'] ?> fa-2x"></i>
                                </div>
                                <h5 class="report-title"><?= $reporte['titulo'] ?></h5>
                                <p class="report-text">
                                    <?= $reporte['texto'] ?>
                                </p>
                                <a href="<?= $reporte['url'] ?>" class="btn btn-primary report-btn">
                                    Ver Reporte <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
</div>

<?php
include "../../footer.php";
?>