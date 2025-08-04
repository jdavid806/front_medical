<?php
include('../header.php');
include('../menu.php');
?>

<head>
    <link rel="stylesheet" href="./Farmacia/styles/farmacia.css">
</head>

<div class="mt-10">
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Farmacia</h4>
            <div class="d-flex align-items-center">
                <div class="me-3">
                    <span class="text-muted me-2">Fecha:</span>
                    <span id="currentDate">27/02/2025</span>
                </div>
                <div>
                    <span class="text-muted me-2">Hora:</span>
                    <span id="currentTime">14:30:45</span>
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
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button"
                                    id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Filtrar por estado
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                                    <li><a class="dropdown-item active" href="#" data-status="ALL">Todos</a></li>
                                    <li><a class="dropdown-item" href="#" data-status="PENDING">Pendiente</a></li>
                                    <li><a class="dropdown-item" href="#" data-status="VALIDATED">Validada</a></li>
                                    <li><a class="dropdown-item" href="#" data-status="DELIVERED">Entregada</a></li>
                                    <li><a class="dropdown-item" href="#" data-status="PARTIALLY_DELIVERED">Parcial</a>
                                    </li>
                                    <li><a class="dropdown-item" href="#" data-status="REJECTED">Rechazada</a></li>
                                </ul>
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
                                <h5 class="mb-0" id="pedido-numero"></h5>
                                <span class="badge bg-primary ms-2" id="pedido-status"></span>
                            </div>
                            <div class="text-muted" id="pedido-fecha">Creado: </div>
                        </div>
                        <div>
                            <div class="timer" id="orderTimer">00:00:00</div>
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
                                    <h6 class="card-title">Información del prescriptor</h6>

                                    <div class="mb-2">
                                        <strong>Nombre:</strong>
                                        <span id="prescriber-name"></span>
                                    </div>

                                    <div class="mb-2">
                                        <strong>Especialidad:</strong>
                                        <span id="prescriber-specialty"></span>
                                    </div>

                                    <div class="mb-2">
                                        <strong>Correo electrónico:</strong>
                                        <span id="prescriber-email"></span>
                                    </div>

                                    <div class="mb-2">
                                        <strong>Teléfono:</strong>
                                        <span id="prescriber-phone"></span>
                                    </div>

                                    <div class="mb-2">
                                        <strong>Dirección:</strong>
                                        <span id="prescriber-address"></span>
                                    </div>
                                </div>

                                <div class="mt-3">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-user-md text-primary me-2"></i>
                                        <span>Doctor responsable</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-white">
                        <h6 class="mb-0">Medicamentos</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Medicamento</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Verificación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="medication-item verified">
                                      
                                    </tr>
                                    <tr class="medication-item verified">
                                        
                                    </tr>
                                    <tr class="medication-item">
                                        
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-white">
                        <h6 class="mb-0">Receta Médica</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fas fa-file-prescription text-primary me-2 fs-4"></i>
                                    <div>
                                        <div class="fw-medium" id="receta-numero"></div>
                                        <div class="text-muted small" id="receta-info"></div>
                                    </div>
                                </div>
                                <div class="d-flex">
                                    <button id="btnVerReceta" class="btn btn-sm btn-outline-primary me-2">
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
                                    <div class="text-muted small" id="verificado-info">
                                        Verificada por: Carlos Méndez - 27/02/2025 14:20
                                    </div>

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
                    <button class="btn btn-outline-primary me-2" id="viewReceiptBtn" data-recipe-id="1">
                        <i class="fas fa-print me-1"></i> Imprimir recibo
                    </button>



                    <button id="btnCompletarEntrega" class="btn btn-primary">
                        <i class="fas fa-box me-1"></i> Entregar pedido
                    </button>

                </div>
            </div>
        </div>
    </div>
</div>
</div>
</div>

<div class="modal fade" id="verifiedDeliveryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Productos Verificados - Pedido #<span id="modalOrderId"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">

                <!-- Contenedor para mostrar los productos que han sido verificados en el front -->
                <div id="contenedorProductosVerificados" class="mb-3">
                    <!-- Aquí se cargarán dinámicamente los productos verificados -->
                </div>

                <!-- Tabla resumen: muestra detalle con precios por unidad, cantidad y subtotal -->
                <div class="table-responsive mb-3">
                    <table class="table align-middle">
                        <thead>
                            <tr>
                                <th>Medicamento</th>
                                <th>Cantidad</th>
                                <th>Precio unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody id="deliveryCartBody">
                            <!-- Cada fila se generará dinámicamente -->
                        </tbody>
                    </table>
                </div>

                <!-- Total general calculado -->
                <div class="text-end mb-3">
                    <h5>Total: <span id="deliveryTotalPrice">$0.00</span></h5>
                </div>

                <!-- Select para método de pago -->
                <div class="mb-3">
                    <label for="paymentMethod" class="form-label">Método de pago</label>
                    <select class="form-select" id="paymentMethod" required>
                        <option value="" disabled selected>Seleccione un método</option>
                    </select>

                </div>

                <!-- Notas o comentarios adicionales -->
                <div class="mb-3">
                    <label for="deliveryNotes" class="form-label">Notas de entrega</label>
                    <textarea class="form-control" id="deliveryNotes" rows="2"
                        placeholder="Observaciones o comentarios adicionales..."></textarea>
                </div>
            </div>

            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="submitDeliveryBtn">
                    <i class="fas fa-check me-1"></i> Entregar Pedido
                </button>
            </div>
        </div>
    </div>
</div>



<!-- Receipt Modal -->
<div class="modal fade" id="receiptModal" tabindex="-1" aria-labelledby="receiptModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="receiptModalLabel">Recibo</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Aquí se llenará la información del recibo -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="printReceiptBtn">Imprimir</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="./Farmacia/js/main.js"></script>
<script src="./Farmacia/js/farmaciaGeneral.js"></script>

<?php
include './modals/verificationModal.php';
include './modals/modalReceta.php';
include '../footer.php';

?>