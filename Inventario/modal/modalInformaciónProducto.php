<!-- Modal de Información del Producto -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">


<div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="infoModalLabel"><i class="bi bi-box-seam"></i> Información del Producto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <!-- Primera fila -->
                    <div class="row">
                        <div class="col-md-6">
                            <p><i class="bi bi-tag"></i> <strong>ID:</strong> <span id="modalProductoId">-</span></p>
                            <p><i class="bi bi-card-text"></i> <strong>Nombre:</strong> <span id="modalProductoNombre">-</span></p>
                            <p><i class="bi bi-file-text"></i> <strong>Descripción:</strong> <span id="modalProductoDescripcion">-</span></p>
                            <p><i class="bi bi-barcode"></i> <strong>Código de Barras:</strong> <span id="modalCodigoBarras">-</span></p>
                        </div>
                        <div class="col-md-6">
                            <p><i class="bi bi-box"></i> <strong>Stock:</strong> <span id="modalStock">-</span></p>
                            <p><i class="bi bi-exclamation-triangle"></i> <strong>Stock Mínimo:</strong> <span id="modalStockMin">-</span></p>
                            <p><i class="bi bi-graph-up"></i> <strong>Stock Máximo:</strong> <span id="modalStockMax">-</span></p>
                        </div>
                    </div>
                    
                    <hr>

                    <!-- Segunda fila -->
                    <div class="row">
                        <div class="col-md-6">
                            <p><i class="bi bi-cash-coin"></i> <strong>Precio de Compra:</strong> <span id="modalPrecioCompra">-</span></p>
                            <p><i class="bi bi-currency-dollar"></i> <strong>Precio de Venta:</strong> <span id="modalPrecioVenta">-</span></p>
                            <p><i class="bi bi-info-circle"></i> <strong>Estado:</strong> <span id="modalEstado">-</span></p>
                        </div>
                        <div class="col-md-6">
                            <p><i class="bi bi-building"></i> <strong>Laboratorio:</strong> <span id="modalLaboratorio">-</span></p>
                            <p><i class="bi bi-tags"></i> <strong>Marca:</strong> <span id="modalMarca">-</span></p>
                            <p><i class="bi bi-shop"></i> <strong>Proveedor:</strong> <span id="modalProveedor">-</span></p>
                        </div>
                    </div>

                    <hr>

                    <!-- Tercera fila -->
                    <div class="row">
                        <div class="col-md-6">
                            <p><i class="bi bi-clipboard-check"></i> <strong>Registro Sanitario:</strong> <span id="modalRegistroSanitario">-</span></p>
                            <p><i class="bi bi-calendar-event"></i> <strong>Fecha de Expiración:</strong> <span id="modalExpiracion">-</span></p>
                        </div>
                        <div class="col-md-6">
                            <p><i class="bi bi-flask"></i> <strong>Concentración:</strong> <span id="modalConcentracion">-</span></p>
                            <p><i class="bi bi-prescription2"></i> <strong>¿Requiere Receta?:</strong> <span id="modalReceta">-</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i> Cerrar</button>
            </div>
        </div>
    </div>
</div>
