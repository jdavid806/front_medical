<?php
include "../menu.php";
include "../header.php";
include "./datosNomina.php"; // CONTIENE LAS INSTANCIAS DE LOS MODELOS Y CONTROLADORES, ESTOS TRAEN LOS DATOS CORRESPONDIENTES DE ESTA SECCION
include "./datosReclutamiento.php"; // CONTIENE LAS INSTANCIAS DE LOS MODELOS Y CONTROLADORES, ESTOS TRAEN LOS DATOS CORRESPONDIENTES DE ESTA SECCION

// include "./datosPrueba.php";

$urlWeb = $BASE . "NominaA/ofertas/" . encrypt($_SESSION["ID"]);
$urlTimer = $BASE . "TimeTracking/" . encrypt($_SESSION["ID"]);

?>
<!-- FULL CALENDAR -->
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js'></script>
<!-- FULL CALENDAR -->

<?php
// var_dump($ConfigNominaUser);

?>


<div class="componete">
  <div class="content">
    <div class="container-small">
      <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
          <li class="breadcrumb-item active" onclick="location.reload()">Nomina</li>
        </ol>
      </nav>
      <div class="pb-9">
        <div class="row">
          <div class="col-12">
            <div class="col-10">
              <div class="col-12 row col-md-auto">
                <div class="col-6">
                  <h2 class="mb-0">Nomina</h2>
                </div>
                <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">

                </div>
              </div>
              <div class="col-12 col-md-auto">
                <div class="d-flex">
                  <div class="flex-1 d-md-none">
                    <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas"
                      data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row g-0 g-md-4 g-xl-6">

          <div class="col-md-12 col-lg-12 col-xl-12">
            <div class="lead-details-container">
              <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" id="navbar-deals-detail" >
                <ul class="nav nav-underline fs-9" role="tablist">
                  <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-masivos-dashboard')">Dashboard</a></li>
                  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-masivos-reclutamiento')">Reclutamiento</a></li>
                  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-masivos-nomina')">Nomina</a></li>
                  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-masivos-cgenerales')">Generales</a></li>
                </ul>
              </nav>
              <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0"
                data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true"
                tabindex="0">



                <div class="mb-8" id="content-masivos-reclutamiento">
                  <div class=" col-12 row mb-4"
                    id="scrollspyFacturacionVentas">
                    <div class="col-6">
                      <h4 class="mb-1" id="scrollspyFacturacionVentas">Reclutamiento</h4>
                    </div>
                    <div class="col-6 text-end">
                      <?= $dropdownNew ?>
                    </div>
                  </div>
                  <div class="col-12 row">
                    <div class="card mb-3">
                      <div class="card-body">

                        <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy col-md-12" style="background-color: transparent !important;z-index: 10" id="navbar-deals-detail">
                          <div class="col-md-7">
                            <ul class="nav nav-underline fs-9" role="tablist">
                              <?php
                              $array_subsecciones = ['sub-content-apertura', 'sub-content-candidatos', 'sub-content-entrevistas', 'sub-content-promociones', 'sub-content-estados','sub-content-configweb','sub-content-contratos'];
                              $array_subsecciones = htmlspecialchars(json_encode($array_subsecciones), ENT_QUOTES);

                              ?>
                              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-apertura', <?= $array_subsecciones ?>)">Puestos</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-candidatos', <?= $array_subsecciones ?>)">Postulaciones / Candidatos</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-entrevistas', <?= $array_subsecciones ?>)">Entrevistas</a></li>
                              <!-- <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-promociones', <?= $array_subsecciones ?>)">Promociones</a></li> -->
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-contratos', <?= $array_subsecciones ?>)">Contratos</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-configweb', <?= $array_subsecciones ?>)">Web</a></li>
                              <!-- <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-reclutamiento','sub-content-estados', <?= $array_subsecciones ?>)">Estados</a></li> -->
                              <!-- <li class="nav-item">
                                
                              </li> -->
                            </ul>

                          </div>
                          <div class="col-md-5 row text-end">
                            
                            <div class="col-md-8 p-0">
                              <button class="btn btn-info btn-sm" onclick="window.open('<?=$urlWeb?>', '_blank')"  type="button">
                                <i class="fas fa-laptop-code"></i> &nbsp; Web
                              </button>
                            </div>

                            <div class="col-md-4 p-0">
                              <div class="dropdown">
                                <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                  <i class="fas fa-plus"></i> &nbsp; Nuevo
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalReclutamientoPuesto">Puesto de trabajo</a></li>
                                  <!-- <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalReclutamientoCandidato">Candidatos</a></li> -->
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEntrevista">Entrevista</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalReclutamientoPromocion">Promocion</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoContrato">Contrato</a></li>
                                </ul>
                              </div>
                            </div>

                          </div>

                      </div>

                      </nav>
                      <?php include "./Reclutamiento/SeccionesReclutamiento.php";  ?>


                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8" id="content-masivos-nomina">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Nomina</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">

                      <div class="col-md-12 row">
                        <div class="col-md-8">
                          <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" style="background-color: white !important; width: 100% !important;" id="navbar-deals-detail">
                            <ul class="nav nav-underline fs-9" role="tablist">
                              <?php
                              $array_subsecciones_nomina = ['sub-content-trabajadores', 'sub-content-contratos', 'sub-content-liquidacionesnomina', 'sub-content-liquidacionestrabajadores'];
                              $array_subsecciones_nomina = htmlspecialchars(json_encode($array_subsecciones_nomina), ENT_QUOTES);
  

                              ?>
                              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-nomina','sub-content-trabajadores', <?= $array_subsecciones_nomina ?>)">Trabajadores</a></li>
                              <!-- <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-nomina','sub-content-contratos', <?= $array_subsecciones_nomina ?>)">Contratos</a></li> -->
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-nomina','sub-content-liquidacionesnomina', <?= $array_subsecciones_nomina ?>)">Liquidaciones Nomina</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-nomina','sub-content-liquidacionestrabajadores', <?= $array_subsecciones_nomina ?>)">Liquidaciones Trabajadores</a></li>
                            </ul>
                          </nav>
                        </div>
                        <div class="col-md-4 row text-end">
                            <div class="col-md-4"></div>
                            <div class="col-md-5 p-1">
                              <button class="btn btn-info btn-sm" onclick="window.open('<?=$urlTimer?>', '_blank')" type="button"><i class="fas fa-clock"></i>&nbsp;Marcaje</button>
                            </div>

                            <div class="col-md-3 p-1">
                              <div class="dropdown">
                                <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuNomina" data-bs-toggle="dropdown" aria-expanded="false">
                                  <i class="fas fa-plus"></i> &nbsp; Nuevo
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuNomina">
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoTrabajador">Trabajador</a></li>
                                  <!-- <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoContrato">Contrato</a></li> -->
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaLiquidacionNomina">Liquidacion de Nomina</a></li>
                                </ul>
                              </div>

                            </div>

                        </div>
                      </div>
                      <?php include "./SeccionesNomina.php";  ?>


                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8" id="content-masivos-dashboard">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Dashboard</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="card mb-3">

                    <div class="card-header">
                    </div>
                    <div class="card-body">

                      <div class="row justify-content-between mb-4">


                        <?php

                        foreach ($datosEstadisticas as $estadistica) { ?>
                          <div class="col-6 col-md-4 col-xxl-2 text-center border-translucent border-start-xxl border-end-xxl-0 border-bottom-xxl-0 border-end border-bottom pb-2 pb-xxl-0 ">
                            <span class="<?= $estadistica["icon"] ?> fa-2x text-<?= $estadistica["class"] ?>"></span>
                            <h1 class="fs-6 pt-3"><?= $estadistica["number"] ?></h1>
                            <p class="fs-9 mb-0"><?= $estadistica["label"] ?></p>
                          </div>
                        <?php } ?>



                      </div>


                      <!-- CALENDARIO -->
                      <div id="calendar" class="col-md-12"></div>
                      <!-- CALENDARIO -->

                    </div>
                  </div>
                </div>
              </div>




              <div class="mb-8" id="content-masivos-cgenerales">
                <!-- Facturacion Ventas -->
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Generales</h4>
                  </div>
                  <div class="col-6 text-end">
                    <?= $dropdownNew ?>
                  </div>
                </div>
                <div class="col-12 row">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="row gx-3">
                        <div class="col-12 row mb-3">
                          <!-- <div class="container text-center mt-1"> -->
                          <div class="col-9 row" id="contenedor-secciones-configuraciones-generales">

                            <div id="subcontenedor-seccion-cg-1">
                              <div class="col-md-12 row">
                                <h5>Datos Principales</h5>
                                <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">

                                <?php


                                $camposGenerales = [
                                  "Razon social" =>  ["input", "razonSocial", "text", "required", ""],
                                  "Nit" =>  ["input", "nit", "text", "required", ""],
                                  "Email" =>  ["input", "email", "email", "required", ""],
                                  "Telefono" =>  ["input", "telefono", "number", "required", ""],
                                  "Direccion" =>  ["input", "direccion", "text", "required", ""],
                                  "Moneda" =>  ["select", "moneda", "", "required", $datosMonedas],
                                ];

                                foreach ($camposGenerales as $label => $datos) { ?>
                                  <div class="col-md-4 mb-1">
                                    <label class="mb-0"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : ('')) ?></label>
                                    <?php if ($datos[0] == "select") {
                                      //select2
                                    ?>
                                      <!-- onchange="changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                      <select class="form-select elementsConfigNomina" style="width: 100%;" id="<?= $datos[1] ?>">
                                        <?php
                                        foreach ($datos[4] as $key => $value) {
                                          echo '<option value="' . $key . '">' . $value . '</option>';
                                        }

                                        ?>
                                      </select>
                                    <?php } else if ($datos[0] == "input") { ?>
                                      <!-- onchange="changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                      <input value="<?= $datos[4] ?>" class="form-control elementsConfigNomina" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                    <?php } ?>
                                  </div>
                                <?php } ?>

                              </div>
                            </div>


                            <div id="subcontenedor-seccion-cg-2">
                              <div class="col-md-12 row">
                                <h5>Parametros de nomina</h5>
                                <?php

                                $periodicidadesPago = [
                                  "Diario" => "Diario",
                                  "Semanal" => "Semanal",
                                  "Quincenal" => "Quincenal",
                                  "Mensual" => "Mensual",
                                  "Bimestral" => "Bimestral",
                                  "Trimestral" => "Trimestral",
                                ];
                                $camposGenerales = [
                                  "Dias por semana" =>  ["input", "diasSemana", "number", "required", "6"],
                                  "Horas por semana" =>  ["input", "horasSemana", "text", "required", "46"],
                                  "Salario Minimo" =>  ["input", "salarioMinimo", "number", "required", "0"],
                                  "Valor de Hora" =>  ["input", "valorHora", "number", "required", ""],
                                  "Periodicidad de pago" =>  ["select", "periodicidadPago", "", "required", $periodicidadesPago],
                                ];

                                foreach ($camposGenerales as $label => $datos) { ?>
                                  <div class="col-md-4 mb-1">
                                    <label class="mb-0"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : ('')) ?></label>
                                    <?php if ($datos[0] == "select") {
                                      //select2
                                    ?>
                                      <!-- onchange="changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                      <select class="form-select elementsConfigNomina" style="width: 100%;" id="<?= $datos[1] ?>">
                                        <?php
                                        foreach ($datos[4] as $key => $value) {
                                          echo '<option value="' . $key . '">' . $value . '</option>';
                                        }
                                        ?>
                                      </select>
                                    <?php } else if ($datos[0] == "input") { ?>
                                      <!-- onchange="changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                      <input value="<?= $datos[4] ?>" class="form-control elementsConfigNomina" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                    <?php } ?>
                                  </div>
                                <?php } ?>
                              </div>
                            </div>

                            <div id="subcontenedor-seccion-cg-3">
                              <div class="col-md-12 row">
                                <h5>Parametros de descuentos</h5>
                                <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true) -->
                                <!-- onchange="changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                <div class="col-md-4">
                                  <label for="">Descontar retardos</label>
                                  <select class="form-select elementsConfigNomina" id="aplicaDescuentoRetardo" onchange="$('.divsRetardos').css('display', this.value == 'Si' ? 'block' : 'none'); ">
                                    <option value="No">No</option>
                                    <option value="Si">Si</option>
                                    <option value="Manual">Especificar al liquidar nomina</option>
                                  </select>
                                </div>

                                <!-- COMPLETAR LA FILA -->
                                <div class="col-md-8"></div>
                                <!-- COMPLETAR LA FILA -->



                                <div class="divsRetardos col-md-4" style="display:none">
                                  <label for="">Margen de retardo (")</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true) -->
                                  <input type="number" class="form-control elementsConfigNomina" onchange="this.value > 60 ? this.value = 60 : this.value;" id="minutosMargenRetardo">
                                </div>

                                <div class="divsRetardos col-md-4" style="display:none">
                                  <label for="">Aplicar descuento segun</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true) -->
                                  <select class="form-select elementsConfigNomina" id="descuentoRetardoSegun" onchange="setValorDescuentoRetardo(this.value);">
                                    <option value="salarioTrabajador">Salario del Trabajador</option>
                                    <option value="salarioMinimo">Salario Minimo</option>
                                    <option value="montoFijo">Monto fijo</option>
                                  </select>
                                </div>

                                <script>
                                  function setValorDescuentoRetardo(valor) {
                                    if (valor == 'montoFijo') {
                                      $('#valorDescuentoRetardo').attr('max', 100 * 1000000000000000);
                                      $('#valorDescuentoRetardoLabel').html("Valor de descuento");
                                    } else {
                                      $('#valorDescuentoRetardo').attr('max', 100)
                                      $('#valorDescuentoRetardoLabel').html("Valor de descuento (%)");
                                    }
                                  }
                                  setValorDescuentoRetardo("#descuentoRetardoSegun")
                                </script>

                                <div class="divsRetardos col-md-4" style="display:none">
                                  <label for="" id="valorDescuentoRetardoLabel">Valor de descuento</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                  <input type="number" class="form-control elementsConfigNomina" id="valorDescuentoRetardo" onchange="this.value > this.max ? this.value = this.max : this.value;">
                                </div>

                                <hr class="mt-3 mb-3">


                                <div class="col-md-4">
                                  <label for="">Descontar inasistencias</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                  <select class="form-select elementsConfigNomina" id="aplicaDescuentoInasistencia" onchange="$('.divsInasistencias').css('display', this.value == 'Si' ? 'block' : 'none');">
                                    <option value="No">No</option>
                                    <option value="Si">Si</option>
                                    <option value="Manual">Especificar al liquidar nomina</option>
                                  </select>
                                </div>

                                <!-- COMPLETAR LA FILA -->
                                <div class="col-md-8"></div>
                                <!-- COMPLETAR LA FILA -->

                                <div class="divsInasistencias col-md-4" style="display:none">
                                  <label for="">Margen de inasistencia (")</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                  <input type="number" class="form-control elementsConfigNomina" onchange="this.value > 60 ? this.value = 60 : this.value;" id="minutosMargenInasistencia">
                                </div>

                                <div class="divsInasistencias col-md-4" style="display:none">
                                  <label for="">Aplicar descuento segun</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                  <select class="form-select elementsConfigNomina" id="descuentoInasistenciaSegun" onchange="setValorDescuentoInasistencia(this.value);">
                                    <option value="salarioTrabajador">Salario del Trabajador</option>
                                    <option value="salarioMinimo">Salario Minimo</option>
                                    <option value="montoFijo">Monto fijo</option>
                                  </select>
                                </div>

                                <script>
                                  function setValorDescuentoInasistencia(valor) {
                                    if (valor == 'montoFijo') {
                                      $('#valorDescuentoInasistencia').attr('max', 100 * 1000000000000000);
                                      $('#valorDescuentoInasistenciaLabel').html("Valor de descuento");
                                    } else {
                                      $('#valorDescuentoInasistencia').attr('max', 100)
                                      $('#valorDescuentoInasistenciaLabel').html("Valor de descuento (%)");
                                    }
                                  }
                                  setValorDescuentoInasistencia($("#descuentoInasistenciaSegun").val())
                                </script>

                                <div class="divsInasistencias col-md-4" style="display:none">
                                  <label for="" id="valorDescuentoInasistenciaLabel">Valor de descuento</label>
                                  <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                                  <input type="number" class="form-control elementsConfigNomina" id="valorDescuentoInasistencia" onchange="this.value > this.max ? this.value = this.max : this.value;">
                                </div>


                              </div>
                            </div>


                            <div class="col-md-12 mt-3" id="paginacionModal"></div>


                          </div>

                          <div class="col-3" style="display:flex; flex-direction: column; align-items: center; justify-content: center">
                            <h5> Logo</h5>
                            <small>(png)</small>
                            <img id="logoImage" class="profile-pic" src="https://via.placeholder.com/150" alt="Imagen de Perfil">
                            <!-- changeAjaxFast('configNomina', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" -->
                            <input type="hidden" value="" class="elementsConfigNomina" id="logoBase64"  onchange="">

                            <div class="upload-btn-wrapper">
                              <button data-bs-toggle="tooltip" data-bs-placement="top" title="Con el fin de obtener una mejor visualizacion en el entorno web y vistas de impresion se recomienda cargar una imagen con fondo transparente" class="btn btn-primary">Subir Imagen</button>
                              <input type="file" id="logoUpload" accept="image/png">
                            </div>
                          </div>


                        </div>

                        <hr>

                        <div class="col-md-12 row">
                          <div class="col-md-9">

                            <ul class="nav nav-underline fs-9 mt-4 mb-3" role="tablist">
                              <?php
                              $array_subsecciones_generales = ['sub-content-sedes', 'sub-content-cargos', 'sub-content-retencionessalario', "sub-content-estados", 'sub-content-plantillasc', 'sub-content-deduccionesgrupales', 'sub-content-adicionesgrupales', 'sub-content-tiposrecargos'];
                              $array_subsecciones_generales = htmlspecialchars(json_encode($array_subsecciones_generales), ENT_QUOTES);
    
                              ?>
    
    
                              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-sedes', <?= $array_subsecciones_generales ?>)">Sedes</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-tiposrecargos', <?= $array_subsecciones_generales ?>)">Tipos de Recargos</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-cargos', <?= $array_subsecciones_generales ?>)">Cargos</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-retencionessalario', <?= $array_subsecciones_generales ?>)">Retenciones Salario</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-deduccionesgrupales', <?= $array_subsecciones_generales ?>)">Deducciones</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-adicionesgrupales', <?= $array_subsecciones_generales ?>)">Provisiones</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-estados', <?= $array_subsecciones_generales ?>)">Estados de reclutamiento</a></li>
                              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSubSections('content-masivos-cgenerales','sub-content-plantillasc', <?= $array_subsecciones_generales ?>)">Plantillas de contrato</a></li>
                            </ul>
                          </div>
                          <div class="col-md-3">
                            <div class="dropdown">
                                <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuSeccionGeneral" data-bs-toggle="dropdown" aria-expanded="false">
                                  <i class="fas fa-plus"></i> &nbsp; Nuevo
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuSeccionGeneral">
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaSede">Sede</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalTiposRecargo">Tipo de recargo</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoCargo">Tipo de cargo</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalRetencionSalarial">Retencion de salario</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalDeduccionesGrupales">Deducciones</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalAdicionesGrupales">Provisiones</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoEstado">Estado de reclutamiento</a></li>
                                  <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalPlantillaContrato">Plantilla de Contrato</a></li>
                                </ul>
                              </div>
                            </div>
                        </div>



                        <?php include "./GeneralesNomina/Sections.php" ?>


                      </div>
                    </div>
                  </div>
                </div>

              </div>



              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>


