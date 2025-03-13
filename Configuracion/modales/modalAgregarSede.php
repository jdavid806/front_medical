<!-- Modal para agregar sede -->
<div class="modal fade modal-xl" id="crearSede" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Nueva Sede</h5>
        <button class="btn btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarSede" class="row g-3 needs-validation" novalidate>
        <div class="modal-body">
          <h6>Información General</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label" for="sedeNombre">Nombre</label>
              <input class="form-control" id="sedeNombre" type="text" placeholder="Sede prueba" required>
              <div class="invalid-feedback">El nombre de la sede no puede estar vacío.</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label" for="sedeCorreo">Correo Electrónico</label>
              <input class="form-control" id="sedeCorreo" type="email" placeholder="ejemplo@correo.com" required>
              <div class="invalid-feedback">Ingrese un correo válido.</div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label" for="sedeWhatsapp">WhatsApp</label>
              <input class="form-control" id="sedeWhatsapp" type="number" placeholder="573001234567" required>
              <div class="invalid-feedback">Ingrese un número de WhatsApp válido.</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label" for="sedeDireccion">Dirección</label>
              <input class="form-control" id="sedeDireccion" type="text" placeholder="Calle 123 #45-67" required>
              <div class="invalid-feedback">La dirección no puede estar vacía.</div>
            </div>
          </div>

          <h6>Ubicación</h6>
          <div class="row">
            <div class="col-sm-12">
              <div class="mb-2 mb-sm-0">
                <label for="country_id" class="form-label">Pais</label>
                <select class="form-select" id="country_id" name="sede[country_id]" required>
                  <option selected disabled value="">Seleccione</option>
                </select>
                <div class="invalid-feedback">El campo es obligatorio</div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-2">
                <label for="department_id" class="form-label">Departamento o provincia</label>
                <select class="form-select" id="department_id" name="sede[department_id]" required>
                  <option selected disabled value="">Seleccione</option>
                </select>
                <div class="invalid-feedback">El campo es obligatorio</div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-2 mb-sm-0">
                <label for="city_id" class="form-label">Ciudad</label>
                <select class="form-select" id="city_id" name="sede[city_id]" required>
                  <option selected disabled value="">Seleccione</option>
                </select>
                <div class="invalid-feedback">El campos es obligatorio</div>
              </div>
            </div>
          </div>

          <h6>Representante</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label" for="sedeRepresentante">Nombre</label>
              <input class="form-control" id="sedeRepresentante" type="text" placeholder="Nombre del representante"
                required>
              <div class="invalid-feedback">El nombre del representante no puede estar vacío.</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label" for="sedeTelefono">Teléfono</label>
              <input class="form-control" id="sedeTelefono" type="number" placeholder="Teléfono del representante"
                required>
              <div class="invalid-feedback">Ingrese un número de teléfono válido.</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit">Guardar Sede</button>
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script type="module">
  import {
    countriesSelect,
    departmentsSelect,
    citiesSelect
  } from "./services/selects.js";
  document.addEventListener("DOMContentLoaded", async function() {
    countriesSelect(document.getElementById('country_id'), (selectedOption) => {
      const selectedCountryId = selectedOption.customProperties.id;

      departmentsSelect(
        document.getElementById('department_id'),
        selectedCountryId,
        (selectedDepartment) => {
          const selectedDepartmentId = selectedDepartment.customProperties.id;

          citiesSelect(
            document.getElementById('city_id'),
            selectedDepartmentId,
            (selectedCity) => {}
          );
        }
      );
    });
  });
</script>
<script>
  document.getElementById("formAgregarSede").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    let nombre = document.getElementById("sedeNombre").value;
    let correo = document.getElementById("sedeCorreo").value;
    let whatsapp = document.getElementById("sedeWhatsapp").value;
    let direccion = document.getElementById("sedeDireccion").value;
    let ciudad = document.getElementById("city_id").value;
    let departamento = document.getElementById("department_id").value;
    let pais = document.getElementById("country_id").value;
    let representante = document.getElementById("sedeRepresentante").value;
    let telefono = document.getElementById("sedeTelefono").value;
    let tabla = document.querySelector("#tablaSedes tbody");
    let nuevaFila = tabla.insertRow();
    let rowCount = tabla.rows.length;

    guardarSedeEnArray(nombre, correo, whatsapp, direccion, ciudad, departamento, pais, representante, telefono);

    nuevaFila.innerHTML = `
      <td>${rowCount}</td>
      <td>${nombre}</td>
      <td>${correo}</td>
      <td>${whatsapp}</td>
      <td>${direccion}</td>
      <td>${ciudad}</td>
      <td>${representante}</td>
      <td>${telefono}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="eliminarSede(this)">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </td>
    `;

    // Limpiar formulario y cerrar modal
    document.getElementById("formAgregarSede").reset();
    let modal = bootstrap.Modal.getInstance(document.getElementById("crearSede"));
    modal.hide();
  });

  function eliminarSede(btn) {
    let fila = btn.closest("tr");
    fila.remove();
  }

  let sedesArray = [];

  function guardarSedeEnArray(nombre, correo, whatsapp, direccion, ciudad, departamento, pais, representante, telefono) {
    let sede = {
      name: nombre,
      email: correo,
      whatsapp: whatsapp,
      address: direccion,
      city: ciudad,
      state: departamento,
      country: pais,
      representatives: [{
        name: representante,
        phone: telefono
      }]
    };



    sedesArray.push(sede);
    console.log("Sede agregada:", sede);
    console.log("Lista actualizada de sedes:", sedesArray);
  }
</script>