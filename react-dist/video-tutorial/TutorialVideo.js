import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { NewCategoryModal } from "./NewCategoryModal.js";
import { NewVideoModal } from "./NewVideoModal.js";
export default function TutorialVideos() {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    const res = await fetch("http://localhost:8000/api/categories");
    const data = await res.json();
    setCategories(data);
  };
  const handleAddCategory = async category => {
    await fetch("http://localhost:8000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(category)
    });
    loadCategories();
  };
  const handleAddVideo = async video => {
    await fetch("http://localhost:8000/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(video)
    });
    loadCategories();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold mb-4"
  }, "\uD83D\uDCDA Videos Instructivos"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-6"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Categor\xEDa",
    icon: "pi pi-plus",
    onClick: () => setShowCategoryModal(true)
  })), categories.map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat.id,
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-blue-600"
  }, cat.name), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Video",
    icon: "pi pi-video",
    className: "p-button-sm",
    onClick: () => {
      setSelectedCategoryId(cat.id);
      setShowVideoModal(true);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, cat.videos.map(video => /*#__PURE__*/React.createElement("div", {
    key: video.id,
    className: "border rounded-lg p-4 shadow bg-white"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold"
  }, video.title), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 text-sm mb-2"
  }, video.description), /*#__PURE__*/React.createElement("iframe", {
    width: "100%",
    height: "200",
    src: video.url,
    title: video.title,
    frameBorder: "0",
    allowFullScreen: true
  })))))), /*#__PURE__*/React.createElement(NewCategoryModal, {
    visible: showCategoryModal,
    onHide: () => setShowCategoryModal(false),
    onSubmit: handleAddCategory
  }), /*#__PURE__*/React.createElement(NewVideoModal, {
    visible: showVideoModal,
    onHide: () => setShowVideoModal(false),
    onSubmit: handleAddVideo,
    categoryId: selectedCategoryId
  }));
}