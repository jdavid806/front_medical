<?php
include 'header.php';
include 'menu.php';

$Nombre_Tabla = "cie10";
#Inicio
if (isset($_POST['Guardar_Informacion_Pagina'])) {

    $Arreglo = $_POST["Arreglo"];
    $tabla = mysqli_query($conn3, "SHOW TABLES LIKE '{$Nombre_Tabla}'");
    $nrowtabla = mysqli_num_rows($tabla);
    if ($nrowtabla == 0) {
        foreach ($Arreglo as $key => $value) {
            $Campos .= "`{$key}` text DEFAULT '',";
        }
        $Campos = trim($Campos, ',');

        $query = "CREATE TABLE `{$Nombre_Tabla}` (
        `id` int(11) NOT NULL,
        `usuario_id` int(11) NOT NULL,
        {$Campos},
        `Creacion_Dinamica` text DEFAULT '',
        `Activo` varchar(5) DEFAULT '1'
        ) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

        $creaciontabla = mysqli_query($conn3, $query);
        if (!$creaciontabla) {
            echo "<script language='Javascript'> alert('error en la creacion de la tabla');</script>";
        } else {
            mysqli_query($conn3, "ALTER TABLE `{$Nombre_Tabla}` ADD PRIMARY KEY (`id`);");
            mysqli_query($conn3, "ALTER TABLE `{$Nombre_Tabla}` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;");
        }
    } else {
        if ($nrowtabla == 1) {

            $Campo1 = mysqli_query($conn3, "show COLUMNS from {$Nombre_Tabla} WHERE Field = 'Creacion_Dinamica';");
            $nrowCampo1 = mysqli_num_rows($Campo1);
            if ($nrowCampo1 == "1") {
                foreach ($Arreglo as $key => $value) {
                    $Campo = mysqli_query($conn3, "show COLUMNS from {$Nombre_Tabla} WHERE Field = '{$key}';");
                    $nrowCampo = mysqli_num_rows($Campo);
                    if ($nrowCampo == 0) {
                        mysqli_query($conn3, "ALTER TABLE `{$Nombre_Tabla}` ADD `{$key}` TEXT NULL DEFAULT '';");
                    }
                }
            } else {
                echo "<script language='Javascript'> alert('Tabla No fue creada Dinamicamente');</script>";
                // si bota este mensaje es por que la tabla no esta creado el campo *Creacion_Dinamica* sirve para que no se use este modulo en tablas ya preexistentes
            }
        }
    }

    $Campos = "";
    $Valores = "";
    foreach ($_POST["Arreglo"] as $key => $value) {
        $Campos .= $key . ',';
        $Valores .= "'{$value}',";
    }
    $Campos = trim($Campos, ',');
    $Valores = trim($Valores, ',');

    $usuario_id = $_POST['usuario_id'];
    $Examenes = $_POST['Examenes'];

    $queryList = mysqli_query($conn3, "INSERT INTO {$Nombre_Tabla} (usuario_id,{$Campos}) VALUES ('$usuario_id',{$Valores});");

    $ruta = htmlentities($_SERVER['PHP_SELF']);
    $ruta = str_replace('.php', '', $ruta);
    if ($queryList != true) {
        echo "<script language='Javascript'> window.location='{$ruta}?error=Hubo Un Error Al Guardar La Entidad'</script>";
    } else {
        echo "<script language='Javascript'> window.location='{$ruta}?msg=Se Guardo La Entidad Correctamente'</script>";
    }
}

///////////////////////////////////////////////////////////////////////////