<input type="hidden" id="array_subsecciones" value="<?= $array_subsecciones ?>">
<input type="hidden" id="array_subsecciones_generales" value="<?= $array_subsecciones_generales ?>">
<input type="hidden" id="array_subsecciones_nomina" value="<?= $array_subsecciones_nomina ?>">


<?php include "../footer.php"; ?>
<script>
  function showSections(idVisible) {
    //,
    //, "content-masivos-cargos", "content-masivos-retencionessalario", "content-masivos-sedes",
    //"content-masivos-contratos","content-masivos-trabajadores",
    let todos = ["content-masivos-dashboard", "content-masivos-reclutamiento", "content-masivos-nomina", "content-masivos-cgenerales"];
    todos.forEach(element => {
      if (element == idVisible) {
        document.getElementById(element).style.display = "block";
      } else {
        document.getElementById(element).style.display = "none";
      }
    });
  }

  function showSubSections(principal, idVisible, todos) {
    //,
    // let todos = ["sub-content-apertura","sub-content-candidatos","sub-content-entrevistas","sub-content-promociones", "sub-content-estados"];
    todos.forEach(id => {
      let element = $(`#${principal} #${id}`);

      if (id == idVisible) {
        element.css("display", "block");
      } else {
        element.css("display", "none");
      }
    });
  }

  showSections("content-masivos-dashboard");
  // showSections("content-masivos-reclutamiento");
  showSubSections("content-masivos-reclutamiento", "sub-content-apertura", JSON.parse(document.getElementById("array_subsecciones").value));
  showSubSections("content-masivos-cgenerales", "sub-content-sedes", JSON.parse(document.getElementById("array_subsecciones_generales").value));
  showSubSections("content-masivos-nomina", "sub-content-trabajadores", JSON.parse(document.getElementById("array_subsecciones_nomina").value));


  function crearNuevoContrato(id) {
    $("#modalNuevoContrato").modal("show");
    $("#modalNuevoContrato #idTrabajador").val(id).change();
  }

  function liquidarEmpleado(id) {
    $("#modalNuevaLiquidacion").modal("show");
    $("#modalNuevaLiquidacion #idTrabajador").val(id).change();
    calcularLiquidacion();
  }


  function inactivarTrabajador(id, checkbox) {
    let tipo = (checkbox.checked) ? "activar" : "inactivar";
    let acciones = {
      "activar": {
        "mensaje": "Al activar este trabajador se deberá diligenciar un nuevo contrato",
        "onclick": function() {
          crearNuevoContrato(id)
        }
      },
      "inactivar": {
        "mensaje": "Al inactivar este trabajador se iniciara proceso de liquidacion",
        "onclick": function() {
          liquidarEmpleado(id)
        }
      }
    }

    let accionesTipo = acciones[tipo];

    Swal.fire({
      title: `¿Estas seguro de ${tipo} este trabajador?`,
      text: accionesTipo.mensaje,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-phoenix-primary",
    }).then((result) => {
      if (result.isConfirmed) {

        accionesTipo.onclick();

      } else {
        if (tipo == "inactivar") {
          checkbox.checked = true;
        } else if (tipo == "activar") {
          checkbox.checked = false;
        }
      }
    })


  }
