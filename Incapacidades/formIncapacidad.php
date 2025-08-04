<form id="formCrearIncapacidad" class="was-validated">
    <div class="mb-3">
        <div class="row">
            <input type="hidden" id="desde" name="start_date" value="">
            <script>
                document.getElementById("desde").value = new Date().toISOString().split('T')[0];
            </script>
            <div class="col-6">
                <label for="dias" class="form-label">Días de Incapacidad</label>
                <input type="number" class="form-control" id="dias" name="dias" min="1" required>
            </div>
            <div class="col-6">
                <label for="hasta" class="form-label">Hasta</label>
                <input type="date" class="form-control" id="hasta" name="end_date" readonly>
            </div>
        </div>
    </div>
    <!-- <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="recurrencia">
        <label class="form-check-label" for="recurrencia">Recurrencia</label>
    </div> -->
    <div id="contenedorRecurrencia" class="d-none card">
        <div class="card-body">
            <div class="mb-3">
                <select class="form-select" name="tipoRecurrencia" id="tipoRecurrencia" required>
                    <option value="dias">Días</option>
                    <option value="semanas">Semanas</option>
                    <option value="meses">Meses</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="cantidadRecurrencia" class="form-label">Cantidad</label>
                <input type="text" class="form-control" id="cantidadRecurrencia" name="cantidadRecurrencia" min="1"
                    value="1">
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label for="reason" class="form-label">Motivo</label>
        <textarea class="form-control" id="reason" name="reason" rows="3"></textarea>
    </div>

    <input type="hidden" id="accionModalCrearIncapacidad">
    <input type="hidden" name="id">
    <input type="hidden" name="user_id" value="<?php echo $_SESSION['user_id'] ?? 1; ?>">
</form>

<script>
    function checkRecurrencia(el) {
        if (el.checked) {
            document.getElementById('contenedorRecurrencia').classList.remove('d-none')
        } else {
            document.getElementById('contenedorRecurrencia').classList.add('d-none')
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        let hoy = new Date().toISOString().split('T')[0];
        document.getElementById('desde').value = new Date().value = hoy;
    });

    // document.getElementById('recurrencia').addEventListener('change', function() {
    //     console.log('change recurrencia:', this.checked);
    //     checkRecurrencia(this)
    // })

    document.getElementById('dias').addEventListener('input', function() {
        const fechaDesde = document.getElementById('desde').value;
        const dias = parseInt(this.value);

        console.log(fechaDesde, dias);


        if (fechaDesde && dias > 0) {
            const fechaInicial = new Date(fechaDesde);
            fechaInicial.setDate(fechaInicial.getDate() + dias - 1); // Restar 1 para incluir el día inicial
            const fechaFinal = fechaInicial.toISOString().split('T')[0];
            document.getElementById('hasta').value = fechaFinal;
        } else {
            document.getElementById('hasta').value = '';
        }
    });

    document.getElementById('desde').addEventListener('change', function() {
        document.getElementById('dias').dispatchEvent(new Event('input'));
    });
</script>