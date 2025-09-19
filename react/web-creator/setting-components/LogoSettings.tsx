import React from "react";
import { InputText } from "primereact/inputtext";
import { WebCreatorComponent } from "../WebCreatorComponentList";

interface LogoSettingsProps {
    component: WebCreatorComponent;
    onChange: (component: WebCreatorComponent) => void;
}

export const LogoSettings = ({ component, onChange }: LogoSettingsProps) => {
    return (
        <>
            <div className="d-flex flex-column">
                <label htmlFor="url" className="form-label">URL</label>
                <InputText
                    id="url"
                    name="url"
                    value={component.imgSrc}
                    onChange={(e) => onChange({ ...component, imgSrc: e.target.value })}
                />
            </div>
        </>
    );
};