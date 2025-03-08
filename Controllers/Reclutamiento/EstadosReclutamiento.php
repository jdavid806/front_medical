<?php
class EstadoReclutamientoController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new EstadoReclutamientoModel($db);
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

    public function obtenerPorId($id) {
        $respuesta = $this->model->obtenerPorId($id);
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