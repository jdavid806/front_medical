<div class="row gx-3 gy-4 mb-5">
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="mb-3">Importar datos</h5>
      <form>
        <div class="row">
          <div class="col-12 mb-2">
            <div class="form-floating">
              <select class="form-select" id="type" name="type" required>
                <option value="" disabled selected>Seleccione una opción</option>
                <option value="pacientes">Pacientes</option>
              </select>
              <label for="type">Importar para:</label>
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <label for="formFile" class="form-label">Default file input example</label>
              <input class="form-control" type="file" id="excelFile" accept=".xlsx, .xls">
            </div>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary" onclick="processExcel()">Importar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>