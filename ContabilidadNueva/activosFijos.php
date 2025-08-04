<?php
include "../menu.php";
include "../header.php";
?>

<style>
    /* Asegurar que el contenedor principal no cause overflow */
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    /* Estilos para las pestañas */
    .nav-underline .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        color: #495057;
    }

    .nav-underline .nav-link.active {
        color: #0d6efd;
        border-bottom: 2px solid #0d6efd;
    }

    .nav-underline .nav-link:hover:not(.active) {
        color: #0d6efd;
    }

    .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 20px;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active">Activos Fijos</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <!-- Pestañas -->
                <ul class="nav nav-underline mb-3" id="fixedAssetsTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="assets-tab" data-bs-toggle="tab"
                            data-bs-target="#assets-tab-pane" type="button" role="tab" aria-controls="assets-tab-pane"
                            aria-selected="true"
                            onclick="loadFixedAssetsComponent('FixedAssetsTable', 'assets-tab-pane')">
                            <i class="fas fa-building"></i> Activos Fijos
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="depreciation-tab" data-bs-toggle="tab"
                            data-bs-target="#depreciation-tab-pane" type="button" role="tab"
                            aria-controls="depreciation-tab-pane" aria-selected="false"
                            onclick="loadFixedAssetsComponent('DepreciationHistoryTable', 'depreciation-tab-pane')">
                            <i class="fas fa-calculator"></i> Historial
                        </button>
                    </li>
                </ul>

                <!-- Contenido de las pestañas -->
                <div class="tab-content" id="fixedAssetsTabContent">
                    <div class="tab-pane fade show active" id="assets-tab-pane" role="tabpanel"
                        aria-labelledby="assets-tab" tabindex="0">
                        <div id="FixedAssetsTable">
                            <div class="loading-spinner">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="depreciation-tab-pane" role="tabpanel"
                        aria-labelledby="depreciation-tab" tabindex="0">
                        <div id="DepreciationHistoryTable">
                            <div class="loading-spinner">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    // Función para cargar dinámicamente los componentes React
    let currentFixedAssetsRoot = null;

    async function loadFixedAssetsComponent(componentName, containerId) {
        try {
            // Mostrar spinner
            document.getElementById(componentName).innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            `;

            // Limpiar cualquier script anterior
            const oldScript = document.getElementById('react-fixed-assets-component-script');
            if (oldScript) {
                oldScript.remove();
            }

            // Crear un script para cargar el componente dinámicamente
            const script = document.createElement('script');
            script.id = 'react-fixed-assets-component-script';
            script.type = 'module';
            script.innerHTML = `
                import React from "react";
                import ReactDOMClient from "react-dom/client";
                import { ${componentName} } from './react-dist/accounting/fixedAssets/tables/${componentName}.js';
                
                try {
                    const container = document.getElementById('${componentName}');
                    
                    // Limpiar la raíz anterior si existe
                    if (currentFixedAssetsRoot) {
                        currentFixedAssetsRoot.unmount();
                    }
                    
                    currentFixedAssetsRoot = ReactDOMClient.createRoot(container);
                    
                    // Verificar si el componente existe
                    if (typeof ${componentName} === 'function') {
                        currentFixedAssetsRoot.render(React.createElement(${componentName}));
                    } else {
                        throw new Error('El componente ${componentName} no es una función válida');
                    }
                } catch (error) {
                    console.error('Error al renderizar ${componentName}:', error);
                    const container = document.getElementById('${componentName}');
                    container.innerHTML = \`
                        <div class="alert alert-danger">
                            <h5>Error al cargar ${componentName}</h5>
                            <p>\${error.message}</p>
                            <button class="btn btn-sm btn-primary" onclick="window.location.reload()">
                                Recargar página
                            </button>
                        </div>
                    \`;
                }
            `;

            // Agregar el script al documento
            document.body.appendChild(script);

        } catch (error) {
            console.error(`Error al cargar ${componentName}:`, error);
            document.getElementById(componentName).innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error crítico al cargar ${componentName}</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-sm btn-primary" onclick="window.location.reload()">
                        Recargar página
                    </button>
                </div>
            `;
        }
    }

    // Cargar el componente inicial (Activos Fijos)
    document.addEventListener('DOMContentLoaded', function () {
        loadFixedAssetsComponent('FixedAssetsTable', 'assets-tab-pane');
    });
</script>
<?php
include "../footer.php";
?>