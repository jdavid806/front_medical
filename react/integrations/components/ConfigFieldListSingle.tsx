import React, { useState } from "react";
import { DynamicConfigFieldListProps } from "../interfaces";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

export const ConfigFieldListSingle = (props: DynamicConfigFieldListProps) => {
    const { field, label, initialValue, onChange, options, placeholder } = props;

    const [value, setValue] = useState(initialValue || "");

    const handleValueChange = (e: DropdownChangeEvent) => {
        setValue(e.value);
        onChange(e.value);
    };

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <Dropdown
                options={options}
                optionLabel="label"
                optionValue="value"
                inputId={field}
                name={field}
                value={value}
                onChange={handleValueChange}
                className="w-100"
                placeholder={placeholder}
            />
        </>
    );
};