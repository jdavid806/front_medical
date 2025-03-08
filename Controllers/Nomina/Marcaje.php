<?php
class MarcacionesController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new MarcacionesModel($db);
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
    
    public function obtenerRetardosHoy() {
        $respuesta = $this->model->obtenerPersonalizado("count(*) as total", " AND fechaMarcacion='{$this->getFecha()}' AND tipoMarcaje = 'Entrada' AND retardo='Si'");
        // $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta["id"];
        return $respuesta["total"];   
    }

    public function obtenerInasistenciasHoy() {
        $respuesta = $this->model->obtenerPersonalizado("count(*) as total", " AND fechaMarcacion='{$this->getFecha()}' AND tipoMarcaje = 'Entrada' AND inasistencia='Si'");
        // $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta["id"];
        return $respuesta["total"];   
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