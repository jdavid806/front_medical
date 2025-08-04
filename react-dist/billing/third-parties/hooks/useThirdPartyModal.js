import React, { useState } from "react";
import { useThirdPartyCreate } from "./useThirdPartyCreate.js";
import { ThirdPartyModal } from "../modals/ThridPartiesModal.js";
export const useThirdPartyModal = options => {
  const [open, setOpen] = useState(false);
  const {
    createThirdParty
  } = useThirdPartyCreate();
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const handleSaveTercero = async formData => {
    try {
      const res = await createThirdParty({
        name: formData.contact.name,
        type: formData.type,
        document_type: formData.contact.document_type,
        document_number: formData.contact.document_number,
        email: formData.contact.email,
        phone: formData.contact.phone,
        address: formData.contact.address,
        first_name: formData.contact.first_name,
        middle_name: formData.contact.middle_name,
        last_name: formData.contact.last_name,
        second_last_name: formData.contact.second_last_name,
        date_of_birth: formData.contact.date_of_birth
      });
      // Ejecutar callback de éxito si existe
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  const ModalComponent = /*#__PURE__*/React.memo(() => /*#__PURE__*/React.createElement(ThirdPartyModal, {
    visible: open,
    onHide: () => {
      closeModal();
    },
    onSubmit: handleSaveTercero,
    loading: false,
    error: null
  }));
  return {
    ThirdPartyModal: ModalComponent,
    open,
    openModal,
    closeModal
  };
};