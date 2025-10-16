import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../components/CustomPRTable.js";
export const UserAvailabilityTable = ({
  availabilities,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [filtros, setFiltros] = useState({
    doctorName: "",
    appointmentType: "",
    daysOfWeek: "",
    branchName: ""
  });
  const toast = useRef(null);

  // Opciones para días de la semana
  const daysOfWeekOptions = [{
    label: "Todos",
    value: ""
  }, {
    label: "Lunes",
    value: "Lunes"
  }, {
    label: "Martes",
    value: "Martes"
  }, {
    label: "Miércoles",
    value: "Miércoles"
  }, {
    label: "Jueves",
    value: "Jueves"
  }, {
    label: "Viernes",
    value: "Viernes"
  }, {
    label: "Sábado",
    value: "Sábado"
  }, {
    label: "Domingo",
    value: "Domingo"
  }];

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...availabilities];

    // Filtro por nombre de doctor
    if (filtros.doctorName) {
      result = result.filter(availability => availability.doctorName.toLowerCase().includes(filtros.doctorName.toLowerCase()));
    }

    // Filtro por tipo de cita
    if (filtros.appointmentType) {
      result = result.filter(availability => availability.appointmentType.toLowerCase().includes(filtros.appointmentType.toLowerCase()));
    }

    // Filtro por día de la semana
    if (filtros.daysOfWeek) {
      result = result.filter(availability => availability.daysOfWeek.toLowerCase().includes(filtros.daysOfWeek.toLowerCase()));
    }

    // Filtro por sucursal
    if (filtros.branchName) {
      result = result.filter(availability => availability.branchName.toLowerCase().includes(filtros.branchName.toLowerCase()));
    }
    setFilteredAvailabilities(result);
  };

  // Sincroniza cuando cambian las availabilities o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [availabilities, filtros]);
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
      appointmentType: "",
      daysOfWeek: "",
      branchName: ""
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
  const confirmDelete = availability => {
    setAvailabilityToDelete(availability);
    setDeleteDialogVisible(true);
  };
  const deleteAvailability = async () => {
    if (availabilityToDelete && onDeleteItem) {
      await onDeleteItem(availabilityToDelete.id);
      showToast("success", "Éxito", `Disponibilidad eliminada correctamente`);

      // Refrescar después de eliminar
      if (onReload) {
        await onReload();
      }
    }
    setDeleteDialogVisible(false);
    setAvailabilityToDelete(null);
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
    onClick: deleteAvailability
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando disponibilidad con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar disponibilidad con ID:", rowData.id);
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
      onEdit: onEditItem ? onEditItem : () => {},
      onDelete: confirmDelete
    }));
  };

  // Función para formatear la hora
  const formatTime = time => {
    if (!time) return "N/A";
    return time;
  };

  // Mapear los datos para la tabla
  const tableItems = filteredAvailabilities.map(availability => ({
    id: availability.id,
    doctorName: availability.doctorName,
    appointmentType: availability.appointmentType,
    daysOfWeek: availability.daysOfWeek,
    startTime: formatTime(availability.startTime),
    endTime: formatTime(availability.endTime),
    branchName: availability.branchName,
    actions: availability
  }));
  const columns = [{
    field: 'doctorName',
    header: 'Usuario',
    sortable: true
  }, {
    field: 'appointmentType',
    header: 'Tipo de Cita',
    sortable: true
  }, {
    field: 'daysOfWeek',
    header: 'Día de la Semana',
    sortable: true
  }, {
    field: 'startTime',
    header: 'Hora de Inicio',
    sortable: true
  }, {
    field: 'endTime',
    header: 'Hora de Fin',
    sortable: true
  }, {
    field: 'branchName',
    header: 'Sucursal',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false
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
  }), availabilityToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar la disponibilidad de ", /*#__PURE__*/React.createElement("b", null, availabilityToDelete.doctorName), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "D\xEDa de la Semana"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.daysOfWeek,
    options: daysOfWeekOptions,
    onChange: e => handleFilterChange("daysOfWeek", e.value),
    optionLabel: "label",
    placeholder: "Seleccione d\xEDa",
    className: "w-100",
    showClear: true
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};