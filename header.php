<style>
  * {
    font-size: large;
  }
</style>


<link rel="stylesheet" href="fuentes/fuentes.css">
<nav class="navbar navbar-top fixed-top navbar-expand-lg" id="navbarCombo" data-navbar-top="combo"
  data-move-target="#navbarVerticalNav">
  <div class="navbar-logo">

    <a class="navbar-brand me-1 me-sm-3" href="/Dashboard">
      <div class="d-flex align-items-center">
        <div class="d-flex align-items-center" id=""><img src="/logo_monaros_sinbg_light.png" alt="phoenix"
            width="125" />

        </div>
      </div>
    </a>
  </div>
  <div class="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center"
    id="navbarTopCollapse">
    <ul class="navbar-nav navbar-nav-top" data-dropdown-on-hover="data-dropdown-on-hover">
      <li class="nav-item dropdown"><a class="nav-link dropdown-toggle lh-1" href="#!" role="button"
          data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span
            class="uil fs-8 me-2 uil-home"></span>Home</a>
        <ul class="dropdown-menu navbar-dropdown-caret">
          <li><a class="dropdown-item" href="pacientes">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="home"></span>Inicio
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="pacientes">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="users"></span>Pacientes
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="citasControl#citas">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="calendar"></span>Citas
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="citasControl">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="user-plus"></span>Admisiones
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="telemedicina">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                  data-feather="video"></span>Telemedicina
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="homeFarmacia">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                  data-feather="airplay"></span>Farmacia
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="homeInventario">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                  data-feather="folder"></span>Inventario
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="homeMarketing">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                  data-feather="briefcase"></span>Marketing
              </div>
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item dropdown"><a class="nav-link dropdown-toggle lh-1" href="Menu_reports" role="button"
          data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span
            class="uil fs-8 me-2 uil-archive"></span>Reportes</a>
        <ul class="dropdown-menu navbar-dropdown-caret" style="width: 300px;">
          <li><a class="dropdown-item" href="RIPS_Report">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="calendar"></span>RIPS
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Registered_patients">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="users"></span>Pacientes
                Registrados
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Clinical_histories_general">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="heart"></span>Historias
                Clinicas
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Clients">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="user-check"></span>Clientes
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Schedule">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="book-open"></span>Agendas
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Invoices">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="calendar"></span>Citas
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Estimates">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="briefcase"></span>Facturas
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="RIPS_Report">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="columns"></span>Presupuestos
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="Accounts_receivable">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="credit-card"></span>Cuentas a
                Cobrar
              </div>
            </a>
          </li>
      </li>
    </ul>
    <li class="nav-item dropdown"><a class="nav-link dropdown-toggle lh-1" href="Menu_reports" role="button"
        data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span
          class="uil fs-8 me-2 uil-credit-card">
        </span>Facturación</a>
      <ul class="dropdown-menu navbar-dropdown-caret" style="width: 300px;">
        <li><a class="dropdown-item" href="FE_FCE">
            <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="credit-card"></span>Generar
              Facturas
            </div>
          </a>
        </li>
      </ul>
    </li>
    <ul>
      <li class="nav-item dropdown"><a class="nav-link dropdown-toggle lh-1" href="farmacia" role="button"
          data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span
            class="uil fs-8 me-2 uil-airplay">
          </span>Farmacia</a>
        <ul class="dropdown-menu navbar-dropdown-caret" style="width: 300px;">
          <li><a class="dropdown-item" href="farmacia">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="heart"></span>Entrega de
                medicamentos
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="insumos">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="package"></span>Entrega de
                insumos
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="caja">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="edit-2"></span>Caja
              </div>
            </a>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li class="nav-item dropdown"><a class="nav-link dropdown-toggle lh-1" href="inventarioGeneral" role="button"
          data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span
            class="uil fs-8 me-2 uil-folder">
          </span>Inventarios</a>
        <ul class="dropdown-menu navbar-dropdown-caret" style="width: 300px;">
          <li><a class="dropdown-item" href="inventarioGeneral">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="package"></span>Inventario
                General
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="inventarioMedicamentos">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                  data-feather="plus-square"></span>Inventario Medicamentos
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="inventarioVacunas">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil" data-feather="edit-2"></span>Inventario
                Vacunas
              </div>
            </a>
          </li>
          <li><a class="dropdown-item" href="inventarioInsumos">
              <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                  data-feather="thermometer"></span>Inventario
                Insumos
              </div>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <ul class="navbar-nav navbar-nav-icons flex-row">
    <li class="nav-item">
      <div class="theme-control-toggle fa-icon-wait px-2">
        <input class="form-check-input ms-0 theme-control-toggle-input" type="checkbox"
          data-theme-control="phoenixTheme" value="dark" id="themeControlToggle" />
        <label class="mb-0 theme-control-toggle-label theme-control-toggle-light" for="themeControlToggle"
          data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme"
          style="height:32px;width:32px;"><span class="icon" data-feather="moon"></span></label>
        <label class="mb-0 theme-control-toggle-label theme-control-toggle-dark" for="themeControlToggle"
          data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme"
          style="height:32px;width:32px;"><span class="icon" data-feather="sun"></span></label>
      </div>
    </li>
    <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#searchBoxModal"><span
          data-feather="search" style="height:19px;width:19px;margin-bottom: 2px;"></span></a></li>

    <li class="nav-item dropdown">
      <a class="nav-link" id="navbarDropdownNindeDots" href="#" role="button" data-bs-toggle="dropdown"
        aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false">
        <svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="2" cy="2" r="2" fill="currentColor"></circle>
          <circle cx="2" cy="8" r="2" fill="currentColor"></circle>
          <circle cx="2" cy="14" r="2" fill="currentColor"></circle>
          <circle cx="8" cy="8" r="2" fill="currentColor"></circle>
          <circle cx="8" cy="14" r="2" fill="currentColor"></circle>
          <circle cx="14" cy="8" r="2" fill="currentColor"></circle>
          <circle cx="14" cy="14" r="2" fill="currentColor"></circle>
          <circle cx="8" cy="2" r="2" fill="currentColor"></circle>
          <circle cx="14" cy="2" r="2" fill="currentColor"></circle>
        </svg></a>

      <div class="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-nine-dots shadow border"
        style="width:23vw !important" aria-labelledby="navbarDropdownNindeDots">
        <div class="card bg-body-emphasis position-relative border-0">
          <div class="card-body pt-3 px-3 pb-0 overflow-auto scrollbar" style="height: 11rem;">
            <div class="row text-center align-items-center gx-0 gy-0">
              <div class="col-4">
                <a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="FE_FCE"><img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Facturación</p>
                </a>
              </div>
              <div class="col-4">
                <a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="FE_Config">
                  <img src="assets/img/nav-icons/CashButton.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Configuración</p>
                </a>
              </div>

              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="FE_Contabilidad"><img src="assets/img/nav-icons/Calculator.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Contabilidad</p>
                </a>
              </div>

              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="FE_Nomina"><img src="assets/img/nav-icons/Calculator.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Nómina</p>
                </a>
              </div>

              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="Menu_reports"><img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Reportes</p>
                </a>
              </div>


              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="caja"><img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Caja</p>
                </a>
              </div>

              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="Config_PDF"><img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">PDF</p>
                </a>
              </div>

              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="Mensajes_whatsapp"><img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Mensajería</p>
                </a>
              </div>

              <div class="col-4"><a
                  class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="consultas-anulacion-pendiente"><img src="assets/img/nav-icons/Container.png" alt=""
                    width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Anulaciones</p>
                </a>
              </div>

              <div class="col-4">
                <a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="waiting-room">
                  <img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">
                    Sala de espera
                  </p>
                </a>
              </div>

              <div class="col-4">
                <a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="gestion-turnos">
                  <img src="assets/img/nav-icons/Container.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">
                    Turnos
                  </p>
                </a>
              </div>

              <div class="col-4">
                <a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3"
                  href="panel-encuesta">
                  <img src="assets/img/nav-icons/IconButton.png" alt="" width="30" />
                  <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">
                    Encuentas
                  </p>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </li>

    <li class="nav-item dropdown"><a class="nav-link lh-1 pe-0" id="navbarDropdownUser" href="#!" role="button"
        data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
        <div class="avatar avatar-l ">
          <img class="rounded-circle " src="assets/img/team/40x40/57.webp" alt="" />

        </div>
      </a>
      <div class="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border"
        aria-labelledby="navbarDropdownUser">
        <div class="card position-relative border-0">
          <div class="card-body p-0">
            <div class="text-center pt-4 pb-3">
              <div class="avatar avatar-xl ">
                <img class="rounded-circle " src="assets/img/team/72x72/57.webp" alt="" />

              </div>
              <h6 class="mt-2 text-body-emphasis">Jerry Seinfield</h6>
            </div>
            <!-- <div class="mb-3 mx-3">
                      <input class="form-control form-control-sm" id="statusUpdateInput" type="text" placeholder="Update your status" />
                    </div> -->
          </div>
          <div class="overflow-auto scrollbar" style="height: 4rem;">
            <ul class="nav d-flex flex-column mb-2 pb-1">
              <!-- <li class="nav-item"><a class="nav-link px-3 d-block" href="apps/social/settings.php"> <span
                    class="me-2 text-body align-bottom" data-feather="user"></span><span>Perfil</span></a></li> -->
              <li class="nav-item"><a class="nav-link px-3 d-block" href="#settings-offcanvas"
                  data-bs-toggle="offcanvas"> <span class="me-2 text-body align-bottom"
                    data-feather="sliders"></span>Personalizar</a></li>
            </ul>
          </div>
          <div class="px-3"> <a class="btn btn-phoenix-secondary d-flex flex-center w-100" id="btn-logout" href="#">
              <span class="me-2" data-feather="log-out"> </span>Cerrar Sesión</a></div>
          <div class="my-2 text-center fw-bold fs-10 text-body-quaternary"><a class="text-body-quaternary me-1"
              href="#!">Privacy policy</a>&bull;<a class="text-body-quaternary mx-1" href="#!">Terms</a>&bull;<a
              class="text-body-quaternary ms-1" href="#!">Cookies</a></div>
        </div>
      </div>
      </div>
    </li>
  </ul>
</nav>

<script>
  const themeController = document.body;

  const imgLogo = document.getElementById("imgLogo");

  themeController.addEventListener(
    "clickControl",
    ({
      detail: {
        control,
        value
      }
    }) => {
      if (control === "phoenixTheme") {
        const prStyle = document.getElementById("user-style-pr-default");
        console.log(control, prStyle);

        // Obtener el modo del tema
        const mode = value === 'auto' ? window.phoenix.utils.getSystemTheme() : value;

        // Cambiar la imagen según el tema
        if (mode === "dark") {
          //imgLogo.src = "/logo_monaros_sinbg_dark.png";
          prStyle.href = `assets/css/bootstrap4pr_dark/theme.css`;
        } else {
          //imgLogo.src = "/logo_monaros_sinbg_light.png";
          prStyle.href = `assets/css/bootstrap4pr/theme.css`;
        }

      }
    }
  );
</script>