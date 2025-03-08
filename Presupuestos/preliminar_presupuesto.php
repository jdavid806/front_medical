<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small card p-5 mt-5">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1">Jeferson Dávila</a></li>
                <li class="breadcrumb-item"><a href="registros-presupuestos">Presupuestos</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Presupuestos</li>
            </ol>
        </nav>
        <div class="card p-5 mt-5">
            <h2>Presupuesto #000059</h2>
            <hr>

            <h4 class="mb-5">Fecha: 01-02-25</h4>

            <div class="row mb-5">
                <div class="col-md-4">
                    <h4 class="mb-3">Datos de la Empresa</h4>
                    <ul class="list-unstyled small">
                        <li><strong>Nombre:</strong> Clínica Ejemplo S.A.</li>
                        <li><strong>NIT:</strong> 10027319-8</li>
                        <li><strong>Dirección:</strong> Calle Falsa 123, Ciudad Ejemplo</li>
                        <li><strong>Teléfono:</strong> 123-456-7890</li>
                        <li><strong>Email:</strong> info@clinicaejemplo.com</li>
                    </ul>
                </div>

                <div class="col-md-4">
                    <h4 class="mb-3">Datos del Cliente</h4>
                    <ul class="list-unstyled">
                        <li><strong>Nombre:</strong> Juan Pérez</li>
                        <li><strong>Cédula:</strong> 123456789</li>
                        <li><strong>Dirección:</strong> Carrera 45 #67-89, Ciudad Ejemplo</li>
                        <li><strong>Ciudad:</strong> Ciudad Ejemplo</li>
                        <li><strong>Teléfono:</strong> 987-654-3210</li>
                        <li><strong>Email:</strong> juan.perez@mail.com</li>
                    </ul>
                </div>

                <div class="col-md-4">
                    <h4 class="mb-3">Presupuesto #000059</h4>
                    <ul class="list-unstyled">
                        <li><strong>Fecha Presupuesto:</strong> 2025-02-01</li>
                        <li><strong>Fecha Vencimiento:</strong> 2025-02-01</li>
                    </ul>
                </div>
            </div>


            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th class="text-end">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Consulta Primera Vez</td>
                        <td>1</td>
                        <td>100.005 COP</td>
                        <td>0.005 COP</td>
                        <td class="text-end">100.005 COP</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Consulta con Especialista de Urología</td>
                        <td>2</td>
                        <td>50,000.005 COP</td>
                        <td>10,000.005 COP</td>
                        <td class="text-end">90,000.005 COP</td>
                    </tr>
                </tbody>
            </table>

            <div class="row">
                <div class="col-md-6">
                    <h4>Comentarios:</h4>
                    Ninguno
                </div>
                <div class="col-md-6">
                    <p class="d-flex justify-content-between">
                        <strong>Precio Base:</strong> <span>100,100.005 COP</span>
                    </p>
                    <p class="d-flex justify-content-between">
                        <strong>Descuento:</strong> <span>10,000.005 COP</span>
                    </p>
                    <p class="d-flex justify-content-between border-bottom pb-2">
                        <strong>Subtotal:</strong> <span>90,100.005 COP</span>
                    </p>

                    <h4 class="d-flex justify-content-between fw-bold text-primary mt-3">
                        <span>Total Presupuesto:</span> <span>90,100.005 COP</span>
                    </h4>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>