import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BrandTable } from "./table/BrandTable";
import { BrandFormModal } from "./modal/BrandFormModal";
import { SwalManager } from "../../../services/alertManagerImported";
import { useBrand } from "./hooks/useBrand";
import { brandService } from "../../../services/api";

export const BrandsApp = () => {
  const { brand, setBrand, fetchBrandsHook } = useBrand();
  const [brands, setBrands] = useState<any[]>([]);
  const [showBrandFormModal, setShowBrandFormModal] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brand) {
      setInitialData({
        name: brand?.attributes.name,
        isEditing: true,
        id: brand.id,
      });
    }
  }, [brand]);

  const onCreate = () => {
    setInitialData(undefined);
    setShowBrandFormModal(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (brand) {
        await brandService.update(brand?.id, data);
        SwalManager.success({
          title: "Marca actualizada",
        });
      } else {
        await brandService.create(data);
        SwalManager.success({
          title: "Marca creada",
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

  const handleTableEdit = (id: string) => {
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
          <h4 className="mb-1">Marcas</h4>
          <div className="text-end mb-2">
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={onCreate}
            >
              <i className="fas fa-plus me-2"></i>
              Nueva Marca
            </button>
          </div>
        </div>
        <BrandTable
          brands={brands}
          onEditItem={handleTableEdit}
        ></BrandTable>

        <BrandFormModal
          title={brand ? "Editar Marca" : "Crear Marca"}
          show={showBrandFormModal}
          handleSubmit={handleSubmit}
          onHide={handleHideBrandFormModal}
          initialData={initialData}
        ></BrandFormModal>
      </PrimeReactProvider>
    </>
  );
};