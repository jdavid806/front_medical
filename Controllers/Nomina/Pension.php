<?php 

class PensionController {
    private $model;

    public function __construct($db) {
        $this->model = new PensionModel($db);
    }

    public function index() {
        $respuesta = $this->model->obtener();
        return $respuesta;
    }

    public function obtenerMax() {
        $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        $respuesta = $respuesta == null || $respuesta == false ? 0 : $respuesta[0]["id"];
        return $respuesta;
    }
    public function obtenerMaxRegistro() {
        $max = $this->obtenerMax();
        $respuesta = $this->obtenerPorId($max);
        return $respuesta;
    }

    public function getFecha() {
        return date("Y-m-d");
    }

    public function obtenerPorId($id) {
        $respuesta = $this->model->obtenerPorId($id);
        return $respuesta;
    }

    public function obtenerPorCondicion($arraycondition) {
        $condition = prepareSetQueryMysql($arraycondition);
        $respuesta = $this->model->obtenerPorCondicion($condition);
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta;

        return $respuesta;
    }

    public function obtenerPorIdUsuario($idUsuario) {
        $condition = 'AND idUsuario = ' .$idUsuario .' OR idUsuario = 0' ;
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