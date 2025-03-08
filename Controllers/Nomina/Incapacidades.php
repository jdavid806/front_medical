<?php 

class IncapacidadesController {
    private $model;

    public function __construct($db) {
        $this->model = new IncapacidadModel($db);
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

    public function getFecha() {
        return date("Y-m-d");
    }

    public function obtenerPorId($id) {
        $respuesta = $this->model->obtenerPorId($id);
        return $respuesta;
    }

    public function obtenerPorIdTrabajador($idTrabajador) {
        $respuesta = $this->model->obtenerPorCondicion("AND idTrabajador = " . $idTrabajador );
        return $respuesta;
    }

    public function obtenerPorIdTrabajadorYRangoFecha($idTrabajador, $fechas) {
        if (!is_array($fechas)) {
            throw new Exception("Valor de fechas invalido", 1);
        }

        $fechaInicio = $fechas[0];
        $fechaFin = $fechas[1];

        $respuesta = $this->model->obtenerPorCondicion("AND idTrabajador = " . $idTrabajador . " AND pagado = 'No' AND ( fechaIncio >= '" . $fechaInicio . "' AND fechaFin <= '" . $fechaFin . "' ) ");
        return $respuesta;
    }

    public function obtenerPorCondicion($arraycondition) {
        $condition = prepareSetQueryMysql($arraycondition);
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