if (isset($_POST['Actualizar_Informacion_Pagina'])) {
    $arreglo_id = $_POST['arreglo_id'];

    var_dump($_POST["Arreglo"]);

    foreach ($_POST["Arreglo"] as $key => $value) {
        $Campos .= "{$key} = '{$value}',";
    }
    $Campos = trim($Campos, ',');

    $queryList = mysqli_query($conn3, "UPDATE {$Nombre_Tabla} SET {$Campos} WHERE codigo = '{$arreglo_id}' limit 1;");
    // die( "UPDATE {$Nombre_Tabla} SET {$Campos} WHERE codigo = '{$arreglo_id}' limit 1;");

    $ruta = htmlentities($_SERVER['PHP_SELF']);
    $ruta = str_replace('.php', '', $ruta);
    if ($queryList != true) {
        echo "<script language='Javascript'> window.location='{$ruta}?error=Hubo Un Error Al Actualizar Los Datos'</script>";
    } else {
        echo "<script language='Javascript'> window.location='{$ruta}?msg=Se Actualizo La Entidad Correctamente'</script>";
    }
}
///////////////////////////////////////////////////////////////////////////
if ($_GET['Eliminar'] <> "") {
    $id = $_GET['Eliminar'];
    $queryList = mysqli_query($conn3, "UPDATE {$Nombre_Tabla} SET Activo='0' WHERE codigo ='{$id}' limit 1");

    $ruta = htmlentities($_SERVER['PHP_SELF']);
    $ruta = str_replace('.php', '', $ruta);
    if ($queryList != true) {
        echo "<script language='Javascript'> window.location='{$ruta}?error=Hubo Un Error Al Eliminar La Entidad'</script>";
    } else {
        echo "<script language='Javascript'> window.location='{$ruta}?msg=Se Elimino La Entidad Correctamente'</script>";
    }
}
///////////////////////////////////////////////////////////////////////////
if (isset($_GET['Editar'])) {
    $id = $_GET['Editar'];
    $queryList = mysqli_query($conn3, "SELECT * FROM  {$Nombre_Tabla} where codigo='$id' limit 1");
    while ($rowMotorizado = mysqli_fetch_array($queryList)) {
        foreach ($rowMotorizado as $key => $value) {
            $datos["$key"] = "$value";
        }
    }
    $datos_json = json_encode($datos);
?>
    <script>
        window.onload = function() {
            var Arreglo = <?php echo $datos_json ?>;
            for (index in Arreglo) {

                if (document.getElementsByName("Arreglo[" + index + "]")[0] != undefined) {

                    if ((document.getElementsByName("Arreglo[" + index + "]")[0].tagName == "INPUT" || document
                            .getElementsByName("Arreglo[" + index + "]")[0].tagName == "TEXTAREA") && document
                        .getElementsByName("Arreglo[" + index + "]")[0].type != "checkbox") {
                        document.getElementsByName("Arreglo[" + index + "]")[0].value = Arreglo[index];
                    } else {

                        var name = document.getElementsByName("Arreglo[" + index + "]")[0].name;
                        var classe = document.getElementsByName("Arreglo[" + index + "]")[0].className;
                        //console.log(Arreglo[index]+" // "+index+ " @@ "+ name);
                        if (classe.indexOf("select2") > -1) {
                            $("select[name='" + name + "'] > option[value='" + Arreglo[index] + "']").attr("selected",
                                true);
                            $("select[name='" + name + "']").select2();
                            //console.log("entroo "+Arreglo[index]+" // "+index+ " @@ "+ name);
                        } else {
                            $("select[name='" + name + "']").val(Arreglo[index]);
                            //console.log("No entro"+Arreglo[index]+" // "+index+ " @@ "+ name);
                        }

                    }

                    if (document.getElementsByName("Arreglo[" + index + "]")[0].tagName == "INPUT" && document
                        .getElementsByName("Arreglo[" + index + "]")[0].type == "checkbox") {
                        console.log(Arreglo[index]);
                        if (Arreglo[index] == "1" || Arreglo[index] == "Si") {
                            document.getElementsByName("Arreglo[" + index + "]")[0].checked = true;
                        } else {
                            document.getElementsByName("Arreglo[" + index + "]")[0].checked = false;
                        }
                    }


                }

            }
        };
    </script>
<?php
}
#Cierre
if ($_GET["msg"] != "") {
    include "plugins/SweetAlert2K/AlertaCorrectaOperacion.php";
}
if ($_GET["error"] != "") {
    include "plugins/SweetAlert2K/AlertaErrorOperacion.php";
}

$usuario_id = $_SESSION['ID'];




function ConsultarOpcionesSelect($Query)
{

    include 'funciones/conn3.php';

    $text = "";
    $query = mysqli_query($conn3, $Query);
    while ($row = mysqli_fetch_array($query)) {
        $text .= "<option value='{$row['id']}'>{$row['Nombre']}</option>";
    }
    return  $text;
}
?>







