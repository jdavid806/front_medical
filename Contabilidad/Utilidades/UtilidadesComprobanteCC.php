<script>
    function obtenerOptionsCentrosCosto() {
        let options = `<option value="">Seleccione</option>`;
        let datos = <?= json_encode($datosCentrosCosto) ?>;
        // console.log("obtenerOptionsCentrosCosto");
        // console.log(datos);
        let keys = Object.keys(datos);
        keys.forEach(key => {
            let data = datos[key];
            options += `<option value="${data.id}">${data.descripcion}</option>`;
        })
        return options;
    }
    
    function obtenerOptionsCuentasContables() {
        let options = `<option value="">Seleccione</option>`;
        let datos = <?= json_encode($datosCuentasContables) ?>;
        // console.log("obtenerOptionsCuentasContables");
        // console.log(datos);
        let keys = Object.keys(datos);
        keys.forEach(key => {
            let data = datos[key];
            options += `<option value="${data.id}">${data.nombre}</option>`;
        })
        return options;
    }
    
    function obtenerOptionsTerceros() {
        let options = `<option value="">Seleccione</option>`;
        let datos = <?= json_encode($datosTerceros) ?>;
        // console.log("obtenerOptionsTerceros");
        // console.log(datos);
        let keys = Object.keys(datos);
        keys.forEach(key => {
            let data = datos[key];
            options += `<option value="${data.id}">${data.nombresContacto} ${data.apellidosContacto}</option>`;
        })
        return options;
    }
</script>