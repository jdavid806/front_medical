import React, { useEffect, useState } from "react";
import { CustomSelect, CustomSelectOption } from "./CustomSelect";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';



export interface CustomSelectContainerConfig {
    selectId: string;
    mapper: (data: any[]) => CustomSelectOption[];
    name?: string;
    label?: string;
    required?: boolean;
    multiple?: boolean;
    data?: CustomSelectOption[];
    promise?: Promise<any[]>;
    value?: any[];
}

interface CustomSelectContainerProps {
    config: CustomSelectContainerConfig;
    onChange?: (value: any) => void;
}

export const CustomSelectContainer: React.FC<CustomSelectContainerProps> = ({ config, onChange }) => {
    const { selectId, label, required, multiple, data, promise, value, mapper, name } = config;

    const [options, setOptions] = useState<CustomSelectOption[]>(data || []);

    useEffect(() => {
        if (promise) {
            promise.then((data) => {
                setOptions(mapper(data))
            });
        }
    }, [promise]);

    return (
        <>
            <label htmlFor={selectId} className='form-label'>{label} {required && <span className="text-primary">*</span>}</label>
            {multiple ? (
                <MultiSelect
                    inputId={selectId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={options}
                    optionLabel="label"
                    filter
                    className="w-100"
                    panelStyle={{
                        zIndex: 100000,
                        padding: 0
                    }}
                    appendTo="self"
                />
            ) : (
                <Dropdown
                    inputId={selectId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={options}
                    optionLabel="label"
                    optionValue="value"
                    filter
                    className="w-100"
                    panelStyle={{
                        zIndex: 100000,
                        padding: 0
                    }}
                    appendTo="self"
                />
            )}
        </>
    );
};
