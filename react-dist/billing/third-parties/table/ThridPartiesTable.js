import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { useThirdParties } from "../hooks/useThirdParties.js";
import { ThirdPartyModal } from "../modals/ThridPartiesModal.js";
import { useThirdPartyCreate } from "../hooks/useThirdPartyCreate.js";
import { useThirdPartyUpdate } from "../hooks/useThirdPartyUpdate.js";
import { useThirdPartyDelete } from "../hooks/useThirdPartyDelete.js";
export const ThridPartiesTable = () => {
  // Usamos el hook para obtener los datos
  const {
    thirdParties,
    fetchThirdParties,
    loading
  } = useThirdParties();
  const {
    createThirdParty
  } = useThirdPartyCreate();
  const {
    updateThirdParty
  } = useThirdPartyUpdate();
  const {
    deleteThirdParty
  } = useThirdPartyDelete();
  const [error, setError] = useState(null);

  // Estado para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    tipoTercero: null,
    documento: null,
    nombre: null,
    fechaDesde: null,
    fechaHasta: null
  });

  // Opciones para los selects
  const tiposTercero = [{
    label: 'Cliente',
    value: 'client'
  }, {
    label: 'Proveedor',
    value: 'provider'
  }, {
    label: 'Entidad',
    value: 'entity'
  }];

  // Función para manejar la creación
  const handleSaveTercero = async formData => {
    try {
      if (selectedTercero) {
        await updateThirdParty(selectedTercero.id.toString(), {
          name: formData.contact.name,
          type: formData.type,
          document_type: formData.contact.document_type,
          document_number: formData.contact.document_number,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          first_name: formData.contact.first_name,
          middle_name: formData.contact.middle_name,
          last_name: formData.contact.last_name,
          second_last_name: formData.contact.second_last_name,
          date_of_birth: formData.contact.date_of_birth
        });
      } else {
        const res = await createThirdParty({
          name: formData.contact.name,
          type: formData.type,
          document_type: formData.contact.document_type,
          document_number: formData.contact.document_number,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          first_name: formData.contact.first_name,
          middle_name: formData.contact.middle_name,
          last_name: formData.contact.last_name,
          second_last_name: formData.contact.second_last_name,
          date_of_birth: formData.contact.date_of_birth
        });
      }
      fetchThirdParties();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Función para manejar la edición de un tercero
  const handleEditTercero = tercero => {
    setInitialData({
      type: tercero?.type || '',
      contact: {
        name: tercero?.name || '',
        document_type: tercero?.document_type || '',
        document_number: tercero?.document_number || '',
        email: tercero?.email || '',
        phone: tercero?.phone || '',
        address: tercero?.address || '',
        first_name: tercero?.first_name || '',
        middle_name: tercero?.middle_name || '',
        last_name: tercero?.last_name || '',
        second_last_name: tercero?.second_last_name || '',
        date_of_birth: tercero?.date_of_birth || ''
      }
    });
    setSelectedTercero(tercero);
    setModalVisible(true);
  };
  const handleDeleteTercero = async tercero => {
    const confirmed = await deleteThirdParty(tercero.id.toString());
    if (confirmed) fetchThirdParties();
  };

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para aplicar filtros
  const aplicarFiltros = async () => {
    try {
      // Aquí deberías implementar la lógica para filtrar
      // Puedes pasar los filtros al hook si acepta parámetros
      // Por ahora solo manejamos el estado de error
      setError(null);
    } catch (err) {
      setError('Ocurrió un error al aplicar los filtros');
    }
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      tipoTercero: null,
      documento: null,
      nombre: null,
      fechaDesde: null,
      fechaHasta: null
    });
    setError(null);
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-row gap-2",
      style: {
        display: 'flex',
        flexDirection: 'row'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm",
      tooltip: "Editar",
      tooltipOptions: {
        position: 'top'
      },
      onClick: e => {
        e.stopPropagation();
        handleEditTercero(rowData);
      }
    }, " ", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      tooltip: "Eliminar",
      tooltipOptions: {
        position: 'top'
      },
      onClick: e => {
        e.stopPropagation();
        handleDeleteTercero(rowData);
      }
    }, " ", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })));
  };

  // Mostrar tipo de tercero con tag de color
  const tipoTerceroTemplate = rowData => {
    const tipoMap = {
      client: {
        severity: 'success',
        label: 'Cliente'
      },
      provider: {
        severity: 'info',
        label: 'Proveedor'
      },
      entity: {
        severity: 'primary',
        label: 'Entidad'
      }
    };
    const {
      severity = 'secondary',
      label = rowData.type
    } = tipoMap[rowData.type] || {};
    return /*#__PURE__*/React.createElement(Tag, {
      value: label,
      severity: severity
    });
  };

  // Estilos
  const styles = {
    card: {
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333'
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      fontWeight: 600
    },
    tableCell: {
      padding: '0.75rem 1rem'
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: '0.5rem',
      display: 'block'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: '100%',
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement(ThirdPartyModal, {
    visible: modalVisible,
    onHide: () => {
      setModalVisible(false);
      setSelectedTercero(null);
    },
    onSubmit: handleSaveTercero,
    onEdit: handleSaveTercero,
    initialData: initialData,
    loading: false,
    error: null
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Crear Nuevo Tercero",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => {
      setInitialData(null);
      setModalVisible(true);
    }
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de tercero"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoTercero,
    options: tiposTercero,
    onChange: e => handleFilterChange('tipoTercero', e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.nombre || '',
    onChange: e => handleFilterChange('nombre', e.target.value),
    placeholder: "Buscar por nombre...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 "
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaDesde,
    onChange: e => handleFilterChange('fechaDesde', e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione fecha",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Listado de Terceros",
    style: styles.card
  }, error ? /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger"
  }, error) : /*#__PURE__*/React.createElement(DataTable, {
    value: thirdParties || [],
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron terceros",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: '50rem'
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "type",
    header: "Tipo",
    sortable: true,
    body: tipoTerceroTemplate,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Documento",
    body: rowData => `${rowData.document_number}`,
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Nombre Completo",
    body: rowData => rowData.name,
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Email",
    body: rowData => rowData.email,
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Tel\xE9fono",
    body: rowData => rowData.phone,
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Direcci\xF3n",
    body: rowData => rowData.address,
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      ...styles.tableCell,
      width: '120px',
      textAlign: 'center'
    }
  }))));
};