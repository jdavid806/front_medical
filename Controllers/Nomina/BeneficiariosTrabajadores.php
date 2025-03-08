<?php
class BeneficiariosTrabajadoresController {
    private $model;

    public function __construct($db, $data = []) {
        $this->model = new BeneficiariosTrabajadoresModel($db);
    }

    public function index() {
        $sedes = $this->model->obtener();
        return $sedes;   
    }

    public function indexConditional($condition) {
        $sedes = $this->model->obtenerPorCondicion($condition);
        return $sedes;   
    }

    public function crear($data) {
        $respuesta = $this->model->crear($data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
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
    
    public function guardaroActualizar($idTrabajador, $data) {
        try {
            foreach ($data as $datosBeneficiario) {
                $idBeneficiario = $datosBeneficiario["id"];
                $datosBeneficiario["idTrabajador"] = $idTrabajador;
                unset($datosBeneficiario["id"]);

                if ($idBeneficiario == 0) {
                    $respuesta = $this->crear($datosBeneficiario);
                    if ($respuesta["status"] == false) {
                        return [
                            "status" => $respuesta["status"],
                            "message" => $respuesta["query"] . " " . $respuesta["error"]
                        ];
                        break;
                    }
                }else{
                    $respuesta = $this->editar($idBeneficiario, $datosBeneficiario);
                    if ($respuesta["status"] == false) {
                        return [
                            "status" => $respuesta["status"],
                            "message" => $respuesta["query"] . " " . $respuesta["error"]
                        ];
                        break;
                    }
                }
            }

            return [
                "status" => true,
                "message" => ""
            ];
            
        } catch (\Throwable $th) {
            
        }

        
    }
}

?>