import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

interface VideoModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  categoryId: number | null;
}

export const NewVideoModal: React.FC<VideoModalProps> = ({
  visible,
  onHide,
  onSubmit,
  categoryId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const handleSave = () => {
    if (!categoryId) return;
    onSubmit({ title, description, url, category_id: categoryId });
    setTitle("");
    setDescription("");
    setUrl("");
    onHide();
  };

  return (
    <Dialog
      header="Nuevo Video"
      visible={visible}
      style={{ width: "500px" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        <div className="field">
          <label>Título</label>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="field">
          <label>Descripción</label>
          <InputTextarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="field">
          <label>URL del Video (YouTube, Vimeo...)</label>
          <InputText value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="flex justify-content-end gap-2 mt-3">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
          <Button label="Guardar" icon="pi pi-check" className="p-button-primary" disabled={!title || !url} onClick={handleSave} />
        </div>
      </div>
    </Dialog>
  );
};
