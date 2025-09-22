import React, { useState } from "react";
import { WebCreatorPanel } from "./WebCreatorSplitterEditor";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

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

    const justifyContentOptions = [
        { label: 'Inicio (flex-start)', value: 'flex-start' },
        { label: 'Centro (center)', value: 'center' },
        { label: 'Fin (flex-end)', value: 'flex-end' },
        { label: 'Espacio entre (space-between)', value: 'space-between' },
        { label: 'Espacio alrededor (space-around)', value: 'space-around' },
        { label: 'Espacio uniforme (space-evenly)', value: 'space-evenly' }
    ];

    const alignItemsOptions = [
        { label: 'Estirar (stretch)', value: 'stretch' },
        { label: 'Inicio (flex-start)', value: 'flex-start' },
        { label: 'Centro (center)', value: 'center' },
        { label: 'Fin (flex-end)', value: 'flex-end' },
        { label: 'Línea base (baseline)', value: 'baseline' }
    ];

    return (
        <div className="d-flex flex-column gap-3">
            <h4>Estilos del Panel</h4>
            <Divider />

            {/* Propiedades Flex */}
            <h5>Propiedades Flex</h5>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="justifyContent" className="form-label">Justificar Contenido</label>
                <Dropdown
                    id="justifyContent"
                    value={panel.styles?.justifyContent || 'flex-start'}
                    options={justifyContentOptions}
                    onChange={(e) => handleStyleChange('justifyContent', e.value)}
                    placeholder="Selecciona justificación"
                    className="w-100"
                />
            </div>

            <div className="d-flex flex-column gap-2">
                <label htmlFor="alignItems" className="form-label">Alinear Items</label>
                <Dropdown
                    id="alignItems"
                    value={panel.styles?.alignItems || 'stretch'}
                    options={alignItemsOptions}
                    onChange={(e) => handleStyleChange('alignItems', e.value)}
                    placeholder="Selecciona alineación"
                    className="w-100"
                />
            </div>

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