<script>
    function optionsCuentasContables() {
        let datos = <?php echo json_encode($cuentasContables); ?>;
        let keys = Object.keys(datos);
        let options = `<option value="">Seleccione</option>`;
        for (const key in keys) {
            let data = datos[key];
            options += `<option value="${data.id}"> ${data.codigo} - ${data.nombre}</option>`;
        }
        return options;
    }

</script>