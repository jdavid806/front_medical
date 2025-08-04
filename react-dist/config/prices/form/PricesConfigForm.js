function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { examTypeService, entitiesService, taxesService, retentionsService } from "../../../../services/api/index.js";
const PricesConfigForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const [showExamType, setShowExamType] = useState(false);
  const [showLabFields, setShowLabFields] = useState(false);
  const [showEntities, setShowEntities] = useState(false);
  const [showTax, setShowTax] = useState(false);
  const [entityRows, setEntityRows] = useState([]);
  const [currentEntity, setCurrentEntity] = useState({
    entity_id: {
      id: 0
    },
    entity_name: {
      name: ""
    },
    price: null,
    tax_name: {
      name: ""
    },
    tax_id: {
      id: 0
    },
    retention_name: {
      name: ""
    },
    retention_id: {
      id: 0
    }
  });
  const [examTypesData, setExamTypesData] = useState([]);
  const [entitiesData, setEntitiesData] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [retentions, setRetentions] = useState([]);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    watch,
    setValue,
    register
  } = useForm({
    defaultValues: initialData || {
      name: "",
      curp: "",
      attention_type: "",
      exam_type_id: "",
      sale_price: 0,
      copago: 0,
      purchase_price: 0,
      taxProduct_type: "",
      toggleEntities: false,
      toggleImpuesto: false
    }
  });
  const attentionType = watch("attention_type");
  const toggleEntities = watch("toggleEntities");
  const toggleImpuesto = watch("toggleImpuesto");
  useEffect(() => {
    if (attentionType === "PROCEDURE") {
      setShowExamType(true);
    } else {
      setShowExamType(false);
      setValue("exam_type_id", "");
    }
    if (attentionType === "LABORATORY") {
      setShowLabFields(false);
    } else {
      setShowLabFields(true);
    }
  }, [attentionType, setValue]);
  useEffect(() => {
    setShowEntities(toggleEntities || false);
  }, [toggleEntities]);
  useEffect(() => {
    setShowTax(toggleImpuesto || false);
  }, [toggleImpuesto]);
  useEffect(() => {
    loadExamTypes();
    loadEntities();
    loadTaxes();
    loadRetentions();
  }, []);
  const onSubmit = data => {
    console.log("data: ", data);
    console.log("entityRows: ", entityRows);
    const submitData = {
      ...data,
      entities: entityRows
    };
    if (data.attention_type === "LABORATORY") {
      submitData.sale_price = 0;
      submitData.copago = 0;
    }

    // onHandleSubmit(submitData);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  const attentionTypes = [{
    label: "Seleccionar...",
    value: ""
  }, {
    label: "Procedimiento",
    value: "PROCEDURE"
  }, {
    label: "Consulta",
    value: "CONSULTATION"
  }, {
    label: "Laboratorio",
    value: "LABORATORY"
  }, {
    label: "Rehabilitación",
    value: "REHABILITATION"
  }, {
    label: "Optometría",
    value: "OPTOMETRY"
  }];
  async function loadExamTypes() {
    const exmaTypes = await examTypeService.getAll();
    setExamTypesData(exmaTypes);
  }
  async function loadEntities() {
    const entities = await entitiesService.getEntities();
    setEntitiesData(entities.data);
  }
  async function loadTaxes() {
    const taxes = await taxesService.getTaxes();
    setTaxes(taxes.data);
  }
  async function loadRetentions() {
    const retentions = await retentionsService.getRetentions();
    setRetentions(retentions.data);
  }
  const handleEntityChange = (field, value) => {
    setCurrentEntity(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const addEntityRow = () => {
    if (currentEntity.entity_id && currentEntity.price !== null) {
      console.log("currentEntity: ", currentEntity);
      // const newRow: any = {
      //   entity_id: currentEntity.entity_id.id,
      //   price: currentEntity.price,
      //   tax_type: currentEntity?.tax_type?.name || undefined,
      //   retention_type: currentEntity.retention_type?.name || undefined,
      // };

      // setEntityRows([...entityRows, newRow]);

      // // Reset current entity
      // setCurrentEntity({
      //   entity_id: { name: "" },
      //   price: null,
      //   tax_type: { name: "" },
      //   retention_type: { name: "" },
      // });
    }
  };
  const confirmDelete = rowIndex => {
    confirmDialog({
      message: "¿Estás seguro de eliminar esta entidad?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => {
        const newRows = [...entityRows];
        newRows.splice(rowIndex, 1);
        setEntityRows(newRows);
      }
    });
  };
  const actionBodyTemplate = (rowData, {
    rowIndex
  }) => {
    return /*#__PURE__*/React.createElement(Button, {
      type: "button",
      className: "p-button-danger p-button-sm",
      onClick: e => {
        e.preventDefault, confirmDelete(rowIndex);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }));
  };
  const priceBodyTemplate = rowData => {
    return `$${rowData.price.toFixed(2)}`;
  };
  const entityBodyTemplate = rowData => {
    return entitiesData.find(e => e.value === rowData.entity_id)?.label || rowData.entity_id;
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Datos de producto"), /*#__PURE__*/React.createElement("input", _extends({
    type: "hidden"
  }, register("product_id"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre del item *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      placeholder: "Nombre del item"
    }, field)), getFormErrorMessage("name"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "curp",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "C\xF3digo Cups *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      placeholder: "C\xF3digo Cups"
    }, field)), getFormErrorMessage("curp"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "attention_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de atenci\xF3n *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: attentionTypes,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      placeholder: "Seleccionar..."
    }, field)), getFormErrorMessage("attention_type"))
  })), showExamType && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "exam_type_id",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Examen"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: examTypesData,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      optionLabel: "name",
      placeholder: "Seleccionar...",
      filter: true,
      appendTo: "self"
    }, field)))
  })), showLabFields && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "sale_price",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Precio p\xFAblico"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      mode: "currency",
      currency: "USD",
      locale: "en-US",
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      placeholder: "Precio p\xFAblico"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "copago",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Precio Copago"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      mode: "currency",
      currency: "USD",
      locale: "en-US",
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      placeholder: "Precio Copago"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "purchase_price",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Costo"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      mode: "currency",
      currency: "USD",
      locale: "en-US",
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      placeholder: "Costo"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "toggleEntities",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "form-check form-switch"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      className: "form-check-input",
      id: "toggleEntities",
      checked: field.value || false,
      onChange: e => field.onChange(e.target.checked)
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-check-label",
      htmlFor: "toggleEntities"
    }, "Agregar entidades"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "toggleImpuesto",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "form-check form-switch"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      className: "form-check-input",
      id: "toggleImpuesto",
      checked: field.value || false,
      onChange: e => field.onChange(e.target.checked)
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-check-label",
      htmlFor: "toggleImpuesto"
    }, "Agregar Impuesto"))
  })))), showTax && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "taxProduct_type",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de impuesto"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: taxes,
      optionLabel: "name",
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      placeholder: "Seleccionar..."
    }, field, {
      filter: true,
      appendTo: "self"
    })))
  })), showEntities && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-3 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    options: entitiesData,
    placeholder: "Seleccionar...",
    className: "w-100",
    optionLabel: "name",
    value: currentEntity.entity_id,
    onChange: e => handleEntityChange("entity_id", e.value),
    filter: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Precio"), /*#__PURE__*/React.createElement(InputNumber, {
    mode: "currency",
    currency: "USD",
    locale: "en-US",
    placeholder: "Precio",
    className: "w-100",
    value: currentEntity.price,
    onValueChange: e => handleEntityChange("price", e.value ?? 0)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de impuesto"), /*#__PURE__*/React.createElement(Dropdown, {
    options: taxes,
    placeholder: "Seleccionar...",
    className: "w-100",
    optionLabel: "name",
    value: currentEntity.tax_id,
    onChange: e => handleEntityChange("tax_id", e.value),
    filter: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de retenci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
    options: retentions,
    placeholder: "Seleccionar...",
    className: "w-100",
    optionLabel: "name",
    value: currentEntity.retention_id,
    onChange: e => handleEntityChange("retention_id", e.value),
    filter: true,
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Agregar",
    icon: "pi pi-plus",
    onClick: addEntityRow
  })))), entityRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card p-3 mt-3"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: entityRows,
    stripedRows: true,
    showGridlines: true,
    responsiveLayout: "scroll",
    className: "p-datatable-sm",
    emptyMessage: "No hay entidades agregadas"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "entity_id",
    header: "Entidad",
    body: entityBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio",
    body: priceBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tax_type",
    header: "Tipo Impuesto",
    body: rowData => rowData.tax_type || "-",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "retention_type",
    header: "Tipo Retenci\xF3n",
    body: rowData => rowData.retention_type || "-",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      width: "100px"
    }
  }))), /*#__PURE__*/React.createElement(ConfirmDialog, null)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Cancelar",
    className: "p-button-outlined"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    icon: "pi pi-save"
  })))));
};
export default PricesConfigForm;