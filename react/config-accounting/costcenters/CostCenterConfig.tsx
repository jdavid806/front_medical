import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { CostCenterConfigTable } from "./table/CostCenterConfigTable";
import CostCenterModalConfig from "./modal/CostCenterModalConfig";
import { useCostCentersConfigTable } from "./hooks/useCostCentersConfigTable";
import { useCostCentersCreateTable } from "./hooks/useCostCentersCreateTable";
import { useCostCentersUpdate } from "./hooks/useCostCentersUpdate";
import { useCostCentersDelete } from "./hooks/useCostCentersDelete";
import { CostCenterFormInputs } from "./interfaces/CostCenterFormConfigType";
import { CostCentersMapperCreate, CostCentersMapperUpdate } from "./mapper/mappedCostCenters";
import { SwalManager } from "../../../services/alertManagerImported";
import { useCostCentersByIdConfigTable } from "./hooks/useCostCentersByConfigTable";

export const CostCenterConfig = ({ onConfigurationComplete }: { onConfigurationComplete?: (isComplete: boolean) => void; showValidation?: boolean; }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState<CostCenterFormInputs | undefined>(undefined);

  const { costCenters, loading, error, refreshCostCenters } = useCostCentersConfigTable();
  const { createCostCenter, loading: createLoading } = useCostCentersCreateTable();
  const { updateCostCenter, loading: updateLoading } = useCostCentersUpdate();
  const { costCenter, fetchCostCenterById, setCostCenter } = useCostCentersByIdConfigTable();
  const { deleteCostCenter, loading: deleteLoading } = useCostCentersDelete();

  const onCreate = () => {
    setInitialData(undefined);
    setCostCenter(null);
    setShowFormModal(true);
  };

  const handleSubmit = async (data: CostCenterFormInputs) => {
    try {
      if (!data.code || !data.name) {
        throw new Error('Código y nombre son requeridos');
      }

      if (costCenter) {
        const updateData = CostCentersMapperUpdate(data);
        await updateCostCenter(costCenter.id, updateData);
        SwalManager.success('Centro de costo actualizado correctamente');
      } else {
        const createData = CostCentersMapperCreate(data);
        await createCostCenter(createData);
        SwalManager.success('Centro de costo creado correctamente');
      }

      await refreshCostCenters();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error al guardar centro de costo:", error);
      SwalManager.error(error.message || 'Error al guardar el centro de costo');
    }
  };

  const handleTableEdit = async (id: string) => {
    try {
      await fetchCostCenterById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error al cargar centro de costo:", error);
      SwalManager.error('Error al cargar el centro de costo');
    }
  };


  const handleDeleteCostCenter = async (id: string) => {
    try {
      const success = await deleteCostCenter(id);
      if (success) {
        await refreshCostCenters();
        SwalManager.success('Centro de costo eliminado correctamente');
      } else {
        SwalManager.error('No se pudo eliminar el centro de costo');
      }
    } catch (error) {
      console.error("Error en eliminación:", error);
      SwalManager.error('Error al eliminar el centro de costo');
    }
  };

  useEffect(() => {
    const hasCostCenters = costCenters && costCenters.length > 0;
    onConfigurationComplete?.(hasCostCenters);
  }, [costCenters, onConfigurationComplete]);

  useEffect(() => {
    if (costCenter) {
      const data: CostCenterFormInputs = {
        id: Number(costCenter.id),
        code: costCenter.code,
        name: costCenter.name,
        description: costCenter.description || ''
      };
      setInitialData(data);
    }
  }, [costCenter]);

  return (
    <PrimeReactProvider
      value={{
        appendTo: "self",
        zIndex: {
          overlay: 100000,
        },
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-1">Configuración de Centros de Costo</h4>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}


      <CostCenterConfigTable
        costCenters={costCenters}
        onEditItem={handleTableEdit}
        onDeleteItem={handleDeleteCostCenter}
        loading={loading}
        onReload={refreshCostCenters}
        onCreate={onCreate}
        createLoading={createLoading}
        updateLoading={updateLoading}
        deleteLoading={deleteLoading}
      />

      <CostCenterModalConfig
        isVisible={showFormModal}
        onSave={handleSubmit}
        onClose={() => {
          setShowFormModal(false);
          setCostCenter(null);
          setInitialData(undefined);
        }}
        initialData={initialData}
        loading={createLoading || updateLoading || deleteLoading}
      />
    </PrimeReactProvider>
  );
};