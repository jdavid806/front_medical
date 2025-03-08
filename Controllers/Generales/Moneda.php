<?php 

class MonedaController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new MonedasModel($db);
    }

    public function index() {
        $respuesta = $this->model->obtener();
        return $respuesta;
    }
    
    public function indexSelect() {
        $respuesta = $this->model->obtener();
        $array = [];
        foreach ($respuesta as $value) {
            $array[$value["Moneda"]] = $value["Nombre"];
        }

        return $array;
    }

    public function obtenerMax() {
        $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        // $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta["id"];
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