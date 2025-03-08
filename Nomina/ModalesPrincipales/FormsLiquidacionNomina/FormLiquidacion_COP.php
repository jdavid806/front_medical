<div class="col-md-6 mb-1">
    <label class="form-label">Trabajador <?= $isRequiredSign ?></label>
    <select onchange="$('#modalNuevaLiquidacion #fechaIngreso').val($(this).find(':selected').data('fechaingreso'));$('#modalNuevaLiquidacion #salario').val($(this).find(':selected').data('salario'));" class="form-select select2" style="width:100%" id="idTrabajador" required>
        <option selected>Seleccione...</option>
        <?php foreach ($trabajadores as $key => $trabajador) {
            echo '<option data-salario="' . $trabajador['salario'] . '" data-fechaingreso="' . explode(" ", $trabajador['fechaRegistro'])[0]  . '" value="' . $trabajador['id'] . '">' . $trabajador['numero_documento'] . ' - ' . $trabajador['nombre'] . ' ' . $trabajador['apellido'] . '</option>';
        } ?>
    </select>
</div>

<div class="col-md-6">
    <label for="salario" class="form-label">Salario Mensual (COP)</label>
    <input type="number" class="form-control" onchange="calcularLiquidacion()" id="salario" placeholder="Ingrese el salario mensual" required>
</div>
<div class="col-md-6">
    <label for="fechaIngreso" class="form-label">Fecha de Ingreso</label>
    <input type="date" class="form-control" onchange="calcularLiquidacion()" id="fechaIngreso" required>
</div>

<div class="col-md-6">
    <label for="fechaSalida" class="form-label">Fecha de Salida</label>
    <input type="date" class="form-control" value="<?= date("Y-m-d") ?>" onchange="calcularLiquidacion()" id="fechaSalida" required>
</div>

<div class="mt-5">
    <h3>Resultados de la Liquidación</h3>
    <ul class="list-group" id="resultados">
        <li class="list-group-item">Cesantías: <span id="cesantiasInner"></span></li>
        <li class="list-group-item">Intereses sobre Cesantías: <span id="interesesCesantiasInner"></span></li>
        <li class="list-group-item">Prima de Servicios: <span id="primaServiciosInner"></span></li>
        <li class="list-group-item">Vacaciones: <span id="vacacionesInner"></span></li>
        <li class="list-group-item fw-bold">Total Liquidación: <span id="totalLiquidacionInner"></span></li>
    </ul>
</div>

<input type="hidden" id="cesantias" value="0">
<input type="hidden" id="interesesCesantias" value="0">
<input type="hidden" id="primaServicios" value="0">
<input type="hidden" id="vacaciones" value="0">
<input type="hidden" id="totalLiquidacion" value="0">

<script>
    let camposJsonLiquidacion = ['cesantias', 'interesesCesantias', 'primaServicios', 'vacaciones', 'totalLiquidacion', 'salario', 'fechaIngreso', 'fechaSalida'];

    function calcularLiquidacion() {
        const salario = parseFloat(document.querySelector('#modalNuevaLiquidacion #salario').value);
        const fechaIngreso = new Date(document.querySelector('#modalNuevaLiquidacion #fechaIngreso').value);
        const fechaSalida = new Date(document.querySelector('#modalNuevaLiquidacion #fechaSalida').value);

        console.log('salario' + " - " + 'fechaIngreso' + " - " + 'fechaSalida');
        console.log(salario + " - " + fechaIngreso + " - " + fechaSalida);



        if (!salario || !fechaIngreso || !fechaSalida || fechaIngreso >= fechaSalida) {
            alert("Por favor ingrese datos válidos.");
            return;
        }

        // Calcular días trabajados
        const diasTrabajados = Math.ceil((fechaSalida - fechaIngreso) / (1000 * 60 * 60 * 24));

        // Cesantías
        const cesantias = (salario * diasTrabajados) / 360;

        // Intereses sobre cesantías
        const interesesCesantias = (cesantias * 0.12 * diasTrabajados) / 360;

        // Prima de servicios
        const primaServicios = (salario * diasTrabajados) / 360;

        // Vacaciones
        const vacaciones = (salario * diasTrabajados) / 720;

        // Total liquidación
        const totalLiquidacion = cesantias + interesesCesantias + primaServicios + vacaciones;

        let valorCesantias = cesantias.toFixed(2);
        let valorInteresesCesantias = interesesCesantias.toFixed(2);
        let valorPrimaServicios = primaServicios.toFixed(2);
        let valorVacaciones = vacaciones.toFixed(2);
        let valorTotalLiquidacion = totalLiquidacion.toFixed(2);

        $(`#cesantias`).val(valorCesantias);
        $(`#interesesCesantias`).val(valorInteresesCesantias);
        $(`#primaServicios`).val(valorPrimaServicios);
        $(`#vacaciones`).val(valorVacaciones);
        $(`#totalLiquidacion`).val(valorTotalLiquidacion);


        // Mostrar resultados
        document.getElementById('cesantiasInner').innerText = `$ ${valorCesantias}`;
        document.getElementById('interesesCesantiasInner').innerText = `$ ${valorInteresesCesantias}`;
        document.getElementById('primaServiciosInner').innerText = `$ ${valorPrimaServicios}`;
        document.getElementById('vacacionesInner').innerText = `$ ${valorVacaciones}`;
        document.getElementById('totalLiquidacionInner').innerText = `$ ${valorTotalLiquidacion}`;
    }
</script>