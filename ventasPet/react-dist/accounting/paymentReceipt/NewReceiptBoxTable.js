/** @jsx React.createElement */
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useCashRecipes } from "./hooks/useCashRecipes";

export const NewReceiptBoxTable = () => {
  // Usar el hook para obtener los datos del backend
  const { recipes, isLoading, error, isEmpty } = useCashRecipes();
  
  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroRecibo: "",
    tipoRecibo: null,
    cliente: "",
    identificacion: "",
    origenDinero: null,
    centroCosto: null,
    fechaInicio: null,
    fechaFin: null,
    valorMinimo: null,
    valorMaximo: null,
    estado: null
  });

  // Opciones para los dropdowns
  const tiposRecibo = [
    { label: "Ingreso", value: "ingreso" },
    { label: "Egreso", value: "egreso" },
    { label: "Reembolso", value: "reembolso" }
  ];

  // Mapear los datos del backend al formato esperado por la tabla
  const mappedRecipes = recipes.map(receipt => ({
    id: receipt.id,
    numeroRecibo: `RC-${receipt.id.toString().padStart(4, '0')}`,
    tipoRecibo: receipt.type,
    cliente: receipt.details[0]?.product_id || 'N/A',
    identificacion: receipt.user_id,
    origenDinero: receipt.payments[0]?.payment_method_id === 1 ? 'Efectivo' : 'Transferencia',
    fechaElaboracion: receipt.created_at,
    valor: parseFloat(receipt.total_amount),
    estado: receipt.status,
    numeroFactura: receipt.details[0]?.id || 'N/A',
    observaciones: receipt.observations
  }));

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = value => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Estilo para los tags de estado
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "pagado":
      case "aprobado":
        return "success";
      case "pendiente":
        return "warning";
      case "rechazado":
      case "anulado":
        return "danger";
      default:
        return null;
    }
  };

  // Estilo para los tags de tipo de recibo
  const getTipoSeverity = tipo => {
    switch (tipo) {
      case "ingreso":
        return "success";
      case "egreso":
        return "danger";
      case "reembolso":
        return "info";
      default:
        return null;
    }
  };

  // Estilos integrados
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600
    },
    tableCell: {
      padding: "0.75rem 1rem"
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block"
    }
  };

  return React.createElement(
    "div",
    {
      className: "container-fluid mt-4",
      style: { width: "100%", padding: "0 15px" }
    },
    React.createElement(
      Card,
      {
        title: "Filtros de Búsqueda",
        style: styles.card
      },
      React.createElement(
        "div",
        { className: "row g-3" },
        React.createElement(
          "div",
          { className: "col-md-6 col-lg-3" },
          React.createElement(
            "label",
            { style: styles.formLabel },
            "Tipo de Recibo"
          ),
          React.createElement(Dropdown, {
            value: filtros.tipoRecibo,
            options: tiposRecibo,
            onChange: function(e) { return handleFilterChange("tipoRecibo", e.value); },
            optionLabel: "label",
            placeholder: "Seleccione tipo",
            className: "w-100"
          })
        ),
        React.createElement(
          "div",
          { className: "col-md-6 col-lg-3" },
          React.createElement(
            "label",
            { style: styles.formLabel },
            "Fecha desde"
          ),
          React.createElement(Calendar, {
            value: filtros.fechaInicio,
            onChange: function(e) { return handleFilterChange("fechaInicio", e.value); },
            dateFormat: "dd/mm/yy",
            placeholder: "dd/mm/aaaa",
            className: "w-100",
            showIcon: true
          })
        ),
        React.createElement(
          "div",
          { className: "col-md-6 col-lg-3" },
          React.createElement(
            "label",
            { style: styles.formLabel },
            "Fecha hasta"
          ),
          React.createElement(Calendar, {
            value: filtros.fechaFin,
            onChange: function(e) { return handleFilterChange("fechaFin", e.value); },
            dateFormat: "dd/mm/yy",
            placeholder: "dd/mm/aaaa",
            className: "w-100",
            showIcon: true
          })
        )
      )
    ),
    React.createElement(
      Card,
      {
        title: "Recibos de Caja",
        style: styles.card
      },
      error && React.createElement(
        "div",
        { className: "alert alert-danger" },
        error
      ),
      isEmpty && !isLoading && React.createElement(
        "div",
        null,
        "No se encontraron recibos"
      ),
      React.createElement(DataTable, {
        value: mappedRecipes,
        paginator: true,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25, 50],
        loading: isLoading,
        className: "p-datatable-striped p-datatable-gridlines",
        emptyMessage: "No se encontraron recibos",
        responsiveLayout: "scroll",
        tableStyle: { minWidth: "50rem" }
      },
        React.createElement(Column, {
          field: "numeroRecibo",
          header: "No. Recibo",
          sortable: true,
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "tipoRecibo",
          header: "Tipo",
          sortable: true,
          body: function(rowData) {
            return React.createElement(Tag, {
              value: rowData.tipoRecibo,
              severity: getTipoSeverity(rowData.tipoRecibo)
            });
          },
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "cliente",
          header: "Cliente/Producto",
          sortable: true,
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "identificacion",
          header: "Usuario ID",
          sortable: true,
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "numeroFactura",
          header: "Detalle ID",
          sortable: true,
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "origenDinero",
          header: "Método Pago",
          sortable: true,
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "fechaElaboracion",
          header: "Fecha",
          sortable: true,
          body: function(rowData) { return formatDate(rowData.fechaElaboracion); },
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "valor",
          header: "Valor",
          sortable: true,
          body: function(rowData) { return formatCurrency(rowData.valor); },
          style: styles.tableCell
        }),
        React.createElement(Column, {
          field: "estado",
          header: "Estado",
          sortable: true,
          body: function(rowData) {
            return React.createElement(Tag, {
              value: rowData.estado,
              severity: getEstadoSeverity(rowData.estado)
            });
          },
          style: styles.tableCell
        })
      )
    )
  );
};