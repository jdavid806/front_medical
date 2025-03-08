<?php
session_start();
unset($_SESSION['username']);
session_destroy();
header('Location: ../inicio'); // Cambia esta ruta a donde necesites
exit(); // Es buena práctica usar exit() después de header()