</script>

<script>
  document.getElementById('logoUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('logoImage').src = e.target.result;
        document.getElementById('logoBase64').value = e.target.result;
      }
      reader.readAsDataURL(file);
      setTimeout(() => {
        changeAjaxFast('NOM_Configuracion', "logoBase64", $("#logoBase64").val(), 'idUsuario', '<?= $_SESSION['ID'] ?>', true)
        // console.log("Se disparo el evento change");
        // $("#logoBase64").change();
      }, 1000);
    }
  });
</script>

<script>
  
  async function getCalendarEventsByUser(idUsuario) {
    const url = "<?= $BASE ?>Nomina/Ajax/AjaxCalendar.php";
    
    // Configurar los datos a enviar en el cuerpo de la solicitud
    const formData = new URLSearchParams();
    formData.append("action", "consultar");
    formData.append("idUsuario", idUsuario);

    // Usar fetch para realizar la solicitud
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Encabezado para datos de formulario
      },
      body: formData.toString()
    });

    const { icon, title, text, data } = await respuesta.json();
    
    // console.log({icon, title, text, data});
    
    
    if (icon == "error") {
      Swal.fire({ icon, title, text,});
      return [];
    }

    return data;

  }

  $(document).ready(function() {

    ( async () => {
      let eventsCalendar = await getCalendarEventsByUser("<?= $_SESSION['ID'] ?>");
      // console.log("eventsCalendar", eventsCalendar);
      
      var calendarEl = document.getElementById('calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es', // Configurar idioma español
        initialView: 'timeGridWeek', // Vista inicial (mes)
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // Vistas: mes, semana, día
        },
        buttonText: {
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        },
        events: eventsCalendar,
        dateClick: function(info) {
          // alert('Has hecho clic en: ' + info.dateStr);
        },
        eventContent: function (info) {
            let iconHtml = `<i class="${info.event.extendedProps.icon}"></i>`;
            let titleHtml = `<span>${info.event.title}</span>`;
            return { html: `${iconHtml} ${titleHtml}` };
        },
        eventClick: function(info) {
          // console.log(info);
          
          // alert('Evento: ' + info.event.title);
          // alert('Fecha de inicio: ' + info.event.start.toISOString());
          // alert('Descripción: ' + (info.event.extendedProps.description || 'Sin descripción'));
        }
      });
      calendar.render();
      
    })()




      


  });
