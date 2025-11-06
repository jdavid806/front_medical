import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties";

interface ThirdPartyDropdownProps {
    value: any;
    handleChange: (e: any) => void;
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    label?: string;
}

export const ThirdPartyDropdown: React.FC<ThirdPartyDropdownProps> = (props) => {

    const {
        value,
        handleChange,
        optionLabel = 'label',
        optionValue = 'value',
        placeholder = 'Seleccione un tercero',
        label = 'Tercero'
    } = props;

    const [mappedThirdParties, setMappedThirdParties] = useState<any[]>([]);

    const { thirdParties } = useThirdParties();

    useEffect(() => {
        const mapped = thirdParties.map((thirdParty: any) => ({
            ...thirdParty,
            label: thirdParty.name,
            value: thirdParty.id
        }));
        setMappedThirdParties(mapped);
    }, [thirdParties]);

    return (<>
        <div className="d-flex flex-column">
            <label className="form-label" htmlFor="thirdParty">{label}</label>
            <Dropdown
                id="thirdParty"
                value={value}
                onChange={handleChange}
                options={mappedThirdParties}
                optionLabel={optionLabel}
                optionValue={optionValue}
                placeholder={placeholder}
                className="w-100"
                filter
                showClear
            />
        </div>
    </>);
};