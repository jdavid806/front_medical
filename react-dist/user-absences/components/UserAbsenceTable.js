import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { formatDateDMY } from "../../../services/utilidades.js";
export const UserAbsenceTable = ({
  items,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [tableItems, setTableItems] = useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filtros, setFiltros] = useState({
    doctorName: "",
    reason: "",
    selectedDates: null // Array de fechas seleccionadas
  });
  const toast = useRef(null);

  // Función para convertir string a Date
  const parseDate = dateString => {
    if (!dateString) return new Date();
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(dateString);
  };
  useEffect(() => {
    const mappedItems = items.map(item => {
      const startDateStr = formatDateDMY(item.start_date);
      const endDateStr = formatDateDMY(item.end_date);
      return {
        id: item.id,
        doctorName: `${item.user.first_name} ${item.user.middle_name} ${item.user.last_name} ${item.user.second_last_name}`.trim(),
        reason: item.reason,
        startDate: startDateStr,
        endDate: endDateStr,
        startDateObj: parseDate(startDateStr),
        endDateObj: parseDate(endDateStr)
      };
    });
    setTableItems(mappedItems);
  }, [items]);

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...tableItems];
    if (filtros.selectedDates && filtros.selectedDates.length > 0) {
      result = result.filter(item => {
        const itemStartDate = item.startDateObj;
        const itemEndDate = item.endDateObj;
        return filtros.selectedDates.some(selectedDate => {
          const normalizedSelected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
          const normalizedStart = new Date(itemStartDate.getFullYear(), itemStartDate.getMonth(), itemStartDate.getDate());
          const normalizedEnd = new Date(itemEndDate.getFullYear(), itemEndDate.getMonth(), itemEndDate.getDate());
          return normalizedSelected >= normalizedStart && normalizedSelected <= normalizedEnd;
        });
      });
    }
    setFilteredItems(result);
  };
  useEffect(() => {
    syncFilteredData();
  }, [tableItems, filtros]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearchChange = searchValue => {
    console.log("Search value:", searchValue);
  };
  const limpiarFiltros = () => {
    setFiltros({
      doctorName: "",
      reason: "",
      selectedDates: null
    });
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    if (onReload) {
      await onReload();
    }
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const confirmDelete = absence => {
    setAbsenceToDelete(absence);
    setDeleteDialogVisible(true);
  };
  const deleteAbsence = async () => {
    if (absenceToDelete && onDeleteItem) {
      await onDeleteItem(absenceToDelete.id);
      showToast("success", "Éxito", `Ausencia eliminada correctamente`);

      // Refrescar después de eliminar
      if (onReload) {
        await onReload();
      }
    }
    setDeleteDialogVisible(false);
    setAbsenceToDelete(null);
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: deleteAbsence
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando ausencia con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar ausencia con ID:", rowData.id);
      onDelete(rowData);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "btn-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: [{
        label: "Editar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-edit me-2"
        }),
        command: handleEdit
      }, {
        label: "Eliminar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-trash me-2"
        }),
        command: handleDelete
      }],
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData,
      onEdit: onEditItem,
      onDelete: confirmDelete
    }));
  };
  const formatSelectedDates = () => {
    if (!filtros.selectedDates || filtros.selectedDates.length === 0) {
      return "Seleccione fechas";
    }
    return `${filtros.selectedDates.length} fecha(s) seleccionada(s)`;
  };
  const finalTableItems = filteredItems.map(item => ({
    id: item.id,
    startDate: item.startDate,
    endDate: item.endDate,
    doctorName: item.doctorName,
    reason: item.reason,
    actions: item
  }));
  const columns = [{
    field: 'startDate',
    header: 'Fecha Inicial',
    sortable: true
  }, {
    field: 'endDate',
    header: 'Fecha Final',
    sortable: true
  }, {
    field: 'doctorName',
    header: 'Usuario',
    sortable: true
  }, {
    field: 'reason',
    header: 'Motivo',
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement("span", {
      title: rowData.reason
    }, rowData.reason && rowData.reason.length > 50 ? `${rowData.reason.substring(0, 50)}...` : rowData.reason)
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false,
    width: "20px"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#F8BB86"
    }
  }), absenceToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar la ausencia de ", /*#__PURE__*/React.createElement("b", null, absenceToDelete.doctorName), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fechas de Ausencia"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.selectedDates,
    onChange: e => handleFilterChange("selectedDates", e.value),
    selectionMode: "multiple",
    readOnlyInput: true,
    placeholder: "Seleccione fechas",
    className: "w-100",
    showIcon: true,
    dateFormat: "dd/mm/yy",
    showButtonBar: true
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, formatSelectedDates()))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: finalTableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};