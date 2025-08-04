import React from 'react';
import { CustomFormModal } from "../components/CustomFormModal.js";
import { AddParaclinicalForm } from "./AddParaclinicalForm.js";
import { useState } from 'react';
import { userService } from "../../services/api/index.js";
import { useExamRecipeResultCreate } from "../exam-recipe-results/hooks/useExamRecipeResultCreate.js";
import { useExamRecipeResultUpdate } from "../exam-recipe-results/hooks/useExamRecipeResultUpdate.js";
import { validFile } from "../../services/utilidades.js";
export const AddParaclinicalButton = () => {
  const [showAddParaclinicalFormModal, setShowAddParaclinicalFormModal] = useState(false);
  const {
    createExamRecipeResult
  } = useExamRecipeResultCreate();
  const {
    updateExamRecipeResult
  } = useExamRecipeResultUpdate();
  const handleSubmit = async data => {
    if (!validFile("addParaclinicalFormFile")) {
      return;
    }
    ;
    const currentUser = await userService.getLoggedUser();
    const finalData = {
      exam_recipe_id: data.exam_recipe_id,
      date: data.date?.toISOString().split('T')[0],
      comment: data.comment,
      uploaded_by_user_id: currentUser.id
    };
    try {
      const res = await createExamRecipeResult(finalData);
      //@ts-ignore
      let minioUrl = await guardarResultadoRecetaExamen("addParaclinicalFormFile", res.id);
      await updateExamRecipeResult(res.id, {
        result_minio_url: minioUrl
      });
      setShowAddParaclinicalFormModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setShowAddParaclinicalFormModal(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Agregar resultados"), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "createParaclinical",
    show: showAddParaclinicalFormModal,
    title: "Agregar paracl\xEDnico",
    onHide: () => setShowAddParaclinicalFormModal(false)
  }, /*#__PURE__*/React.createElement(AddParaclinicalForm, {
    formId: "createParaclinical",
    onHandleSubmit: handleSubmit
  })));
};