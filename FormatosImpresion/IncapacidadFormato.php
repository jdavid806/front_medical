<?php
date_default_timezone_set('America/Bogota');
include("conexiones/conexion.php");
include("funciones/conexiones.php");
include("funciones/funciones.php");
include("funciones/funcionesUtilidades.php");
            
            
            $conn3 = mysqli_connect($host,$userdb,$pass2,$DB)or die ('Ha fallado la conexion MySQL: '.mysqli_error($conn3));

            $historiaClinica1 = decrypt($_GET['iC']);


            


            $queryList=mysqli_query($conn3,"SELECT * FROM  evoluciones where ID = $historiaClinica1");
            if($queryList){
                while($rowMotorizado=mysqli_fetch_array($queryList))
                {
    
                  $cliente_id      =$rowMotorizado['cliente_id'];
                  $usuario_id      =$rowMotorizado['usuario_id'];
                  $Fecha           =$rowMotorizado['Fecha'];
    
                  $Hora            =$rowMotorizado['Hora'];
                  $motivoConsulta  =$rowMotorizado['motivoConsulta'];
                      
                  }
            }
          

$queryList=mysqli_query($conn3,"SELECT * FROM  examenFisico where historia_id = $historiaClinica1");
            if($queryList){
                while($rowMotorizado=mysqli_fetch_array($queryList))
                {
    
                  $peso     =$rowMotorizado['peso'];
                  $altura    =$rowMotorizado['altura'];
                  $imc         =$rowMotorizado['imc'];
                   $ComposicionCorporal  = $rowMotorizado['ComposicionCorporal'];
                 
                  $eg          =$rowMotorizado['estadoGeneral'];
                  $conciencia  =$rowMotorizado['estadoConciencia'];
                  $ojos    =$rowMotorizado['ojos'];
                  $ostocopia    =$rowMotorizado['otoscopia'];
                  $cavidad           =$rowMotorizado['cavidadOral'];
                  $cuello         =$rowMotorizado['cuello'];
                  $torax   =$rowMotorizado['torax'];
                  $corazo   =$rowMotorizado['corazon'];
                 $abdomen        =$rowMotorizado['abdomen'];
                 $urinario =$rowMotorizado['genitoUrinario'];
                  $extremidades  =$rowMotorizado['extremidades'];
                   $nervioso     =$rowMotorizado['sistemaNervioso'];
                  $piel  =$rowMotorizado['pielAnexos'];
                  $partes        =$rowMotorizado['examenPartesdCuerpo'];
    
                  $tart         =$rowMotorizado['tart'];
                  $tc  =$rowMotorizado['temperatura'];
                  $card   =$rowMotorizado['fcard'];
                  $sat  =$rowMotorizado['sat'];
                 
     $vacularPeriferico    =$rowMotorizado['vacularPeriferico '];
                } 
            }
           

           $queryList=mysqli_query($conn3,"SELECT * FROM  config where ID_Usuario = $usuario_id");
          if($queryList){
            while($rowMotorizado=mysqli_fetch_array($queryList))
            {
                $moneda=$rowMotorizado['moneda'];
                $impuestoF=$rowMotorizado['impuestoF'];

                // Nuevos campos

                $nombreF      =$rowMotorizado['nombreF'];
                $telefonoF    =$rowMotorizado['telefonoF'];
                $direccionF   =$rowMotorizado['direccionF'];
                $emailF       = $rowMotorizado['emailF'];
                $ciudadPaisF  =$rowMotorizado['ciudadPaisF'];
                $licenciaF    =$rowMotorizado['licenciaF'];
                $pieF         =$rowMotorizado['pieF'];
                $header       = $rowMotorizado['header'];

                $LogoF               =$rowMotorizado['logoF'];
                $firma               =$rowMotorizado['firma'];

              if (strlen($LogoF) > 0) 
              {
               $Logo = '<img src="'.$Base.'logos/'.$LogoF.'" height="100" width="100%">'; 
              }
              

              if (strlen($firma) > 0)  
              {
                $firmaImg = '<img src="'.$Base.'FirmasReg/'.$firma.'" height="80" width="150">'; 
              }





// Nuevos campos 


            }
 
          }
            

            $queryList=mysqli_query($conn3,"SELECT * FROM  usuarios where ID = $usuario_id");
           if($queryList){
            while($rowMotorizado=mysqli_fetch_array($queryList))
            {

              $empresaNombre      =$rowMotorizado['empresaNombre'];
              $pais               =$rowMotorizado['pais'];

              $ciudad             =$rowMotorizado['ciudad'];
              $direccion          =$rowMotorizado['direccion'];
              $telefono           =$rowMotorizado['telefono'];
              $especialidad        = $rowMotorizado['especialidad'];
              $nit                =$rowMotorizado['nit'];
              

            }
           }
           


            $queryList=mysqli_query($conn3,"SELECT * FROM  cliente where cliente_id = $cliente_id");
            if($queryList){
                while($rowMotorizado=mysqli_fetch_array($queryList))
            {

              $nombre_cliente             =$rowMotorizado['nombre_cliente'];
              $CODI_CLIENTE               =$rowMotorizado['CODI_CLIENTE'];
              $fechaNacimiento            =$rowMotorizado['fechaNacimiento'];
              $celular_cliente            =$rowMotorizado['celular_cliente'];
              $seguro                     = funcionMaster($rowMotorizado['entidad_id'],'id','Nombre', 'Rips_Entidades');
              $direccion_cliente          =$rowMotorizado['direccion_cliente'];
              $etnia=$rowMotorizado['etnia'];
              $genero=$rowMotorizado['genero'];
              $discapacidad=$rowMotorizado['tipodiscapacidad'];

                
            }
            }
            
