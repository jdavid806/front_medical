import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BranchTable } from "./table/BranchTable";
import { BranchFormModal } from "./modal/BranchFormModal";
import { branchService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { useBranch } from "./hooks/useBranch";

export const BranchApp = () => {
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
  };

  const handleTableEdit = (id: string) => {
    fetchBranchHook(id);
    setShowBranchFormModal(true);
  };

  async function fetchBranches() {
    try {
      const response = await branchService.getAll();
      setBranches(response);
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-end mb-2">
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