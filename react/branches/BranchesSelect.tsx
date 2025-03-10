import React from 'react'
import { CustomSelect } from '../components/CustomSelect'

interface BranchesSelectProps {
    selectId: string
    value?: string[]
    placeholder?: string
    onChange?: (value: string[]) => void
}

export const BranchesSelect: React.FC<BranchesSelectProps> = ({ selectId, onChange, value, placeholder }) => {

    return (
        <>
            <CustomSelect
                selectId={selectId}
                onChange={onChange}
                options={[{ value: 'main', label: 'main' }]}
                value={value}
                placeholder={placeholder}>
            </CustomSelect>
        </>
    )
}
