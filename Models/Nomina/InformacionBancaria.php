<?php 

class InformacionBancariaModel
{
    private $conn;
    private $table;

    public function __construct($conn)
    {
        $this->conn = $conn; // Asignar la conexión de base de datos pasada como parámetro
        $this->table = 'NOM_InformacionBancaria';
    }

    public function crearTabla($data)
    {
        $Campos = prepareCreateTable($data);
        $QueryCreateTable = "CREATE TABLE IF NOT EXISTS {$this->table} (
            id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
            fechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fechaActualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            {$Campos}
            activo TINYINT(1) NOT NULL DEFAULT 1
        )";

        if (mysqli_query($this->conn, $QueryCreateTable)) {
            return [
                'status' => true,
            ];
        } else {
            return [
                'status' => false,
                'error' => mysqli_error($this->conn),
                'query' => $QueryCreateTable
            ];
        }
    }

    public function obtener()
    {
        $query = "SELECT * FROM {$this->table} WHERE activo = 1";
        $result = mysqli_query($this->conn, $query);
        if ($result) {
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        } else {
            $rows = [];
        }
        return $rows;
    }

    public function obtenerPorId($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = {$id} LIMIT 1";
        $result = mysqli_query($this->conn, $query);
        if ($result) {
            $rows = mysqli_fetch_array($result, MYSQLI_ASSOC);
        } else {
            $rows = [];
        }
        return $rows;
    }

    public function obtenerPorCondicion($condition) {
        $query = "SELECT * FROM {$this->table} WHERE 1=1 {$condition} AND activo = '1'";
        $result = mysqli_query($this->conn, $query);
        $rows = [];
        if ($result) {
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        }
        return $rows;
    }

    public function obtenerPersonalizado($columnas, $condicion) {
        $query = "SELECT {$columnas} FROM {$this->table} WHERE 1=1 AND activo = '1' {$condicion}";
        $result = mysqli_query($this->conn, $query);
        if ($result) {
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
        } else {
            $row = [];
        }
        return $row;
    }

    public function crear($data) {
        $CrearTabla = $this->crearTabla($data);
        if ($CrearTabla["status"] == false) {
            return $CrearTabla;
        }

        $Campos = prepareSetMysql($data);
        $query = "INSERT INTO {$this->table} SET {$Campos}";
        if (mysqli_query($this->conn, $query)) {
            return [
                'status' => true,
            ];
        } else {
            return [
                'status' => false,
                'error' => mysqli_error($this->conn),
                'query' => $query
            ];
        }
    }

    public function actualizar($id, $data) {
        $CrearTabla = $this->crearTabla($data);
        if ($CrearTabla["status"] == false) {
            return $CrearTabla;
        }
        $Campos = prepareSetMysql($data);
        $query = "UPDATE {$this->table} SET {$Campos} WHERE id = {$id}";
        if (mysqli_query($this->conn, $query)) {
            return [
                'status' => true,
            ];
        } else {
            return [
                'status' => false,
                'error' => mysqli_error($this->conn),
                'query' => $query
            ];
        }
    }

    public function eliminar($id) {
        $query = "UPDATE {$this->table} SET activo = 0 WHERE id = {$id}";
        if (mysqli_query($this->conn, $query)) {
            return [
                'status' => true,
            ];
        } else {
            return [
                'status' => false,
                'error' => mysqli_error($this->conn),
                'query' => $query
            ];
        }
    }
}