<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  .card {
    border: none;
    border-radius: 10px;
    color: white;
  }

  .card-1 {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
  }

  .card-2.score-1 {
    background: linear-gradient(135deg, #ff4e4e, #d7263d);
  }

  .card-2.score-2 {
    background: linear-gradient(135deg, #ff7f50, #ff6347);
  }

  .card-2.score-3 {
    background: linear-gradient(135deg, #ffa500, #ffcc00);
  }

  .card-2.score-4 {
    background: linear-gradient(135deg, #4caf50, #2e7d32);
  }

  .card-2.score-5 {
    background: linear-gradient(135deg, #00c853, #00796b);
  }

  .card-icon {
    font-size: 2.5rem;
  }

  #barChart,
  #pieChart {
    height: 350px !important;
  }
</style>

<div class="">
  <!-- Cards en la parte superior -->
  <div class="row mb-4">
    <div class="col-md-6">
      <div class="card card-1">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title">Encuestas Enviadas</h5>
              <p class="card-text display-4">1,000</p>
            </div>
            <i class="fas fa-paper-plane card-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div id="puntajeCard" class="card card-2">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title">Puntaje Global</h5>
              <p id="puntajeText" class="card-text display-4">4.3/5</p>
            </div>
            <i class="fas fa-star card-icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Gráficos estadísticos -->
  <div class="row mb-4">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Envíos vs Respuestas</h5>
          <canvas id="barChart"></canvas>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Distribución de Calificaciones</h5>
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <div class="row mb-4">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Calificación Promedio por Mes</h5>
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  const totalEnviadas = 1000;
  const totalRespondidas = 750;
  const calificaciones = [50, 100, 200, 250, 150];
  const colorPalette = ["#6a11cb", "#2575fc", "#4bc0c0", "#ff7e5f", "#feb47b"];

  const puntajeGlobal = 4.3;
  const puntajeCard = document.getElementById("puntajeCard");
  const puntajeText = document.getElementById("puntajeText");
  puntajeText.textContent = `${puntajeGlobal}/5`;

  const scoreClass = puntajeGlobal <= 1 ? "score-1"
    : puntajeGlobal <= 2 ? "score-2"
      : puntajeGlobal <= 3 ? "score-3"
        : puntajeGlobal <= 4 ? "score-4"
          : "score-5";

  puntajeCard.classList.add(scoreClass);

  const barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Encuestas"],
      datasets: [
        {
          label: "Enviadas",
          data: [totalEnviadas],
          backgroundColor: colorPalette[0],
        },
        {
          label: "Respondidas",
          data: [totalRespondidas],
          backgroundColor: colorPalette[1],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: totalEnviadas },
      },
    },
  });

  const pieChart = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [
        {
          label: "Calificaciones",
          data: calificaciones,
          backgroundColor: colorPalette,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });

  // Gráfico lineal (Calificación Promedio por Mes)
  const lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      datasets: [
        {
          label: "Calificación Promedio",
          data: [3.5, 4.0, 4.2, 4.5, 4.7, 4.8, 4.5, 4.3, 3.8, 4.1, 4.3, 4.3],
          borderColor: colorPalette[1],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
        },
      },
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
</script>