function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { examTypeService, taxesService, retentionsService } from "../../../../services/api/index.js";
import { Dialog } from "primereact/dialog";
import { ExamConfigFormModal } from "../../../exams-config/components/ExamConfigFormModal.js";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import { useProductsByType } from "../../../products/hooks/useProductsByType.js";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
const PricesConfigForm = ({
  formId,
  onHandleSubmit,
  initialData,
  onCancel,
  entitiesData
}) => {
  const [showExamType, setShowExamType] = useState(false);
  const [showLabFields, setShowLabFields] = useState(true);
  const [showEntities, setShowEntities] = useState(false);
  const [showTax, setShowTax] = useState(false);
  const [entityRows, setEntityRows] = useState([]);
  const [currentEntity, setCurrentEntity] = useState({
    entity_id: '',
    entity_name: '',
    price: 0,
    tax_charge_id: '',
    tax_name: '',
    withholding_tax_id: '',
    retention_name: '',
    negotation_type: ''
  });
  const [examTypesData, setExamTypesData] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [retentions, setRetentions] = useState([]);

  // Estado para controlar la visibilidad del modal de exámenes
  const [showExamModal, setShowExamModal] = useState(false);
  const [supply, setSupply] = useState(null);
  const {
    accounts
  } = useAccountingAccounts();
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
      toggleImpuesto: false,
      toggleIA: false,
      toggleInsumos: false
    }
  });
  const {
    fields,
    append: addSupply,
    remove: removeSupply,
    update: updateSupply
  } = useFieldArray({
    control,
    name: "supplies"
  });
  const attentionType = watch("attention_type");
  const toggleEntities = watch("toggleEntities");
  const toggleImpuesto = watch("toggleImpuesto");
  const toggleIA = watch("toggleIA");
  const toggleInsumos = watch("toggleInsumos");
  const formSupplies = useWatch({
    control,
    name: "supplies"
  });
  const {
    productsByType: supplies,
    fetchProductsByType
  } = useProductsByType();
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
    loadTaxes();
    loadRetentions();
    fetchProductsByType("Insumos");
  }, []);
  useEffect(() => {
    if (initialData) {
      // Establecer product_id si existe para la actualización
      if (initialData.product_id) {
        setValue('product_id', initialData.product_id);
      }
      setValue('name', initialData.name);
      setValue('curp', initialData.curp);
      setValue('attention_type', initialData.attention_type);
      setValue('sale_price', initialData.sale_price);
      setValue('copago', initialData.copago);
      setValue('purchase_price', initialData.purchase_price);
      setValue('exam_type_id', initialData.exam_type_id || '');
      setValue('taxProduct_type', initialData.taxProduct_type || '');

      // Load entities if they exist
      if (initialData.entities && initialData.entities.length > 0) {
        setEntityRows([...initialData.entities]); // Crear nueva copia para forzar re-render
        setValue('toggleEntities', true);
        setShowEntities(true);
      } else {
        setEntityRows([]);
        setValue('toggleEntities', false);
        setShowEntities(false);
      }
      if (initialData.taxProduct_type && initialData.taxProduct_type !== '0') {
        setValue('toggleImpuesto', true);
        setShowTax(true);
      } else {
        setValue('toggleImpuesto', false);
        setShowTax(false);
      }
    } else {
      // Reset form cuando no hay initialData
      setEntityRows([]);
      setShowEntities(false);
      setShowTax(false);
      setValue('toggleEntities', false);
      setValue('toggleImpuesto', false);
    }
  }, [initialData, setValue]);
  const onSubmit = data => {
    const submitData = {
      ...data,
      entities: entityRows
    };
    if (data.attention_type === "LABORATORY") {
      submitData.sale_price = 0;
      submitData.copago = 0;
      submitData.purchase_price = 0;
    }
    onHandleSubmit(submitData);
  };
  const regimeOptions = [{
    label: "Subsidiado",
    value: "subsidiado"
  }, {
    label: "Contributivo",
    value: "contributivo"
  }, {
    label: "Pensionado",
    value: "pensionado"
  }, {
    label: "Privado",
    value: "privado"
  }];
  const handleExamSubmit = data => {
    handleCloseExamModal();
    loadExamTypes();
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "text-danger"
    }, errors[name]?.message);
  };
  async function loadExamTypes() {
    const exmaTypes = await examTypeService.getAll();
    setExamTypesData(exmaTypes);
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
    if (field === 'entity_id') {
      const selectedEntity = value ? entitiesData.find(e => e.id == value) : null;
      setCurrentEntity(prev => ({
        ...prev,
        entity_id: value,
        entity_name: selectedEntity ? selectedEntity.name : ''
      }));
    } else if (field === 'tax_charge_id') {
      const selectedTax = value ? taxes.find(t => t.id == value) : null;
      setCurrentEntity(prev => ({
        ...prev,
        tax_charge_id: value,
        tax_name: selectedTax ? selectedTax.name : ''
      }));
    } else if (field === 'withholding_tax_id') {
      const selectedRetention = value ? retentions.find(r => r.id == value) : null;
      setCurrentEntity(prev => ({
        ...prev,
        withholding_tax_id: value,
        retention_name: selectedRetention ? selectedRetention.name : ''
      }));
    } else {
      setCurrentEntity(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const addEntityRow = () => {
    if (currentEntity.entity_id && currentEntity.price > 0) {
      const newRow = {
        entity_id: currentEntity.entity_id,
        entity_name: currentEntity.entity_name,
        price: currentEntity.price,
        tax_charge_id: currentEntity.tax_charge_id || '',
        tax_name: currentEntity.tax_name || 'N/A',
        withholding_tax_id: currentEntity.withholding_tax_id || '',
        negotation_type: currentEntity.negotation_type || '',
        retention_name: currentEntity.retention_name || 'N/A'
      };
      setEntityRows([...entityRows, newRow]);

      // Reset current entity
      setCurrentEntity({
        entity_id: '',
        entity_name: '',
        price: 0,
        tax_charge_id: '',
        tax_name: '',
        withholding_tax_id: '',
        retention_name: '',
        negotation_type: ''
      });
    }
  };
  const removeEntityRow = rowIndex => {
    if (window.confirm('¿Estás seguro de eliminar esta entidad?')) {
      const newRows = [...entityRows];
      newRows.splice(rowIndex, 1);
      setEntityRows(newRows);
    }
  };

  // Función para abrir el modal de exámenes
  const handleOpenExamModal = () => {
    setShowExamModal(true);
  };

  // Función para cerrar el modal de exámenes
  const handleCloseExamModal = () => {
    setShowExamModal(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Datos de producto"), /*#__PURE__*/React.createElement("form", {
    className: "row g-3",
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "hidden"
  }, register("product_id"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Nombre del item"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Nombre del item"
    }, field)), getFormErrorMessage("name"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "curp",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Cups"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "C\xF3digo Cups"
    }, field)), getFormErrorMessage("curp"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "attention_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Tipo de atenci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: [{
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
      }],
      placeholder: "Seleccionar..."
    }), getFormErrorMessage("attention_type"))
  })), showExamType && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "exam_type_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1 me-2"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Examen"), /*#__PURE__*/React.createElement(Dropdown, {
      className: "w-100",
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: examTypesData.map(exam => ({
        label: exam.name,
        value: exam.id
      })),
      placeholder: "Seleccionar..."
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    }),
    className: "p-button-primary",
    onClick: handleOpenExamModal,
    tooltipOptions: {
      position: 'top'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "sale_price",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Precio p\xFAblico"), /*#__PURE__*/React.createElement(InputNumber, {
      className: "w-100",
      id: field.name,
      placeholder: "Precio p\xFAblico",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "COP",
      locale: "es-CO"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "copago",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Precio Copago"), /*#__PURE__*/React.createElement(InputNumber, {
      className: "w-100",
      id: field.name,
      placeholder: "Precio Copago",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "COP",
      locale: "es-CO"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "purchase_price",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Costo"), /*#__PURE__*/React.createElement(InputNumber, {
      className: "w-100",
      id: field.name,
      placeholder: "Costo",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "COP",
      locale: "es-CO"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "toggleEntities",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label d-block",
      htmlFor: "toggleEntities"
    }, "Agregar entidades"), /*#__PURE__*/React.createElement(InputSwitch, {
      inputId: "toggleEntities",
      checked: field.value || false,
      onChange: e => field.onChange(e.value)
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "toggleImpuesto",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label d-block",
      htmlFor: "toggleImpuesto"
    }, "Agregar Impuesto"), /*#__PURE__*/React.createElement(InputSwitch, {
      inputId: "toggleImpuesto",
      checked: field.value || false,
      onChange: e => {
        field.onChange(e.value);
        if (!e.value) {
          setValue('taxProduct_type', '0');
        }
      }
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "toggleInsumos",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label d-block",
      htmlFor: "toggleInsumos"
    }, "Agregar Insumos"), /*#__PURE__*/React.createElement(InputSwitch, {
      inputId: "toggleInsumos",
      checked: field.value || false,
      onChange: e => {
        field.onChange(e.value);
        if (!e.value) {
          setValue('taxProduct_type', '0');
        }
      }
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3",
    style: {
      display: showLabFields ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "toggleIA",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label d-block",
      htmlFor: "toggleIA"
    }, "Puede agendar con IA"), /*#__PURE__*/React.createElement(InputSwitch, {
      inputId: "toggleIA",
      checked: field.value || false,
      onChange: e => {
        field.onChange(e.value);
        if (!e.value) {
          setValue('taxProduct_type', '0');
        }
      }
    }))
  })), toggleInsumos && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "supply"
  }, "Insumo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "supply",
    placeholder: "Seleccionar insumo",
    className: "w-100",
    showClear: true,
    filter: true,
    optionLabel: "name",
    value: supply,
    options: supplies,
    onChange: e => setSupply(e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    }),
    onClick: () => {
      if (supply) {
        addSupply({
          id: supply.id,
          name: supply.name,
          quantity: 1
        });
        setSupply(null);
      }
    },
    className: "btn btn-primary",
    type: "button"
  })), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: [{
      field: 'name',
      header: 'Nombre'
    }, {
      field: 'quantity',
      header: 'Cantidad',
      body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
        value: data.quantity,
        onChange: e => {
          updateSupply(formSupplies.indexOf(data), {
            ...data,
            quantity: e.value
          });
        },
        className: "w-100",
        inputClassName: "w-100",
        useGrouping: false,
        placeholder: "Cantidad"
      }))
    }, {
      field: 'accounting_account_debit_id',
      header: 'Cuenta contable debita',
      body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
        value: data.accounting_account_debit_id,
        options: accounts,
        onChange: e => {
          updateSupply(formSupplies.indexOf(data), {
            ...data,
            accounting_account_debit_id: e.value
          });
        },
        optionLabel: "account_name",
        optionValue: "id",
        placeholder: "Cuenta contable debita",
        appendTo: document.body,
        filter: true,
        showClear: true
      }))
    }, {
      field: 'accounting_account_credit_id',
      header: 'Cuenta contable acredita',
      body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
        value: data.accounting_account_credit_id,
        options: accounts,
        onChange: e => {
          updateSupply(formSupplies.indexOf(data), {
            ...data,
            accounting_account_credit_id: e.value
          });
        },
        optionLabel: "account_name",
        optionValue: "id",
        placeholder: "Cuenta contable acredita",
        appendTo: document.body,
        filter: true,
        showClear: true
      }))
    }, {
      field: 'actions',
      header: 'Acciones',
      body: data => /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center align-items-center"
      }, /*#__PURE__*/React.createElement(Button, {
        type: "button",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-trash"
        }),
        onClick: () => removeSupply(formSupplies.indexOf(data)),
        className: "p-button-danger p-button-text"
      }))
    }],
    data: formSupplies,
    disablePaginator: true,
    disableReload: true,
    disableSearch: true
  }))), showTax && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "taxProduct_type",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Tipo de impuesto"), /*#__PURE__*/React.createElement(Dropdown, {
      className: "w-100",
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: taxes.map(tax => ({
        label: tax.name,
        value: tax.id
      })),
      placeholder: "Seleccionar..."
    }))
  })), showEntities && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-3 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    className: "w-100",
    value: currentEntity.entity_id,
    onChange: e => handleEntityChange("entity_id", e.value),
    options: entitiesData.map(entity => ({
      label: entity.name,
      value: entity.id
    })),
    placeholder: "Seleccionar..."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Precio"), /*#__PURE__*/React.createElement(InputNumber, {
    className: "w-100",
    placeholder: "Precio",
    value: currentEntity.price,
    onValueChange: e => handleEntityChange("price", e.value || 0),
    mode: "currency",
    currency: "COP",
    locale: "es-CO"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de impuesto"), /*#__PURE__*/React.createElement(Dropdown, {
    className: "w-100",
    value: currentEntity.tax_charge_id,
    onChange: e => handleEntityChange("tax_charge_id", e.value),
    options: taxes.map(tax => ({
      label: tax.name,
      value: tax.id
    })),
    placeholder: "Seleccionar..."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de retenci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
    className: "w-100",
    value: currentEntity.withholding_tax_id,
    onChange: e => handleEntityChange("withholding_tax_id", e.value),
    options: retentions.map(retention => ({
      label: retention.name,
      value: retention.id
    })),
    placeholder: "Seleccionar..."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de negociaci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
    className: "w-100",
    value: currentEntity.negotation_type,
    onChange: e => handleEntityChange("negotation_type", e.value),
    options: regimeOptions,
    placeholder: "Seleccionar..."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "button",
    onClick: addEntityRow
  }, "Agregar")))), entityRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card p-3 mt-3"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-striped"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Entidad"), /*#__PURE__*/React.createElement("th", null, "Precio"), /*#__PURE__*/React.createElement("th", null, "Tipo Impuesto"), /*#__PURE__*/React.createElement("th", null, "Tipo Retenci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Tipo negociaci\xF3n"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, entityRows.map((row, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, row.entity_name), /*#__PURE__*/React.createElement("td", null, row.price), /*#__PURE__*/React.createElement("td", null, row.tax_name || 'N/A'), /*#__PURE__*/React.createElement("td", null, row.retention_name || 'N/A'), /*#__PURE__*/React.createElement("td", null, row.negotation_type || 'N/A'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger btn-sm",
    onClick: () => removeEntityRow(index)
  }, "Eliminar")))))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary me-2",
    type: "submit"
  }, "Guardar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    type: "button",
    onClick: onCancel
  }, "Cancelar"))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Ex\xE1menes",
    visible: showExamModal,
    style: {
      width: "90vw",
      maxWidth: "1000px",
      height: "80vh"
    },
    onHide: handleCloseExamModal,
    modal: true
  }, /*#__PURE__*/React.createElement(ExamConfigFormModal, {
    show: showExamModal,
    handleSubmit: handleExamSubmit,
    onHide: handleCloseExamModal,
    title: "Crear Examen"
  }))));
};
export default PricesConfigForm;