$cie1=mysqli_query($conn3,"SELECT * FROM historiaClinica9_Quirurgico_Cie10 as hc, cie10 as cie10 WHERE hc.usuario_id=$usuario_id and hc.historiaClinica9_id='$historiaClinica1' AND cie10.codigo=hc.codigo and hc.cliente_id=$cliente_id ");

 
 
   ?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php echo $empresaNombre ?> </title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.6 -->
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="dist/css/AdminLTE.min.css">
    <!--<link rel="stylesheet" href="style.css">
   <!--<link rel="stylesheet" type="text/css" href="https://medicalsoftplus.com/co131/estilopiepagina.css">-->

    <!--<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
 estilos css-->
    <!--<link rel="stylesheet" href="https://sievensoftcolombia.com/css/bootstrap.css">
 estilos css-->
    <!--<link href="https://sievensoftcolombia.com/css/bootstrap.min.css" rel="stylesheet">
<script src="https://sievensoftcolombia.com/js/jquery-3.2.1.slim.min.js" ></script>
<script src="https://sievensoftcolombia.com/js/popper.min.js" ></script>
<script src="https://sievensoftcolombia.com/js/bootstrap.js"></script>
<link href="https://sievensoftcolombia.com/font/icon.css"  rel="stylesheet">-->


</head>

<body onload="window.print();">
    <div class="wrapper">
        <div class="col-md-12">

            <div class="box box-solid">
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="row">
                    </div>
                </div>
                <div class="page-header" style="text-align: center">

                    <div class="row">

                        <div class="col-md-12">

                            <table class="tg" style="undefined;table-layout: fixed; width: 100%">
                                <colgroup>
                                    <col style="width:  100%">
                                    <col style="width:  100%">
                                    <col style="width:  100%">
                                    <col style="width:  100%">
                                </colgroup>

                                <tr>
                                    <th class="Logo" rowspan="4" align="center"><?php echo $Logo ?> </th>
                                    <th class="titulo" colspan="4" rowspan="4">
                                        <div align="center"><?php echo $header  ?></div>
                                        <!--<h9 align="center"> <?php echo  $empresaNombre ?> <?php echo   $direccion?>  </h9></th>-->
                                </tr>

                                <tr>
                                </tr>
                                <tr>
                                </tr>
                                <tr>
                                </tr>
                            </table>
                            <br>
                            <table class="tg" border=1 style="undefined;table-layout: fixed; width: 100%">
                                <tr>
                                    <td width="30%" class="nombrePaciente">Nombre del paciente:
                                        <?php echo $nombre_cliente ?></td>
                                    <td width="20%" class="documento">Documento: <?php echo $CODI_CLIENTE ?></td>
                                    <td width="30%" class="f.nacimiento">F.Nacimiento: <?php echo  $fechaNacimiento ?>
                                    </td>
                                    <td width="20%" class="edad">Edad: <?php echo  calculaedad($fechaNacimiento) ?></td>
                                </tr>

                                <tr>
                                    <td class="residencia">Residencia: <?php echo $direccion_cliente  ?></td>
                                    <td class="seguro">EPS:<?php echo $seguro  ?></td>
                                    <td class="telefono">Teléfono: <?php echo $telefono?></td>
                                    <td class="genero">Genero: <?php echo $genero?></td>
                                </tr>
                            </table>
                            <table class="tg" border=1 style="undefined;table-layout: fixed; width: 100%">

                                <tr>
                                    <!--<td width="30%" class="etnia">Etnia: <?php echo $etnia ?></td>
    <td width="70%" class="discapacidad">Discapacidad:<?php echo $discapacidad ?></td>-->

                                </tr>
                            </table>
                        </div>
                    </div>
                </div>




                <!--<div class="row">
          <div class="col-md-12">
