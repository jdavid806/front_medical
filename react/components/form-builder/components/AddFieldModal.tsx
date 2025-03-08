// AddFieldModal.tsx
import React from 'react';
import { CustomModal } from "../../CustomModal";

interface AddFieldModalProps {
    show: boolean;
    newFieldData: any;
    onHide: () => void;
    onSubmit: () => void;
    onFieldDataChange: (data: any) => void;
}

export const AddFieldModal: React.FC<AddFieldModalProps> = ({
    show,
    newFieldData,
    onHide,
    onSubmit,
    onFieldDataChange
}) => (
    <CustomModal
        show={show}
        onHide={onHide}
        title='Agregar Nuevo Campo'
    >
        <div className="modal-body">
            <div className="mb-3">
                <label className="form-label">Tipo de Campo</label>
                <select
                    className="form-select"
                    value={newFieldData.type}
                    onChange={(e) => onFieldDataChange({ ...newFieldData, type: e.target.value })}
                >
                    <option value="text">Texto</option>
                    <option value="textarea">Área de Texto</option>
                    <option value="select">Selección</option>
                    <option value="checkbox">Checkbox</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Etiqueta</label>
                <input
                    type="text"
                    className="form-control"
                    value={newFieldData.label}
                    onChange={(e) => onFieldDataChange({ ...newFieldData, label: e.target.value })}
                />
            </div>
            {newFieldData.type === 'select' && (
                <div className="mb-3">
                    <label className="form-label">
                        Opciones (separadas por comas)
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={newFieldData.options}
                        onChange={(e) => onFieldDataChange({ ...newFieldData, options: e.target.value })}
                    />
                </div>
            )}
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
            >
                Cancelar
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={onSubmit}
            >
                Guardar
            </button>
        </div>
    </CustomModal>
);