function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useProduct } from "../products/hooks/useProduct.js";
import { Checkbox } from 'primereact/checkbox';
export const ProductInventoryForm = ({
  formId,
  productId,
  onHandleSubmit
}) => {
  const {
    product,
    fetchProduct
  } = useProduct();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: {
      minimum_stock: 0,
      maximum_stock: null,
      sanitary_registration: '',
      description: '',
      prescription: false
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);
  useEffect(() => {
    if (product) {
      console.log('PRODUCT', product);
      reset(product);
    }
  }, [product]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "minimum_stock",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Stock m\xEDnimo *"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 1,
      placeholder: "Ingrese el stock m\xEDnimo",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      className: "w-100",
      inputClassName: classNames('w-100', {
        'p-invalid': errors.minimum_stock
      })
    }))
  }), getFormErrorMessage('minimum_stock')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "maximum_stock",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Stock m\xE1ximo *"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 1,
      placeholder: "Ingrese el stock m\xE1ximo",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      className: "w-100",
      inputClassName: classNames('w-100', {
        'p-invalid': errors.maximum_stock
      })
    }))
  }), getFormErrorMessage('maximum_stock'))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "sale_price",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Precio de venta *"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 1,
      placeholder: "Ingrese el precio de venta",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      className: "w-100",
      inputClassName: classNames('w-100', {
        'p-invalid': errors.sale_price
      })
    }))
  }), getFormErrorMessage('sale_price'))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "sanitary_registration",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Registro sanitario *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Ingrese el registro sanitario",
      className: classNames('w-100', {
        'p-invalid': errors.sanitary_registration
      })
    }, field)))
  }), getFormErrorMessage('sanitary_registration'))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name,
      placeholder: "Ingrese la descripci\xF3n",
      className: "w-100"
    }, field)))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "prescription",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      inputId: field.name,
      checked: field.value,
      onChange: e => field.onChange(e.checked)
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "ml-2 form-check-label"
    }, "\xBFRequiere Receta?")))
  }))));
};