import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { NewCategoryModal } from "./NewCategoryModal";
import { NewVideoModal } from "./NewVideoModal";
import { useManualUsuarioVideoCategories } from "./hooks/useManualUsuarioVideoCategories";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";

export function ManualUsuario() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { categories, loading, addCategory, addVideo } =
    useManualUsuarioVideoCategories();

  const toast = useRef<Toast>(null);

  if (loading) return <p>Cargando...</p>;

  const handleAddCategory = async (category: any) => {
    try {
      await addCategory(category);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoría creada correctamente",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la categoría",
        life: 3000,
      });
    }
  };

  const handleAddVideo = async (video: any) => {
    try {
      await addVideo(video);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Video agregado correctamente",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo agregar el video",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h1 className="text-2xl font-bold mb-4">
        📚 Videos Instructivos Medicalsoft
      </h1>

      <div className="d-flex justify-content-between align-items-center mb-4 p-3 border rounded shadow-sm bg-light">
        <div>
          <button
            className="btn btn-success"
            onClick={() => setShowCategoryModal(true)}
          >
            <i className="fas fa-plus me-2"></i> Nueva Categoría
          </button>
        </div>

        <div>
          <button
            className="btn btn-info text-white"
            onClick={() => setShowVideoModal(true)}
          >
            <i className="fas fa-video me-2"></i> Agregar Video
          </button>
        </div>
      </div>

      <Accordion multiple>
        {categories.map((cat) => (
          <AccordionTab key={cat.id} header={cat.name}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.videos.length > 0 ? (
                cat.videos.map((video: any) => (
                  <div
                    key={video.id}
                    className="border rounded-lg p-4 shadow bg-white"
                  >
                    <h3 className="font-bold">{video.title}</h3>
                    <div
                      className="text-gray-600 text-sm mb-2 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: video.description }}
                    />

                    <iframe
                      width="100%"
                      height="500"
                      src={video.url}
                      title={video.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay videos en esta categoría</p>
              )}
            </div>
          </AccordionTab>
        ))}
      </Accordion>

      {/* Modales */}
      <NewCategoryModal
        visible={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        onSubmit={handleAddCategory}
      />
      <NewVideoModal
        visible={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        onSubmit={handleAddVideo}
        categories={categories}
      />
    </div>
  );
}
