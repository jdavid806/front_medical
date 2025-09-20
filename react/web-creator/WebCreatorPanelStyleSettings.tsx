import React, { useState } from "react";
import { WebCreatorPanel } from "./WebCreatorSplitterEditor";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";

interface WebCreatorPanelStyleSettingsProps {
    panel: WebCreatorPanel;
    onStyleChange: (panel: WebCreatorPanel) => void;
}

export const WebCreatorPanelStyleSettings = ({ panel, onStyleChange }: WebCreatorPanelStyleSettingsProps) => {

    const handleStyleChange = (property: string, value: any) => {
        const newStyles = { ...panel.styles, [property]: value };
        onStyleChange({ ...panel, styles: newStyles });
    };

    const resetStyles = () => {
        const resetStyles = { ...panel.styles };
        onStyleChange({ ...panel, styles: resetStyles });
    };

    return (
        <div className="d-flex flex-column gap-3">
            <h4>Estilos del Panel</h4>
            <Divider />

            <div className="d-flex flex-column gap-2">
                <label htmlFor="backgroundColor" className="form-label">Color de fondo</label>
                <div className="d-flex align-items-center gap-2">
                    <ColorPicker
                        id="backgroundColor"
                        value={panel.styles?.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', '#' + e.value)}
                        format="hex"
                    />
                    <InputText
                        value={panel.styles?.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                        className="w-100"
                    />
                </div>
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="borderColor" className="form-label">Color del borde</label>
                <div className="d-flex align-items-center gap-2">
                    <ColorPicker
                        id="borderColor"
                        value={panel.styles?.borderColor || '#e5e7eb'}
                        onChange={(e) => handleStyleChange('borderColor', '#' + e.value)}
                        format="hex"
                    />
                    <InputText
                        value={panel.styles?.borderColor || '#e5e7eb'}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        placeholder="#e5e7eb"
                        className="w-100"
                    />
                </div>
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="borderWidth" className="form-label">Ancho del borde (px)</label>
                <InputNumber
                    id="borderWidth"
                    value={panel.styles?.borderWidth}
                    onChange={(e) => handleStyleChange('borderWidth', e.value)}
                    placeholder="1px"
                    className="w-100"
                    inputClassName="w-100"
                />
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="borderRadius" className="form-label">Radio del borde (px)</label>
                <InputNumber
                    id="borderRadius"
                    value={panel.styles?.borderRadius}
                    onChange={(e) => handleStyleChange('borderRadius', e.value)}
                    placeholder="6px"
                    className="w-100"
                    inputClassName="w-100"
                />
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="boxShadow" className="form-label">Sombra</label>
                <InputText
                    id="boxShadow"
                    value={panel.styles?.boxShadow}
                    onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                    placeholder="0 2px 4px rgba(0,0,0,0.1)"
                />
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="padding" className="form-label">Padding (px)</label>
                <InputNumber
                    id="padding"
                    value={panel.styles?.padding}
                    onChange={(e) => handleStyleChange('padding', e.value)}
                    placeholder="16px"
                    className="w-100"
                    inputClassName="w-100"
                />
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="margin" className="form-label">Margin (px)</label>
                <InputNumber
                    id="margin"
                    value={panel.styles?.margin}
                    onChange={(e) => handleStyleChange('margin', e.value)}
                    placeholder="8px"
                    className="w-100"
                    inputClassName="w-100"
                />
            </div>

            <Divider />

            <Button
                icon="pi pi-refresh"
                label="Restablecer estilos"
                severity="secondary"
                onClick={resetStyles}
            />
        </div>
    );
};