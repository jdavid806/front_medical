import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { CategoriesTable } from "./table/CategoriesTable";
import { CategoriesFormModal } from "./modal/CategoriesFormModal";
import { SwalManager } from "../../../services/alertManagerImported";
import { useCategory } from "./hooks/useCategory";
import { categoryProductsService } from "../../../services/api";

export const CategoriesApp = () => {
  const { category, setCategory, fetchCategoriesHook } = useCategory();
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryFormModal, setShowCategoryFormModal] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      setInitialData({
        name: category?.name,
        description: category?.description,
        isEditing: true,
        id: category.id,
      });
    }
  }, [category]);

  const onCreate = () => {
    setInitialData(undefined);
    setShowCategoryFormModal(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (category) {
        await categoryProductsService.update(category?.id, data);
        SwalManager.success({
          title: "Categoría actualizada",
        });
      } else {
        await categoryProductsService.create(data);
        SwalManager.success({
          title: "Categoría creada",
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

  const handleTableEdit = (id: string) => {
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

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-1">Categorías</h4>
          <div className="text-end mb-2">
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={onCreate}
            >
              <i className="fas fa-plus me-2"></i>
              Nueva Categoría
            </button>
          </div>
        </div>
        <CategoriesTable
          categories={categories}
          onEditItem={handleTableEdit}
        ></CategoriesTable>

        <CategoriesFormModal
          title={category ? "Editar Categoría" : "Crear Categoría"}
          show={showCategoryFormModal}
          handleSubmit={handleSubmit}
          onHide={handleHideCategoryFormModal}
          initialData={initialData}
        ></CategoriesFormModal>
      </PrimeReactProvider>
    </>
  );
};