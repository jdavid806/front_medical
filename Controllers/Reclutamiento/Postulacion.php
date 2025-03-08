<?php 

class PostulacionController {
    private $model;

    public function __construct($db) {
        $this->model = new PostulacionModel($db);
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
    
    public function obtenerPorUsuario($idUsuario, $TrabajadorController) {
        $respuesta = $this->model->obtenerPorCondicion(" AND idUsuario = " . $idUsuario);
        $respuestaFiltroCandidatos = $this->filtrarCandidatos($respuesta, $TrabajadorController);
        return $respuestaFiltroCandidatos;
    }
    
    public function filtrarCandidatos($postulaciones, $TrabajadorController) {
        $respuesta = [];
        foreach ($postulaciones as $postulacion) {
            $idCandidato = $postulacion["idCandidato"];
            $datosCandidato = $TrabajadorController->obtenerPorId($idCandidato);
            if ($datosCandidato["tipo"] == "Candidato") {
                array_push($respuesta, $postulacion);
            }
        }
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
    
    public function crearConTrabajador($data, $ControllerTrabajador) {
    
        $idPuesto = $data['idPuesto'];
        $idSitio = $data['idSitio'];

        $dataPostulacion = [];

        unset($data['idPuesto']);
        unset($data['idSitio']);

        $datosCandidato = $ControllerTrabajador->obtenerPorDocumento($data["numero_documento"]);
        $candidatoExiste = is_numeric($datosCandidato["id"]);
        if ($candidatoExiste) {
            $dataPostulacion = [
                "idUsuario" => $idSitio,
                "idPuesto" => $idPuesto,
                "idCandidato" => $datosCandidato["id"],
                "archivo" => "",
            ];
        }else{
            $data["tipo"] = "Candidato";
            $CrearCandidato = $ControllerTrabajador->crear($data);
            if ($CrearCandidato["status"] == true) {
                $idCandidato = $ControllerTrabajador->obtenerMax();
                $idCandidato = is_array($idCandidato) ? $idCandidato[0] : $idCandidato;
                $dataPostulacion = [
                    "idUsuario" => $idSitio,
                    "idPuesto" => $idPuesto,
                    "idCandidato" => $idCandidato,
                    "archivo" => "",
                ];
            }else{
                return [
                    "status" => $CrearCandidato["status"] ,
                    "message" =>  "Error al crear al candidato" . $CrearCandidato["query"] . " " . $CrearCandidato["error"]
                ];
            }

        }

        
        // $data = escaparArray($data);
        $respuesta = $this->model->crear($dataPostulacion);
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