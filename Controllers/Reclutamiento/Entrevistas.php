<?php 

class EntrevistasController {
    private $model;

    public function __construct($db) {
        $this->model = new EntrevistaModel($db);
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

    public function obtenerPorCondicion($arraycondition) {
        $condition = prepareSetQueryMysql($arraycondition);
        $respuesta = $this->model->obtenerPorCondicion($condition);
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta;

        return $respuesta;
    }

    public function obtenerPorMesYUsuario($mes, $idUsuario = '0') {
        $currentYear = date("Y");
        $respuesta = $this->model->obtenerPorCondicion("AND fecha LIKE '%". $currentYear. "-" . $mes . "-%' AND idUsuario = " . $idUsuario);
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta;
        return $respuesta;
    }

    public function obtenerPorMeses($arrayMeses, $idUsuario = '0') {

        $respuesta = [];
        foreach ($arrayMeses as $mes) {
            $entrevistasPorMes = $this->obtenerPorMesYUsuario($mes, $idUsuario);
            foreach ($entrevistasPorMes as $entrevista) {
                $respuesta[] = $entrevista;
            }
        }

        return $respuesta;
    }
    
    public function obtenerPorMesesParaFullCalendar($arrayMeses, $idUsuario = '0') {

        $respuesta = [];

        foreach ($arrayMeses as $mes) {
            $entrevistasPorMes = $this->obtenerPorMesYUsuario($mes, $idUsuario);
            foreach ($entrevistasPorMes as $entrevista) {
                $datosTrabajador = $this->model->obtenerTrabajadorPorIdEntrevista($entrevista["id"]);
                $respuesta[] = [
                    "title" => "Entrevista cargo " . $entrevista["cargoAplica"],
                    "start" => $entrevista["fecha"] . "T" . $entrevista["hora"],
                    "end" => $entrevista["fecha"] . "T" . $entrevista["hora"],
                    "icon" => "fas fa-handshake",
                    "description" => "Entrevista para el cargo de " . $entrevista["cargoAplica"] . " con el candidato " . $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] . " " ,
                ];
            }
        }

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