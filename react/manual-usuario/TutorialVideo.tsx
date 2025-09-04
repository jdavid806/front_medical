import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { NewCategoryModal } from "./NewCategoryModal";
import { NewVideoModal } from "./NewVideoModal";

export default function TutorialVideos() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetch("http://localhost:8000/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleAddCategory = async (category: any) => {
    await fetch("http://localhost:8000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    loadCategories();
  };

  const handleAddVideo = async (video: any) => {
    await fetch("http://localhost:8000/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(video),
    });
    loadCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Videos Instructivos</h1>

      {/* <div className="flex gap-2 mb-6">
        <Button
          label="Nueva Categoría"
          icon="pi pi-plus"
          onClick={() => setShowCategoryModal(true)}
        />
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-blue-600">{cat.name}</h2>
            <Button
              label="Agregar Video"
              icon="pi pi-video"
              className="p-button-sm"
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setShowVideoModal(true);
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cat.videos.map((video: any) => (
              <div key={video.id} className="border rounded-lg p-4 shadow bg-white">
                <h3 className="font-bold">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                <iframe
                  width="100%"
                  height="200"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      ))}

      <NewCategoryModal
        visible={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        onSubmit={handleAddCategory}
      />

      <NewVideoModal
        visible={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        onSubmit={handleAddVideo}
        categoryId={selectedCategoryId}
      /> */}
    </div>
  );
}
