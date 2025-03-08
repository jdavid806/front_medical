<script> 
    
  function obtenerOptionsCliente(nameEmpty = 'Todos') {
    let options = `<option data-empresa="" value="">${nameEmpty}</option>`;
    let datosCliente = <?=$datosSimuladosClientes?>;
    
    let keysData = Object.keys(datosCliente);
    keysData.forEach(key => {
      let data = datosCliente[key];
      
      let attData = `data-pn='${data[1]}' data-sn='${data[2]}' data-pa='${data[3]}' data-sa='${data[4]}' data-dir='' data-tipo='${data[5]}' data-doc='${data[6]}' data-mail='${data[7]}' data-tel='${data[8]}' `;
      options += `<option ${attData} data-empresa="${data[9]}" value="${data[0]}">${data[6]} - ${data[1]} ${data[3]}</option>`;
    })
    return options;
  }
  
  function obtenerOptionsProveedores(nameEmpty = 'Todos') {
    let options = `<option value="">${nameEmpty}</option>`;
    let datos = <?=$proveedores?>;
    let keysData = Object.keys(datos);
    keysData.forEach(key => {
      let data = datos[key];
      let atributosData = `data-nombre = '${data.nombre}' data-dir = '${data.direccion}' data-tipo = '${data.tipoIndentificacionTributaria}' data-tiposociedad = '0' data-doc = '${data.numero_identificacion}' data-mail = '${data.email}' data-tel = '${data.telefono}' `;
      options += `<option ${atributosData} value="${data.id}">${data.numero_identificacion} - ${data.nombre}}</option>`;
    })
    return options;
  }
  
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


  
  function obtenerOptionsCentrosCosto() {
    let options = `<option value="">Seleccione</option>`;
    let datos = <?=$datosSimuladosCentrosDeCosto?>;
    let keys = Object.keys(datos);
    keys.forEach(key => {
      let data = datos[key];
      options += `<option value="${data.id}">${data.descripcion}</option>`;
    })
    return options;
  }

  function obtenerOptionsEspecialista() {
    let options = `<option value="">Todos</option>`;
    let datosEspecialistas = <?=$datosSimuladosEspecialistas?>;
    let keysData = Object.keys(datosEspecialistas);
    keysData.forEach(key => {
      let data = datosEspecialistas[key];
      options += `<option value="${data.id}">${data.nombre}</option>`;
    })
    return options;
  }
  
  function obtenerOptionsProcedimiento() {
    let options = `<option value="">Todos</option>`;
    let datosProcedimientos = <?=$dataJsonProcedimientos?>;
    let keysData = Object.keys(datosProcedimientos);
    keysData.forEach(key => {
      let data = datosProcedimientos[key];
      options += `<option value="${data.id}">${data.nombreProcedimiento}</option>`;
    })

    return options;
  }

  // function obtenerOptionsImpuestoCargo() {
  //   let options = `<option value="">Seleccione</option>`;
  //   let datosImpuestos = <?=$datosImpuestosC?>;
  //   let keysData = Object.keys(datosImpuestos);
  //   keysData.forEach(key => {
  //     let data = datosImpuestos[key];
  //     options += `<option value="${data.id}">${data.nombre}</option>`;
  //   })

  //   return options;
  // }
  
  // function obtenerOptionsImpuestoRetencion() {
  //   let options = `<option value="">Seleccione</option>`;
  //   let datosImpuestos = <?=$datosImpuestosR?>;
  //   let keysData = Object.keys(datosImpuestos);
  //   keysData.forEach(key => {
  //     let data = datosImpuestos[key];
  //     options += `<option value="${data.id}">${data.nombre}</option>`;
  //   })

  //   return options;
  // }
  
  function obtenerOptionsVendedores() {
    let options = `<option value="">Seleccione</option>`;
    let datos = <?=$dataJsonVendedores?>;
    let keysData = Object.keys(datos);
    keysData.forEach(key => {
      let data = datos[key];
      options += `<option value="${data.id}">${data.nombre}</option>`;
    })

    return options;
  }
  function obtenerOptionsEntidades() {
    let options = `<option value="">Seleccione</option>`;
    let datos = <?=$datosSimuladosEntidades?>;
    let keysData = Object.keys(datos);
    keysData.forEach(key => {
      let data = datos[key];
      options += `<option value="${data.id}">${data.nombreEntidad}</option>`;
    })

    return options;
  }
  
  function obtenerOptionsImpuestoCargo() {
    let options = `<option data-tasaimpuesto="" value="">Seleccione</option>`;
    let datos = <?=$datosImpuestosC?>;
    console.log("datos obtenerOptionsImpuestoCargo");
    console.log(datos);
    let keysData = Object.keys(datos);
    keysData.forEach(key => {
      let data = datos[key];
      options += `<option data-tasaimpuesto="${data.tasaImpuesto}" value="${data.id}">${data.nombre} - ${data.tasaImpuesto}%</option>`;
    })
    return options;
  }

  function obtenerOptionsImpuestoRetencion() {
    let options = `<option data-tasaretencion="" value="">Seleccione</option>`;
    let datos = <?=$datosImpuestosR?>;
    console.log("datos obtenerOptionsImpuestoRetencion");
    console.log(datos);
    let keysData = Object.keys(datos);
    keysData.forEach(key => {
      let data = datos[key];
      options += `<option data-tasaretencion="${data.tasaRetencion}" value="${data.id}">${data.nombre} - ${data.tasaRetencion}%</option>`;
    })
    return options;
  }


</script>