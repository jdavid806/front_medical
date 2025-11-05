import React from "react";
import { MassMessageForm } from "./MassMessageForm";

interface MessageFormModalProps {
  handleSubmit: (data: any) => void;
  initialData?: any;
}

export const MassMessageFormModal: React.FC<MessageFormModalProps> = ({
  handleSubmit,
  initialData,
}) => {
  const formId = "createMassMessageForm";

  return (
    <MassMessageForm
      formId={formId}
      onHandleSubmit={handleSubmit}
      initialData={initialData}
    ></MassMessageForm>
  );
};
