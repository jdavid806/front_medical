import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useProductsByType } from "../../products/hooks/useProductsByType.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
export const SuppliesDeliveryForm = props => {
  const {
    formId,
    onSubmit
  } = props;
  const {
    control,
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      supply: null,
      supplies: [],
      observations: ""
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
  const supply = useWatch({
    control,
    name: "supply"
  });
  const formSupplies = useWatch({
    control,
    name: "supplies"
  });
  const {
    productsByType: supplies,
    fetchProductsByType
  } = useProductsByType();
  const getFormData = formValues => {
    return {
      products: formValues.supplies.map(supply => ({
        product_id: supply.id,
        quantity: supply.quantity
      })),
      status: "pendiente",
      delivery_date: null,
      observations: formValues.observations
    };
  };
  const onSubmitForm = data => {
    onSubmit(getFormData(data));
  };
  useEffect(() => {
    fetchProductsByType("Insumos");
  }, []);
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmitForm)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "supply",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "supply"
    }, "Insumo"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "supply",
      placeholder: "Seleccionar insumo",
      className: "w-100",
      showClear: true,
      filter: true,
      optionLabel: "name",
      value: field.value,
      options: supplies,
      onChange: e => field.onChange(e.value)
    }))
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
        setValue("supply", null);
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
      field: 'actions',
      header: 'Acciones',
      body: data => /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center align-items-center"
      }, /*#__PURE__*/React.createElement(Button, {
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
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "observations",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "observations"
    }, "Observaciones"), /*#__PURE__*/React.createElement(InputTextarea, {
      id: "observations",
      placeholder: "Observaciones",
      className: "w-100",
      value: field.value,
      onChange: e => field.onChange(e.target.value),
      autoResize: true,
      rows: 3,
      cols: 30
    }))
  }))));
};