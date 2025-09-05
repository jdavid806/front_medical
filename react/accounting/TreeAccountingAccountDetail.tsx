import React from 'react'
import { AccountingAccountNode } from './hooks/useAccountingAccountsTree';
import { Button } from 'primereact/button';
import { CustomPRTable } from '../components/CustomPRTable';
import { natureSeverity } from './utils/AccountingAccountUtils';

interface TreeAccountingAccountDetailProps {
    nodePath: AccountingAccountNode[];
    onAddSubAccount: () => void;
    onEditAccount: () => void;
}

export const TreeAccountingAccountDetail = ({ nodePath, onAddSubAccount, onEditAccount }: TreeAccountingAccountDetailProps) => {
    const columns = [
        {
            field: 'level',
            header: 'Nivel',
            body: (data: AccountingAccountNode) => <span className={`badge bg-secondary opacity-75`}>{data.level}</span>
        },
        {
            field: 'account_code',
            header: 'Código'
        },
        {
            field: 'account_name',
            header: 'Nombre',
        },
        {
            field: 'nature_code',
            header: ' Naturaleza',
            body: (data: AccountingAccountNode) => <span className={`badge bg-${natureSeverity(data.nature_code)} opacity-75`}>{data.nature_label}</span>
        },
        {
            field: 'account_type_name',
            header: 'Tipo',
            body: (data: AccountingAccountNode) => <span className={`badge bg-info opacity-75`}>{data.account_type_name}</span>
        },
    ];
    return (
        <div>
            <div className="d-flex justify-content-between gap-2 align-items-center w-100 flex-wrap mb-3">
                <h2>Jerarquia de la cuenta</h2>
                <div className="d-flex align-items-center gap-2">
                    <Button
                        label="Nueva subcuenta"
                        icon={<i className="fas fa-plus"></i>}
                        onClick={onAddSubAccount}
                        className="btn btn-outline-primary"
                    />
                    <Button
                        label="Editar cuenta"
                        icon={<i className="fas fa-edit"></i>}
                        onClick={onEditAccount}
                        className="btn btn-outline-primary"
                    />
                </div>
            </div>
            <CustomPRTable
                columns={columns}
                data={nodePath}
                disableReload
                disableSearch
                disablePaginator
                size="small"
            />
        </div>
    )
}