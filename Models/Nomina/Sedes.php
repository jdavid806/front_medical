<?php

// require_once "../../funciones/funcionesModels.php";

class SedeModel
{
    private $conn3;
    private $table;

    public function __construct($conn3)
    {
        $this->conn3 = $conn3; // Asignar la conexión de base de datos pasada como parámetro
        $this->table = "NOM_Sedes";
    }


    public function crearTabla($data)
    {
        $Campos = prepareCreateTable($data);
        $QueryCreateTable = "CREATE TABLE IF NOT EXISTS {$this->table} (
            id INT(11)  PRIMARY KEY NOT NULL AUTO_INCREMENT,
            fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fechaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            {$Campos}
            activo TINYINT(1) NOT NULL DEFAULT 1
        )";

        if (mysqli_query($this->conn3, $QueryCreateTable)) {
            return [
                "status" => true,
            ];
        } else {
            return [
                "status" => false,
                "error" => mysqli_error($this->conn3),
                "query" => $QueryCreateTable
            ];
        }

    }

    public function obtenerSedes()
    {
        $query = "SELECT * FROM {$this->table} WHERE activo = 1";
        $result = mysqli_query($this->conn3, $query);
        if ($result) {
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        } else {
            $rows = [];
        }
        return $rows;
    }

    public function obtenerSedePorId($id)
    {
        // $query = "SELECT * FROM {$this->table} WHERE id = {$id} and activo = '1' LIMIT 1";
        $query = "SELECT * FROM {$this->table} WHERE id = {$id} LIMIT 1";        
        $result = mysqli_query($this->conn3, $query);
        if ($result) {
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        } else {
            $rows = [];
        }
        return $rows;
    }

    public function obtenerPorCondicion($condition) {
        $query = "SELECT * FROM {$this->table} WHERE 1=1 {$condition} AND activo = '1'";
        $result = mysqli_query($this->conn3, $query);
        $rows = [];
        if ($result) {
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        }
        return $rows;
    }

    public function obtenerPersonalizado($columnas, $condicion) {
        $query = "SELECT {$columnas} FROM {$this->table} WHERE 1=1 AND activo = '1' {$condicion}";
        $result = mysqli_query($this->conn3, $query);
        if ($result) {
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
        } else {
            $row = [];
        }
        return $row;
    }


    public function crearSede($data)
    {
        $CrearTabla = $this->crearTabla($data);
        if ($CrearTabla["status"] == false) {
            return $CrearTabla;
        }

        $Campos = prepareSetMysql($data);
        $query = "INSERT INTO {$this->table} SET {$Campos}";
        if (mysqli_query($this->conn3, $query)) {
            return [
                "status" => true,
            ];
        } else {
            return [
                "status" => false,
                "error" => mysqli_error($this->conn3),
                "query" => $query
            ];
        }
    }




    public function actualizarSede($id, $data)
    {
        $CrearTabla = $this->crearTabla($data);
        if ($CrearTabla["status"] == false) {
            return $CrearTabla;
        }
        $Campos = prepareSetMysql($data);
        $query = "UPDATE {$this->table} SET {$Campos} WHERE id = {$id}";
        if (mysqli_query($this->conn3, $query)) {
            return [
                "status" => true,
            ];
        } else {
            return [
                "status" => false,
                "error" => mysqli_error($this->conn3),
                "query" => $query
            ];
        }
    }

    public function eliminarSede($id)
    {
        $query = "UPDATE {$this->table} SET activo = 0 WHERE id = {$id}";
        if (mysqli_query($this->conn3, $query)) {
            return [
                "status" => true,
            ];
        } else {
            return [
                "status" => false,
                "error" => mysqli_error($this->conn3),
                "query" => $query
            ];
        }
    }
}