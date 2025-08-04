<?php
include('../header.php');
include('../menu.php');
?>

<head>
    <link rel="stylesheet" href="./Farmacia/styles/farmacia.css">
</head>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Farmacia</li>
            </ol>
        </nav>
    </div>
    <div class="mt-5">
        <div class="container-fluid">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">Insumos</h4>
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <span class="text-muted me-2"></span>
                        <span id="currentDate"></span>
                    </div>
                    <div class="me-3">
                        <span class="text-muted me-2"></span>
                        <span id="currentTime"></span>
                    </div>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newRequestModal">Nueva
                            Solicitud</button>
                    </div>
                </div>

            </div>

            <div class="row">
                <!-- Left Column - Order List -->
                <div class="col-lg-4">
                    <div class="card mb-4">
                        <div class="card-header bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Pedidos Pendientes</h5>
                                <div class="dropdown">
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="input-group">
                                    <span class="input-group-text bg-white border-end-0">
                                        <i class="fas fa-search text-muted"></i>
                                    </span>
                                    <input type="text" class="form-control border-start-0"
                                        placeholder="Buscar por # o nombre..." id="searchOrder">
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="order-list">
                                <div class="order-item active p-3 border-bottom">
                                    <div class="d-flex justify-content-between align-items-start">
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Order Details -->
                <div class="col-lg-8">
                    <div class="order-details p-4 mb-4">
                        <div class="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <div class="d-flex align-items-center">
                                    <h5 class="mb-0">Pedido #12346</h5>
                                    <span class="badge bg-primary ms-2">En espera</span>
                                </div>
                                <div class="text-muted">Creado: 27/02/2025 14:15</div>
                            </div>
                            <div>
                                <div class="timer" id="orderTimer">00:15:23</div>
                                <div class="text-muted text-center">Tiempo de espera</div>
                            </div>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="card h-100">
                                    <div class="card-body" id="client-info">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <h6 class="card-title">Detalles de insumos</h6>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Subtotal:</span>
                                            <span  id='subtotal'>$0</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Impuestos:</span>
                                            <span  id='impuesto'> $0</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Descuento:</span>
                                            <span  id='descuento'>-$0</span>
                                        </div>
                                        <hr>
                                        <div class="d-flex justify-content-between fw-bold">
                                            <span>Total:</span>
                                            <span id='total'>$0</span>
                                        </div>
                                        <div class="mt-3">
                                            <div class="d-flex align-items-center">
                                                <i class="fas fa-credit-card text-primary me-2"></i>
                                                <span>Pago con tarjeta (Prepagado)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card mb-4">
                            <div class="card-header bg-white">
                                <h6 class="mb-0">Insumos</h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">

                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Insumos</th>
                                                <th>Cantidad</th>
                                                <th>Verificación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="medication-item verified">
                                                <td>
                                                    <div class="fw-medium">Guantes </div>
                                                    <div class="text-muted small">Guantes - Genérico</div>
                                                </td>
                                                <td>1 caja</td>
                                                <td>
                                                    <span class="badge bg-success">Verificado</span>
                                                </td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary">
                                                        <i class="fas fa-redo"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="card mb-4">
                            <div class="card-header bg-white">
                                <h6 class="mb-0">Lista de insumos</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center mb-3">
                                            <i class="fas fa-file-prescription text-primary me-2 fs-4"></i>
                                            <div>
                                                <div class="fw-medium">Receta #RX-2025-0234</div>
                                                <div class="text-muted small">Dr. Alejandro Morales - 25/02/2025</div>
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                            <button class="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal"
                                                data-bs-target="#modalReceta">
                                                <i class="fas fa-eye me-1"></i> Ver receta
                                            </button>
                                            <button class="btn btn-sm btn-outline-secondary">
                                                <i class="fas fa-print me-1"></i> Imprimir
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="verification-box">
                                            <i class="fas fa-check-circle text-success fs-3 mb-2"></i>
                                            <div class="fw-medium">Receta verificada</div>
                                            <div class="text-muted small">Verificada por: Carlos Méndez - 27/02/2025
                                                14:20
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between">
                            <button class="btn btn-outline-secondary">
                                <i class="fas fa-arrow-left me-1"></i> Volver
                            </button>
                            <div>
                                <button class="btn btn-outline-primary me-2" data-bs-toggle="modal"
                                    data-bs-target="#receiptModal">
                                    <i class="fas fa-print me-1"></i> Imprimir recibo
                                </button>
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deliveryModal">
                                    <i class="fas fa-box me-1"></i> Entregar Insumo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Verification Modal -->
