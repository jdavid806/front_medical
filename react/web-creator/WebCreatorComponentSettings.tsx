import React from "react";
import { Divider } from "primereact/divider";
import { WebCreatorComponent } from "./WebCreatorComponentList";

export const WebCreatorComponentSettings = ({ selectedComponent }: { selectedComponent: WebCreatorComponent }) => {
    return (
        <>
            <div>
                <h3>{selectedComponent.name}</h3>
                <Divider />
                <div className="d-flex flex-column">
                    Aquí irá la configuración del componente jaja
                </div>
            </div>
        </>
    );
};