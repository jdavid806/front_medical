import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import InventoryService from "../../services/api/classes/inventoryServices.js"; // Interfaces actualizadas
export const UserSupplyStockReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchReportData();
  }, []);
  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Reemplaza con tu endpoint real
      const service = new InventoryService();
      const response = await service.usersSuppliesStockReport();
      setReportData(response);
    } catch (err) {
      setError('Error al cargar el reporte');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };
  const getStatusSeverity = status => {
    switch (status) {
      case 'entregado':
        return 'success';
      case 'parcialmente_entregado':
        return 'warning';
      case 'pendiente':
        return 'danger';
      default:
        return 'info';
    }
  };
  const getStatusLabel = status => {
    switch (status) {
      case 'entregado':
        return 'Entregado';
      case 'parcialmente_entregado':
        return 'Parcialmente Entregado';
      case 'pendiente':
        return 'Pendiente';
      default:
        return status;
    }
  };
  const calculateProgress = (delivered, requested) => {
    return requested > 0 ? delivered / requested * 100 : 0;
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };
  const UserSummaryCard = ({
    user
  }) => {
    const totalProducts = Object.keys(user.report_data.current_balance).length;
    const positiveBalanceCount = Object.values(user.report_data.current_balance).filter(balance => balance > 0).length;
    const zeroBalanceCount = Object.values(user.report_data.current_balance).filter(balance => balance === 0).length;
    const negativeBalanceCount = Object.values(user.report_data.current_balance).filter(balance => balance < 0).length;
    return /*#__PURE__*/React.createElement(Card, {
      className: "mb-3 border-0 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-3"
    }, /*#__PURE__*/React.createElement("h6", {
      className: "mb-1 fw-bold text-primary"
    }, user.user_name), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, user.user_specialty), /*#__PURE__*/React.createElement("div", {
      className: "mt-1"
    }, /*#__PURE__*/React.createElement(Badge, {
      value: user.clinical_record,
      severity: "info"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Email"), /*#__PURE__*/React.createElement("span", null, user.user_email))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "border-end"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-0 text-success"
    }, positiveBalanceCount), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Con Stock"))), /*#__PURE__*/React.createElement("div", {
      className: "col-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "border-end"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-0 text-warning"
    }, zeroBalanceCount), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Sin Stock"))), /*#__PURE__*/React.createElement("div", {
      className: "col-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-0 text-danger"
    }, negativeBalanceCount), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Sobregirado"))))));
  };
  const ProductBalanceTable = ({
    user
  }) => {
    const products = Object.keys(user.report_data.current_balance).map(productId => {
      const productDetail = user.report_data.product_details[productId];
      return {
        productId,
        productName: productDetail?.product_name || `Producto ${productId}`,
        productReference: productDetail?.product_reference || 'N/A',
        delivered: user.report_data.delivered_supplies[productId] || 0,
        consumed: user.report_data.consumed_supplies[productId] || 0,
        balance: user.report_data.current_balance[productId]
      };
    });
    const balanceBodyTemplate = rowData => {
      const severity = rowData.balance > 0 ? 'success' : rowData.balance < 0 ? 'danger' : 'warning';
      return /*#__PURE__*/React.createElement(Tag, {
        value: rowData.balance,
        severity: severity
      });
    };
    const productNameBodyTemplate = rowData => {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "fw-semibold"
      }, rowData.productName), /*#__PURE__*/React.createElement("small", {
        className: "text-muted"
      }, "Ref: ", rowData.productReference));
    };
    return /*#__PURE__*/React.createElement(Card, {
      className: "mb-3",
      title: "Balance de Insumos"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: products,
      size: "small",
      className: "p-datatable-sm"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "productName",
      header: "Producto",
      body: productNameBodyTemplate,
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "delivered",
      header: "Entregado",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "consumed",
      header: "Consumido",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "balance",
      header: "Saldo",
      body: balanceBodyTemplate,
      sortable: true
    })));
  };
  const MedicalSuppliesSection = ({
    medicalSupplies
  }) => {
    const productNameBodyTemplate = rowData => {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "fw-semibold"
      }, rowData.product_name), /*#__PURE__*/React.createElement("small", {
        className: "text-muted"
      }, "Ref: ", rowData.product_reference));
    };
    return /*#__PURE__*/React.createElement(Card, {
      className: "mb-3",
      title: "Solicitudes de Insumos M\xE9dicos"
    }, /*#__PURE__*/React.createElement(Accordion, {
      multiple: true
    }, medicalSupplies.map(supply => /*#__PURE__*/React.createElement(AccordionTab, {
      key: supply.medical_supply_id,
      header: /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-between align-items-center w-100"
      }, /*#__PURE__*/React.createElement("span", null, "Solicitud #", supply.medical_supply_id), /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-2"
      }, /*#__PURE__*/React.createElement(Tag, {
        value: getStatusLabel(supply.status),
        severity: getStatusSeverity(supply.status)
      }), supply.delivery_date && /*#__PURE__*/React.createElement(Badge, {
        value: formatDate(supply.delivery_date)
      })))
    }, supply.observations && /*#__PURE__*/React.createElement("div", {
      className: "alert alert-warning mb-3"
    }, /*#__PURE__*/React.createElement("strong", null, "Observaciones:"), " ", supply.observations), /*#__PURE__*/React.createElement(DataTable, {
      value: supply.products,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "product_name",
      header: "Producto",
      body: productNameBodyTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "requested_quantity",
      header: "Solicitado"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "delivered_quantity",
      header: "Entregado"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "pending_quantity",
      header: "Pendiente"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "status",
      header: "Estado",
      body: rowData => /*#__PURE__*/React.createElement(Tag, {
        value: getStatusLabel(rowData.status),
        severity: getStatusSeverity(rowData.status)
      })
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Progreso",
      body: rowData => /*#__PURE__*/React.createElement(ProgressBar, {
        value: calculateProgress(rowData.delivered_quantity, rowData.requested_quantity),
        showValue: false,
        style: {
          height: '6px'
        }
      })
    })), /*#__PURE__*/React.createElement("h6", {
      className: "mt-3 mb-2"
    }, "Detalles de Entrega"), supply.products.map(product => /*#__PURE__*/React.createElement("div", {
      key: product.product_id,
      className: "mb-2"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, product.product_name, ":"), product.delivery_details.length > 0 ? /*#__PURE__*/React.createElement(DataTable, {
      value: product.delivery_details,
      size: "small",
      className: "mt-1"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "delivery_id",
      header: "ID Entrega"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "quantity",
      header: "Cantidad"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "deposit_id",
      header: "Dep\xF3sito"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "delivery_date",
      header: "Fecha",
      body: rowData => formatDate(rowData.delivery_date)
    })) : /*#__PURE__*/React.createElement("div", {
      className: "text-center p-2 text-muted"
    }, "No hay detalles de entrega")))))));
  };
  const ProceduresSection = ({
    procedures
  }) => {
    const suppliesConsumedBodyTemplate = rowData => {
      return /*#__PURE__*/React.createElement("div", null, rowData.supplies_consumed.map((supply, idx) => /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "mb-1"
      }, /*#__PURE__*/React.createElement(Badge, {
        value: `${supply.supply_name} (${supply.quantity})`,
        className: "me-1",
        severity: "info"
      }), /*#__PURE__*/React.createElement("small", {
        className: "text-muted"
      }, "Ref: ", supply.supply_reference))));
    };
    return /*#__PURE__*/React.createElement(Card, {
      className: "mb-3",
      title: "Procedimientos Completados"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: procedures,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "appointment_id",
      header: "ID Cita"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "appointment_date",
      header: "Fecha",
      body: rowData => formatDate(rowData.appointment_date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "product_name",
      header: "Procedimiento"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Insumos Consumidos",
      body: suppliesConsumedBodyTemplate
    })));
  };
  const UserDetailSection = ({
    user
  }) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "user-detail-section mb-4 p-3 border rounded"
    }, /*#__PURE__*/React.createElement(UserSummaryCard, {
      user: user
    }), /*#__PURE__*/React.createElement(ProductBalanceTable, {
      user: user
    }), /*#__PURE__*/React.createElement(MedicalSuppliesSection, {
      medicalSupplies: user.detailed_data.medical_supplies
    }));
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container mt-4"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Informe de Consumo de Insumos"
    }, [...Array(3)].map((_, index) => /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "mb-3"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "80px"
    })))));
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container mt-4"
    }, /*#__PURE__*/React.createElement(Card, {
      className: "border-danger"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger mb-0"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-exclamation-triangle me-2"
    }), error, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger ms-3",
      onClick: fetchReportData
    }, "Reintentar"))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "container mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("span", null, "Informe de Consumo de Insumos"), reportData && /*#__PURE__*/React.createElement(Badge, {
      value: `${reportData.summary.total_users} usuarios`
    })),
    subTitle: reportData && `Generado: ${formatDate(reportData.summary.generated_at)}`
  }, reportData ? /*#__PURE__*/React.createElement(Accordion, {
    multiple: true
  }, reportData.report.map(user => /*#__PURE__*/React.createElement(AccordionTab, {
    key: user.user_id,
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-100"
    }, /*#__PURE__*/React.createElement("span", null, user.user_name), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Tag, {
      value: user.user_specialty,
      severity: "info"
    }), /*#__PURE__*/React.createElement(Badge, {
      value: Object.keys(user.report_data.current_balance).length,
      severity: "success"
    })))
  }, /*#__PURE__*/React.createElement(UserDetailSection, {
    user: user
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "text-center p-4 text-muted"
  }, "No hay datos disponibles")));
};