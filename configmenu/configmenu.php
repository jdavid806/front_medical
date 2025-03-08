<?php
include "../menu.php";
include "../header.php";

?>
<!-- ==== PARA EL DRAG & DROP========= -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<!-- ==== PARA EL DRAG & DROP========= -->



<div class="content">
  <nav class="mb-3" aria-label="breadcrumb">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item"><a href="#">Inicio</a></li>
      <li class="breadcrumb-item"><a href="#">Configurar Menu</a></li>
    </ol>
  </nav>
  <div class="mb-9">
    <div id="projectSummary" data-list='{"valueNames":["projectName","assignees","start","deadline","task","projectprogress","status","action"],"page":6,"pagination":true}'>
      <div class="row mb-1 gx-6 gy-3 align-items-center">
        <div class="col-auto">
          <h2 class="mb-0">Items de menu<span class="fw-normal text-body-tertiary ms-3"></span></h2>
          <br>
          <p>
          <p class="d-inline-flex gap-1">
            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseItem" aria-expanded="false" aria-controls="collapseItem">
              <i class="fas fa-plus"></i> Añadir item
            </button>
            
            <button class="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseListItem" aria-expanded="false" aria-controls="collapseListItem">
              <i class="fas fa-eye"></i> Ver items
            </button>
          </p>
          
          <?php include "./crudItems.php"; ?>

        </div>
      </div>
      <div class="row g-3 justify-content-between align-items-end mb-1">
        <div class="col-12 col-sm-auto">
        </div>
        <div class="col-12 col-sm-auto">
          <div class="d-flex align-items-center">
            <div class="search-box me-3">
              <form class="position-relative">
                <input class="form-control search-input search" type="search" placeholder="Search projects" aria-label="Search" />
                <span class="fas fa-search search-box-icon"></span>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="table-responsive scrollbar">

        <h2 class="mb-1">Grupos de menu<span class="fw-normal text-body-tertiary ms-3"></span></h2>
        <!-- ====== LISTA DE MENUS=== -->
        <table class="table fs-9 mb-0 border-top border-translucent">
          <thead>
            <tr>
              <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:30%;">NOMBRE</th>
              <th class="sort align-middle ps-3" scope="col" data-sort="assignees" style="width:60%;">ITEMS</th>
              <th class="sort align-middle ps-3" scope="col" data-sort="assignees" style="width:10%;"></th>
            </tr>
          </thead>
          <tbody class="list" id="project-list-table-body">
            <?php
            $QueryMenusDisponibles = "SELECT * FROM configMenu  WHERE Activo = '1' ORDER BY Nombre ASC";
            $ResultMenu = mysqli_query($conn3, $QueryMenusDisponibles);
            foreach ($ResultMenu as $RowMenu) { 
              
              $RowMenu['Array_Items'] = json_decode($RowMenu['Array_Items'], true);
              $listItems = "<ul class='list-group'>"; 
              foreach ($RowMenu['Array_Items'] as $Items) {
                if ($Items["isActive"] == true) {
                  $listItems .= "<li class='list-group-item'>" . $Items['name'] . "</li>";
                }
              }
              $listItems .= "</ul>";
              
              ?>
              <tr class="position-static">
                <td style="width:30%;" class="align-middle time white-space-nowrap ps-0 projectName py-4"><a class="fw-bold fs-8" href="#"><?= $RowMenu['Nombre'] ?></a></td>
                <td style="width:60%;" class="align-middle white-space-nowrap text-end statuses"><?= $listItems ?></td>
                <td style="width:10%;" class="align-middle white-space-nowrap text-end statuses">
                  <button class="btn btn-primary me-4" onclick="updateMenuShow('<?php echo $RowMenu['ID']; ?>')"><span class="fas fa-marker me-2"></span>Editar</button>
                  <button class="btn btn-danger me-4" onclick="deleteAlert('ID', '<?php echo $RowMenu['ID']; ?>', 'configMenu', 'Activo')"><span class="fas fa-trash me-2"></span>Eliminar</button>
                </td>
              </tr>
            <?php } ?>

          </tbody>
        </table>
        <!-- ====== LISTA DE MENUS=== -->
      </div>
      
      <div class="d-flex flex-wrap align-items-center justify-content-between py-3 pe-0 fs-9 border-bottom border-translucent">
        <div class="d-flex">
          <p class="mb-0 d-none d-sm-block me-3 fw-semibold text-body" data-list-info="data-list-info"></p><a class="fw-semibold" href="#!" data-list-view="*">Ver todo<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a class="fw-semibold d-none" href="#!" data-list-view="less">View Less<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
        </div>
        <div class="d-flex">
          <button class="page-link" data-list-pagination="prev"><span class="fas fa-chevron-left"></span></button>
          <ul class="mb-0 pagination"></ul>
          <button class="page-link pe-0" data-list-pagination="next"><span class="fas fa-chevron-right"></span></button>
        </div>
      </div>
      
      <br>
      <h2 class="mb-1" id="h2_title_menu">Crear nuevo menu</h2>
      <input type="text" class="form-control" name="NuevoMenu" id="NuevoMenu">
      <input value="<?= $_SESSION['ID'] ?>" type="hidden" id="userId">
      <br>
      <table class="table fs-9 mb-0 border-top border-translucent" id="table-menu">
        <thead>
          <tr>
            <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:10%;">#</th>
            <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:30%;">NOMBRE</th>
            <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:30%;">ICONO</th>
            <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:30%;"></th>
          </tr>
        </thead>
        <tbody class="list" id="table-menu-body">
          <?php
          $QueryMenusDisponibles = "SELECT * FROM main_menu  WHERE estado = '1' AND idPrincipal = '0'  ORDER BY Nombre ASC";
          $ResultMenu = mysqli_query($conn3, $QueryMenusDisponibles);
          foreach ($ResultMenu as $index => $RowMenu) {
            $options = "";
            if (is_array($dataIcons)) {
              foreach ($dataIcons as $icon) {
                $escapedIcon = htmlspecialchars($icon, ENT_QUOTES, 'UTF-8');
                $options .= '<option ' .  (($icon == $RowMenu['icon']) ? 'selected' : "") . ' value="' . $escapedIcon . '" data-icon="' . $escapedIcon . '">' . $escapedIcon . '</option>';
              }
            } else {
              $options .= '<option disabled>No icons available</option>';
            }

          ?>
            <tr class="position-static" data-orden="<?= $index + 1 ?>">
              <td style="width:10%;">
                <input type="checkbox" class="form-check-input checkItem">
                <input type="hidden" class="form-check-input idItem" value="<?= $RowMenu['id'] ?>">
              </td>
              <td style="width:30%;"><input type="text" class="form-control nombreItem" value="<?= $RowMenu['nombre'] ?>"></td>
              <td style="width:30%;"><select class="form-control select2 iconItem" style="width: 100%;" id=""><?= $options ?></select></td>
              <td style="width:30%;">
                <div class="btn-group" style="width: 100%;">
                  <!-- ==== SUBMENU DE ITEM PRINCIPAL ====== -->
                  <button type="button" class="btn btn-info dropdown-toggle" style="width: 100%;" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-bars"></i>&nbsp;Submenus</button>
                  <ul class="dropdown-menu submenus_desplegables" data-menu-principal="<?= $RowMenu['id'] ?>" style="padding:10px; width:100%">
                    <?php 
                      $QuerySumbmenus = "SELECT * FROM main_menu  WHERE estado = '1' AND idPrincipal = '" . $RowMenu['id'] . "'";
                      $ResultSumbmenus = mysqli_query($conn3, $QuerySumbmenus);
                      $submenusTotales = 0;
                      foreach ($ResultSumbmenus as $ordenSubmenu => $RowSumbmenus) { 
                        $submenusTotales += 1;
                        ?>
                        <li data-orden-submenu="<?=$ordenSubmenu + 1?>" style="margin-bottom:5px; padding:5px; display:flex; flex-direction:row; ">
                          <input type="checkbox" style="width:20px; margin-right:5px;" class="active_item_submenu">
                          <input class="form-control nombre_item_submenu" type="text"  value="<?= $RowSumbmenus['nombre'] ?>">
                          <input type="hidden" class="id_item_submenu" value="<?= $RowSumbmenus['id'] ?>">
                        </li>
                    <?php } ?> 
                  </ul>
                  <!-- ==== SUBMENU DE ITEM PRINCIPAL ====== -->
                  
                </div>
                <input type="hidden" class="form-check-input submenusItem" value="<?= $submenusTotales ?>">

              </td>
            </tr>
          <?php } 
          
          $itemsTotales = $index + 1;
          ?>
        </tbody>
      </table>
      <button class="btn btn-primary btn-lg me-4" id="button_submit_menu" style="width:100%" onclick="createMenu()"><span class="fas fa-bookmark me-2"></span>Guardar</button>
      <input type="hidden" id="idMenu" value="0">
    </div>
  </div>
  <?php include "../footer.php"; ?>
  <?php include "./funcionesMenu.php"; ?>

  <script>
    $(document).ready(function() {
      // Inicializa select2 con iconos
      $('.select2').select2({
        templateResult: formatIcon,
        templateSelection: formatIcon
      });

      $(".submenus_desplegables").sortable({
        items: 'li',
        cursor: 'move',
        placeholder: 'ui-state-highlight',
        connectWith: '.submenus_desplegables',
        helper: 'clone',
        update: function(event, ui) {
          updateSubmenuOrder($(this));
        }
      }).disableSelection();

      function updateSubmenuOrder(container) {
        container.find('li').each(function(index) {
          $(this).attr('data-orden-submenu', index + 1);
        });
      }


      // Inicializa sortable para la tabla
      $("#table-menu").sortable({
        items: 'tr',
        cursor: 'move',
        placeholder: 'ui-state-highlight',
        update: function(event, ui) {
          console.log('Moved item from index', ui.oldIndex, 'to index', ui.item.index());
          // Actualizar el atributo data-orden para cada fila
          $('#table-menu-body tr').each(function(index) {
            $(this).attr('data-orden', index + 1); // +1 para que sea 1-based en lugar de 0-based
          });

        }
      });

      $("#table-menu").disableSelection();
    });
  </script>


  