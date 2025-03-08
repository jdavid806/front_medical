<?php
class TrabajadoresController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new TrabajadoresModel($db);
    }

    public function index() {
        // $respuesta = $this->model->obtener();
        $respuesta = $this->model->obtenerPorCondicion(" AND tipo='Trabajador'");
        return $respuesta;   
    }
    
    public function indexCandidatos() {
        // $respuesta = $this->model->obtener();
        $respuesta = $this->model->obtenerPorCondicion(" AND tipo='Candidato'");
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
    
    public function obtenerPorDocumento($numeroDocumento) {
        $respuesta = $this->model->obtenerPorCondicion(" AND numero_documento='" . $numeroDocumento . "'");
        $respuesta = $respuesta ? $respuesta[0] : [];
        return $respuesta;   
    }

    public function obtenerPorCondicion($condition) {
        $respuesta = $this->model->obtenerPorCondicion($condition);
        $respuesta = !is_array($respuesta) ? [] : $respuesta;
        return $respuesta;   
    }
    
    public function obtenerPorMesDeNacimiento($mes) {
        $respuesta = $this->model->obtenerPorCondicion(" AND tipo='Trabajador' AND fecha_nacimiento LIKE '%-" . $mes . "-%'");
        $respuesta = !is_array($respuesta) ? [] : $respuesta;
        return $respuesta;   
    }
    
    public function obtenerPorMesesDeNacimiento($arraymeses) {
        if ($arraymeses == null || !is_array($arraymeses)) {
            throw new Exception("Parametro arraymeses no es valido", 1);
        }
        
        $respuesta = [];

        foreach ($arraymeses as $mes) {
            $trabajadoresPorMes = $this->obtenerPorMesDeNacimiento($mes);
            foreach ($trabajadoresPorMes as $trabajador) {
                $respuesta[] = $trabajador; 
            }
        }

        return $respuesta;

        // $respuesta = $this->model->obtenerPorCondicion(" AND tipo='Trabajador' AND fecha_nacimiento LIKE '%-" . $mes . "-%'");
        // $respuesta = !is_array($respuesta) ? [] : $respuesta;
        
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