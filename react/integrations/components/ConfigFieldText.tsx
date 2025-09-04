import React, { useState } from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { InputText } from "primereact/inputtext";

export const ConfigFieldText = (props: DynamicConfigFieldProps) => {
    const { field, label, initialValue, onChange } = props;

    const [value, setValue] = useState(initialValue || "");

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <InputText
                id={field}
                name={field}
                value={value}
                onChange={handleValueChange}
                className="w-100"
            />
        </>
    );
};