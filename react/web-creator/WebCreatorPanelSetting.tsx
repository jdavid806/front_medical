import React from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { WebCreatorPanel } from "./WebCreatorSplitterEditor";
import { WebCreatorPanelStyleSettings } from "./WebCreatorPanelStyleSettings";
import { Dropdown } from "primereact/dropdown";

interface WebCreatorPanelSettingProps {
    panel: WebCreatorPanel;
    addSiblingAbove: () => void;
    addSiblingBelow: () => void;
    addSiblingLeft: () => void;
    addSiblingRight: () => void;
    addHorizontalChild: () => void;
    addVerticalChild: () => void;
    removeSelectedPanel: () => void;
    onPanelStyleChange: (panel: WebCreatorPanel) => void;
}

export const WebCreatorPanelSetting = ({
    panel,
    addSiblingAbove,
    addSiblingBelow,
    addSiblingLeft,
    addSiblingRight,
    addHorizontalChild,
    addVerticalChild,
    removeSelectedPanel,
    onPanelStyleChange
}: WebCreatorPanelSettingProps) => {
    return (
        <div className="d-flex flex-column gap-3">
            <h4>Configuración del Panel</h4>

            <Divider />
            <div className="d-flex flex-column gap-2">
                <label htmlFor="wrapperType" className="form-label">Tipo de Wrapper</label>
                <Dropdown
                    options={[
                        { label: 'Panel', value: 'default' },
                        { label: 'Tabs', value: 'tabs' },
                        { label: 'Form', value: 'form' }
                    ]}
                    value={panel.wrapperType}
                    onChange={(e) => onPanelStyleChange({ ...panel, wrapperType: e.value })}
                />
            </div>
            <Divider />

            {/* Configuración de estilos */}
            <WebCreatorPanelStyleSettings
                panel={panel}
                onStyleChange={onPanelStyleChange}
            />

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
    );
};