<script>
    function formatIcon(option) {
        if (!option.id) {
          return option.text;
        }
        return $('<span><i class="' + $(option.element).data('icon') + ' me-2 text-primary"></i> ' + option.text + '</span>');
      }


    function saveNewItem() {
      let campos = ["NuevoItem_nombre", "NuevoItem_pantalla", "NuevoItem_icon", "NuevoItem_idPrincipal", "NuevoItem_color", "NuevoItem_usuario_id"];
      let data = {};
      let next = true;
      campos.forEach(element => {
        let key = element.replace("NuevoItem_", "");
        data[key] = $("#" + element).val();
        if (data[key] == "") {
          next = false;
        }
      });
      if (!next) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Todos los campos son obligatorios'})
        return false;
      }

      data["nivel"] = data["idPrincipal"] == 0 ? 1 : 2;
      data["Tipo"] = "Nuevo_Item_Menu"

      $.ajax({
        type: "POST",
        url: "<?= $BASE ?>main_menu/Ajax_Config_Menu.php",
        data,
        success: function(response) {
          const dataJson = JSON.parse(response);
          const { icon, title, text } = dataJson;
          Swal.fire({ icon, title, text });

          if (icon == 'success') {
            setTimeout(() => {
              location.reload();
            }, 1000);
          }


        },
        error: function(xhr, status, error) {
          console.log(xhr.responseText);
        }
      });
    }


    function reem_js(texto) {
        try {
          // Reemplazar caracteres especiales latinos minúsculas
          const findLower = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '\"', '€', 'ü'];
          const replLower = ['a', 'e', 'i', 'o', 'u', 'n', '', '', 'u'];
  
          let result = texto;
          for (let i = 0; i < findLower.length; i++) {
            result = result.split(findLower[i]).join(replLower[i]);
          }
  
          // Reemplazar caracteres especiales latinos mayúsculas
          const findUpper = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ', 'Ü', 'ç', 'Ç'];
          const replUpper = ['A', 'E', 'I', 'O', 'U', 'N', 'U', 'C', 'C'];
  
          for (let i = 0; i < findUpper.length; i++) {
            result = result.split(findUpper[i]).join(replUpper[i]);
          }
  
          return result;
          
        } catch (error) {
          console.warn(error);
          return texto;
        }
      }
      
      
      function createMenu() {
        let nombreMenu = $("#NuevoMenu").val();
        nombreMenu = reem_js(nombreMenu);
        const userId = $("#userId").val();
        const idMenu = $("#idMenu").val(); // SOLO POR SI SE ESTA EDITANDO [0 -NUEVO , <> 0 -EDITANDO]
        if (nombreMenu == "") {
          Swal.fire({ icon: 'warning', title: 'Error', text: 'El nombre del menu es obligatorio' });
          return false;
        }

        let JsonCampos = obtenerJsonMenu();
        // console.log(JsonCampos);
        // return

        $.ajax({
          type: "POST",
          url: "<?= $BASE ?>main_menu/Ajax_Config_Menu.php",
          data: {
            JsonCampos,
            idMenu,
            userId,
            nombreMenu,
            Tipo: "Nuevo_Menu",
          },
          success: function(response) {
            const dataJson = JSON.parse(response);
            const {icon,title,text} = dataJson;
            Swal.fire({ icon, title, text });

            if (icon == "success") {
              setTimeout(() => {
                location.reload();
              }, 1000);
            }

          },
          error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
        });
        
      }

      //createMenu

    function obtenerJsonMenu() {
      const itemsTotales = Number('<?= $itemsTotales ?>');
      
      let formData = {};
      for (let i = 1; i <= itemsTotales; i++) {
        let fila = $('#table-menu-body tr[data-orden="' + i + '"]');

        let checkItem = fila.find('.checkItem').is(':checked'); // Para checkboxes, usa is(':checked')
        let idItem = fila.find('.idItem').val();
        let nombreItem = fila.find('.nombreItem').val();
        let iconItem = fila.find('.iconItem').val();
        let submenusItem = fila.find('.submenusItem').val(); // PARA CALCULAR EL TOTAL DE SUMBMENUS
        let submenus = {};
        if (submenusItem > 0) {
          let listaSubmenu = fila.find('.submenus_desplegables');
          for (let j = 1; j <= submenusItem; j++) {
            // Selecciona el submenú correspondiente por su atributo data-orden-submenu
            let submenu = listaSubmenu.find('li[data-orden-submenu="' + j + '"]');
            
            // console.log("Li submenu:", submenu); // Debug

            // Asegúrate de que submenu no esté vacío
            if (submenu.length) {
              // Obtén los valores de los elementos dentro del submenú
              let idItemSubmenu = submenu.find('.id_item_submenu').val();
              let nombreItemSubmenu = submenu.find('.nombre_item_submenu').val();
              let activeItemSubmenu = submenu.find('.active_item_submenu').is(':checked'); // Checkbox estado
              // let nombreItemSubmenu = submenu.find('.nombre_item_submenu');
              console.log("Let nombreItemSubmenu");
              console.log(nombreItemSubmenu);
              

              
              // Agrega el submenú al objeto de submenús
              submenus[j] = {
                id: idItemSubmenu,
                name: reem_js(nombreItemSubmenu),
                active: activeItemSubmenu
              };
            } else {
              console.warn('Submenu no encontrado para data-orden-submenu=' + j);
            }
          }

        }
        

        formData[i] = {
          id: idItem,
          name: reem_js(nombreItem),
          icon: iconItem,
          isActive: checkItem,
          submenus
        };
      }

      formData = JSON.stringify(formData);
      return formData;
      // console.log(formData);
      // Recorre cada fila de la tabla en su orden actual
    }



    function updateItemMenuShow(idItemMenu) {
      $.ajax({
          type: "POST",
          url: "<?= $BASE ?>main_menu/Ajax_Config_Menu.php",
          data: {
            idItemMenu,
            Tipo: "Datos_Item_Menu",
          },
          success: function(response) {
            const dataJson = JSON.parse(response);
            console.log(dataJson);
            console.log(dataJson.nombre);
            
            $("#header-update-item-menu").html("<i class='fas fa-pencil'></i> Editar - " + dataJson.nombre);

            $("#EditarItem_nombre").val(dataJson.nombre);
            $("#EditarItem_idItemMenu").val(dataJson.id);
            $("#EditarItem_pantalla").val(dataJson.pantalla);
            $("#EditarItem_icon").val(dataJson.icon).change();
            $("#EditarItem_idPrincipal").val(dataJson.idPrincipal).change();

            $("#modalUpdateItem").modal("show");


          },
          error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
        });
    }

    function updateItemMenuFinish() {
        let campos = ["EditarItem_idItemMenu","EditarItem_nombre","EditarItem_pantalla","EditarItem_icon","EditarItem_idPrincipal"];
        let data = {};
        campos.forEach(element => {
            let key = element.split("_")[1];
            let value = $("#"+element).val();
            data[key] = value;
        });
        
        data.Tipo = "Actualizar_Item_Menu";


        $.ajax({
          type: "POST",
          url: "<?= $BASE ?>main_menu/Ajax_Config_Menu.php",
          data,
          success: function(response) {
            const dataJson = JSON.parse(response);
            const { icon, text, title } = dataJson;
            Swal.fire({ icon, text, title });
            $("#modalUpdateItem").modal("hide");


          },
          error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
        });
    }


    function updateMenuShow(idMenu) {
        $.ajax({
          type: "POST",
          url: "<?= $BASE ?>main_menu/Ajax_Config_Menu.php",
          data:{
            idMenu,
            Tipo: "Mostrar_Configuracion_Menu",
          },
          success: function(response) {
            $("#table-menu-body").html(response);
            $('.select2').select2({
                templateResult: formatIcon,
                templateSelection: formatIcon
            });
            const targetElement = document.getElementById('h2_title_menu');
            // Desplaza la vista hasta el elemento
            targetElement.scrollIntoView({
                behavior: 'smooth', // Desplazamiento suave
                block: 'start'     // El elemento se alinea al inicio del contenedor
            });

            $.ajax({
                type: "POST",
                url: "<?= $BASE ?>main_menu/Ajax_Config_Menu.php",
                data:{
                    idMenu,
                    Tipo: "Mostrar_Configuracion_Menu_Adicional",
                },
                success: function(response) {
                    console.log(response);
                    const dataJson = JSON.parse(response);
                    console.log(dataJson);
                    

                    $("#button_submit_menu").html("<i class='fas fa-wrench'></i>&nbsp;Actualizar");
                    $("#idMenu").val(dataJson.id);
                    $("#NuevoMenu").val(dataJson.nombre);
                    $("#h2_title_menu").html("Actualizar menú [" + dataJson.nombre + "]");

                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });



          },
          error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
        });
    }



    $("#table-list-item").DataTable({
      "language": {
        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      }
    });
  </script>

<style>
  .ui-state-highlight {
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
  height: 1.5em;
  line-height: 1.2em;
}
</style>


<div class="modal" id="modalUpdateItem">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title" id="header-update-item-menu"></h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- Modal body -->
      <div class="modal-body col-md-12 row">
        <input type="hidden" class="form-control" name="EditarItem[idItemMenu]" id="EditarItem_idItemMenu">
        
        <div class="col-md-6">
            <label for="EditarItem_nombre">Nombre</label>
            <input type="text" class="form-control" name="EditarItem[nombre]" id="EditarItem_nombre">
        </div>

        <div class="col-md-6">
            <label for="EditarItem_pantalla">Destino</label>
            <input type="text" class="form-control" name="EditarItem[pantalla]" id="EditarItem_pantalla">
        </div>

        <div class="col-md-6">
            <label for="EditarItem_icon" id="LabelIcono">Icono</label>
            <select class="form-control" style="width: 100%;" onchange="updateIcon(this.value)" name="EditarItem[icon]" id="EditarItem_icon">
            <?php

            // Asegúrate de que $dataIcons es un array
            if (is_array($dataIcons)) {
                foreach ($dataIcons as $icon) {
                // Escape el valor del icono para evitar problemas de seguridad
                $escapedIcon = htmlspecialchars($icon, ENT_QUOTES, 'UTF-8');
                echo '<option value="' . $escapedIcon . '" data-icon="' . $escapedIcon . '">' . $escapedIcon . '</option>';
                }
            } else {
                echo '<option disabled>No icons available</option>';
            }
            ?>
            </select>
        </div>

        <script>
            function updateIcon(icon) {
                const LabelIcono = document.getElementById('LabelIcono');
                // Update the label's HTML with the selected icon
                LabelIcono.innerHTML = 'Icono <i class="' + icon + '"></i>';
            }
        </script>

        <div class="col-md-6">
            <label for="EditarItem_icon">Item Principal</label>
            <select class="form-control" style="width: 100%;" name="EditarItem[idPrincipal]" id="EditarItem_idPrincipal">
            <?php
            echo "<option value='0'>Ninguno</option>";
            $QueryOptions = "SELECT id,nombre FROM main_menu WHERE estado = '1' AND idPrincipal = '0' order by nombre asc";
            $ResultOptions = mysqli_query($conn3, $QueryOptions);
            foreach ($ResultOptions as $RowOptions) {
                echo "<option value='" . $RowOptions['id'] . "'>" . $RowOptions['nombre'] . "</option>";
            }

            ?>
            </select>
        </div>

        <div class="col-md-12">
            <button type="button" class="btn btn-success btn-lg mt-1" style="width: 100%;" onclick="updateItemMenuFinish()"> <i class="fas fa-save"></i> Actualizar</button></button>
        </div>

      </div>

      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"> <i class="fas fa-xmark"></i> Cerrar</button>
      </div>

    </div>
  </div>
</div>