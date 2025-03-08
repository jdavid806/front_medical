<?php
class RetencionSalarioController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new RetencionSalarioModel($db);
    }

    public function index() {
        $sedes = $this->model->obtener();
        return $sedes;   
    }

    public function crear($data) {
        $respuesta = $this->model->crear($data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }

    public function obtenerPorSalario($salario) {
        $respuesta = $this->model->obtenerCondicional(" AND $salario BETWEEN rangoSalarialDesde AND rangoSalarialHasta");
        $respuesta = !$respuesta || empty($respuesta) ? [] : $respuesta[0];
        return $respuesta;
    }

    public function editar($id, $data) {
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