<div class="modal fade" id="verificationModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Verificar Medicamento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Información del medicamento seleccionado -->
                <div class="text-center mb-4">
                    <div class="fw-bold mb-2" id="medicamentoNombre">Seleccione un medicamento</div>
                    <div class="text-muted" id="medicamentoDescripcion">Descripción aquí...</div>
                </div>

                <!-- Selector de medicamentos -->
                <div class="mb-4">
                    <label class="form-label">Seleccionar Medicamento</label>
                    <select id="medicamentoSelect" class="form-select">
                        <option value="">Buscar medicamento...</option>
                    </select>
                </div>

                <!-- Información adicional -->
                <div class="mb-4">
                    <label class="form-label">Lote</label>
                    <input type="text" class="form-control" id="medicamentoLote" placeholder="Ingresar número de lote">
                </div>

                <div class="mb-4">
                    <label class="form-label">Fecha de vencimiento</label>
                    <input type="date" class="form-control" id="medicamentoFechaVenc">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="verifyButton">Verificar</button>
            </div>
        </div>
    </div>
</div>


<!-- Delivery Modal -->
<div class="modal fade" id="deliveryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Entregar Pedido #12346</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning mb-4">
                    <div class="d-flex">
                        <i class="fas fa-exclamation-triangle me-2 mt-1"></i>
                        <div>
                            <div class="fw-bold">Verificación pendiente</div>
                            <div>Hay 1 medicamento pendiente de verificación. Complete la verificación antes de
                                entregar.</div>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <h6>Identificación del cliente</h6>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="idCheck">
                        <label class="form-check-label" for="idCheck">
                            Documento de identidad verificado
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="ageCheck">
                        <label class="form-check-label" for="ageCheck">
                            Mayor de edad verificado
                        </label>
                    </div>
                </div>

                <div class="mb-4">
                    <h6>Firma del cliente</h6>
                    <div class="signature-pad mb-2" id="signaturePad"></div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-secondary" id="clearSignature">
                            <i class="fas fa-eraser me-1"></i> Limpiar
                        </button>
                    </div>
                </div>

                <div class="mb-4">
                    <h6>Información adicional</h6>
                    <textarea class="form-control" rows="2"
                        placeholder="Notas o comentarios sobre la entrega..."></textarea>
                </div>

                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="confirmCheck" required>
                    <label class="form-check-label" for="confirmCheck">
                        Confirmo que todos los medicamentos han sido verificados y entregados correctamente
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="completeDeliveryBtn">
                    <i class="fas fa-check me-1"></i> Completar entrega
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Receipt Modal -->
<div class="modal fade" id="receiptModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Recibo de Entrega</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="receipt-preview">
                    <div class="receipt-header">
                        <div class="fw-bold">FARMACIA DELIVERY</div>
                        <div>Av. Principal 123, Ciudad</div>
                        <div>Tel: +1 234 567 890</div>
                    </div>

                    <div class="receipt-divider"></div>

                    <div class="text-center mb-2">
                        <div class="fw-bold">RECIBO DE ENTREGA</div>
                        <div>Pedido: #12346</div>
                        <div>Fecha: 27/02/2025 14:45</div>
                    </div>

                    <div class="receipt-divider"></div>

                    <div class="mb-2">
                        <div>Cliente: Sophia Anderson</div>
                        <div>Tel: +1 888 8888 8888</div>
                    </div>

                    <div class="receipt-divider"></div>

                    <div class="mb-2">
                        <div class="d-flex justify-content-between">
                            <span>Amoxicilina 500mg</span>
                            <span>$12.99</span>
                        </div>
                        <div class="small text-muted">1 caja x $12.99</div>

                        <div class="d-flex justify-content-between mt-2">
                            <span>Loratadina 10mg</span>
                            <span>$17.50</span>
                        </div>
                        <div class="small text-muted">2 cajas x $8.75</div>

                        <div class="d-flex justify-content-between mt-2">
                            <span>Omeprazol 20mg</span>
                            <span>$9.25</span>
                        </div>
                        <div class="small text-muted">1 caja x $9.25</div>
                    </div>

                    <div class="receipt-divider"></div>

                    <div class="mb-2">
                        <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>$39.74</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Impuestos (10%):</span>
                            <span>$3.97</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Descuento:</span>
                            <span>-$5.00</span>
                        </div>
                        <div class="d-flex justify-content-between fw-bold">
                            <span>TOTAL:</span>
                            <span>$38.71</span>
                        </div>
                    </div>

                    <div class="receipt-divider"></div>

                    <div class="mb-2">
                        <div>Método de pago: Tarjeta de crédito</div>
                        <div>Atendido por: Carlos Méndez</div>
                    </div>

                    <div class="barcode">
                        <img src="https://via.placeholder.com/250x50" alt="Código de barras">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="printReceiptBtn">
                    <i class="fas fa-print me-1"></i> Imprimir
                </button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="./Farmacia/js/insumos.js"></script>

<?php
include './modals/nuevaSolicitud.php';
include './modals/modalReceta.php';
include '../footer.php';

?>