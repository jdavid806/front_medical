// components/BranchesTab.tsx
import React from 'react';
import { BranchApp } from '../../../fe-config/company/branch/BranchApp';

interface BranchesTabProps {
    companyId?: string;
    onValidationChange?: (isValid: boolean) => void;
}

export const BranchesTab: React.FC<BranchesTabProps> = ({ companyId, onValidationChange }) => {
    return (
        <div className="container-fluid">
            <BranchApp onValidationChange={onValidationChange} />
        </div>
    );
};

export default BranchesTab;