Diagnósticos:<br>

    <?php  echo $cod_cie1 ?> - <?php  echo $des_cie1 ?><br>
    <?php  echo $cod_cie2 ?> - <?php  echo $des_cie2 ?><br>
    <?php  echo $cie3 ?><br>
    <?php  echo $cie4 ?><br>
</div>-->

                <h4 align="center"> NOTA DE EVOLUCIÓN </h4>
                <div class="col-md-12">
                </div>
            </div>


            <div>


                <?php  echo $notas1  ?>
                <?php  if ($motivoConsulta <> '') {$motivoConsulta1 = $motivoConsulta.'<hr>';} ?>
                <?php  echo $motivoConsulta1  ?>

                <!--<?php  if ($notas<> '') {$notas1 = 'Notas adicionales: '.$notas.'<hr>' ;} ?>
  <?php  echo $notas1  ?>-->
            </div>



        </div>
        <!-- /.col -->
    </div>
    <!-- /.row -->

    <div class="col-xs-6" align="center">
        <?php echo $Fecha ?>
    </div>

    <div class="col-xs-6" align="center">
        <?php echo $ciudadPaisF?>
    </div>



    <div class="col-xs-6" align="center">
        <?php
 // echo  $firmaImg;

  ?>
    </div>

    <div class="col-xs-6" align="center">
        <?php
  echo  $firmaImg;

  ?>
        <br>_______________________________________<br>
        <?php echo $nombreF?><br>
        <?php echo $especialidad?><br>
        <b>* Documento firmado digitalmente *</b>
    </div>

    </div>


    </div>



    </div>
    </div>
    </div>
    </div>

    </div>


    <!-- /.row -->

    <!-- this row will not appear when printing -->
    <div class="row no-print">
        <div class="col-xs-12">
            <!--<a href="imprimirRecipe.php?historiaClinica1=<?php echo $historiaClinica1?>" target="_blank" class="btn btn-default"><i class="fa fa-print"></i> Imprimir</a>-->
        </div>
    </div>
    <script src="plugins/jQuery/jquery-2.2.3.min.js"></script>
    <!-- Bootstrap 3.3.6 -->
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <!-- DataTables -->
    <script src="plugins/datatables/jquery.dataTables.min.js"></script>
    <script src="plugins/datatables/dataTables.bootstrap.min.js"></script>
    <!-- SlimScroll -->
    <script src="plugins/slimScroll/jquery.slimscroll.min.js"></script>
    <!-- FastClick -->
    <script src="plugins/fastclick/fastclick.js"></script>
    <!-- AdminLTE App -->
    <script src="dist/js/app.min.js"></script>
    <!-- AdminLTE for demo purposes -->
    <script src="dist/js/demo.js"></script>
    <!-- Select2 -->
    <script src="plugins/select2/select2.full.min.js"></script>
    <!-- InputMask -->
    <script src="plugins/input-mask/jquery.inputmask.js"></script>
    <script src="plugins/input-mask/jquery.inputmask.date.extensions.js"></script>
    <script src="plugins/input-mask/jquery.inputmask.extensions.js"></script>
    <!-- date-range-picker -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
    <script src="plugins/daterangepicker/daterangepicker.js"></script>
    <!-- bootstrap datepicker -->
    <script src="plugins/datepicker/bootstrap-datepicker.js"></script>
    <!-- bootstrap color picker -->
    <script src="plugins/colorpicker/bootstrap-colorpicker.min.js"></script>
    <!-- bootstrap time picker -->
    <script src="plugins/timepicker/bootstrap-timepicker.min.js"></script>

    <!-- iCheck 1.0.1 -->
    <script src="plugins/iCheck/icheck.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="plugins/morris/morris.min.js"></script>

    <script src="https://cdn.ckeditor.com/4.5.7/standard/ckeditor.js"></script>
    <!-- Bootstrap WYSIHTML5 -->
    <script src="plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
</body>

</html>