import { echartSetOption } from './echarts-utils';

/* -------------------------------------------------------------------------- */
/*                             Echarts Total Sales                            */
/* -------------------------------------------------------------------------- */

const totalSalesChartInit = () => {
  const { getColor, getData, getDates } = window.phoenix.utils;
  const $totalSalesChart = document.querySelector('.echart-total-sales-chart');

  // getItemFromStore('phoenixTheme')

  const dates = getDates(
    new Date('5/1/2022'),
    new Date('5/30/2022'),
    1000 * 60 * 60 * 24
  );

  const currentMonthData = [
    100, 200, 300, 300, 300, 250, 200, 200, 200, 200, 200, 500, 500, 500, 600,
    700, 800, 900, 1000, 1100, 850, 600, 600, 600, 400, 200, 200, 300, 300, 300
  ];

  const prevMonthData = [
    200, 200, 100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 200, 400, 600,
    600, 600, 800, 1000, 700, 400, 450, 500, 600, 700, 650, 600, 550
  ];

  const tooltipFormatter = params => {
    const currentDate = window.dayjs(params[0].axisValue);
    const prevDate = window.dayjs(params[0].axisValue).subtract(1, 'month');

    const result = params.map((param, index) => ({
      value: param.value,
      date: index > 0 ? prevDate : currentDate,
      color: param.color
    }));

    let tooltipItem = ``;
    result.forEach((el, index) => {
      tooltipItem += `<h6 class="fs-9 text-body-tertiary ${
        index > 0 && 'mb-0'
      }"><span class="fas fa-circle me-2" style="color:${el.color}"></span>
      ${el.date.format('MMM DD')} : ${el.value}
    </h6>`;
    });
    return `<div class='ms-1'>
              ${tooltipItem}
            </div>`;
  };

  if ($totalSalesChart) {
    const userOptions = getData($totalSalesChart, 'echarts');
    const chart = window.echarts.init($totalSalesChart);

    const getDefaultOptions = () => ({
      color: [getColor('primary'), getColor('info')],
      tooltip: {
        trigger: 'axis',
        padding: 10,
        backgroundColor: getColor('body-highlight-bg'),
        borderColor: getColor('border-color'),
        textStyle: { color: getColor('light-text-emphasis') },
        borderWidth: 1,
        transitionDuration: 0,
        axisPointer: {
          type: 'none',
          z: 0
        },
        formatter: tooltipFormatter,
        extraCssText: 'z-index: 1000'
      },
      xAxis: [
        {
          type: 'category',
          data: dates,
          axisLabel: {
            formatter: value => window.dayjs(value).format('DD MMM'),
            interval: 13,
            showMinLabel: true,
            showMaxLabel: false,
            color: getColor('secondary-color'),
            align: 'left',
            fontFamily: 'Nunito Sans',
            fontWeight: 600,
            fontSize: 12.8
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: getColor('secondary-bg')
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color:
                window.config.config.phoenixTheme === 'dark'
                  ? getColor('body-highlight-bg')
                  : getColor('secondary-bg')
            }
          },
          boundaryGap: false
        },
        {
          type: 'category',
          position: 'bottom',
          data: dates,
          axisLabel: {
            formatter: value => window.dayjs(value).format('DD MMM'),
            interval: 130,
            showMaxLabel: true,
            showMinLabel: false,
            color: getColor('secondary-color'),
            align: 'right',
            fontFamily: 'Nunito Sans',
            fontWeight: 600,
            fontSize: 12.8
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          boundaryGap: false
        }
      ],
      yAxis: {
        position: 'right',
        axisPointer: { type: 'none' },
        axisTick: 'none',
        splitLine: {
          show: false
        },
        axisLine: { show: false },
        axisLabel: { show: false }
      },
      series: [
        {
          name: 'd',
          type: 'line',
          // data: Array.from(Array(30).keys()).map(() =>
          //   getRandomNumber(100, 300)
          // ),
          data: currentMonthData,
          showSymbol: false,
          symbol: 'circle',
          zlevel: 2
        },
        {
          name: 'e',
          type: 'line',
          // data: Array.from(Array(30).keys()).map(() =>
          //   getRandomNumber(100, 300)
          // ),
          data: prevMonthData,
          // symbol: 'none',
          lineStyle: {
            type: 'dashed',
            width: 1,
            color: getColor('info')
          },
          showSymbol: false,
          symbol: 'circle',
          zlevel: 1
        }
      ],
      grid: {
        right: 2,
        left: 5,
        bottom: '20px',
        top: '2%',
        containLabel: false
      },
      animation: false
    });
    echartSetOption(chart, userOptions, getDefaultOptions);
  }
};

export default totalSalesChartInit;
