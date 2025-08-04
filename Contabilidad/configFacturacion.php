<?php
include "../menu.php";
include "../header.php";
?>

<style>
    /* Estilos generales mejorados */
    .content {
        padding: 2rem;
        background-color: #f8f9fa;
    }

    /* Contenedor más ancho */
    .container-wide {
        max-width: 1400px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        padding: 2rem;
    }

    /* Breadcrumb alineado a la izquierda y fuera del contenedor */
    .breadcrumb-container {
        max-width: 1400px;
        margin: 3rem auto 3rem 2rem;
        padding: 0 2rem;
    }

    /* Estilos para los tabs de facturación */
    .nav-tabs {
        border-bottom: 2px solid #dee2e6;
        margin-bottom: 2rem;
    }

    .nav-tabs .nav-link {
        border: none;
        color: #6c757d;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        margin-right: 0.5rem;
        border-radius: 4px 4px 0 0;
        transition: all 0.2s ease;
    }

    .nav-tabs .nav-link:hover {
        color: #0d6efd;
        background-color: rgba(13, 110, 253, 0.05);
    }

    .nav-tabs .nav-link.active {
        color: #0d6efd;
        background-color: transparent;
        border-bottom: 3px solid #0d6efd;
    }

    .nav-tabs .nav-link i {
        margin-right: 8px;
    }

    /* Estilos para los formularios */
    .form-label {
        font-weight: 500;
        color: #495057;
        margin-bottom: 0.5rem;
    }

    .form-control,
    .form-select {
        border-radius: 4px;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ced4da;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-control:focus,
    .form-select:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    .btn-primary {
        background-color: #0d6efd;
        border-color: #0d6efd;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .btn-primary:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
    }

    .invalid-feedback {
        font-size: 0.875rem;
        color: #dc3545;
    }

    /* Estilos para los grupos de formulario */
    .form-group {
        margin-bottom: 1.5rem;
    }

    /* Efecto de transición para los paneles */
    .tab-content>.tab-pane {
        padding: 1.5rem;
        background-color: white;
        border-radius: 0 0 8px 8px;
    }

    .search-container {
        position: relative;
        margin-bottom: 5px;
    }

    .search-container input {
        width: 100%;
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
    }

    .search-container input:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    /* Estilo para el select con filtro */
    .form-select.with-search {
        margin-top: 5px;
    }

    /* Responsividad */
    @media (max-width: 768px) {
        .nav-tabs .nav-link {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }

        .container-wide {
            padding: 1rem;
        }

        .breadcrumb-container {
            padding: 0 1rem;
        }
    }
</style>

<!-- Input hidden para el ID de la empresa -->
<input type="hidden" id="id_Empresa" value="">

<div class="content">
    <!-- Breadcrumb fuera del contenedor principal -->
    <div class="breadcrumb-container">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="configContabilidad">Configuración</a></li>
                <li class="breadcrumb-item active">Configuración Facturacion</li>
            </ol>
        </nav>
    </div>

    <!-- Contenedor principal más ancho -->
    <div class="container-wide">
        <!-- Tabs de Facturación en la parte superior -->
        <ul class="nav nav-tabs" id="facturacionTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="fiscal-tab" data-bs-toggle="tab" data-bs-target="#tab-fiscal"
                    type="button" role="tab" aria-controls="tab-fiscal" aria-selected="true">
                    <i class="fa-solid fa-file-invoice-dollar"></i> Factura Fiscal
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="consumidor-tab" data-bs-toggle="tab" data-bs-target="#tab-consumidor"
                    type="button" role="tab" aria-controls="tab-consumidor" aria-selected="false">
                    <i class="fa-solid fa-receipt"></i> Factura Consumidor
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="gubernamental-tab" data-bs-toggle="tab" data-bs-target="#tab-gubernamental"
                    type="button" role="tab" aria-controls="tab-gubernamental" aria-selected="false">
                    <i class="fa-solid fa-building-columns"></i> Factura Gubernamental
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="notaCredito-tab" data-bs-toggle="tab" data-bs-target="#tab-notaCredito"
                    type="button" role="tab" aria-controls="tab-notaCredito" aria-selected="false">
                    <i class="fa-solid fa-file-invoice"></i> Notas de Crédito
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="notaDebito-tab" data-bs-toggle="tab" data-bs-target="#tab-notaDebito"
                    type="button" role="tab" aria-controls="tab-notaDebito" aria-selected="false">
                    <i class="fa-solid fa-file-invoice"></i> Notas de Débito
                </button>
            </li>
        </ul>

        <!-- Contenido de los tabs de Facturación -->
        <div class="tab-content" id="facturacionTabContent">

            <!-- Factura Fiscal -->
            <div class="tab-pane fade show active" id="tab-fiscal" role="tabpanel" aria-labelledby="fiscal-tab">
                <form class="row g-3 needs-validation" novalidate id="form-fiscal">
                    <input type="hidden" id="idFacturaFiscal" value="">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="prefijoFiscal">Prefijo DGII</label>
                            <input class="form-control" id="prefijoFiscal" name="prefijoFiscal" type="text"
                                placeholder="Ej: ABC" required>
                            <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="cuentaFiscal">Cuenta Contable</label>
                            <div class="search-container">
                                <input type="text" id="searchCuentaFiscal" placeholder="Buscar cuenta...">
                            </div>
                            <select class="form-select" id="cuentaFiscal" name="cuentaFiscal" required>
                                <option value="">Seleccione una cuenta</option>
                                <!-- Las opciones se cargarán dinámicamente -->
                            </select>
                            <div class="invalid-feedback">Favor seleccione una cuenta contable.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label class="form-label" for="numeroResolucionFiscal">Número Resolución</label>
                            <input class="form-control" id="numeroResolucionFiscal" name="numeroResolucionFiscal"
                                type="text" placeholder="Ej: 1234567890" required>
                            <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaDesdeFiscal">Facturas Desde</label>
                            <input class="form-control" id="facturaDesdeFiscal" name="facturaDesdeFiscal" type="number"
                                min="1" placeholder="Ej: 1001" required>
                            <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaHastaFiscal">Facturas Hasta</label>
                            <input class="form-control" id="facturaHastaFiscal" name="facturaHastaFiscal" type="number"
                                min="1" placeholder="Ej: 2000" required>
                            <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaResolucionFiscal">Fecha Resolución</label>
                            <input class="form-control" id="fechaResolucionFiscal" name="fechaResolucionFiscal"
                                type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaVencimientoFiscal">Fecha Vencimiento</label>
                            <input class="form-control" id="fechaVencimientoFiscal" name="fechaVencimientoFiscal"
                                type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary" type="button" id="guardarFiscal">
                            <i class="fa-solid fa-save me-2"></i>Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>

            <!-- Factura Consumidor -->
            <div class="tab-pane fade" id="tab-consumidor" role="tabpanel" aria-labelledby="consumidor-tab">
                <form class="row g-3 needs-validation" novalidate id="form-consumidor">
                    <input type="hidden" name="" id="idFacturaConsumidor" value="">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="prefijoConsumidor">Prefijo DGII</label>
                            <input class="form-control" id="prefijoConsumidor" name="prefijoConsumidor" type="text"
                                placeholder="Ej: ABC" required>
                            <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="cuentaConsumidor">Cuenta Contable</label>
                            <div class="search-container">
                                <input type="text" id="searchCuentaConsumidor" placeholder="Buscar cuenta...">
                            </div>
                            <select class="form-select" id="cuentaConsumidor" name="cuentaConsumidor" required>
                                <option value="">Seleccione una cuenta</option>
                                <!-- Las opciones se cargarán dinámicamente -->
                            </select>
                            <div class="invalid-feedback">Favor seleccione una cuenta contable.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label class="form-label" for="numeroResolucionConsumidor">Número Resolución</label>
                            <input class="form-control" id="numeroResolucionConsumidor"
                                name="numeroResolucionConsumidor" type="text" placeholder="Ej: 1234567890" required>
                            <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaDesdeConsumidor">Facturas Desde</label>
                            <input class="form-control" id="facturaDesdeConsumidor" name="facturaDesdeConsumidor"
                                type="number" min="1" placeholder="Ej: 1001" required>
                            <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaHastaConsumidor">Facturas Hasta</label>
                            <input class="form-control" id="facturaHastaConsumidor" name="facturaHastaConsumidor"
                                type="number" min="1" placeholder="Ej: 2000" required>
                            <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaResolucionConsumidor">Fecha Resolución</label>
                            <input class="form-control" id="fechaResolucionConsumidor" name="fechaResolucionConsumidor"
                                type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaVencimientoConsumidor">Fecha Vencimiento</label>
                            <input class="form-control" id="fechaVencimientoConsumidor"
                                name="fechaVencimientoConsumidor" type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary" type="button" id="guardarConsumidor">
                            <i class="fa-solid fa-save me-2"></i>Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>

            <!-- Factura Gubernamental -->
            <div class="tab-pane fade" id="tab-gubernamental" role="tabpanel" aria-labelledby="gubernamental-tab">
                <form class="row g-3 needs-validation" novalidate id="form-gubernamental">
                    <input type="hidden" name="" id="idFacturaGubernamental" value="">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="prefijoGubernamental">Prefijo DGII</label>
                            <input class="form-control" id="prefijoGubernamental" name="prefijoGubernamental"
                                type="text" placeholder="Ej: ABC" required>
                            <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="cuentaGubernamental">Cuenta Contable</label>
                            <div class="search-container">
                                <input type="text" id="searchCuentaGubernamental" placeholder="Buscar cuenta...">
                            </div>
                            <select class="form-select" id="cuentaGubernamental" name="cuentaGubernamental" required>
                                <option value="">Seleccione una cuenta</option>
                                <!-- Las opciones se cargarán dinámicamente -->
                            </select>
                            <div class="invalid-feedback">Favor seleccione una cuenta contable.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label class="form-label" for="numeroResolucionGubernamental">Número Resolución</label>
                            <input class="form-control" id="numeroResolucionGubernamental"
                                name="numeroResolucionGubernamental" type="text" placeholder="Ej: 1234567890" required>
                            <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaDesdeGubernamental">Facturas Desde</label>
                            <input class="form-control" id="facturaDesdeGubernamental" name="facturaDesdeGubernamental"
                                type="number" min="1" placeholder="Ej: 1001" required>
                            <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaHastaGubernamental">Facturas Hasta</label>
                            <input class="form-control" id="facturaHastaGubernamental" name="facturaHastaGubernamental"
                                type="number" min="1" placeholder="Ej: 2000" required>
                            <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaResolucionGubernamental">Fecha Resolución</label>
                            <input class="form-control" id="fechaResolucionGubernamental"
                                name="fechaResolucionGubernamental" type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaVencimientoGubernamental">Fecha Vencimiento</label>
                            <input class="form-control" id="fechaVencimientoGubernamental"
                                name="fechaVencimientoGubernamental" type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary" type="button" id="guardarGubernamental">
                            <i class="fa-solid fa-save me-2"></i>Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>

            <!-- Notas de Crédito -->
            <div class="tab-pane fade" id="tab-notaCredito" role="tabpanel" aria-labelledby="notaCredito-tab">
                <form class="row g-3 needs-validation" novalidate id="form-notaCredito">
                    <input type="hidden" name="" id="idNotaCredito" value="">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="prefijoNotaCredito">Prefijo DGII</label>
                            <input class="form-control" id="prefijoNotaCredito" name="prefijoNotaCredito" type="text"
                                placeholder="Ej: ABC" required>
                            <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="cuentaNotaCredito">Cuenta Contable</label>
                            <div class="search-container">
                                <input type="text" id="searchCuentaNotaCredito" placeholder="Buscar cuenta...">
                            </div>
                            <select class="form-select" id="cuentaNotaCredito" name="cuentaNotaCredito" required>
                                <option value="">Seleccione una cuenta</option>
                                <!-- Las opciones se cargarán dinámicamente -->
                            </select>
                            <div class="invalid-feedback">Favor seleccione una cuenta contable.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label class="form-label" for="numeroResolucionNotaCredito">Número Resolución</label>
                            <input class="form-control" id="numeroResolucionNotaCredito"
                                name="numeroResolucionNotaCredito" type="text" placeholder="Ej: 1234567890" required>
                            <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaDesdeNotaCredito">Facturas Desde</label>
                            <input class="form-control" id="facturaDesdeNotaCredito" name="facturaDesdeNotaCredito"
                                type="number" min="1" placeholder="Ej: 1001" required>
                            <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaHastaNotaCredito">Facturas Hasta</label>
                            <input class="form-control" id="facturaHastaNotaCredito" name="facturaHastaNotaCredito"
                                type="number" min="1" placeholder="Ej: 2000" required>
                            <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaResolucionNotaCredito">Fecha Resolución</label>
                            <input class="form-control" id="fechaResolucionNotaCredito"
                                name="fechaResolucionNotaCredito" type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaVencimientoNotaCredito">Fecha Vencimiento</label>
                            <input class="form-control" id="fechaVencimientoNotaCredito"
                                name="fechaVencimientoNotaCredito" type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary" type="button" id="guardarNotaCredito">
                            <i class="fa-solid fa-save me-2"></i>Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>

            <!-- Notas de Débito (Nueva sección) -->
            <div class="tab-pane fade" id="tab-notaDebito" role="tabpanel" aria-labelledby="notaDebito-tab">
                <form class="row g-3 needs-validation" novalidate id="form-notaDebito">
                    <input type="hidden" name="" id="idNotaDebito" value="">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="prefijoNotaDebito">Prefijo DGII</label>
                            <input class="form-control" id="prefijoNotaDebito" name="prefijoNotaDebito" type="text"
                                placeholder="Ej: ABC" required>
                            <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="cuentaNotaDebito">Cuenta Contable</label>
                            <div class="search-container">
                                <input type="text" id="searchCuentaNotaDebito" placeholder="Buscar cuenta...">
                            </div>
                            <select class="form-select" id="cuentaNotaDebito" name="cuentaNotaDebito" required>
                                <option value="">Seleccione una cuenta</option>
                                <!-- Las opciones se cargarán dinámicamente -->
                            </select>
                            <div class="invalid-feedback">Favor seleccione una cuenta contable.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-group">
                            <label class="form-label" for="numeroResolucionNotaDebito">Número Resolución</label>
                            <input class="form-control" id="numeroResolucionNotaDebito"
                                name="numeroResolucionNotaDebito" type="text" placeholder="Ej: 1234567890" required>
                            <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaDesdeNotaDebito">Facturas Desde</label>
                            <input class="form-control" id="facturaDesdeNotaDebito" name="facturaDesdeNotaDebito"
                                type="number" min="1" placeholder="Ej: 1001" required>
                            <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="facturaHastaNotaDebito">Facturas Hasta</label>
                            <input class="form-control" id="facturaHastaNotaDebito" name="facturaHastaNotaDebito"
                                type="number" min="1" placeholder="Ej: 2000" required>
                            <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaResolucionNotaDebito">Fecha Resolución</label>
                            <input class="form-control" id="fechaResolucionNotaDebito" name="fechaResolucionNotaDebito"
                                type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label" for="fechaVencimientoNotaDebito">Fecha Vencimiento</label>
                            <input class="form-control" id="fechaVencimientoNotaDebito"
                                name="fechaVencimientoNotaDebito" type="date" required>
                            <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary" type="button" id="guardarNotaDebito">
                            <i class="fa-solid fa-save me-2"></i>Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    // Variable global para almacenar las cuentas contables
    let cuentasContables = [];

    // Función para obtener datos del formulario
    function getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`El formulario con ID ${formId} no existe en el DOM`);
            return null;
        }

        const formData = new FormData(form);
        const formDataObject = {};

        formData.forEach((value, key) => {
            // Convertir nombres de campos con guiones a camelCase
            const newKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            formDataObject[newKey] = value;
        });

        return formDataObject;
    }

    // Función para obtener la ruta principal
    function obtenerRutaPrincipal() {
        // Implementa esta función según tu configuración
        return window.location.origin;
    }

    // Función para cargar las cuentas contables desde el backend
    async function cargarCuentasContables() {
        try {
            const response = await fetch(obtenerRutaPrincipal() + '/api/v1/admin/accounting-accounts?per_page=all');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Manejar diferentes formatos de respuesta
            let cuentas = [];

            if (Array.isArray(data)) {
                cuentas = data;
            } else if (data.data && Array.isArray(data.data)) {
                cuentas = data.data;
            } else if (data.accounts && Array.isArray(data.accounts)) {
                cuentas = data.accounts;
            } else {
                console.error('Formato de respuesta no reconocido:', data);
                throw new Error('Formato de respuesta no reconocido');
            }

            // Filtrar solo cuentas activas
            return cuentas.filter(cuenta => cuenta.status === 'active');
        } catch (error) {
            console.error('Error al cargar cuentas contables:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las cuentas contables. Por favor, intente nuevamente.'
            });
            return [];
        }
    }

    // Función para configurar los filtros de búsqueda
    function configurarFiltrosBusqueda() {
        const selects = [
            { id: 'cuentaFiscal', searchId: 'searchCuentaFiscal' },
            { id: 'cuentaConsumidor', searchId: 'searchCuentaConsumidor' },
            { id: 'cuentaGubernamental', searchId: 'searchCuentaGubernamental' },
            { id: 'cuentaNotaCredito', searchId: 'searchCuentaNotaCredito' },
            { id: 'cuentaNotaDebito', searchId: 'searchCuentaNotaDebito' }
        ];

        selects.forEach(item => {
            const searchInput = document.getElementById(item.searchId);
            const select = document.getElementById(item.id);

            if (searchInput && select) {
                searchInput.addEventListener('input', function () {
                    const searchTerm = this.value.toLowerCase();
                    const options = select.options;

                    for (let i = 0; i < options.length; i++) {
                        const option = options[i];
                        const text = option.textContent.toLowerCase();
                        option.style.display = text.includes(searchTerm) ? '' : 'none';
                    }

                    // Mantener visible la opción seleccionada
                    if (select.selectedIndex >= 0) {
                        select.options[select.selectedIndex].style.display = '';
                    }
                });
            }
        });
    }

    // Función para poblar los selects de cuentas contables
    async function poblarSelectsCuentas() {
        try {
            cuentasContables = await cargarCuentasContables();
            console.log('Cuentas cargadas:', cuentasContables);

            const selects = [
                'cuentaFiscal',
                'cuentaConsumidor',
                'cuentaGubernamental',
                'cuentaNotaCredito',
                'cuentaNotaDebito'
            ];

            selects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    // Limpiar opciones existentes (excepto la primera)
                    while (select.options.length > 1) {
                        select.remove(1);
                    }

                    // Ordenar cuentas por código
                    cuentasContables.sort((a, b) => {
                        return (a.account_code || '').localeCompare(b.account_code || '');
                    });

                    // Agregar nuevas opciones
                    cuentasContables.forEach(cuenta => {
                        const option = document.createElement('option');
                        option.value = cuenta.account_code;
                        option.textContent = `${cuenta.account_code} - ${cuenta.account_name}`;
                        option.setAttribute('data-id', cuenta.id);
                        select.appendChild(option);
                    });
                }
            });

            // Configurar los filtros de búsqueda después de poblar los selects
            configurarFiltrosBusqueda();

        } catch (error) {
            console.error('Error al poblar selects:', error);
        }
    }

    // Función para obtener el ID de la cuenta seleccionada
    function obtenerIdCuentaSeleccionada(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return null;

        const selectedOption = select.options[select.selectedIndex];
        return selectedOption ? selectedOption.getAttribute('data-id') : null;
    }

    // Función genérica para guardar cualquier tipo de factura
    async function guardarConfiguracionFactura(tipoFactura, formId) {
        try {
            const data = await getFormData(formId);
            if (!data) return;

            const idElement = document.getElementById(`idFactura${tipoFactura}`);
            const id = idElement ? idElement.value : null;

            // Obtener el ID de la cuenta contable seleccionada
            const idCuenta = obtenerIdCuentaSeleccionada(`cuenta${tipoFactura}`);

            if (!idCuenta) {
                throw new Error("Debe seleccionar una cuenta contable válida");
            }

            const infoFactura = {
                dian_prefix: data[`prefijo${tipoFactura}`],
                accounting_account: idCuenta, // Enviamos el ID
                resolution_number: data[`numeroResolucion${tipoFactura}`],
                invoice_from: data[`facturaDesde${tipoFactura}`],
                invoice_to: data[`facturaHasta${tipoFactura}`],
                type: obtenerTipoFactura(tipoFactura),
                resolution_date: data[`fechaResolucion${tipoFactura}`],
                expiration_date: data[`fechaVencimiento${tipoFactura}`]
            };

            // Verificación de datos requeridos
            if (!infoFactura.dian_prefix || !infoFactura.resolution_number) {
                throw new Error("Faltan datos requeridos para la factura");
            }

            // Estas funciones deben estar definidas en tu código
            if (id) {
                await updateTipoFacturas(id, infoFactura);
            } else {
                await createTipoFacturas(infoFactura);
            }

            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: `Configuración de ${obtenerNombreFactura(tipoFactura)} guardada correctamente`,
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => cargarDatosTenant(), 500);
        } catch (error) {
            console.error(`Error al guardar ${tipoFactura}:`, error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || `Error al guardar la configuración`
            });
        }
    }

    // Funciones específicas para cada tipo de factura
    async function guardarFacturaFiscal() {
        await guardarConfiguracionFactura('Fiscal', 'form-fiscal');
    }

    async function guardarFacturaConsumidor() {
        await guardarConfiguracionFactura('Consumidor', 'form-consumidor');
    }

    async function guardarFacturaGubernamental() {
        await guardarConfiguracionFactura('Gubernamental', 'form-gubernamental');
    }

    async function guardarNotaCredito() {
        await guardarConfiguracionFactura('NotaCredito', 'form-notaCredito');
    }

    async function guardarNotaDebito() {
        await guardarConfiguracionFactura('NotaDebito', 'form-notaDebito');
    }

    // Funciones auxiliares
    function obtenerTipoFactura(tipoFactura) {
        const tipos = {
            'Fiscal': 'tax_invoice',
            'Consumidor': 'consumer',
            'Gubernamental': 'government_invoice',
            'NotaCredito': 'credit_note',
            'NotaDebito': 'debit_note'
        };
        return tipos[tipoFactura] || '';
    }

    function obtenerNombreFactura(tipoFactura) {
        const nombres = {
            'Fiscal': 'factura fiscal',
            'Consumidor': 'factura consumidor',
            'Gubernamental': 'factura gubernamental',
            'NotaCredito': 'nota de crédito',
            'NotaDebito': 'nota de débito'
        };
        return nombres[tipoFactura] || 'factura';
    }

    // Función para cargar los datos del tenant (debes implementarla según tu API)
    async function cargarDatosTenant() {
        try {
            // Implementa esta función según tu API
            // Debe cargar los datos de configuración de facturación para cada tipo
        } catch (error) {
            console.error('Error al cargar datos del tenant:', error);
        }
    }

    // Inicialización
    document.addEventListener("DOMContentLoaded", function () {
        // Primero cargar las cuentas contables
        poblarSelectsCuentas().then(() => {
            // Luego cargar los datos del tenant
            return cargarDatosTenant();
        }).then(() => {
            // Asignar eventos a los botones
            document.getElementById("guardarFiscal")?.addEventListener("click", guardarFacturaFiscal);
            document.getElementById("guardarConsumidor")?.addEventListener("click", guardarFacturaConsumidor);
            document.getElementById("guardarGubernamental")?.addEventListener("click", guardarFacturaGubernamental);
            document.getElementById("guardarNotaCredito")?.addEventListener("click", guardarNotaCredito);
            document.getElementById("guardarNotaDebito")?.addEventListener("click", guardarNotaDebito);
        }).catch(error => {
            console.error("Error al cargar datos iniciales:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los datos iniciales. Por favor, recarga la página.'
            });
        });
    });
</script>

<?php
include "../footer.php";
?>