<style>
    .Titulo_Pagina {
        width: fit-content;
        background-color: #3c8dbc75;
        padding: 20px;
        border-radius: 20px 20px 0px 0px;
        display: table-cell;
    }
</style>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper p-3">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <ol class="breadcrumb">
            <li><a href="portada"><i class="fa fa-dashboard"></i> Escritorio</a></li>
            <li><a href="#"> Registro de CIE-10 </a></li>
        </ol>
    </section>

    <!-- Main content -->
    <section class="content">
        <div class="">
            <div class="content">
                <h4 class="Titulo_Pagina">Registro de CIE-10 </h4>
                <div class="box">
                    <div class="box-body">

                        <div class="col-md-12">
                            <div class="panel panel-default">
                                <div class="panel-body">


                                    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST" class="row">
                                        <div class="form-group col-md-12">
                                            <label>Codigo</label>
                                            <input type="text" class="form-control input-lg" name="Arreglo[codigo]" placeholder="" value="" maxlength="120"  required>
                                        </div>
                                        <div class="form-group col-md-12">
                                            <label>Descripcion</label>
                                            <input type="text" class="form-control input-lg" name="Arreglo[descripcion]" placeholder="" value="" maxlength="120"  required>
                                        </div>
                                        <div class="form-group col-md-12">
                                            <label>Color</label>
                                            <input type="color" class="form-control input-lg" name="Arreglo[Color]" placeholder="" value="" maxlength="120"  required>
                                        </div>


                                        <input type="hidden" name="usuario_id" value="<?php echo $usuario_id; ?>">

                                        <?php if ($_GET['Editar'] <> "") : ?>
                                            <div class="col-sm-12">
                                                <input type="hidden" name="arreglo_id" value="<?php echo $_GET['Editar'] ?>">
                                                <center><button type="submit" class="btn btn-block btn-outline-info rounded-pill shadow" name="Actualizar_Informacion_Pagina">
                                                        <h2> <strong> A c t u a l i z a r </strong> </h2>
                                                    </button></center>
                                            </div>
                                        <?php else : ?>
                                            <div class="col-sm-12">
                                                <center><button type="submit" class="btn btn-block btn-outline-info rounded-pill shadow" name="Guardar_Informacion_Pagina">
                                                        <h2> <strong> G u a r d a r </strong> </h2>
                                                    </button></center>
                                            </div>
                                        <?php endif; ?>

                                        <div class="form-group col-md-12">
                                            <br>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>


                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-body">
                                    <div class="col-md-12">
                                        <h2 style="text-align: center;font-weight: bold;"> CIE-10 </h2>
                                        <table id="example1" class="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Nombre de la entidad</th>
                                                    <th scope="col">Color</th>
                                                    <th scope="col">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php

                                                $queryList = mysqli_query($conn3, "SELECT * FROM  {$Nombre_Tabla} WHERE Activo='1' limit 200 ");

                                                while ($rowMotorizado = mysqli_fetch_array($queryList)) {
                                                    //$contador++;
                                                    $id = $rowMotorizado['codigo'];
                                                    $Nombre = $rowMotorizado['descripcion'];
                                                    $Color = $rowMotorizado['Color'];

                                                    $ruta = htmlentities($_SERVER['PHP_SELF']);
                                                    $ruta = str_replace('.php', '', $ruta);
                                                    echo "<tr>
                                                    <th scope='row' width='2%'>{$id}</th>
                                                    <td width='20%' align='center'>{$Nombre}</td>
                                                    <td width='20%' align='center'><div style='width:50px; height:50px; border-radius:100%; background-color:{$Color}'></div></td>";


                                                    echo "<td width='20%' align='center'><font color='#04CC05'> <a href='{$ruta}?Editar={$id}' class='btn btn-outline-info btn-lg rounded-pill shadow' style='width: 50px;'><i class='fa fa-pencil' title='Editar'> </i></a></font>
                                                    <font> <a href='{$ruta}?Eliminar={$id}' class='btn btn-outline-danger btn-lg rounded-pill shadow' style='width: 50px;'> <i class='fa fa-close' title='Eliminar'> </i></a></font>
                                                    </td></tr>";
                                                }

                                                ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- /.content -->
</div>
<!-- /.content-wrapper -->
<?php
include 'footer.php';
?>
