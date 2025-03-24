<div id="citasTable" class="card" data-list='{"valueNames":["paciente","hora","estado"],"page":5,"pagination":true}'>
  <div class="card-body">
    <div class="search-box mb-3">
      <input class="form-control search" type="search" placeholder="Buscar cita..." aria-label="Buscar">
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th class="sort" data-sort="paciente">Paciente</th>
          <th class="sort" data-sort="hora">Hora</th>
          <th class="sort" data-sort="estado">Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody class="list">
        <tr>
          <td class="paciente">Juan Pérez</td>
          <td class="hora">10:00 AM</td>
          <td class="estado">Pendiente</td>
          <td>
            <button class="btn btn-danger btn-sm">Descartar</button>
            <button class="btn btn-primary btn-sm">Reenviar</button>
          </td>
        </tr>
        <tr>
          <td class="paciente">Ana Gómez</td>
          <td class="hora">11:30 AM</td>
          <td class="estado">Pendiente</td>
          <td>
            <button class="btn btn-danger btn-sm">Descartar</button>
            <button class="btn btn-primary btn-sm">Reenviar</button>
          </td>
        </tr>
        <tr>
          <td class="paciente">Carlos López</td>
          <td class="hora">1:00 PM</td>
          <td class="estado">Pendiente</td>
          <td>
            <button class="btn btn-danger btn-sm">Descartar</button>
            <button class="btn btn-primary btn-sm">Reenviar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-between mt-3">
      <span class="d-none d-sm-inline-block" data-list-info></span>
      <div class="d-flex">
        <ul class="pagination mb-0"></ul>
      </div>
    </div>
  </div>
</div>