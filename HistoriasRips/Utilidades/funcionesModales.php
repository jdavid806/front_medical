<script>
    function optionsCups() {
        let datos = <?= json_encode($DatosProcedimientos) ?>;
    
        let keys = Object.keys(datos);
        let options = `<option value="">Seleccione</option>`;
        keys.forEach(element => {
            let data = datos[element];
            options += `<option data-precio="${data.precio}" value="${data.id}">${data.nombreProcedimiento}</option>`;
        });
        return options;
    }

    function optionsCupsPorEntidad() {
        let input = $("#modalNuevaAutorizacionv2 #entidadFacturar");
        if (!input.val()) return `<option>No se ha seleccionado entidad</option>`;
        input = input.find(":selected").data("jsonprocedimientos");
        
        // console.log(`El input es ` , input);
        // let datos = JSON.parse(input);
        let datos = input;
        let keys = Object.keys(datos);
        let options = `<option value="">Seleccione</option>`;
        keys.forEach(element => {
            let data = datos[element];
            options += `<option data-nombre="${data.nombre}" data-precio="${data.precio}" data-copago="${data.aplicaCopago ? data.porcentajeCopago : 0}" value="${data.idProcedimiento}">${data.codigoCups} - ${data.nombre}</option>`;
        });
        return options;
    }
</script>