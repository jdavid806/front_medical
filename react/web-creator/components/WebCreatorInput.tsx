import React, { useState } from "react";
import { WebCreatorComponent } from "../WebCreatorComponentList";
import { InputText } from "primereact/inputtext";

export const WebCreatorInput = ({ component }: { component: WebCreatorComponent }) => {

    const [value, setValue] = useState('');

    return (
        <div>
            <label className="form-label">{component.label}</label>
            <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
    );
};