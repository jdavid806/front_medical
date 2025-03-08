document.addEventListener('DOMContentLoaded', function () {
  // Crear el primer gráfico Doughnut en el div con id 'pie-chart-1'
  var pieChartElement1 = document.getElementById('pie-chart-1');
  var pieChart1 = echarts.init(pieChartElement1);

  // Configuración del primer gráfico Doughnut (anillo)
  var option1 = {
    title: {
      text: 'Ventas del Mes - Producto A', // Título del gráfico 1
      subtext: 'Distribución de Ventas',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'  // Color del título
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['Producto A', 'Producto B', 'Producto C'],
      textStyle: {
        color: '#555'  // Color de los textos de la leyenda
      }
    },
    series: [
      {
        name: 'Ventas',
        type: 'pie',
        radius: ['40%', '70%'],  // Crear el agujero en el centro
        data: [
          { value: 335, name: 'Producto A' },
          { value: 310, name: 'Producto B' },
          { value: 234, name: 'Producto C' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)' // Efecto al pasar el ratón sobre una sección
          }
        },
        label: {
          position: 'outside',
          formatter: '{b}: {d}%' // Muestra el nombre de la categoría y el porcentaje
        }
      }
    ]
  };

  // Usar la configuración para el primer gráfico
  pieChart1.setOption(option1);

  // Crear el segundo gráfico Doughnut en el div con id 'pie-chart-2'
  var pieChartElement2 = document.getElementById('pie-chart-2');
  var pieChart2 = echarts.init(pieChartElement2);

  // Configuración del segundo gráfico Doughnut (anillo)
  var option2 = {
    title: {
      text: 'Ventas del Mes - Producto B', // Título del gráfico 2
      subtext: 'Distribución de Ventas',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['Producto A', 'Producto B', 'Producto C'],
      textStyle: {
        color: '#555'
      }
    },
    series: [
      {
        name: 'Ventas',
        type: 'pie',
        radius: ['40%', '70%'],  // Crear el agujero en el centro
        data: [
          { value: 435, name: 'Producto A' },
          { value: 210, name: 'Producto B' },
          { value: 180, name: 'Producto C' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          position: 'outside',
          formatter: '{b}: {d}%' // Muestra el nombre de la categoría y el porcentaje
        }
      }
    ]
  };

  // Usar la configuración para el segundo gráfico
  pieChart2.setOption(option2);
});
