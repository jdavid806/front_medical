import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { CategoriesTable } from "./table/CategoriesTable.js";
import { CategoriesFormModal } from "./modal/CategoriesFormModal.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useCategory } from "./hooks/useCategory.js";
import { categoryProductsService } from "../../../services/api/index.js";
export const CategoriesApp = () => {
  const {
    category,
    setCategory,
    fetchCategoriesHook
  } = useCategory();
  const [categories, setCategories] = useState([]);
  const [showCategoryFormModal, setShowCategoryFormModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (category) {
      setInitialData({
        name: category?.name,
        description: category?.description,
        isEditing: true,
        id: category.id
      });
    }
  }, [category]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowCategoryFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (category) {
        await categoryProductsService.update(category?.id, data);
        SwalManager.success({
          title: "Categoría actualizada"
        });
      } else {
        await categoryProductsService.create(data);
        SwalManager.success({
          title: "Categoría creada"
        });
      }
    } catch (error) {
      console.error("Error creating/updating category: ", error);
    } finally {
      setShowCategoryFormModal(false);
      await fetchCategories();
    }
  };
  const handleHideCategoryFormModal = () => {
    setShowCategoryFormModal(false);
  };
  const handleTableEdit = id => {
    fetchCategoriesHook(id);
    setShowCategoryFormModal(true);
  };
  async function fetchCategories() {
    try {
      const response = await categoryProductsService.getAll();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories: ", error);
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
  }, "Categor\xEDas"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nueva Categor\xEDa"))), /*#__PURE__*/React.createElement(CategoriesTable, {
    categories: categories,
    onEditItem: handleTableEdit
  }), /*#__PURE__*/React.createElement(CategoriesFormModal, {
    title: category ? "Editar Categoría" : "Crear Categoría",
    show: showCategoryFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideCategoryFormModal,
    initialData: initialData
  })));
};