<?php
include "../../menu.php";
include "../../header.php";
include "./includes/modals/FacturaElectronica.php";
include "./includes/modals/modalNotaCredito.php";
?>

<link rel="stylesheet" href="../assets/css/styles.css">
<style>
    /* Tus estilos actuales ... */
</style>

<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Reportes Contables</li>
                </ol>
            </nav>
            <div class="row mt-4">
                <div class="row">
                    <div class="col-12">
                        <div class="col-10">
                            <div class="col-12 row col-md-auto">
                                <div class="col-6">
                                    <h2 class="mb-0">Reportes contables</h2>
                                </div>
                                <div class="col-6 text-end"
                                    style="z-index: 999999999999999999999999999999999999999999999999999999999">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pestañas -->
                <ul class="nav nav-underline fs-9 p-3" id="reporteContablesTabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="estadoResultado-tab" data-bs-toggle="tab" href="#estadoResultado"
                            role="tab" onclick="loadReactComponent('StatusResult')">
                            <i class="fas fa-chart-line"></i> Estado de resultados
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="balanceGeneral-tab" data-bs-toggle="tab" href="#balanceGeneral"
                            role="tab" onclick="loadReactComponent('BalanceSheet')">
                            <i class="fas fa-balance-scale"></i> Balance general
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="balanceCuentaContable-tab" data-bs-toggle="tab"
                            href="#balanceCuentaContable" role="tab"
                            onclick="loadReactComponent('BalanceAccountingAccount')">
                            <i class="fas fa-file-invoice-dollar"></i> Balance de prueba x Cuenta contable
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="balancePortercero-tab" data-bs-toggle="tab" href="#balancePortercero"
                            role="tab" onclick="loadReactComponent('BalanceThirdParty')">
                            <i class="fas fa-user-tie"></i> Balance de prueba x tercero
                        </a>
                    </li>
                </ul>

                <!-- Contenedor para los componentes React -->
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="estadoResultado" role="tabpanel">
                        <div id="react-container-status"></div>
                    </div>
                    <div class="tab-pane fade" id="balanceGeneral" role="tabpanel">
                        <div id="react-container-balance"></div>
                    </div>
                    <div class="tab-pane fade" id="balanceCuentaContable" role="tabpanel">
                        <div id="react-container-citas"></div>
                    </div>
                    <div class="tab-pane fade" id="balancePortercero" role="tabpanel">
                        <div id="react-container-sala"></div>
                    </div>
                </div>

                <script>
                    // Función para cargar dinámicamente los componentes React
                    let currentRoot = null;

                    function loadReactComponent(componentName) {
                        // Determinar el ID del contenedor basado en el componente
                        let containerId;
                        switch (componentName) {
                            case 'StatusResult':
                                containerId = 'react-container-status';
                                break;
                            case 'BalanceSheet':
                                containerId = 'react-container-balance';
                                break;
                            case 'BalanceAccountingAccount':
                                containerId = 'react-container-citas';
                                break;
                            case 'BalanceThirdParty':
                                containerId = 'react-container-sala';
                                break;
                            default:
                                containerId = 'react-container-status';
                        }

                        // Limpiar cualquier script anterior
                        const oldScript = document.getElementById('react-component-script');
                        if (oldScript) {
                            oldScript.remove();
                        }

                        // Crear un script para cargar el componente dinámicamente
                        const script = document.createElement('script');
                        script.id = 'react-component-script';
                        script.type = 'module';
                        script.innerHTML = `
                        import React from "react";
                        import ReactDOMClient from "react-dom/client";
                        import { ${componentName} } from './react-dist/billing/reports/${componentName}.js';
                        
                        const container = document.getElementById('${containerId}');
                        
                        // Limpiar la raíz anterior si existe
                        if (currentRoot) {
                            currentRoot.unmount();
                        }
                        
                        currentRoot = ReactDOMClient.createRoot(container);
                        currentRoot.render(React.createElement(${componentName}));
                    `;

                        // Agregar el script al documento
                        document.body.appendChild(script);
                    }
                    // Cargar el componente inicial (Estado de resultados)
                    document.addEventListener('DOMContentLoaded', function () {
                        loadReactComponent('StatusResult');
                    });
                </script>

                <?php
                include "../../footer.php";
                ?>