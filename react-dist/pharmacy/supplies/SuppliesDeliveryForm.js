import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useProductsByType } from "../../products/hooks/useProductsByType.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { Button } from "primereact/button";
export const SuppliesDeliveryForm = props => {
  const {
    formId,
    onSubmit
  } = props;
  const {
    control,
    handleSubmit
  } = useForm({
    defaultValues: {
      quantity: 0,
      supply: null,
      supplies: []
    }
  });
  const {
    fields,
    append: addSupply,
    remove: removeSupply
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
      quantity: formValues.quantity,
      supply: formValues.supply,
      supplies: formValues.supplies
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
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "quantity",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: "quantity"
    }, "Cantidad"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: "quantity",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onChange: e => field.onChange(e.value),
      onValueChange: e => field.onChange(e.value),
      useGrouping: false,
      placeholder: "Cantidad",
      className: "w-100",
      inputClassName: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    }),
    onClick: () => addSupply(supply),
    className: "btn btn-outline-primary"
  })), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: [{
      field: 'name',
      header: 'Nombre'
    }, {
      field: 'quantity',
      header: 'Cantidad'
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
    data: formSupplies
  })));
};