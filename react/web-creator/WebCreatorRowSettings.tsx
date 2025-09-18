import React from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { WebCreatorGridRow } from "./WebCreatorGridEditor";

interface WebCreatorRowSettingsProps {
    addRowUpper: () => void;
    addRowBelow: () => void;
    addColumn: (row: WebCreatorGridRow) => void;
    selectedRow: WebCreatorGridRow;
}

export const WebCreatorRowSettings = ({ addRowUpper, addRowBelow, addColumn, selectedRow }: WebCreatorRowSettingsProps) => {
    return (
        <>
            <h4>Fila</h4>
            <Divider />
            <div className="d-flex flex-column justify-content-center gap-2">
                <div className="d-flex gap-2 align-items-center justify-content-between">
                    <span>Agregar fila: </span>
                    <div className="d-flex gap-2 align-items-center">
                        <Button
                            icon={<i className="fa fa-arrow-up"></i>}
                            tooltip="Agregar fila arriba"
                            rounded
                            text
                            severity="help"
                            onClick={addRowUpper}
                        />
                        <Button
                            icon={<i className="fa fa-arrow-down"></i>}
                            tooltip="Agregar fila abajo"
                            rounded
                            text
                            severity="help"
                            onClick={addRowBelow}
                        />
                    </div>
                </div>
                <Button
                    icon={<i className="fa fa-plus"></i>}
                    label="Agregar columna"
                    rounded
                    text
                    severity="info"
                    onClick={() => addColumn(selectedRow)}
                />
            </div>
        </>
    );
};