<?php 
    include "../funciones/funciones.php";
    include "../funciones/conn3.php";

    try {
        if ($_POST['Tipo'] == "Nuevo_Item_Menu") {
            unset($_POST['Tipo']);
            $Tabla = "main_menu";
            $CamposInsertar = "";
            $ValoresInsertar = "";
            foreach ($_POST as $key => $value) {
                $CamposInsertar .= $key . ",";
                $ValoresInsertar .= "'" . $value . "',";
            }
            $CamposInsertar = substr($CamposInsertar, 0, -1);
            $ValoresInsertar = substr($ValoresInsertar, 0, -1);
    
            $Query = "INSERT INTO $Tabla ($CamposInsertar) VALUES ($ValoresInsertar)";
            $Response = [];
            if (mysqli_query($conn3, $Query)) {
                $Response["icon"] = "success";
                $Response["title"] = "Guardado";
                $Response["text"] = "Guardado correctamente";
            }else{
                $Response["icon"] = "error";
                $Response["title"] = "Error";
                $Response["text"] = "Error al guardar. " . mysqli_error($conn3);
            }
    
            echo json_encode($Response);    
        }else if ($_POST['Tipo'] == "Nuevo_Menu") {
            $JsonCampos = $_POST['JsonCampos'];
            $idMenu = $_POST['idMenu'];
            $userId = $_POST['userId'];
            $nombreMenu = $_POST['nombreMenu'];
            $Tabla = "gruposMenu";

            $Data = [
                "FechaHora" => date("Y-m-d H:i:s"),
                "Array_Items" => $JsonCampos,
                "usuarioId" => $userId,
                "Nombre" => $nombreMenu
            ];

            $Campos = "";
            $Actions = [];
            foreach ($Data as $key => $value) {
                $Campos .= $key . " = '" . $value . "',";
            }
            $Campos = substr($Campos, 0, -1);

            if ($idMenu == "0") {// CREANDO NUEVO MENU
                $Actions = ["INSERT", ""];    
            }else{
                $Actions = ["UPDATE", " WHERE ID = " . $idMenu];    
            }

            $InsertUpdate = "{$Actions[0]} {$Tabla} SET {$Campos} {$Actions[1]}";
            $Response = [];
            if (mysqli_query($conn3, $InsertUpdate)) {
                $Response["icon"] = "success";
                $Response["title"] = "Guardado";
                $Response["text"] = "Guardado correctamente";
            }else{
                $Response["icon"] = "error";
                $Response["title"] = "Error";
                $Response["text"] = "Error al guardar. =>" . $InsertUpdate;
            }
    
            echo json_encode($Response);

        }else if ($_POST['Tipo'] == "Datos_Item_Menu") {
            $idItemMenu = $_POST['idItemMenu'];
            $Query = "SELECT * FROM main_menu WHERE id = $idItemMenu";
            $Result = mysqli_query($conn3, $Query);
            $Data   = mysqli_fetch_array($Result);
            echo json_encode($Data);
        }else if ($_POST['Tipo'] == "Actualizar_Item_Menu") {
            $idItemMenu = $_POST['idItemMenu'];

            unset($_POST['idItemMenu']);
            unset($_POST['Tipo']);

            $Campos = "";
            foreach ($_POST as $key => $value) {
                $Campos .= $key . " = '" . $value . "',";
            }
            $Campos = substr($Campos, 0, -1);

            $Response = [];
            $Query = "UPDATE main_menu SET $Campos WHERE id = $idItemMenu";
            if (mysqli_query($conn3, $Query)) {
                $Response["icon"] = "success";
                $Response["title"] = "Correcto";
                $Response["text"] = "Actualizado correctamente";
            }else{
                $Response["icon"] = "error";
                $Response["title"] = "Error";
                $Response["text"] = "Error al actualizar. " . mysqli_error($conn3);
            }

            echo json_encode($Response);

    
        }else if ($_POST['Tipo'] == "Mostrar_Configuracion_Menu_Adicional") {
            $idMenu = $_POST['idMenu'];
            $Query = "SELECT nombre,id FROM gruposMenu WHERE ID = $idMenu";
            // echo $Query;
            
            $Result = mysqli_query($conn3, $Query);
            $Data   = mysqli_fetch_array($Result);
            echo json_encode($Data);

        }else if ($_POST['Tipo'] == "Mostrar_Configuracion_Menu") {
        //? MOSTRAR TODO EL MENU YA CONFIGURADO POR EL USUARIO [INICIO]
            $idMenu = $_POST['idMenu'];
            $Json_Menu = funcionMaster($idMenu, "ID", "Array_Items", "gruposMenu");
            $Json_Menu = json_decode($Json_Menu, true);
            
            $jsonIcons = file_get_contents('Perfiles_Menu_Iconos.json');
            $dataIcons = json_decode($jsonIcons, true);
            
            $index = 0;
            $IdsExcluidos = "";
            $html = "";
            //* ////////////////// ITEMS QUE YA ESTABAN GUARDADOS EN EL JSON (ACTIVOS O INACTIVOS) /////////////////////// 
            foreach ($Json_Menu as $key => $dataItem) {
                $IdsExcluidos .= $dataItem['id'] . ",";
                $index += 1;

                $options = "";
                if (is_array($dataIcons)) {
                    foreach ($dataIcons as $icon) {
                        $escapedIcon = htmlspecialchars($icon, ENT_QUOTES, 'UTF-8');
                    $options .= '<option ' .  (($icon == $dataItem['icon']) ? 'selected' : "") . ' value="' . $escapedIcon . '" data-icon="' . $escapedIcon . '">' . $escapedIcon . '</option>';
                    }
                } else {
                    $options .= '<option disabled>No icons available</option>';
                }
  
                $submenus = $dataItem['submenus'];

                $html .= '<tr class="position-static" data-orden="'. $index .'">
                                <td style="width:10%;">
                                <input type="checkbox" '. (($dataItem['isActive'] == true) ? 'checked' : "") .' class="form-check-input checkItem">
                                <input type="hidden" class="form-check-input idItem" value="'. $dataItem['id']. '">
                                </td>
                                <td style="width:30%;"><input type="text" class="form-control nombreItem" value="'. $dataItem['name'] .'"></td>
                                <td style="width:30%;"><select class="form-control select2 iconItem" style="width: 100%;" id="">'. $options .'</select></td>
                                <td style="width:30%;">
                                    <div class="btn-group" style="width: 100%;">
                                        <button type="button" class="btn btn-info dropdown-toggle" style="width: 100%;" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-bars"></i>&nbsp;Submenus</button>
                                        <ul class="dropdown-menu submenus_desplegables" data-menu-principal="'. $dataItem['id'] .'" style="padding:10px; width:100%">';
                                        
                                            // $QuerySumbmenus = "SELECT * FROM main_menu  WHERE estado = '1' AND idPrincipal = '" . $dataItem['id'] . "'";
                                            // $ResultSumbmenus = mysqli_query($conn3, $QuerySumbmenus);
                                            $submenusTotales = 0;
                                            $idsSubmenusExcluidos = "";
                                            $ordenSubmenu = 0;
                                            foreach ($submenus as $RowSumbmenus) { 
                                            $submenusTotales += 1;
                                            $ordenSubmenu += 1;
                                            $idsSubmenusExcluidos .= $RowSumbmenus['id'] . ","; 
                                            $html .= '<li data-orden-submenu="'. $ordenSubmenu .'" style="margin-bottom:5px; padding:5px; display:flex; flex-direction:row; ">
                                                            <input type="checkbox" '. (($RowSumbmenus['active'] == true) ? 'checked' : "") .' style="width:20px; margin-right:5px;" class="active_item_submenu">
                                                            <input class="form-control nombre_item_submenu" type="text"  value="'. $RowSumbmenus['name'] .'">
                                                            <input type="hidden" class="id_item_submenu" value="' . $RowSumbmenus['id'] .'">
                                                        </li>';
                                            }  
                                            $idsSubmenusExcluidos = substr($idsSubmenusExcluidos, 0, -1);

                                            $WhereSubMenusExcluidos = (($idsSubmenusExcluidos <> "") ? "AND id NOT IN ($idsSubmenusExcluidos)" : "");
                                            $QuerySumbmenus = "SELECT * FROM main_menu  WHERE estado = '1' AND idPrincipal = '" . $dataItem['id'] . "' {$WhereSubMenusExcluidos}";
                                            $ResultSumbmenus = mysqli_query($conn3, $QuerySumbmenus);
                                            foreach ($ResultSumbmenus as $RowSumbmenus) { 
                                            $submenusTotales += 1;
                                            $ordenSubmenu += 1;
                                            $idsSubmenusExcluidos .= $RowSumbmenus['id'] . ","; 
                                            $html .= '<li data-orden-submenu="'. $ordenSubmenu .'" style="margin-bottom:5px; padding:5px; display:flex; flex-direction:row; ">
                                                            <input type="checkbox" '. (($RowSumbmenus['isActive'] == true) ? 'checked' : "") .' style="width:20px; margin-right:5px;" class="active_item_submenu">
                                                            <input class="form-control nombre_item_submenu" type="text"  value="'. $RowSumbmenus['nombre'] .'">
                                                            <input type="hidden" class="id_item_submenu" value="' . $RowSumbmenus['id'] .'">
                                                        </li>';
                                            }

                            $html .=    '</ul>
                                    </div>
                                    <input type="hidden" class="" value="'. $QuerySumbmenus .'">
                                    <input type="hidden" class="form-check-input submenusItem" value="'. $submenusTotales .'">
                                </td>
                            </tr>';



            }
            $IdsExcluidos = substr($IdsExcluidos, 0, -1);
            
            
            //* ////////////////// ITEMS QUE NO ESTABAN EN EL JSON GUARDADO PREVIAVENTE (NI ACTIVOS NI INACTIVOS) /////////////////////// 
            $QueryMenusDisponibles = "SELECT * FROM main_menu  WHERE estado = '1' AND idPrincipal = '0' AND id NOT IN ($IdsExcluidos)  ORDER BY Nombre ASC";
            $ResultMenu = mysqli_query($conn3, $QueryMenusDisponibles);
            foreach ($ResultMenu as $RowMenu) {
                $index +=1;
                $options = "";
                if (is_array($dataIcons)) {
                    foreach ($dataIcons as $icon) {
                        $escapedIcon = htmlspecialchars($icon, ENT_QUOTES, 'UTF-8');
                    $options .= '<option ' .  (($icon == $RowMenu['icon']) ? 'selected' : "") . ' value="' . $escapedIcon . '" data-icon="' . $escapedIcon . '">' . $escapedIcon . '</option>';
                    }
                } else {
                    $options .= '<option disabled>No icons available</option>';
                }
  
                $html .= '<tr class="position-static" data-orden="'. $index .'">
                                <td style="width:10%;">
                                <input type="checkbox" class="form-check-input checkItem">
                                <input type="hidden" class="form-check-input idItem" value="'. $RowMenu['id']. '">
                                </td>
                                <td style="width:30%;"><input type="text" class="form-control nombreItem" value="'. $RowMenu['nombre'] .'"></td>
                                <td style="width:30%;"><select class="form-control select2 iconItem" style="width: 100%;" id="">'. $options .'</select></td>
                                <td style="width:30%;">
                                    <div class="btn-group" style="width: 100%;">
                                        <button type="button" class="btn btn-info dropdown-toggle" style="width: 100%;" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-bars"></i>&nbsp;Submenus</button>
                                        <ul class="dropdown-menu submenus_desplegables" data-menu-principal="'. $RowMenu['id'] .'" style="padding:10px; width:100%">';
                                        
                                            $QuerySumbmenus = "SELECT * FROM main_menu  WHERE estado = '1' AND idPrincipal = '" . $RowMenu['id'] . "'";
                                            $ResultSumbmenus = mysqli_query($conn3, $QuerySumbmenus);
                                            $submenusTotales = 0;
                                            foreach ($ResultSumbmenus as $ordenSubmenu => $RowSumbmenus) { 
                                            $submenusTotales += 1; 
                                            $html .= '<li data-orden-submenu="'. $ordenSubmenu + 1 .'" style="margin-bottom:5px; padding:5px; display:flex; flex-direction:row; ">
                                            <input class="" type="checkbox" style="width:20px; margin-right:5px;" class="active_item_submenu">
                                                <input class="form-control nombre_item_submenu" type="text"  value="'. $RowSumbmenus['nombre'] .'">
                                                <input type="hidden" class="id_item_submenu" value="' . $RowSumbmenus['id'] .'">
                                            </li>';
                                        }  
                                    $html .= '</ul>
                                    </div>
                                    <input type="hidden" class="form-check-input submenusItem" value="'. $submenusTotales .'">
                                </td>
                                </tr>';
            } 
            
            $itemsTotales = $index + 1;
            //* ////////////////// ITEMS QUE NO ESTABAN EN EL JSON GUARDADO PREVIAVENTE (NI ACTIVOS NI INACTIVOS) ///////////////////////  
            echo $html; 
        }
        //? MOSTRAR TODO EL MENU YA CONFIGURADO POR EL USUARIO[FIN]
        

    //// CAPTURA DE EXCEPCIONES    
    } catch (\Throwable $th) {
        $Response = [];
        $Response["icon"] = "error";
        $Response["title"] = "Error";
        $Response["text"] = $th;
        echo json_encode($Response);
    }


?>