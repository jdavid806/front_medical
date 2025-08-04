import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { UserComissionsFormInputs } from "../../users/Comissions";
import { comissionConfig } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { useMassMessage } from "./hooks/useMassMessage";
import { useMassMessagesAll } from "./hooks/useMassMessagesAll";
import { MassMessageTable } from "./MassMessageTable";
import { MassMessageFormModal } from "./MassMessageFormModal";

export const MassMessageApp = () => {
  const { massMessage, setMassMessage, fetchMassMessage } = useMassMessage();
  const { massMessages, setMassMessages, fetchMassMessages } =
    useMassMessagesAll();
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState<
    UserComissionsFormInputs | undefined
  >(undefined);

  useEffect(() => {
    fetchMassMessages();
  }, []);

  //   useEffect(() => {
  //     if (commission) {
  //       const productsIds = commission.services.map(
  //         (service) => service.product.id
  //       );
  //       setInitialData({
  //         users: [commission.user.id],
  //         attention_type: commission.attention_type,
  //         application_type: commission.application_type,
  //         commission_type: commission.commission_type,
  //         services: productsIds,
  //         commission_value: commission.commission_value,
  //         percentage_base: commission.percentage_base,
  //         percentage_value: commission.percentage_value,
  //         retention_type: commission.retention_type,
  //         value_retention: commission.value_retention,
  //         isEditing: true,
  //         id: commission.id,
  //       });
  //     }
  //   }, [commission]);

  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };

  const handleSubmit = async (data: UserComissionsFormInputs) => {
    const finalData: UserComissionsFormInputs = {
      ...data,
    };

    try {
      if (massMessage) {
        const response = await comissionConfig.CommissionConfigUpdate(
          massMessage.id,
          finalData
        );
        SwalManager.success({
          title: "Registro actualizado",
        });
      } else {
        const response = await comissionConfig.create(finalData);
        SwalManager.success();
      }
    } catch (error) {
      console.error("Error creating/updating comission config: ", error);
    } finally {
      setShowFormModal(false);
      await fetchMassMessages();
    }
  };

  const handleHideFormModal = () => {
    setShowFormModal(false);
  };

  const handleTableEdit = (id: string) => {
    fetchMassMessage(id);

    setShowFormModal(true);
  };

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
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="text-end mb-2">
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={onCreate}
            >
              <i className="fas fa-plus me-2"></i>
              Nuevo Mensaje
            </button>
          </div>
        </div>
        <MassMessageTable
          massMessages={massMessages}
          onEditItem={handleTableEdit}
        ></MassMessageTable>

        <MassMessageFormModal
          title="Crear Mensaje Masivo"
          show={showFormModal}
          handleSubmit={handleSubmit}
          onHide={handleHideFormModal}
          initialData={initialData}
        ></MassMessageFormModal>
      </PrimeReactProvider>
    </>
  );
};