</script>

<script>
  $(document).ready(function() {
    paginacionModal("contenedor-secciones-configuraciones-generales", "subcontenedor-seccion-cg-", 3); // PARA SECCIONAR EL APARTADO DE CONFIGURACIONES GENERALES

    setTimeout(() => {
      let inputsConfigNomina = document.querySelectorAll(".elementsConfigNomina");
      inputsConfigNomina.forEach(element => {
        element.addEventListener("change", function({
          target
        }) {
          changeAjaxFast('NOM_Configuracion', target.id, target.value, 'idUsuario', '<?= $_SESSION['ID'] ?>', true)
        })

      })

      // console.log("Añadido evento de change fast");

    }, 1000);



  })
</script>
<?php
include "./ModalesDetalleEmpleado/ModalContrato.php";
include "./ModalesPrincipales/ModalAdicionesGrupales.php";
include "./ModalesPrincipales/ModalDeduccionesGrupales.php";
include "./ModalesPrincipales/ModalEstadoReclutamiento.php";
include "./ModalesPrincipales/ModalLiqidacionEmpleado.php";
include "./ModalesPrincipales/ModalLiqidacionNomina.php";
include "./ModalesPrincipales/ModalLiqidacionNominaEditar.php";
include "./ModalesPrincipales/ModalPersonas.php";
include "./ModalesPrincipales/ModalPlantillaContrato.php";
include "./ModalesPrincipales/ModalRetencionesSalario.php";
include "./ModalesPrincipales/ModalSedes.php";
include "./ModalesPrincipales/ModalTiposCargo.php";
include "./ModalesPrincipales/ModalTiposRecargo.php";

