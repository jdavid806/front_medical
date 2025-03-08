<?php

// controllers/SedeController.php
class SedeController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new SedeModel($db);
    }

    public function index() {
        $sedes = $this->model->obtenerSedes();
        return $sedes;   
    }

    public function crear($data) {
        $respuesta = $this->model->crearSede($data);
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


    public function obtenerPorId($id) {
        $respuesta = $this->model->obtenerSedePorId($id);
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta[0];
        return $respuesta;
    }
    
    public function obtenerPorCondicion($condicion) {
        $respuesta = $this->model->obtenerPorCondicion($condition);
        return $respuesta;
    }

    public function editar($id, $data) {
        $respuesta = $this->model->actualizarSede($id, $data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
        return $respuesta;
    }

    public function eliminar($id) {
        $respuesta = $this->model->eliminarSede($id);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
        return $respuesta;
    }
}


// --CONTENIDO DE UN AJAX

?>