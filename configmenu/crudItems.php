<?php 

$QueryTableItemsMenu = "CREATE TABLE IF NOT EXISTS main_menu (
    id int(11) PRIMARY KEY auto_increment,
    nombre text NULL,
    nivel int(11) DEFAULT '1',
    pantalla text NULL,
    idPrincipal int(11) DEFAULT '0',
    estado int(11) DEFAULT '1',
    icon text NULL,
    color text NULL,
    orden int(11) DEFAULT '1',
    tabla text NULL,
    editable int(11) DEFAULT '1',
    usuario_id int(11) DEFAULT '0'
)";

mysqli_query($conn3, $QueryTableItemsMenu) or die(mysqli_error($conn3));



$QueryTableGruposMenu = "CREATE TABLE IF NOT EXISTS gruposMenu (
                        ID int(11) NO PRIMARY KEY auto_increment,
                        FechaHora datetime NULL current_timestamp(),
                        Array_Items longtext NOT NULL DEFAULT '[]',
                        Activo int(1) DEFAULT 1,
                        usuarioId int(11) DEFAULT 0,
                        Nombre text YES NULL 
                        )";

mysqli_query($conn3, $QueryTableGruposMenu) or die(mysqli_error($conn3));





?>


<!-- ====== AGREGAR NUEVO ITEM ======== -->
<div class="collapse show col-md-12 row " id="collapseItem">
    <div class="col-md-6">
        <label for="NuevoItem_nombre">Nombre</label>
        <input type="text" class="form-control" name="NuevoItem[nombre]" id="NuevoItem_nombre">
    </div>

    <div class="col-md-6">
        <label for="NuevoItem_pantalla">Destino <small><strong> [Desde <?= $Base ?>] </strong></small></label>
        <input type="text" class="form-control" name="NuevoItem[pantalla]" id="NuevoItem_pantalla">
    </div>

    <div class="col-md-6">
        <label for="NuevoItem_icon">Icono</label>
        <select class="form-control select2" style="width: 100%;" name="NuevoItem[icon]" id="NuevoItem_icon">
            <?php
            $jsonIcons = file_get_contents('main_menu/Perfiles_Menu_Iconos.json');
            $dataIcons = json_decode($jsonIcons, true);

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

    <div class="col-md-6">
        <label for="NuevoItem_icon">Item Principal</label>
        <select class="form-control select2" style="width: 100%;" name="NuevoItem[idPrincipal]" id="NuevoItem_idPrincipal">
            <?php
            echo "<option value='0'>Ninguno</option>";
            $QueryOptions = "SELECT * FROM main_menu WHERE estado = '1' AND idPrincipal = '0'";
            $ResultOptions = mysqli_query($conn3, $QueryOptions);
            foreach ($ResultOptions as $RowOptions) {
                echo "<option value='" . $RowOptions['id'] . "'>" . $RowOptions['nombre'] . "</option>";
            }


            ?>
        </select>
    </div>
    <input type="hidden" value="#000000" class="form-control" name="NuevoItem[color]" id="NuevoItem_color">

    <div class="col-md-6">
        <!-- <label for="NuevoItem_color" style="color: transparent;"> lorem</label> -->
        <br>
        <a class="btn btn-success mb-4" onclick="saveNewItem()">
            <span class="fas fa-plus me-2"></span>Guardar
        </a>
    </div>

    <input value="<?= $_SESSION['ID'] ?>" type="hidden" name="NuevoItem[usuario_id]" id="NuevoItem_usuario_id">
</div>
<!-- ====== AGREGAR NUEVO ITEM ======== -->

<!-- ====== LISTADO DE ITEMS ======== -->
<div class="col-md-12 collapse " id="collapseListItem" style="width:100%">
    <table class="table fs-9 mb-0" id="table-list-item" style="width:100%">
        <thead>
            <tr>
                <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:70%;">Item</th>
                <th class="sort white-space-nowrap align-middle ps-0" scope="col" data-sort="projectName" style="width:30%;">Opciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $QueryItemsMenu = "SELECT nombre,id FROM main_menu WHERE estado = '1'";
            $ResultMenu = mysqli_query($conn3, $QueryItemsMenu);
            foreach ($ResultMenu as $RowMenu) { ?>
                <tr>
                    <td style="width:70%;"><?= $RowMenu['nombre'] ?></td>
                    <td style="width:30%;">
                        <button class="btn btn-danger me-4" onclick="deleteAlert('id', '<?php echo $RowMenu['id']; ?>', 'main_menu', 'estado')"><span class="fas fa-trash me-2"></span"></button>
                        <button class="btn btn-info me-4" onclick="updateItemMenuShow('<?php echo $RowMenu['id']; ?>')"><span class="fas fa-pencil me-2"></span"></button>
                    </td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</div>
    <!-- ====== LISTADO DE ITEMS ======== -->