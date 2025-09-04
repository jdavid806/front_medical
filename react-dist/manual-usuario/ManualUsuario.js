import React, { useState, useRef } from "react";
import { NewCategoryModal } from "./NewCategoryModal.js";
import { NewVideoModal } from "./NewVideoModal.js";
import { useManualUsuarioVideoCategories } from "./hooks/useManualUsuarioVideoCategories.js";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
export function ManualUsuario() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const {
    categories,
    loading,
    addCategory,
    addVideo
  } = useManualUsuarioVideoCategories();
  const toast = useRef(null);
  if (loading) return /*#__PURE__*/React.createElement("p", null, "Cargando...");
  const handleAddCategory = async category => {
    try {
      await addCategory(category);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoría creada correctamente",
        life: 3000
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la categoría",
        life: 3000
      });
    }
  };
  const handleAddVideo = async video => {
    try {
      await addVideo(video);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Video agregado correctamente",
        life: 3000
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo agregar el video",
        life: 3000
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold mb-4"
  }, "\uD83D\uDCDA Videos Instructivos Medicalsoft"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4 p-3 border rounded shadow-sm bg-light"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: () => setShowCategoryModal(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), " Nueva Categor\xEDa")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-info text-white",
    onClick: () => setShowVideoModal(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-video me-2"
  }), " Agregar Video"))), /*#__PURE__*/React.createElement(Accordion, {
    multiple: true
  }, categories.map(cat => /*#__PURE__*/React.createElement(AccordionTab, {
    key: cat.id,
    header: cat.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, cat.videos.length > 0 ? cat.videos.map(video => /*#__PURE__*/React.createElement("div", {
    key: video.id,
    className: "border rounded-lg p-4 shadow bg-white"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold"
  }, video.title), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 text-sm mb-2"
  }, video.description), /*#__PURE__*/React.createElement("iframe", {
    width: "100%",
    height: "500",
    src: video.url,
    title: video.title,
    frameBorder: "0",
    allowFullScreen: true
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "No hay videos en esta categor\xEDa"))))), /*#__PURE__*/React.createElement(NewCategoryModal, {
    visible: showCategoryModal,
    onHide: () => setShowCategoryModal(false),
    onSubmit: handleAddCategory
  }), /*#__PURE__*/React.createElement(NewVideoModal, {
    visible: showVideoModal,
    onHide: () => setShowVideoModal(false),
    onSubmit: handleAddVideo,
    categories: categories
  }));
}