<?php 

class CuentasContablesController {
    private $model;

    public function __construct($db) {
        $this->model = new CuentaContableModel($db);
    }

    public function index() {
        $respuesta = $this->model->obtener();
        return $respuesta;
    }
    
    public function obtenerListado() {
        $respuesta = $this->model->obtener();
        // echo "Obtener listado desde e4l controller";
        // var_dump($respuesta);

        // $nuevoArray = [];
        // foreach ($respuesta as $cuenta) {
        //     $nuevoArray[$cuenta["codigo"]] = $cuenta["nombre"];
        // }
        $respuesta1 = ordenarCuentasDesdeController($respuesta);
        return $respuesta1;
    }

    public function obtenerMax() {
        $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta[0]["id"];
        return $respuesta;
    }

    public function obtenerPorInicial($inicial) {
        $respuesta = $this->model->obtenerPersonalizado("*", " AND codigo LIKE '{$inicial}%'");
        // $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta["id"];
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

?>