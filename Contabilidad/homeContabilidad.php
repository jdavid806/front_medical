<?php
include "../menu.php";
include "../header.php";

$tabs = [
    ['icono' => 'toolbox', 'titulo' => 'Cuentas Contables', 'texto' => 'Ver y configurar las cuentas contables', 'url' => 'CuentasContables'],
    ['icono' => 'file-invoice-dollar', 'titulo' => 'Facturación', 'texto' => 'Genera facturaras x Entidad y de venta', 'url' => 'FE_FCE'],
    ['icono' => 'building-columns', 'titulo' => 'Bancos', 'texto' => 'Visualiza saldos y transacciones bancarias', 'url' => 'BancosContables'],
    ['icono' => 'file-invoice', 'titulo' => 'Comprobantes Contables', 'texto' => 'Genera Comprobantes contables', 'url' => 'ComprobantesContables'],
    ['icono' => 'file-contract', 'titulo' => 'Recibos de Caja', 'texto' => 'Contabiliza los recibidos cajas y realizados', 'url' => 'RecibosDeCajas'],
    ['icono' => 'chart-pie', 'titulo' => 'Cuentas x Cobrar y Pagar', 'texto' => 'Visualiza reporte de facturas con sus vencimientos', 'url' => 'CuentasCobrarPagar'],
    ['icono' => 'cash-register', 'titulo' => 'Cierre de Caja', 'texto' => 'Generar el cierre de Caja', 'url' => 'controlCaja'],
    ['icono' => 'file-invoice-dollar', 'titulo' => 'Control Cierre de Caja', 'texto' => 'Auditoria de cierres de caja', 'url' => 'reporteCaja'],
    ['icono' => 'chart-simple', 'titulo' => 'Reportes Contables', 'texto' => 'Visualiza reportes financieros', 'url' => 'ReportesContables'],
    ['icono' => 'receipt', 'titulo' => 'Cierres Contables', 'texto' => 'Visualiza saldos de cierres contables', 'url' => 'CierresContables'],
    ['icono' => 'check-double', 'titulo' => 'Auditoria Contable', 'texto' => 'Visualiza historico de registros y acciones del sistema', 'url' => 'FE_ContabilidadNueva'],
    ['icono' => 'users', 'titulo' => 'Gestión de Terceros', 'texto' => 'Consulta y administra el registro de terceros, incluyendo su creación y modificación', 'url' => 'GestionarTerceros'],
    ['icono' => 'toolbox', 'titulo' => 'Configuración Contable', 'texto' => 'Configura Métodos de pago, Impuestos y Centros de Costo', 'url' => 'configContabilidad'],
    ['icono' => 'warehouse', 'titulo' => 'Gestión de Activos', 'texto' => 'Administra el inventario y estado de todos los activos de las cuentas', 'url' => 'ActivosFijos'],
];

?>

<style type="text/css">
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }
</style>
<div class="componete">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Modulos Contables</li>
            </ol>
        </nav>
        <div class="row g-0 g-md-4 g-xl-6 p-5 justify-content-center">
            <div class="col-md-9">
                <div class="row row-cols-1 row-cols-md-3 g-3 mb-3 mt-2">
                    <?php foreach ($tabs as $tab) { ?>
                        <div class="col">
                            <div class="card text-center" style="min-height: 15em;">
                                <div class="card-body d-flex flex-column justify-content-between align-items-center"
                                    style="height: 100%;">
                                    <!-- Icono en la parte superior -->
                                    <div class="mb-2">
                                        <i class="fas fa-<?= $tab['icono'] ?> fa-2x"></i>
                                    </div>
                                    <!-- Título -->
                                    <h5 class="card-title"><?= $tab['titulo'] ?></h5>
                                    <!-- Texto -->
                                    <p class="card-text fs-9 text-center">
                                        <?= $tab['texto'] ?>
                                    </p>
                                    <!-- Botón -->
                                    <a href="<?= $tab['url'] ?>" class="btn btn-primary mt-auto">
                                        <i class="fas fa-chevron-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>