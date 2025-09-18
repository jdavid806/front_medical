import React from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";

interface WebCreatorCellSettingsProps {
    addColumnBefore: () => void;
    addColumnAfter: () => void;
    removeColumn: () => void;
}

export const WebCreatorCellSettings = ({ addColumnBefore, addColumnAfter, removeColumn }: WebCreatorCellSettingsProps) => {
    return (
        <>
            <h4>Celda</h4>
            <Divider />
            <div className="d-flex flex-column justify-content-center gap-2">
                <div className="d-flex gap-2 align-items-center justify-content-between">
                    <span>Agregar columna: </span>
                    <div className="d-flex gap-2 align-items-center">
                        <Button
                            icon={<i className="fa fa-arrow-left"></i>}
                            tooltip="Agregar columna detrás"
                            rounded
                            text
                            severity="help"
                            onClick={addColumnBefore}
                        />
                        <Button
                            icon={<i className="fa fa-arrow-right"></i>}
                            tooltip="Agregar columna delante"
                            rounded
                            text
                            severity="help"
                            onClick={addColumnAfter}
                        />
                    </div>
                </div>
                <Button
                    icon={<i className="fa fa-trash"></i>}
                    label="Eliminar columna"
                    rounded
                    text
                    severity="danger"
                    onClick={removeColumn}
                />
            </div>
        </>
    );
};