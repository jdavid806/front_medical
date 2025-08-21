<?php
include "../menu.php";
include "../header.php";
?>

<style>
  .tox .tox-notification,
  .tox-promotion {
    display: none;
  }

  .hidden {
    display: none;
  }
</style>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Configuración</li>
      </ol>
    </nav>
    <div class="pb-9">
      <div class="row">
        <div class="col-12">
          <div class="col-10">
            <div class="d-flex justify-content-between col-12 row col-md-auto"
              id="scrollspyFacturacionVentas">
              <div class="col-6">
                <h2 class="mb-4">Configuración</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 g-md-4 g-xl-6">
        <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="info-facturacion-tab" data-bs-toggle="tab"
              href="#tab-config-empresa" role="tab" aria-controls="tab-info-facturacion"
              aria-selected="false">
              <i class="fas fa-building"></i> Configuración Empresa
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="entidades-tab" data-bs-toggle="tab" href="#tab-entidades" role="tab"
              aria-controls="tab-entidades" aria-selected="true">
              <i class="fas fa-sitemap"></i> Entidades
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="metodos-pago-tab" data-bs-toggle="tab" href="#tab-metodos-pago"
              role="tab" aria-controls="tab-metodos-pago" aria-selected="false">
              <i class="fas fa-credit-card"></i> Métodos de Pago
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="impuesto-cargo-tab" data-bs-toggle="tab" href="#tab-impuesto-cargo"
              role="tab" aria-controls="tab-impuesto-cargo" aria-selected="false">
              <i class="fas fa-percentage"></i> Impuesto Cargo
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="impuesto-retencion-tab" data-bs-toggle="tab"
              href="#tab-impuesto-retencion" role="tab" aria-controls="tab-impuesto-retencion"
              aria-selected="false">
              <i class="fas fa-hand-holding-usd"></i> Impuesto Retención
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="centro-costos-tab" data-bs-toggle="tab" href="#tab-centro-costos"
              role="tab" aria-controls="tab-centro-costos" aria-selected="false">
              <i class="fas fa-chart-pie"></i> Centro de Costos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="usuarios-tab" data-bs-toggle="tab" href="#tab-usuarios" role="tab"
              aria-controls="tab-usuarios" aria-selected="false">
              <i class="fas fa-users"></i> Usuarios
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="especialidades-tab" data-bs-toggle="tab" href="#tab-especialidades"
              role="tab" aria-controls="tab-especialidades" aria-selected="false">
              <i class="fas fa-stethoscope"></i> Especialidades Médicas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="roles-tab" data-bs-toggle="tab" href="#tab-roles" role="tab"
              aria-controls="tab-roles" aria-selected="false">
              <i class="fas fa-user-tag"></i> Roles de Usuario
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="horarios-tab" data-bs-toggle="tab" href="#tab-horarios" role="tab"
              aria-controls="tab-horarios" aria-selected="false">
              <i class="fas fa-calendar-alt"></i> Horarios de Atención
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="modulos-tab" data-bs-toggle="tab" href="#tab-modulos" role="tab"
              aria-controls="tab-modulos" aria-selected="false">
              <i class="fas fa-clinic-medical"></i> Modulos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="user-absences-tab" data-bs-toggle="tab" href="#tab-user-absences"
              role="tab" aria-controls="tab-user-absences" aria-selected="false">
              <i class="fas fa-calendar-alt"></i> Ausencias Programadas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="precios-tab" data-bs-toggle="tab" href="#tab-precios" role="tab"
              aria-controls="tab-precios" aria-selected="false">
              <i class="fas fa-dollar-sign"></i> Precios
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="consentimientos-tab" data-bs-toggle="tab" href="#tab-consentimientos"
              role="tab" aria-controls="tab-consentimientos" aria-selected="false">
              <i class="fas fa-file-contract"></i> Consentimientos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="importar-datos-tab" data-bs-toggle="tab" href="#tab-importar-datos"
              role="tab" aria-controls="tab-importar-datos" aria-selected="false">
              <i class="fas fa-file-import"></i> Importar Datos
            </a>
          </li>
          <!-- <li class="nav-item" role="presentation">
            <a class="nav-link" id="plantillas-mensajes-tab" data-bs-toggle="tab" href="#tab-plantillas-mensajes"
              role="tab" aria-controls="tab-plantillas-mensajes" aria-selected="false">
              <i class="fas fa-envelope"></i> Plantillas Mensajes
            </a>
          </li> -->
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="examenes-tab" data-bs-toggle="tab" href="#tab-examenes" role="tab"
              aria-controls="tab-examenes" aria-selected="false">
              <i class="fas fa-microscope"></i> Exámenes
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="comissions-tab" data-bs-toggle="tab" href="#tab-comissions" role="tab"
              aria-controls="tab-comissions" aria-selected="false">
              <i class="fas fa-users-viewfinder"></i> Comisiones
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="dgii-tab" data-bs-toggle="tab" href="#tab-dgii" role="tab"
              aria-controls="tab-dgii" aria-selected="false">
              <i class="fas fa-coins"></i> DGII
            </a>
          </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">
          <!-- Solo el primer tab cargado inicialmente -->
          <div class="tab-pane fade show active" id="tab-config-empresa" role="tabpanel"
            aria-labelledby="info-facturacion-tab">
            <?php include "./tabs/tab_tenantConfiguration.php"; ?>
          </div>

          <!-- Los demás tabs vacíos, se cargarán dinámicamente -->
          <div class="tab-pane fade" id="tab-entidades" role="tabpanel" aria-labelledby="entidades-tab"></div>
          <div class="tab-pane fade" id="tab-metodos-pago" role="tabpanel" aria-labelledby="metodos-pago-tab">
          </div>
          <div class="tab-pane fade" id="tab-impuesto-cargo" role="tabpanel"
            aria-labelledby="impuesto-cargo-tab"></div>
          <div class="tab-pane fade" id="tab-impuesto-retencion" role="tabpanel"
            aria-labelledby="impuesto-retencion-tab"></div>
          <div class="tab-pane fade" id="tab-centro-costos" role="tabpanel"
            aria-labelledby="centro-costos-tab"></div>
          <div class="tab-pane fade" id="tab-usuarios" role="tabpanel" aria-labelledby="usuarios-tab"></div>
          <div class="tab-pane fade" id="tab-especialidades" role="tabpanel"
            aria-labelledby="especialidades-tab"></div>
          <div class="tab-pane fade" id="tab-roles" role="tabpanel" aria-labelledby="roles-tab"></div>
          <div class="tab-pane fade" id="tab-horarios" role="tabpanel" aria-labelledby="horarios-tab"></div>
          <div class="tab-pane fade" id="tab-modulos" role="tabpanel" aria-labelledby="modulos-tab"></div>
          <div class="tab-pane fade" id="tab-user-absences" role="tabpanel"
            aria-labelledby="user-absences-tab"></div>
          <div class="tab-pane fade" id="tab-precios" role="tabpanel" aria-labelledby="precios-tab"></div>
          <div class="tab-pane fade" id="tab-consentimientos" role="tabpanel"
            aria-labelledby="consentimientos-tab"></div>
          <div class="tab-pane fade" id="tab-importar-datos" role="tabpanel"
            aria-labelledby="importar-datos-tab"></div>
          <div class="tab-pane fade" id="tab-examenes" role="tabpanel" aria-labelledby="examenes-tab"></div>
          <div class="tab-pane fade" id="tab-comissions" role="tabpanel" aria-labelledby="comissions-tab">
          </div>
          <div class="tab-pane fade" id="tab-dgii" role="tabpanel" aria-labelledby="dgii-tab">
            <?php //include "./tabs/tab_dgii.php"; 
            ?>
          </div>
        </div>

      </div>

    </div>
  </div>
