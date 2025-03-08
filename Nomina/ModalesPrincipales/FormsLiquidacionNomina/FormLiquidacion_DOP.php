<div class="row">
    <!-- Trabajador -->
    <div class="col-md-6 mb-3">
        <label class="form-label">Trabajador <?= $isRequiredSign ?></label>
        <select onchange=" $('#modalNuevaLiquidacion #fechaIngreso').val($(this).find(':selected').data('fechaingreso')); $('#modalNuevaLiquidacion #diasTrabajados').val($(this).find(':selected').data('diasliquidar')); $('#modalNuevaLiquidacion #salario').val($(this).find(':selected').data('salario'));calcularLiquidacion();" class="form-select select2" style="width:100%" id="idTrabajador" required>
            <option selected>Seleccione...</option>
            <?php
            foreach ($trabajadores as $key => $trabajador) {
                $ultimaNominaEmpleado = $ControllerNominaGrupal->obtenerUltimaLiquidacionTrabajador($trabajador['id']);
                $ultimaNominaEmpleado = explode(" ", $ultimaNominaEmpleado)[0];
                $dias = floor((strtotime(date("Y-m-d")) - strtotime($ultimaNominaEmpleado)) / 86400);
                echo '<option data-diasliquidar="' . $dias . '" data-fechaultimanomina="' . $ultimaNominaEmpleado . '" data-salario="' . $trabajador['salario'] . '" data-fechaingreso="' . explode(" ", $trabajador['fechaRegistro'])[0]  . '" value="' . $trabajador['id'] . '">' . $trabajador['numero_documento'] . ' - ' . $trabajador['nombre'] . ' ' . $trabajador['apellido'] . '</option>';
            } ?>
        </select>
    </div>

    <!-- Fecha de Ingreso -->
    <div class="col-md-6 mb-3">
        <label for="fechaIngreso" class="form-label">Fecha de Ingreso</label>
        <input type="date" class="form-control" onchange="calcularLiquidacion()" id="fechaIngreso" required>
    </div>
    <!-- Fecha de Terminación -->
    <div class="col-md-6 mb-3">
        <label for="fechaSalida" class="form-label">Fecha de Terminación</label>
        <input type="date" class="form-control" onchange="calcularLiquidacion()" id="fechaSalida" value="<?= date("Y-m-d") ?>" required>
    </div>
    
    <!-- Salario Mensual -->
    <div class="col-md-6 mb-3">
        <label for="salario" class="form-label">Salario Mensual</label>
        <input type="number" class="form-control" onchange="calcularLiquidacion()" id="salario" placeholder="Ingrese el salario mensual" min="0" required>
    </div>
    <!-- Utilidades Anuales -->
    <div class="col-md-6 mb-3">
        <label for="utilidadesAnuales" class="form-label">Utilidades Anuales</label>
        <input type="number" class="form-control" onchange="calcularLiquidacion()" id="utilidadesAnuales" value="0" placeholder="Ingrese las utilidades anuales" min="0" required>
    </div>
</div>
<div class="row">
    <!-- Días Trabajados en el Mes de Terminación -->
    <div class="col-md-6 mb-3">
        <label for="diasTrabajados" class="form-label">Días Trabajados en el Mes de Terminación</label>
        <input type="number" class="form-control" onchange="calcularLiquidacion()" id="diasTrabajados" placeholder="Ingrese los días trabajados" min="0" max="30" required>
    </div>
    <!-- Días de Vacaciones No Disfrutadas -->
    <div class="col-md-6 mb-3">
        <label for="diasVacaciones" class="form-label">Días de Vacaciones No Disfrutadas</label>
        <input type="number" class="form-control" onchange="calcularLiquidacion()" id="diasVacaciones" placeholder="Ingrese los días de vacaciones no disfrutadas" min="0" required>
    </div>
</div>

<div class="mt-5">
    <h3>Resultados de la Liquidación</h3>
    <ul class="list-group" id="resultados">
        <li class="list-group-item">Antigüedad (Años de Servicio): <span id="antiguedadInner"></span></li>
        <li class="list-group-item">Indemnización por Despido sin Justa Causa: <span id="indemnizacionInner"></span></li>
        <li class="list-group-item">Salarios Pendientes: <span id="salariosPendientesInner"></span></li>
        <li class="list-group-item">Vacaciones No Disfrutadas: <span id="vacacionesInner"></span></li>
        <li class="list-group-item">Proporcional de Utilidades: <span id="proporcionalUtilidadesInner"></span></li>
        <li class="list-group-item fw-bold">Total Liquidación: <span id="totalLiquidacionInner"></span></li>
    </ul>
</div>

<input type="hidden" id="antiguedad" value="">
<input type="hidden" id="indemnizacion" value="">
<input type="hidden" id="salariosPendientes" value="">
<input type="hidden" id="vacaciones" value="">
<input type="hidden" id="proporcionalUtilidades" value="">
<input type="hidden" id="totalLiquidacion" value="">


