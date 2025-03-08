<?php
require './PhpMailer/vendor/autoload.php'; // Para Composer
// Si instalaste manualmente, usa:
// require 'libs/phpmailer/src/PHPMailer.php';
// require 'libs/phpmailer/src/SMTP.php';
// require 'libs/phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'tu_email@gmail.com';
    $mail->Password = 'tu_contraseña';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Configuración del correo
    $mail->setFrom('dsantirodriguez12@gmail.com', 'Santiago');
    $mail->addAddress('santiago.salasdezoom@gmail.com', 'Deivyd');
    $mail->Subject = 'Asunto del correo';
    $mail->Body = 'Este es el contenido del correo.';
    $mail->AltBody = 'Este es el contenido alternativo para clientes sin soporte HTML.';

    // Enviar correo
    $mail->send();
    echo 'Correo enviado exitosamente.';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
