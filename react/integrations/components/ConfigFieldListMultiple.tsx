import React, { useEffect, useState } from "react";
import { DynamicConfigFieldListProps } from "../interfaces";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

export const ConfigFieldListMultiple = (props: DynamicConfigFieldListProps) => {
    const { field, label, initialValue, onChange, options, placeholder } = props;

    const [value, setValue] = useState<string[]>([]);

    const handleValueChange = (e: MultiSelectChangeEvent) => {
        setValue(e.value);
        onChange(e.value.map((id: any) => id).join(","));
    };

    useEffect(() => {
        if (initialValue) {
            setValue(initialValue.split(","));
        }
    }, [initialValue]);

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <MultiSelect
                options={options}
                optionLabel="label"
                optionValue="value"
                inputId={field}
                name={field}
                value={value}
                onChange={handleValueChange}
                className="w-100"
                filter
                showClear
                placeholder={placeholder}
            />
        </>
    );
};