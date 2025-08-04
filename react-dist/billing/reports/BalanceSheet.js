import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useBalanceGeneral } from "./hooks/useBalanceGeneral.js";
import { useComparativeBalanceGeneral } from "./hooks/useComparativeBalanceGeneral.js";
import { useBalanceGeneralFormat } from "../../documents-generation/hooks/useBalanceGeneralFormat.js";
import { useComparativeBalanceGeneralFormat } from "../../documents-generation/hooks/useComparativeBalanceGeneralFormat.js";
export const BalanceSheet = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    dateRange: dateRangeBalanceGeneral,
    setDateRange: setDateRangeBalanceGeneral,
    fetchBalanceGeneral,
    balanceGeneral: balanceSheetData
  } = useBalanceGeneral();
  const {
    dateRangePeriodOne,
    dateRangePeriodTwo,
    setDateRangePeriodOne,
    setDateRangePeriodTwo,
    fetchComparativeBalanceGeneral,
    comparativeBalanceGeneral: comparativeBalanceSheetData
  } = useComparativeBalanceGeneral();
  const {
    generarFormatoBalanceGeneral
  } = useBalanceGeneralFormat();
  const {
    generateComparativeBalanceGeneralFormat
  } = useComparativeBalanceGeneralFormat();
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const filterAccountsByType = accounts => {
    return accounts.filter(account => account.account_code.startsWith('1') || account.account_code.startsWith('2') || account.account_code.startsWith('3'));
  };
  const exportToPdfSimpleReport = () => {
    generarFormatoBalanceGeneral(balanceSheetData, dateRangeBalanceGeneral?.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(' - ') || '--', 'Impresion');
  };
  const exportToPdfComparativeReport = () => {
    generateComparativeBalanceGeneralFormat(comparativeBalanceSheetData, 'Impresion');
  };
  const renderBalanceStatus = isBalanced => {
    return /*#__PURE__*/React.createElement("div", {
      className: `alert ${isBalanced ? 'alert-success' : 'alert-danger'} mt-3`
    }, isBalanced ? /*#__PURE__*/React.createElement("span", null, "El balance general est\xE1 equilibrado") : /*#__PURE__*/React.createElement("span", null, "El balance general NO est\xE1 equilibrado"));
  };
  const renderAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement(DataTable, {
      value: filterAccountsByType(accounts),
      className: "p-datatable-sm",
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "account_code",
      header: "C\xF3digo",
      style: {
        width: '120px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "account_name",
      header: "Cuenta"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "balance",
      header: "Balance",
      body: rowData => formatCurrency(rowData.balance),
      style: {
        textAlign: 'right',
        width: '180px'
      }
    })));
  };
  const renderComparativeAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement(DataTable, {
      value: filterAccountsByType(accounts),
      className: "p-datatable-sm",
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "account_code",
      header: "C\xF3digo",
      style: {
        width: '100px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "account_name",
      header: "Cuenta",
      style: {
        width: '200px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "balance_period_1",
      header: "Periodo 1",
      body: rowData => formatCurrency(rowData.balance_period_1),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "balance_period_2",
      header: "Periodo 2",
      body: rowData => formatCurrency(rowData.balance_period_2),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "difference",
      header: "Diferencia",
      body: rowData => formatCurrency(rowData.difference),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    })));
  };
  const renderSimpleReport = () => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangeBalanceGeneral,
      onChange: e => setDateRangeBalanceGeneral(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione un rango de fechas"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-end"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf"
      }),
      label: "Exportar a PDF",
      className: "mr-2",
      onClick: exportToPdfSimpleReport
    })))), /*#__PURE__*/React.createElement(Card, {
      title: "Balance General"
    }, renderAccountTable(balanceSheetData.categories.assets, "Activos"), renderAccountTable(balanceSheetData.categories.liabilities, "Pasivos"), renderAccountTable(balanceSheetData.categories.equity, "Patrimonio"), /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Activos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.totals.assets))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Pasivos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.totals.liabilities))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Patrimonio")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.totals.equity))), /*#__PURE__*/React.createElement("tr", {
      className: "table-secondary"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Diferencia")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.difference)))))), renderBalanceStatus(balanceSheetData.is_balanced)));
  };
  const renderComparativeReport = () => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Periodo 1"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangePeriodOne,
      onChange: e => setDateRangePeriodOne(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione un rango de fechas",
      key: "period-one-calendar"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Periodo 2"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangePeriodTwo,
      onChange: e => setDateRangePeriodTwo(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione un rango de fechas",
      key: "period-two-calendar"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-12 d-flex align-items-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "btn btn-primary",
      label: "Comparar",
      onClick: fetchComparativeBalanceGeneral,
      key: "fetch-button"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf"
      }),
      label: "Exportar a PDF",
      className: "mr-2",
      onClick: exportToPdfComparativeReport
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "Balance General Comparativo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h6", null, "Periodo 1"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, comparativeBalanceSheetData.period_1)))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h6", null, "Periodo 2"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, comparativeBalanceSheetData.period_2))))), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.assets, "Activos"), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.liabilities, "Pasivos"), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.equity, "Patrimonio"), /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Totales Comparativos"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cuenta"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Periodo 1"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Periodo 2"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Diferencia"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Activos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.difference))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Pasivos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.difference))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Patrimonio")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.difference))), /*#__PURE__*/React.createElement("tr", {
      className: "table-secondary"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Resultado del Ejercicio")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.difference)))))), renderBalanceStatus(comparativeBalanceSheetData.summary.is_balanced)));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Reporte de Balance General"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Balance General"
  }, renderSimpleReport()), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Balance Comparativo"
  }, renderComparativeReport()))));
};

