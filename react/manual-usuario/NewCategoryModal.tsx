import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface CategoryModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
}

export const NewCategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onHide,
  onSubmit,
}) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    onSubmit({ name });
    setName("");
    onHide();
  };

  return (
    <Dialog
      header="Nueva Categoría"
      visible={visible}
      style={{ width: "400px" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        <div className="field">
          <label>Nombre de la Categoría</label>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            disabled={!name}
            onClick={handleSave}
          />
        </div>
      </div>
    </Dialog>
  );
};
