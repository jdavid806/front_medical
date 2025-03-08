<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir autoload de Composer
require __DIR__ . '/../../PhpMailer/vendor/autoload.php';


class NameController
{
    private $model;
    private $emailEmisor;

    public function __construct()
    {
        $this->emailEmisor = 'tu_correo@gmail.com';
    }


    public function sendEmail()
    {
        $mail = new PHPMailer(true);

        // TODO => REALIZAR LA CONFIGURACION DE ENVIO
        //     try {
        //         // Configuración del servidor SMTP
        //         $mail->isSMTP();                              // Usar SMTP
        //         $mail->Host       = 'smtp.gmail.com';         // Servidor SMTP de Gmail
        //         $mail->SMTPAuth   = true;                     // Habilitar autenticación SMTP
        //         $mail->Username   = 'tu_correo@gmail.com';    // Tu dirección de correo
        //         $mail->Password   = 'tu_contraseña';          // Contraseña de tu correo
        //         $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encriptación TLS
        //         $mail->Port       = 587;                      // Puerto SMTP de Gmail

        //         // Configuración del correo
        //         $mail->setFrom('tu_correo@gmail.com', 'Tu Nombre');  // Remitente
        //         $mail->addAddress('destinatario@gmail.com', 'Destinatario'); // Destinatario
        //         $mail->Subject = 'Asunto del correo';
        //         $mail->Body    = 'Este es el contenido del correo.';
        //         $mail->isHTML(true); // Permitir HTML en el correo

        //         // Enviar el correo
        //         $mail->send();
        //         echo 'Correo enviado correctamente';
        //     } catch (Exception $e) {
        //         echo "Error al enviar el correo: {$mail->ErrorInfo}";
        //     }
        // }



        // public function index() {
        //     $respuesta = $this->model->obtener();
        //     return $respuesta;
        // }

        // public function obtenerMax() {
        //     $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        //     $respuesta = $respuesta == null || $respuesta == false ? 0 : $respuesta[0]["id"];
        //     return $respuesta;
        // }

        // public function getFecha() {
        //     return date("Y-m-d");
        // }

        // public function obtenerPorId($id) {
        //     $respuesta = $this->model->obtenerPorId($id);
        //     return $respuesta;
        // }

        // public function obtenerPorCondicion($arraycondition) {
        //     $condition = prepareSetQueryMysql($arraycondition);
        //     $respuesta = $this->model->obtenerPorCondicion($condition);
        //     $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta;

        //     return $respuesta;
        // }

        // public function crear($data) {
        //     $data = escaparArray($data);
        //     $respuesta = $this->model->crear($data);
        //     return [
        //         "status" => $respuesta["status"] ,
        //         "message" => $respuesta["query"] . " " . $respuesta["error"]
        //     ];
        // }

        // public function editar($id, $data) {
        //     $data = escaparArray($data);
        //     $respuesta = $this->model->actualizar($id, $data);
        //     return [
        //         "status" => $respuesta["status"],
        //         "message" => $respuesta["query"] . " " . $respuesta["error"]
        //     ];
        // }

        // public function eliminar($id) {
        //     $respuesta = $this->model->eliminar($id);
        //     return [
        //         "status" => $respuesta["status"],
        //         "message" => $respuesta["query"] . " " . $respuesta["error"]
        //     ];
        // }
    }
}