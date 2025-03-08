<?php 

class NominaIndividualController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new NominaIndividualModel($db);
    }

    public function index() {
        $respuesta = $this->model->obtener();
        return $respuesta;
    }

    public function obtenerMax() {
        $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta[0]["id"];
        return $respuesta;
    }

    public function getFecha() {
        return date("Y-m-d");
    }

    public function obtenerPorId($id) {
        $respuesta = $this->model->obtenerPorId($id);
        return $respuesta;
    }

    public function obtenerPorCondicion($condition) {
        $respuesta = $this->model->obtenerPorCondicion($condition);
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta;

        return $respuesta;
    }
    
    public function obtenerPorIdPrincipalYTrabajador($idPrincipal, $idTrabajador) {

        if ( !is_numeric($idPrincipal) || !is_numeric($idTrabajador)) {
            throw new Exception("Ocurrio un error con los parametros idPrincipal y idTrabajador", 1);
        }

        $respuesta = $this->model->obtenerPorCondicion(" AND idTrabajador = " . $idTrabajador . " AND idPrincipal = " . $idPrincipal);
        $id = $respuesta == null || $respuesta == false ? [] : $respuesta[0]["id"];
        return $id;
    }

    public function crear($data) {
        $data = escaparArray($data);
        $respuesta = $this->model->crear($data);
        return [
            "status" => $respuesta["status"] ,
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }

    public function editar($id, $data) {
        $data = escaparArray($data);
        $respuesta = $this->model->actualizar($id, $data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }

    public function eliminar($id) {
        $respuesta = $this->model->eliminar($id);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }
}