import React, { useState } from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { Password } from "primereact/password";

export const ConfigFieldPassword = (props: DynamicConfigFieldProps) => {
    const { field, label, initialValue, onChange } = props;

    const [value, setValue] = useState(initialValue || "");

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <Password
                inputId={field}
                name={field}
                value={value}
                onChange={handleValueChange}
                feedback={false}
                tabIndex={1}
                toggleMask
                inputClassName="w-100"
                className="w-100"
                panelClassName="w-100"
            />

            <style>
                {`
                    .p-icon-field-right {
                        width: 100%;
                    }
                `}
            </style>
        </>
    );
};