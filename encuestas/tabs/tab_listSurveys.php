<div id="encuestasTable" class="card"
  data-list='{"valueNames":["paciente","fecha","motivo","calificacion","comentario"],"page":5,"pagination":true}'>
  <div class="card-body">
    <div class="search-box mb-3">
      <input class="form-control search" type="search" placeholder="Buscar encuesta..." aria-label="Buscar">
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th class="sort" data-sort="paciente">Paciente</th>
          <th class="sort" data-sort="fecha">Fecha</th>
          <th class="sort" data-sort="motivo">Motivo</th>
          <th class="sort" data-sort="calificacion">Calificación</th>
          <th class="sort" data-sort="comentario">Comentario</th>
        </tr>
      </thead>
      <tbody class="list">
        <tr>
          <td class="paciente">Juan Pérez</td>
          <td class="fecha">2023-10-01</td>
          <td class="motivo">Consulta General</td>
          <td class="calificacion">5</td>
          <td class="comentario">Muy buen servicio</td>
        </tr>
        <tr>
          <td class="paciente">Ana Gómez</td>
          <td class="fecha">2023-10-02</td>
          <td class="motivo">Control</td>
          <td class="calificacion">4</td>
          <td class="comentario">Buen trato</td>
        </tr>
        <tr>
          <td class="paciente">Carlos López</td>
          <td class="fecha">2023-10-03</td>
          <td class="motivo">Revisión</td>
          <td class="calificacion">3</td>
          <td class="comentario">Regular</td>
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