<style>
  .fade-out {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fade-in {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
</style>

<div class="d-flex justify-content-between align-items-center mb-3">
  <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
    <li class="nav-item" role="presentation"><a class="nav-link active" id="home-tab" data-bs-toggle="tab"
        href="#tab-home" role="tab" aria-controls="tab-home" aria-selected="true">Precios</a></li>
    <!-- <li class="nav-item" role="presentation"><a class="nav-link" id="profile-tab" data-bs-toggle="tab"
        href="#tab-profile" role="tab" aria-controls="tab-profile" aria-selected="false" tabindex="-1">Configuración de
        precios</a></li> -->
  </ul>
  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPrice">
    <i class="fa-solid fa-plus"></i> Agregar Precio
  </button>
</div>
<div class="tab-content mt-3" id="myTabContent">
  <div class="tab-pane fade active show" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
    <div class="row gx-3 gy-4 mb-5">
      <div id="preciosTable" class="card"
        data-list='{"valueNames":["name", "barcode", "attentionType", "salePrice", "copayment"],"page":5,"pagination":true}'>
        <div class="card-body">
          <!-- Buscador -->
          <div class="search-box mb-3">
            <input class="form-control search" type="search" placeholder="Buscar precio..." aria-label="Buscar">
          </div>

          <!-- Tabla -->
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th class="sort" data-sort="name">Ítem</th>
                <th class="sort" data-sort="barcode">Cups</th>
                <th class="sort" data-sort="attentionType">Tipo de Atención</th>
                <th class="sort" data-sort="salePrice">Precio Público</th>
                <th class="sort" data-sort="copayment">Copago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="list" id="tablaPrecios">
              <!-- Filas dinámicas -->
            </tbody>
          </table>

          <!-- Paginación -->
          <div class="d-flex justify-content-between mt-3">
            <span class="d-none d-sm-inline-block" data-list-info></span>
            <div class="d-flex">
              <ul class="pagination mb-0"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab">

    <div class="container text-center">
      <div class="row row-cols-2 bg-body-highlight">

        <!-- Contributivo -->
        <div class="col p-2 border">
          <div class="card">

            <div class="card-body">
              <h5 class="card-title">Contributivo</h5>
              <!-- Header -->
              <div class="d-flex align-items-center p-2 bg-light border-bottom">
                <div class="flex-grow-1 text-start fw-bold" style="width: 100px;">
                  Categoría
                </div>
                <div class="flex-grow-1 text-start fw-bold" style="width: 100px;">
                  Cuota Moderadora
                </div>
                <div class="flex-grow-1 text-start fw-bold" style="width: 120px;">
                  Copago
                </div>
              </div>

              <!-- Categoría A -->
              <div class="d-flex align-items-center p-2 border-bottom">
                <div class="flex-grow-1 text-start" style="width: 100px;">
                  <span class="fw-bold">Categoría A</span>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 150px;">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" id="moderator_fee1" name="moderator_fee1" value="4500">
                  </div>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 120px;">
                    <input type="number" class="form-control" value="11">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <!-- Categoría B -->
              <div class="d-flex align-items-center p-2 border-bottom">
                <div class="flex-grow-1 text-start" style="width: 100px;">
                  <span class="fw-bold">Categoría B</span>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 150px;">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" id="moderator_fee1" name="moderator_fee2" value="11300">
                  </div>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 120px;">
                    <input type="number" class="form-control" value="17">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <!-- Categoría C -->
              <div class="d-flex align-items-center p-2 border-bottom">
                <div class="flex-grow-1 text-start" style="width: 100px;">
                  <span class="fw-bold">Categoría C</span>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 150px;">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" id="moderator_fee1" name="moderator_fee3" value="41000">
                  </div>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 120px;">
                    <input type="number" class="form-control" value="21">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <!-- Botón de guardado general -->
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-primary px-4">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Subsidiary -->

        <div class="col p-2 border">
          <div class="card">

            <div class="card-body">
              <h5 class="card-title">Subsidiario</h5>
              <!-- Header -->
              <div class="d-flex align-items-center p-2 bg-light border-bottom">
                <div class="flex-grow-1 text-start fw-bold" style="width: 250px;">
                  Niveles
                </div>
                <div class="flex-grow-1 text-start fw-bold" style="width: 150px;">
                  Copago
                </div>
              </div>

              <!-- Nivel 1 -->
              <div class="d-flex align-items-center p-2 border-bottom">
                <div class="flex-grow-1 text-start" style="width: 250px;">
                  <span class="fw-bold">Nivel 1</span>
                </div>
                <!-- <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 150px;">
                    <input type="number" class="form-control" name="copaymentNivel1" id="copaymentNivel1" value="11">
                    <span class="input-group-text">%</span>
                  </div>
                </div> -->
              </div>

              <!-- Categoría B -->
              <div class="d-flex align-items-center p-2 border-bottom">
                <div class="flex-grow-1 text-start" style="width: 250px;">
                  <span class="fw-bold">Nivel 2</span>
                </div>
                <div class="flex-grow-1 text-start">
                  <div class="input-group" style="width: 150px;">
                    <input type="number" class="form-control" value="17" name="copaymentNivel2" id="copaymentNivel2">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>



              <div class="card-footer">
                <!-- Botón de guardado general -->
                <div class="d-flex justify-content-end mt-3">
                  <button class="btn btn-primary px-4">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    cargarContenido();
  });

</script>