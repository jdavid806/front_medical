document.addEventListener("DOMContentLoaded", function () {
  window.createDoughnutChart = function (
    elementId,
    titleText,
    titleSubtext,
    seriesName,
    seriesData
  ) {
    // Obtener el elemento por ID
    var chartElement = document.getElementById(elementId);
    if (!chartElement) {
      console.error(`El elemento con id '${elementId}' no existe.`);
      return;
    }

    // Inicializar el gráfico
    var chart = echarts.init(chartElement);

    // Configuración del gráfico
    var options = {
      title: {
        text: titleText, // Título dinámico
        subtext: titleSubtext, // Subtítulo dinámico
        left: "center",
        textStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: seriesName, // Nombre dinámico de la serie
          type: "pie",
          radius: ["40%", "70%"], // Crear el agujero en el centro
          data: seriesData, // Datos dinámicos
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            position: "outside",
            formatter: "{b}: {d}%", // Muestra el nombre de la categoría y el porcentaje
          },
        },
      ],
    };

    // Usar la configuración para inicializar el gráfico
    chart.setOption(options);
  };

});
