<?php 
die();


// include "funciones/conn3.php";
// include "funciones/funciones.php";
// include "funciones/funcionesModels.php";

// $datos  =   ['111' =>	'Cultivo de cereales (excepto arroz), legumbres y semillas oleaginosas',
//             '112' =>	'Cultivo de arroz',
//             '113' =>	'Cultivo de hortalizas, raíces y tubérculos',
//             '114' =>	'Cultivo de tabaco',
//             '115' =>	'Cultivo de plantas textiles',
//             '119' =>	'Otros cultivos transitorios n.c.p.',
//             '121' =>	'Cultivo de frutas tropicales y subtropicales',
//             '122' =>	'Cultivo de plátano y banano',
//             '123' =>	'Cultivo de café',
//             '124' =>	'Cultivo de caña de azúcar',
//             '125' =>	'Cultivo de flor de corte',
//             '126' =>	'Cultivo de palma para aceite (palma africana) y otros frutos oleaginosos',
//             '127' =>	'Cultivo de plantas con las que se prepararan bebidas',
//             '128' =>	'Cultivo de especias y de plantas aromáticas y medicinales',
//             '129' =>	'Otros cultivos permanentes n.c.p.',
//             '130' =>	'Propagación de plantas (actividades de los viveros, excepto viveros forestales)',
//             '141' =>	'Cría de ganado bovino y bufalino',
//             '142' =>	'Cría de caballos y otros equinos',
//             '143' =>	'Cría de ovejas y cabras',
//             '144' =>	'Cría de ganado porcino',
//             '145' =>	'Cría de aves de corral',
//             '149' =>	'Cría de otros animales n.c.p.',
//             '150' =>	'Explotación primaria mixta (agrícola y pecuaria)',
//             '163' =>	'Actividades posteriores a la cosecha',
//             '170' =>	'Caza ordinaria y mediante trampas y actividades de servicios conexas',
//             '210' =>	'Silvicultura y otras actividades forestales',
//             '220' =>	'Extracción de madera',
//             '230' =>	'Recolección de productos forestales diferentes a la madera',
//             '311' =>	'Pesca marítima',
//             '312' =>	'Pesca de agua dulce',
//             '321' =>	'Acuicultura marítima',
//             '322' =>	'Acuicultura de agua dulce',
//             '6531' =>	'Régimen de prima media con prestación definida (RPM)',
//             '8411' =>	'Actividades legislativas de la administración pública',
//             '8412' =>	'Actividades ejecutivas de la administración pública',
//             '8413' =>	'Regulación de las actividades de organismos que prestan servicios de salud, educativos, culturales y otros servicios sociales, excepto servicios de seguridad social',
//             '8414' =>	'Actividades reguladoras y facilitadoras de la actividad económica',
//             '8415' =>	'Actividades de los órganos de control y otras instituciones.',
//             '8421' =>	'Relaciones exteriores',
//             '8422' =>	'Actividades de defensa',
//             '8423' =>	'Orden público y actividades de seguridad publica',
//             '8424' =>	'Administración de justicia',
//             '8430' =>	'Actividades de planes de Seguridad Social de afiliación obligatoria',
//             '9001' =>	'Creación literaria',
//             '9002' =>	'Creación musical',
//             '9003' =>	'Creación teatral',
//             '9004' =>	'Creación audiovisual',
//             '9005' =>	'Artes plásticas y visuales',
//             '9006' =>	'Actividades teatrales',
//             '9007' =>	'Actividades de espectáculos musicales en vivo',
//             '9008' =>	'Otras actividades de espectáculos en vivo n.c.p',
//             '9101' =>	'Actividades de Bibliotecas y archivos',
//             '9102' =>	'Actividades y funcionamiento de museos, conservación de edificios y sitios históricos',
//             '9103' =>	'Actividades de jardines botánicos, zoológicos y reservas naturales',
//             '9311' =>	'Gestión de instalaciones deportivas',
//             '9312' =>	'Actividades de clubes deportivos',
//             '9319' =>	'Otras actividades deportivas',
//             '9412' =>	'Actividades de asociaciones profesionales y gremiales sin ánimo de lucro',
//             '9420' =>	'Actividades de sindicatos',
//             '9491' =>	'Actividades de asociaciones religiosas',
//             '9492' =>	'Actividades de partidos políticos',
//             '9700' =>	'Actividades de los hogares individuales como empleadores de personal doméstico',
//             '9810' =>	'Actividades no diferenciadas de los hogares individuales como productores de bienes para uso propio',
//             '9820' =>	'Actividades no diferenciadas de los hogares individuales como productores de servicios para uso propio',
//             '9900' =>	'Actividades de organizaciones y entidades extraterritoriales signatarios de la Convención de Viena'];


// $queryCreateTable = "CREATE TABLE IF NOT EXISTS FE_TipoaActividadesE (
//     id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     fechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     codigo varchar(45) DEFAULT '',
//     descripcion TEXT NULL DEFAULT '',
//     activo TINYINT(1) NOT NULL DEFAULT 1
// )";
// mysqli_query($conn3, $queryCreateTable) or die(mysqli_error($conn3));


// foreach ($datos as $key => $value) {
//     $value1 = reem($value);
//     $Insert = "INSERT INTO FE_TipoaActividadesE (codigo,descripcion) VALUES ('".$key."','".$value1."')";
//     mysqli_query($conn3, $Insert) or die(mysqli_error($conn3));
// }

// echo "-- END --";