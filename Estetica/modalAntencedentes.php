<div class="modal fade modal-xl" id="modalVerAntecedentesClinicos" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content">

      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h5 class="modal-title fw-bold" id="exampleModalLabel">Antecedentes Clínicos</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="modal-body">
        <!-- Antecedentes Heredofamiliares -->
        <h3 class="fw-bold mb-3"><i class="fa-solid fa-users fa-lg"></i> Antecedentes Heredofamiliares</h3>
        <div class="row">
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Diabetes:</span> Padre</p>
            <p><span class="fw-bold">Hipertensión:</span> Madre y abuelo paterno</p>
          </div>
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Cáncer:</span> Tía materna (de mama)</p>
            <p><span class="fw-bold">Enfermedades cardiovasculares:</span> Ninguna reportada</p>
          </div>
        </div>

        <hr class="my-4">

        <!-- Antecedentes Personales Patológicos -->
        <h3 class="fw-bold mb-3"><i class="fa-solid fa-heart-pulse fa-lg"></i> Antecedentes Personales Patológicos</h3>
        <div class="row">
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Enfermedades previas:</span> Hepatitis A (infancia)</p>
            <p><span class="fw-bold">Cirugías:</span> Apendicectomía (2015)</p>
            <p><span class="fw-bold">Hospitalizaciones:</span> Ninguna adicional</p>
          </div>
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Alergias:</span> Penicilina</p>
            <p><span class="fw-bold">Medicamentos:</span> Metformina (tratamiento actual)</p>
          </div>
        </div>

        <hr class="my-4">

        <!-- Antecedentes Personales No Patológicos -->
        <h3 class="fw-bold mb-3"><i class="fa-solid fa-person-walking fa-lg"></i> Antecedentes Personales No Patológicos</h3>
        <div class="row">
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Hábitos:</span> No fuma, consume alcohol ocasionalmente</p>
            <p><span class="fw-bold">Actividad física:</span> Realiza ejercicio 3 veces por semana</p>
          </div>
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Vacunación:</span> Esquema completo hasta la última revisión</p>
            <p><span class="fw-bold">Dieta:</span> Controlada en carbohidratos</p>
          </div>
        </div>

        <hr class="my-4">

        <!-- Historia Gineco-Obstétrica (si aplica) -->
        <h3 class="fw-bold mb-3"><i class="fa-solid fa-baby fa-lg"></i> Historia Gineco-Obstétrica</h3>
        <div class="row">
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Menarquia:</span> 12 años</p>
            <p><span class="fw-bold">Ciclos menstruales:</span> Regulares</p>
          </div>
          <div class="col-md-6 mb-4">
            <p><span class="fw-bold">Gestaciones:</span> 2 (1 parto vaginal, 1 cesárea)</p>
            <p><span class="fw-bold">Métodos anticonceptivos:</span> DIU</p>
          </div>
        </div>
      </div>

      <!-- Footer del modal -->
      <div class="modal-footer d-flex justify-content-end">
        <div class="btn-group me-3">
          <a href="#<?php echo $consulta['historiaId']; ?>" title="Imprimir antecedentes" class="btn text-primary p-0">
            <i class="fa-solid fa-print"></i>
          </a>
          <a href="#<?php echo $consulta['historiaId']; ?>" title="Descargar antecedentes" class="btn text-primary p-0 ms-3">
            <i class="fa-solid fa-download"></i>
          </a>
          <div class="dropdown ms-3">
            <a class="btn text-primary p-0" href="#" role="button" title="Compartir" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="fa-solid fa-share-nodes"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#"><i class="fa-brands fa-whatsapp"></i> Compartir por Whatsapp</a></li>
              <li><a class="dropdown-item" href="#"><i class="fa-solid fa-envelope"></i> Compartir por Correo</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<style>
  .logo {
  font-size: 24px; /* Tamaño del ícono */
  border: 2px solid #000; /* Borde cuadrado */
  background-color: #d3d3d3; /* Fondo gris */
  padding: 5px; /* Espacio interno para el ícono */
  border-radius: 4px; /* Opcional: hace que los bordes sean ligeramente redondeados */
}
</style>