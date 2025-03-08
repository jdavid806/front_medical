<?php
class CargoController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new CargoModel($db);
    }

    public function index() {
        $sedes = $this->model->obtener();
        return $sedes;   
    }

    public function obtenerPorId($id) {
        $sedes = $this->model->obtenerPorId($id);
        return $sedes;   
    }

    public function crear($data) {
        $data = escaparArray($data);
        $respuesta = $this->model->crear($data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }

    public function obtenerMax() {
        $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        $respuesta = $respuesta == null || $respuesta == false ? 0 : $respuesta[0]["id"];
        return $respuesta;
    }
    
    public function obtenerMaxRegistro() {
        $idMax = $this->obtenerMax();
        $respuesta = $this->obtenerPorId($idMax);
        return $respuesta;
    }


    public function obtenerPorCondicion($condition) {
        $respuesta = $this->model->obtenerPorCondicion($condition);
        return $respuesta;   
    }

    public function editar($id, $data) {
        $data = $escaparArray($data);
        $respuesta = $this->model->actualizar($id, $data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
        return $respuesta;
    }

    public function eliminar($id) {
        $respuesta = $this->model->eliminar($id);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
        return $respuesta;
    }
}

?>