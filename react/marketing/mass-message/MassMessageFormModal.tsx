import React from "react";
import { MassMessageForm } from "./MassMessageForm";
import { CustomFormModal } from "../../components/CustomFormModal";

interface MessageFormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
}

export const MassMessageFormModal: React.FC<MessageFormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {
  const formId = "createDoctor";

  return (
    <CustomFormModal show={show} formId={formId} onHide={onHide} title={title}>
      <MassMessageForm
        formId={formId}
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></MassMessageForm>
    </CustomFormModal>
  );
};
