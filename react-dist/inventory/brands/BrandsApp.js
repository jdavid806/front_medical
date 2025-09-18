import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BrandTable } from "./table/BrandTable.js";
import { BrandFormModal } from "./modal/BrandFormModal.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useBrand } from "./hooks/useBrand.js";
import { brandService } from "../../../services/api/index.js";
export const BrandsApp = () => {
  const {
    brand,
    setBrand,
    fetchBrandsHook
  } = useBrand();
  const [brands, setBrands] = useState([]);
  const [showBrandFormModal, setShowBrandFormModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    fetchBrands();
  }, []);
  useEffect(() => {
    if (brand) {
      setInitialData({
        name: brand?.attributes.name,
        isEditing: true,
        id: brand.id
      });
    }
  }, [brand]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowBrandFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (brand) {
        await brandService.update(brand?.id, data);
        SwalManager.success({
          title: "Marca actualizada"
        });
      } else {
        await brandService.create(data);
        SwalManager.success({
          title: "Marca creada"
        });
      }
    } catch (error) {
      console.error("Error creating/updating brand: ", error);
    } finally {
      setShowBrandFormModal(false);
      await fetchBrands();
    }
  };
  const handleHideBrandFormModal = () => {
    setShowBrandFormModal(false);
  };
  const handleTableEdit = id => {
    fetchBrandsHook(id);
    setShowBrandFormModal(true);
  };
  async function fetchBrands() {
    try {
      const response = await brandService.getAll();
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands: ", error);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Marcas"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nueva Marca"))), /*#__PURE__*/React.createElement(BrandTable, {
    brands: brands,
    onEditItem: handleTableEdit
  }), /*#__PURE__*/React.createElement(BrandFormModal, {
    title: brand ? "Editar Marca" : "Crear Marca",
    show: showBrandFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideBrandFormModal,
    initialData: initialData
  })));
};