</div>
</div>
</div>
</div>
<?php include "../footer.php"; ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>

<style>
  .custom-th {
    padding: 0.25rem;
    height: 40px;
    font-size: 16px;
  }

  .custom-td {
    padding: 0.25rem;
    height: 40px;
    font-size: 16px;
  }
</style>

<script type="module">
  import React from "react";
  import ReactDOMClient from "react-dom/client";
  import {
    ModuleApp
  } from './react-dist/modules/ModuleApp.js';
  import {
    UserApp
  } from './react-dist/users/UserApp.js';
  import {
    UserRoleApp
  } from './react-dist/user-roles/UserRoleApp.js';
  import {
    UserAvailabilityApp
  } from './react-dist/user-availabilities/UserAvailabilityApp.js';
  import {
    UserAbsenceApp
  } from './react-dist/user-absences/UserAbsenceApp.js';
  import {
    ExamConfigApp
  } from './react-dist/exams-config/ExamConfigApp.js';
  import {
    ComissionApp
  } from './react-dist/users/ComissionsApp.js';
  import  SpecialityApp from './react-dist/fe-config/speciality/SpecialityApp.js';
  // Importa aquí otros componentes React que necesites

  // Mapa de contenido de los tabs
  const tabContentMap = {
    'tab-config-empresa': '../Configuracion/tabs/tab_tenantConfiguration.php',
    'tab-entidades': '../Configuracion/tabs/tab_entitiesConfiguration.php',
    'tab-metodos-pago': '../Configuracion/tabs/tab_paymentMethodsConfiguration.php',
    'tab-impuesto-cargo': '../Configuracion/tabs/tab_taxesConfiguration.php',
    'tab-impuesto-retencion': '../Configuracion/tabs/tab_retentiosConfiguration.php',
    'tab-centro-costos': '../Configuracion/tabs/tab_costCentersConfiguration.php',
    'tab-usuarios': '../Configuracion/includes/usuarios.php',
    'tab-especialidades': '../Configuracion/tabs/tab_specialitiesConfiguration.php',
    'tab-roles': '../Configuracion/tabs/tab_rolesConfiguration.php',
    'tab-horarios': '../Configuracion/includes/userAvailabilities.php',
    'tab-modulos': '', // Este se maneja con React
    'tab-user-absences': '../Configuracion/tabs/tab_userAbsencesConfiguration.php',
    'tab-precios': '../Configuracion/tabs/tab_pricesConfiguration.php',
    'tab-consentimientos': '../Configuracion/tabs/tab_consentTemplatesConfiguration.php',
    'tab-importar-datos': '../Configuracion/tabs/tab_importDataConfigruation.php',
    'tab-examenes': '../Configuracion/tabs/tab_examsConfiguration.php',
    'tab-comissions': '../Configuracion/tabs/tab_commissionsConfiguration.php',
    'tab-dgii': '../Configuracion/tabs/tab_dgii.php'
  };

  // Mapa de componentes React por tab
  const reactComponentsMap = {
    'tab-usuarios': {
      component: UserApp,
      containerId: 'userAppReact'
    },
    'tab-modulos': {
      component: ModuleApp,
      containerId: 'gestionarModulosReact'
    },
    'tab-roles': {
      component: UserRoleApp,
      containerId: 'userRoleAppReact'
    },
    'tab-horarios': {
      component: UserAvailabilityApp,
      containerId: 'userAvailabilityAppReact'
    },
    'tab-user-absences': {
      component: UserAbsenceApp,
      containerId: 'userAbsencesAppReact'
    },
    'tab-examenes': {
      component: ExamConfigApp,
      containerId: 'examsConfigReact'
    },
    'tab-comissions': {
      component: ComissionApp,
      containerId: 'userComissionsAppReact'
    },
    'tab-especialidades': {
      component: SpecialityApp,
      containerId: 'specialities'
    }
    // Agrega aquí otros tabs con componentes React
  };

  // Función para inicializar componentes React
  function initReactComponent(tabId) {
    if (reactComponentsMap[tabId]) {
      const {
        component,
        containerId
      } = reactComponentsMap[tabId];
      const container = document.getElementById(containerId);

      if (container) {
        // Limpia cualquier contenido previo
        container.innerHTML = '';
        // Crea una nueva raíz React
        const root = ReactDOMClient.createRoot(container);
        // Renderiza el componente
        root.render(React.createElement(component));
      }
    }
  }

  // Función mejorada para cargar el contenido del tab
  async function loadTabContent(tabId) {
    const tabPane = document.getElementById(tabId);

    // Si ya está cargado, solo inicializa React si es necesario
    if (tabPane.dataset.loaded === 'true') {
      if (reactComponentsMap[tabId]) {
        initReactComponent(tabId);
      }
      return;
    }

    // Mostrar loader
    tabPane.innerHTML =
      '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';

    // Obtener la URL del contenido
    const contentUrl = tabContentMap[tabId];

    if (!contentUrl && !reactComponentsMap[tabId]) return;

    try {
      let html = '';

      // Si tiene contenido PHP, cargarlo via fetch
      if (contentUrl) {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        html = await response.text();
      }

      // Si es un tab con React, asegurar el contenedor
      if (reactComponentsMap[tabId]) {
        html = `<div id="${reactComponentsMap[tabId].containerId}"></div>`;
      }

      tabPane.innerHTML = html;
      tabPane.dataset.loaded = 'true';

      // Inicializar scripts específicos para tabs no-React
      if (!reactComponentsMap[tabId]) {
        initTabSpecificScripts(tabId);
      } else {
        // Inicializar componente React
        initReactComponent(tabId);
      }
    } catch (error) {
      console.error('Error cargando el tab:', error);
      tabPane.innerHTML = `
        <div class="alert alert-danger">
          Error al cargar el contenido. 
          <button onclick="loadTabContent('${tabId}')" class="btn btn-sm btn-danger ms-2">Reintentar</button>
        </div>`;
    }
  }

  // Función para inicializar scripts específicos de cada tab (no-React)
  async function initTabSpecificScripts(tabId) {
    switch (tabId) {
      case 'tab-entidades':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarEntidades();
        }
        break;

      case 'tab-metodos-pago':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarMetodosPago();
        }
        break;
      case 'tab-impuesto-cargo':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarImpuestos();
        }
        break;
      case 'tab-impuesto-retencion':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarRetenciones();
        }
        break;
      case 'tab-centro-costos':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarCentrosCosto();
        }
        break;
      case 'tab-especialidades':
        break;
      case 'tab-centro-costos':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarCentrosCosto();
        }
        break;
      case 'tab-precios':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarContenido();
        }
        break;
      case 'tab-consentimientos':
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
          cargarConsentimientos();
        }
        break;
    }
  }

  // Event listeners para los tabs
  document.querySelectorAll('#myTab a').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(event) {
      const target = event.target.getAttribute('href').substring(1);
      loadTabContent(target);
    });
  });

  // Cargar el primer tab al iniciar
  document.addEventListener('DOMContentLoaded', function() {
    loadTabContent('tab-config-empresa');
  });
</script>

<?php
include "./modales/modalAgregarSede.php";
include "./modales/modalAgregarEntidad.php";
include "./modales/ModalAgregarMetodoPago.php";
include "./modales/modalAgregarImpuestoPago.php";
include "./modales/modalAgregarRetencion.php";
include "./modales/modalAgregarCentroCosto.php";
include "./modales/modalAgregarRoles.php";
include "./ModalUserRole.php";
include "./modales/modalAgregarPlantillaConsentimiento.php";
include "./ModalPrice.php";
include "./modales/modalConfigEntidad.php";

include "./modales/ModalVincularWS.php";
?>