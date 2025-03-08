<?php 
include "../funciones/funciones.php";
include "../funciones/conn3.php";

if ($_POST['action'] == 'changeAjaxFast') {
    $table = $_POST['table'];
    $columnChange = $_POST['columnChange'];
    $value = $_POST['value'];
    $columnWhere = $_POST['columnWhere'];
    $idWhere = $_POST['idWhere'];

    $Update = "UPDATE $table SET $columnChange = '$value'  WHERE $columnWhere = '$idWhere' ";
    // echo $Update;
    
    if (mysqli_query($conn3, $Update)) {
        echo "ok";
    }else{
        echo "Error " . $Update . "<br>" . mysqli_error($conn3);
    }
}else if ($_POST['action'] == 'deleteAjaxFast') {
    $columnWhere = $_POST['columnWhere']; 
    $id = $_POST['id']; 
    $table = $_POST['table']; 
    $columnSet = $_POST['columnSet']; 

    $Response = [];
    $UpdateDelete  = "UPDATE $table SET $columnSet = 0  WHERE $columnWhere = '$id' ";
    if (mysqli_query($conn3, $UpdateDelete)) {
        $Response['icon'] = 'success';
        $Response['title'] = 'Eliminado';
        $Response['text'] = 'Eliminado correctamente';
        
    }else{
        $Response['icon'] = 'error';
        $Response['title'] = 'Error';
        $Response['text'] = 'Error al eliminar => ' . $UpdateDelete;
    }

    echo json_encode($Response);

}


?>