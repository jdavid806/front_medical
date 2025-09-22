import React from "react";
import { InputText } from "primereact/inputtext";
import { WebCreatorComponent } from "../WebCreatorComponentList";

interface InputSettingsProps {
    component: WebCreatorComponent;
    onChange: (component: WebCreatorComponent) => void;
}

export const InputSettings = ({ component, onChange }: InputSettingsProps) => {
    return (
        <>
            <div className="d-flex flex-column">
                <label htmlFor="label" className="form-label">Label</label>
                <InputText
                    id="label"
                    name="label"
                    value={component.label}
                    onChange={(e) => onChange({ ...component, label: e.target.value })}
                />
            </div>
        </>
    );
};