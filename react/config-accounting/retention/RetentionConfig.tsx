import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { RetentionConfigTable } from "./table/RetentionConfigTable";
import RetentionModalConfig from "./modal/RetentionModalConfig";
import { SwalManager } from "../../../services/alertManagerImported";
import { useRetentionsConfigTable } from "./hooks/useRetentionConfigTable";
import { useRetentionCreateTable } from "./hooks/useRetentionCreateTable";
import { useRetentionConfigByTable } from "./hooks/useRetentionConfigByTable";
import { useRetentionDeleteTable } from "./hooks/useRetentionDeleteTable";
import { useRetentionUpdateTable } from "./hooks/useRetentionUpdateTable";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts";
import { RetentionFormInputs } from "./interfaces/RetentionDTO";
import {
  RetentionMapperCreate,
  RetentionMapperUpdate,
} from "./mapper/mappedRetention";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export const RetentionConfig = ({ onConfigurationComplete }: { onConfigurationComplete?: (isComplete: boolean) => void; showValidation?: boolean; }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState<
    RetentionFormInputs | undefined
  >(undefined);
  const [retentionToDelete, setRetentionToDelete] = useState<string | null>(
    null
  );
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Hooks para las operaciones CRUD
  const { retentions, loading, error, refreshRetentions } =
    useRetentionsConfigTable();
  const { createRetention, loading: createLoading } = useRetentionCreateTable();
  const { updateRetention, loading: updateLoading } = useRetentionUpdateTable();
  const { retention, fetchRetentionById, setRetention } =
    useRetentionConfigByTable();
  const { deleteRetention, loading: deleteLoading } = useRetentionDeleteTable();
  const { accounts, isLoading: isLoadingAccounts } = useAccountingAccounts();

  const onCreate = () => {
    setInitialData(undefined);
    setRetention(null);
    setShowFormModal(true);
  };

  const handleSubmit = async (data: RetentionFormInputs) => {
    try {

      if (retention) {
        const updateData = RetentionMapperUpdate(data);
        await updateRetention(retention.id, updateData);
        SwalManager.success("Retención actualizada correctamente");
      } else {
        const createData = RetentionMapperCreate(data);
        await createRetention(createData);
        SwalManager.success("Retención creada correctamente");
      }

      await refreshRetentions();
      setShowFormModal(false);
    } catch (error) {
      SwalManager.error(error.message || "Error al guardar la retención");
    }
  };

  const handleTableEdit = async (id: string) => {
    try {

      const retentionData = await fetchRetentionById(id);

      if (retentionData) {
        setShowFormModal(true);
      } else {
        SwalManager.error("No se pudo cargar la retención para editar");
      }
    } catch (error) {
      SwalManager.error("Error al cargar la retención");
    }
  };

  const handleDeleteRetention = async (id: string) => {
    try {
      const success = await deleteRetention(id);
      if (success) {
        await refreshRetentions();
        SwalManager.success("Retention eliminado correctamente");
      } else {
        SwalManager.error("No se pudo eliminar Retention");
      }
    } catch (error) {
      console.error("Error en eliminación:", error);
      SwalManager.error("Error al eliminar el Retention");
    }
  };

  useEffect(() => {
    const hasRetentions = retentions && retentions.length > 0;
    onConfigurationComplete?.(hasRetentions);
  }, [retentions, onConfigurationComplete]);

  useEffect(() => {
    if (retention && accounts) {
      const data: RetentionFormInputs = {
        name: retention.name,
        percentage: retention.percentage,
        accounting_account_id: retention.accounting_account_id,
        accounting_account_reverse_id: retention.accounting_account_reverse_id,
        sell_accounting_account_id: retention.sell_accounting_account_id,
        sell_reverse_accounting_account_id:
          retention.sell_reverse_accounting_account_id,
        description: retention.description || "",
      };
      setInitialData(data);
    }
  }, [retention, accounts]);



  const deleteDialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setDeleteDialogVisible(false)}
      />
      <Button
        label="Eliminar"
        icon="pi pi-check"
        className="p-button-danger"
        onClick={() =>
          retentionToDelete && handleDeleteRetention(retentionToDelete)
        }
        loading={deleteLoading}
      />
    </div>
  );

  const enrichedRetentions = retentions.map((retentionItem) => {

    const account = accounts.find(
      (acc) => acc.id === retentionItem.accounting_account_id
    );
    const returnAccount = accounts.find(
      (acc) => acc.id === retentionItem.accounting_account_reverse_id
    );

    const accountData =
      retentionItem.account ||
      (account
        ? {
          id: account.id.toString(),
          name:
            account.account_name ||
            account.account ||
            `Cuenta ${account.account_code}`,
        }
        : null);

    const returnAccountData =
      retentionItem.returnAccount ||
      (returnAccount
        ? {
          id: returnAccount.id.toString(),
          name:
            returnAccount.account_name ||
            returnAccount.account ||
            `Cuenta ${returnAccount.account_code}`,
        }
        : null);

    return {
      id: retentionItem.id,
      name: retentionItem.name,
      percentage: retentionItem.percentage,
      account: accountData,
      returnAccount: returnAccountData,
      description: retentionItem.description,
    };
  });

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
        <h4 className="mb-1">Configuración de Retenciones</h4>
        <div className="text-end">
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={onCreate}
            disabled={createLoading || updateLoading || deleteLoading}
          >
            <i className="fas fa-plus me-2"></i>
            {createLoading || updateLoading
              ? "Procesando..."
              : "Nueva Retención"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div
        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
        style={{ minHeight: "400px" }}
      >
        <div className="card-body h-100 w-100 d-flex flex-column">
          <RetentionConfigTable
            retentions={enrichedRetentions}
            onEditItem={handleTableEdit}
            onDeleteItem={handleDeleteRetention}
            loading={loading || isLoadingAccounts}
          />
        </div>
      </div>
      <RetentionModalConfig
        isVisible={showFormModal}
        onSave={handleSubmit}
        onClose={() => {
          setShowFormModal(false);
          setRetention(null);
          setInitialData(undefined);
        }}
        initialData={initialData}
        accounts={accounts}
        loading={createLoading || updateLoading || deleteLoading}
      />

      <Dialog
        visible={deleteDialogVisible}
        style={{ width: "450px" }}
        header="Confirmar Eliminación"
        modal
        footer={deleteDialogFooter}
        onHide={() => setDeleteDialogVisible(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem", color: "#f8bb86" }}
          />
          {retentionToDelete && (
            <span>
              ¿Estás seguro que deseas eliminar esta retención? Esta acción no
              se puede deshacer.
            </span>
          )}
        </div>
      </Dialog>
    </PrimeReactProvider>
  );
};