<script>
    let camposJsonLiquidacion = ['antiguedad', 'indemnizacion', 'salariosPendientes', 'vacaciones', 'proporcionalUtilidades', 'totalLiquidacion', 'salario','utilidadesAnuales','diasTrabajados','diasVacaciones'];

    // Función para calcular la antigüedad en años
    function calcularAntiguedad(fechaIngreso, fechaSalida) {
        const ingreso = new Date(fechaIngreso);
        const terminacion = new Date(fechaSalida);
        let years = terminacion.getFullYear() - ingreso.getFullYear();
        let months = terminacion.getMonth() - ingreso.getMonth();
        let days = terminacion.getDate() - ingreso.getDate();

        if (months < 0 || (months === 0 && days < 0)) {
            years--;
        }
        return years >= 0 ? years : 0;
    }

    // Función para calcular la liquidación
    function calcularLiquidacion() {

        console.log("Llego al calulo de liquidacion");
        

        // Obtener valores del formulario
        const fechaIngreso = $('#modalNuevaLiquidacion #fechaIngreso').val();
        const fechaSalida = $('#modalNuevaLiquidacion #fechaSalida').val();
        const salarioMensual = parseFloat($('#modalNuevaLiquidacion #salario').val()) || 0;
        const utilidadesAnuales = parseFloat($('#modalNuevaLiquidacion #utilidadesAnuales').val()) || 0;
        const diasTrabajados = parseFloat($('#modalNuevaLiquidacion #diasTrabajados').val()) || 0;
        const diasVacaciones = parseFloat($('#modalNuevaLiquidacion #diasVacaciones').val()) || 0;


        console.log({ fechaIngreso, fechaSalida, salarioMensual, utilidadesAnuales, diasTrabajados, diasVacaciones});
        


        // Validar fechas
        if (new Date(fechaSalida) < new Date(fechaIngreso)) {
            alert('La Fecha de Terminación no puede ser anterior a la Fecha de Ingreso.');
            return;
        }

        // 1. Calcular Antigüedad
        const antiguedad = calcularAntiguedad(fechaIngreso, fechaSalida);
        $('#modalNuevaLiquidacion #antiguedadInner').text(antiguedad);
        $('#modalNuevaLiquidacion #antiguedad').val(antiguedad);

        // 2. Indemnización por Despido sin Justa Causa
        let indemnizacion = 0;
        if (antiguedad >= 1) {
            indemnizacion = antiguedad * salarioMensual;
        }
        $('#modalNuevaLiquidacion #indemnizacion').val(indemnizacion.toFixed(2));
        $('#modalNuevaLiquidacion #indemnizacionInner').text(indemnizacion.toFixed(2));

        // 3. Salarios Pendientes
        const salarioDiario = salarioMensual / 30;
        const salariosPendientes = salarioDiario * diasTrabajados;
        $('#modalNuevaLiquidacion #salariosPendientes').val(salariosPendientes.toFixed(2));
        $('#modalNuevaLiquidacion #salariosPendientesInner').text(salariosPendientes.toFixed(2));

        // 4. Vacaciones No Disfrutadas
        // Asumimos 14 días de vacaciones para 1 a 5 años de servicio
        let diasVacacionesAsignados = 14;
        if (antiguedad > 5) {
            // Incremento proporcional por años adicionales (ejemplo: +1 día por cada año extra)
            diasVacacionesAsignados += Math.floor(antiguedad - 5);
        }
        const vacaciones = (salarioDiario * diasVacaciones);
        $('#modalNuevaLiquidacion #vacaciones').val(vacaciones.toFixed(2));
        $('#modalNuevaLiquidacion #vacacionesInner').text(vacaciones.toFixed(2));

        // 5. Proporcional de Utilidades
        const mesesTerminacion = new Date(fechaSalida).getMonth() + 1; // Meses trabajados en el año (1-12)
        const proporcionalUtilidades = (utilidadesAnuales / 12) * mesesTerminacion;
        $('#modalNuevaLiquidacion #proporcionalUtilidades').val(proporcionalUtilidades.toFixed(2));
        $('#modalNuevaLiquidacion #proporcionalUtilidadesInner').text(proporcionalUtilidades.toFixed(2));

        // 6. Total Liquidación
        const totalLiquidacion = indemnizacion + salariosPendientes + vacaciones + proporcionalUtilidades;
        $('#modalNuevaLiquidacion #totalLiquidacionInner').text(totalLiquidacion.toFixed(2));
        $('#modalNuevaLiquidacion #totalLiquidacion').val(totalLiquidacion.toFixed(2));

        console.log({ antiguedad, indemnizacion, salariosPendientes, vacaciones, proporcionalUtilidades, totalLiquidacion});
        



    }

    // Inicializar Select2 y manejar eventos
    $(document).ready(function() {
        $('.select2').select2();

        // Calcular liquidación al cambiar los campos prellenados
        calcularLiquidacion();
    });
</script>