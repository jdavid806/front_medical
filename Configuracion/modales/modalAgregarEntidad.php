<div class="modal fade modal-xl" id="crearEntidad" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agregar Nueva Entidad</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formAgregarEntidad" class="needs-validation" novalidate>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3 col-md-4">
              <label class="form-label" for="nombre-entidad">Nombre</label>
              <input class="form-control" id="nombre-entidad" type="text" required>
              <div class="invalid-feedback">Debe llenar el nombre de la Entidad</div>
            </div>
            <?php /*
       esto es para colombia asi solos e ve en codigo y no en consola c:
       att alguien con sueño hambre y pereza, osea que putas nunca estuvo listo el proyecto
       y me toco trabajar sabado y domigo :C
       antes agredezcan que no le he agregado un bucle sin fin pero estoy a nada de hacerlo
       además pvto windows no quiere dokerisar el proyecto

       !!!! MUERTE A WINDOWS Y SU PENDEJADA DE NO QUERER FUNCIONAR !!!!

       ya con eso me desahogue gracias por leerme c:
    <div class="mb-3 col-md-4">
      <label class="form-label" for="nit-entidad">NIT</label>
      <input class="form-control" id="nit-entidad" type="number" required>
      <div class="invalid-feedback">Debe ingresar un NIT válido</div>
    </div>
    <div class="mb-3 col-md-4">
      <label class="form-label" for="dv-entidad">DV</label>
      <input class="form-control" id="dv-entidad" type="number" required>
      <div class="invalid-feedback">Debe ingresar el DV</div>
    </div>
  */ ?>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="numeroIdentificacion-entidad">Número de Identificación</label>
              <input class="form-control" id="numeroIdentificacion-entidad" type="number" required>
              <div class="invalid-feedback">Debe ingresar un número de identificación válido</div>
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="tipoIdentificacion-entidad">Tipo de Identificación</label>
              <select class="form-control" id="tipoIdentificacion-entidad" required>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
              </select>
              <div class="invalid-feedback">Debe seleccionar un tipo de identificación</div>
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="email-entidad">Email</label>
              <input class="form-control" id="email-entidad" type="email" required>
              <div class="invalid-feedback">Debe ingresar un correo válido</div>
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="direccion-entidad">Dirección</label>
              <input class="form-control" id="direccion-entidad" type="text">
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="telefono-entidad">Teléfono</label>
              <input class="form-control" id="telefono-entidad" type="number">
            </div>
            <div class="mb-3 col-md-4">
              <label class="form-label" for="ciudad-entidad">Ciudad</label>
              <select class="form-control" id="ciudad-entidad">
                <option value="1">Republica Dominicana</option>
                <option value="2">Bogotá</option>
                <option value="3">Medellín</option>
                <option value="4">Cali</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit">Guardar</button>
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>

  function handleEntidadesForm() {

    const form = document.getElementById('formAgregarEntidad');

    if (!form) {
      console.warn('El formulario de creación no existe en el DOM');
      return;
    }

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const productId = document.getElementById('entity_id')?.value;
      const productData = {
        name: document.getElementById("nombre-entidad").value,
        document_type: document.getElementById("tipoIdentificacion-entidad").value,
        document_number: document.getElementById("numeroIdentificacion-entidad").value,
        email: document.getElementById("email-entidad").value,
        address: document.getElementById("direccion-entidad").value,
        phone: document.getElementById("telefono-entidad").value,
        city_id: document.getElementById("ciudad-entidad").value,
      };
      

      // Validación básica
      /* if (!productData.name || !productData.product_type_id) {
          alert('Nombre y tipo son campos obligatorios');
          return;
      } */

      try {
        if (productId) {
          updateEntidad(productId, productData);
        } else {
          createEntidad(productData);
        }

        // Limpiar formulario y cerrar modal
        form.reset();
        $('#crearPlantilla').modal('hide');
        cargarConsentimientos();
      } catch (error) {
        alert('Error al crear el producto: ' + error.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleEntidadesForm();
  });

</script>