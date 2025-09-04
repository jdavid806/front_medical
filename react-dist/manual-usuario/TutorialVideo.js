import React, { useEffect, useState } from "react";
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
  }, "\uD83D\uDCDA Videos Instructivos"));
}