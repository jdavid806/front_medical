import React, { useEffect, useState } from 'react';
import { PricesTableConfig } from "../prices/table/PricesTableConfig.js";
import PricesConfigFormModal from "../prices/form/PricesConfigFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
import { ProductMapperCreate, ProductMapperUpdate } from "./mappers/index.js";
import { usePricesConfigTable } from "./hooks/usePricesConfigTable.js";
import { usePriceConfigCreate } from "./hooks/usePriceConfigCreate.js";
import { usePriceConfigUpdate } from "./hooks/usePriceConfigUpdate.js";
import { usePriceConfigById } from "./hooks/usePriceConfigById.js";
export const PricesConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    fetchProducts,
    products
  } = usePricesConfigTable();
  const {
    createProduct,
    loading
  } = usePriceConfigCreate();
  const {
    updateProduct
  } = usePriceConfigUpdate();
  const {
    fetchPriceById,
    priceById,
    setPriceById
  } = usePriceConfigById();
  const onCreate = () => {
    setInitialData(undefined);
    setPriceById(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    const mapperDataProduct = ProductMapperCreate(data);
    const mapperDataProductUpdate = ProductMapperUpdate(data);
    try {
      if (priceById) {
        await updateProduct(priceById.id.toString(), mapperDataProductUpdate);
      } else {
        await createProduct(mapperDataProduct);
      }
      fetchProducts();
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleTableEdit = id => {
    fetchPriceById(id);
    setShowFormModal(true);
  };

  // const handleTableDelete = async (id: string) => {
  //     const confirmed = await deletePrice(id);
  //     if (confirmed) fetchPrices();
  // };

  useEffect(() => {
    if (priceById) {
      const data = {
        name: priceById.name,
        attention_type: priceById.attention_type,
        curp: priceById.barcode,
        sale_price: priceById.sale_price,
        copago: +priceById.copayment,
        taxProduct_type: priceById.tax_charge_id ?? '0',
        exam_type_id: priceById.exam_type_id ?? '0',
        purchase_price: priceById.purchase_price
      };
      setInitialData(data);
    }
  }, [priceById]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Configuraci\xF3n de Precios"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo Precio"))), /*#__PURE__*/React.createElement(PricesTableConfig, {
    prices: products,
    onEditItem: handleTableEdit
    // onDeleteItem={handleTableDelete}
  }), /*#__PURE__*/React.createElement(PricesConfigFormModal, {
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
    },
    initialData: initialData
  })));
};