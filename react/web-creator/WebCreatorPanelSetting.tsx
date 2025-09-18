import React from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

interface WebCreatorPanelSettingProps {
    addSiblingAbove: () => void;
    addSiblingBelow: () => void;
    addSiblingLeft: () => void;
    addSiblingRight: () => void;
    addHorizontalChild: () => void;
    addVerticalChild: () => void;
    removeSelectedPanel: () => void;
}

export const WebCreatorPanelSetting = ({
    addSiblingAbove,
    addSiblingBelow,
    addSiblingLeft,
    addSiblingRight,
    addHorizontalChild,
    addVerticalChild,
    removeSelectedPanel
}: WebCreatorPanelSettingProps) => {
    return (<>
        <div className="d-flex flex-column gap-3">
            <h4>Configuración del Panel</h4>
            <Divider />
            <p>Añadir panel</p>
            <div className="d-flex flex-wrap gap-2">
                <Button
                    icon={<i className="fa fa-arrow-up" />}
                    rounded
                    text
                    severity="help"
                    tooltip="Agregar panel arriba"
                    onClick={addSiblingAbove}
                />
                <Button
                    icon={<i className="fa fa-arrow-down" />}
                    rounded
                    text
                    severity="help"
                    tooltip="Agregar panel abajo"
                    onClick={addSiblingBelow}
                />
                <Button
                    icon={<i className="fa fa-arrow-left" />}
                    rounded
                    text
                    severity="help"
                    tooltip="Agregar panel a la izquierda"
                    onClick={addSiblingLeft}
                />
                <Button
                    icon={<i className="fa fa-arrow-right" />}
                    rounded
                    text
                    severity="help"
                    tooltip="Agregar panel a la derecha"
                    onClick={addSiblingRight}
                />
            </div>
            <Divider />
            <p>Dividir panel</p>
            <div className="d-flex flex-wrap gap-2">
                <Button
                    icon={<i className="fa fa-arrows-h" />}
                    rounded
                    text
                    severity="help"
                    tooltip="Dividir horizontalmente"
                    onClick={addHorizontalChild}
                />
                <Button
                    icon={<i className="fa fa-arrows-v" />}
                    rounded
                    text
                    severity="help"
                    tooltip="Dividir verticalmente"
                    onClick={addVerticalChild}
                />
            </div>
            <Divider />
            <Button
                icon={<i className="fa fa-trash" />}
                label="Eliminar panel"
                rounded
                text
                severity="danger"
                onClick={removeSelectedPanel}
            />
        </div>
    </>);
};