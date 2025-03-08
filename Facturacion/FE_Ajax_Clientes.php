<?php
include "../funciones/conn3.php";
function obtenerDatosClientes()
{
    include "../funciones/conn3.php";
    $clientesMedical = mysqli_query($connMedical, "SELECT * FROM cliente");
    $datosSimuladosClientes = [];

    while ($row = mysqli_fetch_assoc($clientesMedical)) {
        $datosSimuladosClientes[] = [
            $row['cliente_id'],
            $row['primer_nombre'],
            $row['segundo_nombre'],
            $row['primer_apellido'],
            $row['segundo_apellido'],
            $row['tipo_cliente'],
            $row['CODI_CLIENTE'],
            $row['correo_cliente'],
            $row['whatsapp'],
            $row['entidad_id'],
            $row['direccion_cliente']
        ];
    }

    return json_encode($datosSimuladosClientes);
}



?>
<script>
function obtenerOptionsClienteYEmpresa(nameEmpty = 'Todos') {
    let options = `<option data-empresa="" value="">${nameEmpty}</option>`;
    
    let datosCliente = <?=$datosSimuladosClientes?>;
    
    let keysData = Object.keys(datosCliente);
    keysData.forEach(key => {
      let data = datosCliente[key];
      
      let attrData = `data-tipopersona='Natural' data-pn='${data[1]}' data-sn='${data[2]}' data-pa='${data[3]}' data-sa='${data[4]}' data-dir='${data[10]}' data-tipo='${data[5]}' data-doc='${data[6]}' data-mail='${data[7]}' data-tel='${data[8]}' `;
      options += `<option ${attrData} value="${data[0]}">${data[6]} - ${data[1]} ${data[3]}</option>`;
      //data-empresa="${data[9]}"
    });

    let datosEmpresas = <?=$datosSimuladosPersonasJuridicas?>;
    
    let keysDataEmpresa = Object.keys(datosEmpresas);
    keysDataEmpresa.forEach(key => {
      let data = datosEmpresas[key];
      let attrData = `data-tipopersona='Juridica' data-tipo='${data[1]}' data-doc='${data[2]}' data-nombre='${data[3]}' data-tiposociedad='${data[4]}' data-dir='${data[5]}' data-tel='${data[6]}' data-mail='${data[7]}'  `;
      options += `<option ${attrData} value="${data[0]}">${data[2]} - ${data[3]}</option>`;
      //data-empresa="${data[9]}"
    });


    return options;
  }

  </script>