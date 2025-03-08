<?php
class DescuentosController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new DescuentosModel($db);
    }

    public function index() {
        $respuesta = $this->model->obtener();
        return $respuesta;   
    }
    
    public function obtenerMax() {
        $respuesta = $this->model->obtenerMaximo();
        return $respuesta;   
    }

    public function obtenerPorId($id) {
        $respuesta = $this->model->obtenerPorId($id);
        return $respuesta;   
    }

    public function obtenerPorCondicion($condition) {
        $respuesta = $this->model->obtenerPorCondicion($condition);
        return $respuesta;   
    }

    public function crear($data) {
        $data = escaparArray($data);
        $respuesta = $this->model->crear($data);
        return [
            "status" => $respuesta["status"],
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