/*import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Nullable } from 'primereact/ts-helpers';

type AccountComparison = {
    account_code: string;
    account_name: string;
    balance_period_1: number;
    balance_period_2: number;
    difference: number;
};

type TotalsComparison = {
    total_period_1: number;
    total_period_2: number;
    difference: number;
};

type BalanceSheetData = {
    period_1: string;
    period_2: string;
    comparison: {
        incomes: AccountComparison[];
        costs: AccountComparison[];
        expenses: AccountComparison[];
    };
    totals_comparison: {
        incomes: TotalsComparison;
        costs: TotalsComparison;
        expenses: TotalsComparison;
    };
};

export const BalanceSheet: React.FC = () => {
    const [data, setData] = useState<BalanceSheetData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<Nullable<Date>>(new Date());
    const [comparisonYear, setComparisonYear] = useState<Nullable<Date>>(new Date(new Date().getFullYear() - 1, 0, 1));

    // Simular carga de datos
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        // Simulación de llamada a API
        setTimeout(() => {
            const mockData: BalanceSheetData = {
                "period_1": "2025-01-01 to 2025-12-31",
                "period_2": "2024-01-01 to 2024-12-31",
                "comparison": {
                    "incomes": [
                        {
                            "account_code": "41",
                            "account_name": "Ingresos Operacionales",
                            "balance_period_1": 5000000,
                            "balance_period_2": 4500000,
                            "difference": 500000
                        },
                        {
                            "account_code": "413501",
                            "account_name": "Ventas de Productos",
                            "balance_period_1": 4000000,
                            "balance_period_2": 3800000,
                            "difference": 200000
                        },
                        {
                            "account_code": "413502",
                            "account_name": "Servicios Profesionales",
                            "balance_period_1": 1000000,
                            "balance_period_2": 700000,
                            "difference": 300000
                        }
                    ],
                    "costs": [
                        {
                            "account_code": "51",
                            "account_name": "Costos Directos",
                            "balance_period_1": 2500000,
                            "balance_period_2": 2200000,
                            "difference": 300000
                        },
                        {
                            "account_code": "510501",
                            "account_name": "Costo de Ventas",
                            "balance_period_1": 2000000,
                            "balance_period_2": 1800000,
                            "difference": 200000
                        },
                        {
                            "account_code": "510502",
                            "account_name": "Materiales Directos",
                            "balance_period_1": 500000,
                            "balance_period_2": 400000,
                            "difference": 100000
                        }
                    ],
                    "expenses": [
                        {
                            "account_code": "61",
                            "account_name": "Gastos Operacionales",
                            "balance_period_1": 1500000,
                            "balance_period_2": 1400000,
                            "difference": 100000
                        },
                        {
                            "account_code": "610501",
                            "account_name": "Gastos Administrativos",
                            "balance_period_1": 800000,
                            "balance_period_2": 750000,
                            "difference": 50000
                        },
                        {
                            "account_code": "610502",
                            "account_name": "Gastos de Ventas",
                            "balance_period_1": 500000,
                            "balance_period_2": 450000,
                            "difference": 50000
                        },
                        {
                            "account_code": "610503",
                            "account_name": "Gastos Financieros",
                            "balance_period_1": 200000,
                            "balance_period_2": 200000,
                            "difference": 0
                        }
                    ]
                },
                "totals_comparison": {
                    "incomes": {
                        "total_period_1": 5000000,
                        "total_period_2": 4500000,
                        "difference": 500000
                    },
                    "costs": {
                        "total_period_1": 2500000,
                        "total_period_2": 2200000,
                        "difference": 300000
                    },
                    "expenses": {
                        "total_period_1": 1500000,
                        "total_period_2": 1400000,
                        "difference": 100000
                    }
                }
            };
            setData(mockData);
            setLoading(false);
        }, 1000);
    };

    // Formatear número para saldos en pesos dominicanos (DOP)
    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Función para renderizar el cambio porcentual
    const renderDifference = (rowData: AccountComparison) => {
        const difference = rowData.difference;
        const baseValue = rowData.balance_period_2 !== 0 ? rowData.balance_period_2 : 1;
        const percentage = (difference / baseValue) * 100;

        let className = difference >= 0 ? 'text-success' : 'text-danger';
        let icon = difference >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down';

        return (
            <div className={className}>
                <i className={`${icon} mr-1`}></i>
                {formatCurrency(difference)} ({percentage.toFixed(2)}%)
            </div>
        );
    };

    // Función para renderizar una sección del balance
    const renderSection = (section: AccountComparison[], title: string) => {
        return (
            <div className="mb-4">
                <DataTable
                    value={section}
                    loading={loading}
                    className="p-datatable-sm"
                    showGridlines
                    stripedRows
                >
                    <Column field="account_code" header="Código" style={{ width: '100px' }} />
                    <Column field="account_name" header="Nombre de Cuenta" />
                    <Column
                        header="Periodo Actual"
                        body={(rowData) => formatCurrency(rowData.balance_period_1)}
                        style={{ width: '180px' }}
                    />
                    <Column
                        header="Periodo Anterior"
                        body={(rowData) => formatCurrency(rowData.balance_period_2)}
                        style={{ width: '180px' }}
                    />
                    <Column
                        header="Variación"
                        body={renderDifference}
                        style={{ width: '220px' }}
                    />
                </DataTable>
            </div>
        );
    };

    // Footer para los totales de cada sección
    const renderSectionFooter = (sectionKey: keyof BalanceSheetData['totals_comparison']) => {
        if (!data) return null;

        const totals = data.totals_comparison[sectionKey];
        const percentage = totals.total_period_2 !== 0 ?
            (totals.difference / totals.total_period_2) * 100 : 0;

        const isPositive = totals.difference >= 0;
        const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
        const textColor = isPositive ? 'text-green-600' : 'text-red-600';

        return (
            <div className={`${bgColor} p-3 border-round mt-2`}>
                <div className="grid">
                    <div className="col-12 md:col-4 font-bold">
                        <div>Total Periodo Actual</div>
                        <div className="text-xl">{formatCurrency(totals.total_period_1)}</div>
                    </div>
                    <div className="col-12 md:col-4 font-bold">
                        <div>Total Periodo Anterior</div>
                        <div className="text-xl">{formatCurrency(totals.total_period_2)}</div>
                    </div>
                    <div className={`col-12 md:col-4 font-bold ${textColor}`}>
                        <div>Variación</div>
                        <div className="text-xl">
                            {formatCurrency(totals.difference)} ({percentage.toFixed(2)}%)
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <ProgressBar
                        value={Math.abs(percentage)}
                        color={isPositive ? '#22C55E' : '#EF4444'}
                        showValue={false}
                    />
                </div>
            </div>
        );
    };

    // Función para generar el reporte
    const generateReport = () => {
        setLoading(true);
        // Simular carga de datos con los años seleccionados
        setTimeout(() => {
            loadData();
        }, 500);
    };

    // Función para calcular la utilidad operacional
    const calculateOperatingIncome = () => {
        if (!data) return { period1: 0, period2: 0, difference: 0 };

        const period1 = data.totals_comparison.incomes.total_period_1 -
            data.totals_comparison.costs.total_period_1 -
            data.totals_comparison.expenses.total_period_1;

        const period2 = data.totals_comparison.incomes.total_period_2 -
            data.totals_comparison.costs.total_period_2 -
            data.totals_comparison.expenses.total_period_2;

        return {
            period1,
            period2,
            difference: period1 - period2
        };
    };

    return (
        <div className="container-fluid mt-4" style={{ padding: '0 15px' }}>
            <Card title="Estado de Resultados Comparativo" className="mb-4">
                <div className="row g-3 mb-4">
                    <div className="col-md-5">
                        <label className="form-label">Año Fiscal (Periodo Actual)</label>
                        <Calendar
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.value)}
                            view="year"
                            dateFormat="yy"
                            placeholder="Seleccione año"
                            className="w-100"
                            showIcon
                        />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Año Fiscal (Periodo Anterior)</label>
                        <Calendar
                            value={comparisonYear}
                            onChange={(e) => setComparisonYear(e.value)}
                            view="year"
                            dateFormat="yy"
                            placeholder="Seleccione año"
                            className="w-100"
                            showIcon
                        />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <Button
                            label="Generar"
                            icon="pi pi-refresh"
                            className="w-100"
                            onClick={generateReport}
                            loading={loading}
                        />
                    </div>
                </div>

                {loading && !data && (
                    <div className="text-center p-5">
                        <i className="pi pi-spinner pi-spin mr-2"></i>
                        Cargando datos...
                    </div>
                )}

                {data && (
                    <>
                        <div className="d-flex justify-content-between mb-4">
                            <div className="text-center p-3 bg-blue-50 border-round border-1 border-blue-200">
                                <h5>Periodo Actual</h5>
                                <p className="mb-0 font-bold">{data.period_1}</p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 border-round border-1 border-blue-200">
                                <h5>Periodo Anterior</h5>
                                <p className="mb-0 font-bold">{data.period_2}</p>
                            </div>
                        </div>

                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                            <TabPanel header="Ingresos (4)">
                                {renderSection(data.comparison.incomes, "Ingresos")}
                                {renderSectionFooter('incomes')}
                            </TabPanel>
                            <TabPanel header="Costos (5)">
                                {renderSection(data.comparison.costs, "Costos")}
                                {renderSectionFooter('costs')}
                            </TabPanel>
                            <TabPanel header="Gastos (6)">
                                {renderSection(data.comparison.expenses, "Gastos")}
                                {renderSectionFooter('expenses')}
                            </TabPanel>
                            <TabPanel header="Resumen">
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <Card title="Margen Bruto" className="mb-3">
                                            <div className="grid">
                                                <div className="col-12">
                                                    <h5>Ingresos Totales</h5>
                                                    <p>Periodo Actual: {formatCurrency(data.totals_comparison.incomes.total_period_1)}</p>
                                                    <p>Periodo Anterior: {formatCurrency(data.totals_comparison.incomes.total_period_2)}</p>
                                                    <p className="font-bold">
                                                        Variación: {formatCurrency(data.totals_comparison.incomes.difference)} (
                                                        {(data.totals_comparison.incomes.difference / data.totals_comparison.incomes.total_period_2 * 100).toFixed(2)}%)
                                                    </p>
                                                </div>
                                                <div className="col-12">
                                                    <h5>Costos Totales</h5>
                                                    <p>Periodo Actual: {formatCurrency(data.totals_comparison.costs.total_period_1)}</p>
                                                    <p>Periodo Anterior: {formatCurrency(data.totals_comparison.costs.total_period_2)}</p>
                                                    <p className="font-bold">
                                                        Variación: {formatCurrency(data.totals_comparison.costs.difference)} (
                                                        {(data.totals_comparison.costs.difference / data.totals_comparison.costs.total_period_2 * 100).toFixed(2)}%)
                                                    </p>
                                                </div>
                                                <div className="col-12 bg-gray-100 p-3 border-round">
                                                    <h5>Margen Bruto</h5>
                                                    <p>Periodo Actual: {formatCurrency(
                                                        data.totals_comparison.incomes.total_period_1 -
                                                        data.totals_comparison.costs.total_period_1
                                                    )}</p>
                                                    <p>Periodo Anterior: {formatCurrency(
                                                        data.totals_comparison.incomes.total_period_2 -
                                                        data.totals_comparison.costs.total_period_2
                                                    )}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <Card title="Utilidad Operacional" className="mb-3">
                                            <div className="grid">
                                                <div className="col-12">
                                                    <h5>Gastos Totales</h5>
                                                    <p>Periodo Actual: {formatCurrency(data.totals_comparison.expenses.total_period_1)}</p>
                                                    <p>Periodo Anterior: {formatCurrency(data.totals_comparison.expenses.total_period_2)}</p>
                                                    <p className="font-bold">
                                                        Variación: {formatCurrency(data.totals_comparison.expenses.difference)} (
                                                        {(data.totals_comparison.expenses.difference / data.totals_comparison.expenses.total_period_2 * 100).toFixed(2)}%)
                                                    </p>
                                                </div>
                                                <div className="col-12 bg-gray-100 p-3 border-round">
                                                    <h5>Utilidad Operacional</h5>
                                                    <p>Periodo Actual: {formatCurrency(
                                                        data.totals_comparison.incomes.total_period_1 -
                                                        data.totals_comparison.costs.total_period_1 -
                                                        data.totals_comparison.expenses.total_period_1
                                                    )}</p>
                                                    <p>Periodo Anterior: {formatCurrency(
                                                        data.totals_comparison.incomes.total_period_2 -
                                                        data.totals_comparison.costs.total_period_2 -
                                                        data.totals_comparison.expenses.total_period_2
                                                    )}</p>
                                                    <p className="font-bold">
                                                        Variación: {formatCurrency(
                                                            (data.totals_comparison.incomes.total_period_1 -
                                                                data.totals_comparison.costs.total_period_1 -
                                                                data.totals_comparison.expenses.total_period_1) -
                                                            (data.totals_comparison.incomes.total_period_2 -
                                                                data.totals_comparison.costs.total_period_2 -
                                                                data.totals_comparison.expenses.total_period_2)
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </>
                )}
            </Card>
        </div>
    );
};
*/