?>


<script>
  function crearTablaConfigNomina() {
    const miDiv = document.getElementById('contenedor-secciones-configuraciones-generales');
    const inputsYSelects = miDiv.querySelectorAll('input, select');
    // let CamposTabla = "";
    let dataSendConfig = {};
    // Mostrar los elementos encontrados
    inputsYSelects.forEach(element => {
      let idElemento = element.id;
      if (idElemento != "") {
        dataSendConfig[idElemento] = element.value;
        // CamposTabla += idElemento + " TEXT NULL,";
      }
    });


    dataSendConfig.logoBase64 = $("#logoBase64").val();
    dataSendConfig.action = "CrearTabla";

    $.ajax({
      type: "POST",
      url: "<?= $BASE ?>Nomina/Ajax/AjaxConfiguracionNomina.php",
      data: dataSendConfig,
      success: function(respuesta) {
        // console.log("Creando tabla...");
        // console.log(respuesta);
      }
    });

  }


  $.ajax({
    type: "POST",
    url: "<?= $BASE ?>Nomina/Ajax/AjaxConfiguracionNomina.php",
    data: {
      action: "ConsultarDatos",
      idUsuario: "<?= $_SESSION["ID"] ?>"
    },
    success: function(respuesta) {
      const dataJson = JSON.parse(respuesta);
      // console.log("El datos json retornado es ");
      // console.log(dataJson);
      if (!dataJson.activo) {
        crearTablaConfigNomina();
        return;
      }

      // console.log("Respuesta");
      // console.log(dataJson);

      for (const key in dataJson) {
        let selector = $("#contenedor-secciones-configuraciones-generales #" + key);
        if (key == 'logoBase64') {
          $("#logoImage").attr("src", dataJson[key]);
          selector.val(dataJson[key]);
        } else {
          selector.val(dataJson[key]);
          if (selector.prop("nodeName") == "SELECT") {
            selector.change();
          }
        }
      }

      for (const key in dataJson) {
        let selector = $("#contenedor-secciones-configuraciones-generales #" + key);
        selector.val(dataJson[key]);
        if (selector.prop("nodeName") == "SELECT") {
          selector.change();
        }
      }
    }
  });
</script>

<?php

// CREAR TABLA DE CONFIGURACION

?>

<style>
  .fc-daygrid-event-harness{
    overflow: hidden !important;
  }

  table * {
    font-size: 15px !important;
  }

  #content-masivos-cgenerales label{
    font-size: 15px !important;
  }
</style>