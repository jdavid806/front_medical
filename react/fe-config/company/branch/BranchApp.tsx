import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BranchTable } from "./table/BranchTable";
import { BranchFormModal } from "./modal/BranchFormModal";
import { branchService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { useBranch } from "./hooks/useBranch";

interface BranchAppProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const BranchApp: React.FC<BranchAppProps> = ({ onValidationChange }) => {
  const { branch, setBranch, fetchBranchHook } = useBranch();
  const [branches, setBranches] = useState<any[]>([]);
  const [showBranchFormModal, setShowBranchFormModal] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branch) {
      setInitialData({
        name: branch?.name,
        email: branch?.email,
        phone: branch?.phone,
        address: branch?.address,
        city: branch?.city,
        country: branch?.country,
        isEditing: true,
        id: branch.id,
      });
    }
  }, [branch]);

  // Validar si hay al menos una sede creada
  useEffect(() => {
    const isValid = branches && branches.length > 0;
    console.log('🏢 Validación Sedes - Branches:', branches.length, 'IsValid:', isValid);
    onValidationChange?.(isValid);
  }, [branches, onValidationChange]);

  const onCreate = () => {
    setInitialData(undefined);
    setShowBranchFormModal(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (branch) {
        await branchService.update(branch?.id, data);
        SwalManager.success({
          title: "Sede actualizada",
        });
      } else {
        await branchService.create(data);
        SwalManager.success({
          title: "Sede creada",
        });
      }
    } catch (error) {
      console.error("Error creating/updating branch: ", error);
    } finally {
      setShowBranchFormModal(false);
      await fetchBranches();
    }
  };

  const handleHideBranchFormModal = () => {
    setShowBranchFormModal(false);
    setBranch(null);
  };

  const handleTableEdit = (id: string) => {
    fetchBranchHook(id);
    setShowBranchFormModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await branchService.delete(id);
      SwalManager.success({
        title: "Sede eliminada",
      });
      await fetchBranches();
    } catch (error) {
      console.error("Error deleting branch: ", error);
    }
  };

  async function fetchBranches() {
    try {
      const response = await branchService.getAll();
      setBranches(response);
      console.log('📊 Sedes cargadas:', response.length);
    } catch (error) {
      console.error("Error fetching branches: ", error);
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
        <div style={{ marginLeft: '13px' }} className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Gestión de Sucursales</h4>
            <small className="text-muted">
              {branches.length > 0
                ? `${branches.length} sede(s) configurada(s)`
                : 'Crea al menos una sede para completar este módulo'
              }
            </small>
          </div>

          <div className="text-end" style={{ marginRight: '12px' }}>
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={onCreate}
            >
              <i className="fas fa-plus me-2"></i>
              Nueva Sede
            </button>
          </div>
        </div>

        <BranchTable
          branches={branches}
          onEditItem={handleTableEdit}
          onDeleteItem={handleDeleteItem}
        ></BranchTable>

        <BranchFormModal
          title={branch ? "Editar Sede" : "Crear Sede"}
          show={showBranchFormModal}
          handleSubmit={handleSubmit}
          onHide={handleHideBranchFormModal}
          initialData={initialData}
        ></BranchFormModal>
      </PrimeReactProvider>
    </>
  );
};