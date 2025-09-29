import React from 'react';
import { BranchApp } from '../../../fe-config/company/branch/BranchApp';


interface BranchesTabProps {
    companyId?: string;
}

const BranchesTab: React.FC<BranchesTabProps> = ({ companyId }) => {
    return <BranchApp />
};

export default BranchesTab;