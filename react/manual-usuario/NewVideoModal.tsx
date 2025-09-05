import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor"; // 👈 importar el Editor

interface VideoModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  categories: any[];
}

export const NewVideoModal: React.FC<VideoModalProps> = ({
  visible,
  onHide,
  onSubmit,
  categories,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // guardará HTML
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleSave = () => {
    if (!categoryId) return;
    onSubmit({ title, description, url, category_id: categoryId });
    setTitle("");
    setDescription("");
    setUrl("");
    setCategoryId(null);
    onHide();
  };

  return (
    <Dialog
      header="Nuevo Video"
      visible={visible}
      style={{ width: "600px" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        <div className="field">
          <label>Categoría</label>
          <Dropdown
            value={categoryId}
            options={categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
            onChange={(e) => setCategoryId(e.value)}
            placeholder="Seleccione una categoría"
          />
        </div>

        <div className="field">
          <label>Título</label>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="field">
          <label>Descripción</label>
          <Editor
            value={description}
            onTextChange={(e) => setDescription(e.htmlValue ?? "")}
            style={{ height: "200px" }}
          />
        </div>

        <div className="field">
          <label>URL del Video (YouTube, Vimeo...)</label>
          <InputText value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="flex justify-content-end gap-2 mt-3">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={onHide}
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            className="p-button-primary"
            disabled={!title || !url || !categoryId}
            onClick={handleSave}
          />
        </div>
      </div>
    </Dialog>
  );
};
