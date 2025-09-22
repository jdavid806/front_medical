import React from "react";
import { Divider } from "primereact/divider";
import { WebCreatorComponent } from "./WebCreatorComponentList";
import { LogoSettings } from "./setting-components/LogoSettings";
import { MenubarSettings } from "./setting-components/MenubarSettings";
import { InputSettings } from "./setting-components/InputSettings";

interface WebCreatorComponentSettingsProps {
    selectedComponent: WebCreatorComponent;
    onChange: (component: WebCreatorComponent) => void;
}

export const WebCreatorComponentSettings = ({ selectedComponent, onChange }: WebCreatorComponentSettingsProps) => {

    const getComponentSettings = () => {
        switch (selectedComponent.type) {
            case "logo":
                return <LogoSettings component={selectedComponent} onChange={(component) => onChange(component)} />;
            case "menubar":
                return <MenubarSettings component={selectedComponent} onChange={(component) => onChange(component)} />;
            case "button":
                return <div>Button settings</div>;
            case "sidebar":
                return <div>Sidebar settings</div>;
            case "input":
                return <InputSettings component={selectedComponent} onChange={(component) => onChange(component)} />;
            default:
                return <div>Unknown component type</div>;
        }
    };

    return (
        <>
            <div>
                <h3>{selectedComponent.name}</h3>
                <Divider />
                <div className="d-flex flex-column">
                    {getComponentSettings()}
                </div>
            </div>
        </>
    );
};