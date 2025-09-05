import React from "react"
import { Card } from "primereact/card"
import { AccountingAccountsTree, AccountingAccountsTreeRef } from "./AccountingAccountsTree"
import { TreeAccountingAccountDetail } from "./TreeAccountingAccountDetail"
import { useState } from "react"
import { AccountingAccountNode } from "./hooks/useAccountingAccountsTree"
import { AccountingAccountFormModal, AccountingAccountFormModalRef } from "./AccountingAccountFormModal"
import { AccountingAccountFormModalData } from "./AccountingAccountFormModal"
import { useAccountingAccountCreate } from "./hooks/useAccountingAccountCreate"
import { useRef } from "react"
import { EditAccountingAccountFormModal, EditAccountingAccountFormModalData, EditAccountingAccountFormModalRef } from "./EditAccountingAccountFormModal"
import { useAccountingAccountUpdate } from "./hooks/useAccountingAccountUpdate"

export const AccountingAccountsV2 = () => {
    const [selectedNode, setSelectedNode] = useState<AccountingAccountNode | null>(null);
    const [selectedNodePath, setSelectedNodePath] = useState<AccountingAccountNode[] | null>(null);
    const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
    const [showEditAccountDialog, setShowEditAccountDialog] = useState(false);

    const { createAccount } = useAccountingAccountCreate();
    const { updateAccount } = useAccountingAccountUpdate();

    const accountingAccountsTreeRef = useRef<AccountingAccountsTreeRef>(null);
    const accountingAccountFormModalRef = useRef<AccountingAccountFormModalRef>(null);
    const editAccountingAccountFormModalRef = useRef<EditAccountingAccountFormModalRef>(null);

    const handleCreateAccount = async (data: AccountingAccountFormModalData) => {
        try {
            await createAccount(data);
            setShowNewAccountDialog(false);
            accountingAccountFormModalRef.current?.resetForm();
            accountingAccountsTreeRef.current?.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateAccount = async (data: EditAccountingAccountFormModalData) => {
        try {
            await updateAccount(data);
            setShowEditAccountDialog(false);
            editAccountingAccountFormModalRef.current?.resetForm();
            accountingAccountsTreeRef.current?.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (<>
        <div className="row">
            <div className="col-md-7 col-12">
                <AccountingAccountsTree
                    ref={accountingAccountsTreeRef}
                    onNodeSelect={(node, path) => {
                        setSelectedNode(node);
                        setSelectedNodePath(path);
                    }}
                />
            </div>
            <div className="col-md-5 col-12">
                <Card>
                    {!selectedNode && (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <h3>Seleccione una cuenta</h3>
                        </div>
                    )}
                    {selectedNode && (
                        <TreeAccountingAccountDetail
                            nodePath={selectedNodePath || []}
                            onAddSubAccount={() => setShowNewAccountDialog(true)}
                            onEditAccount={() => setShowEditAccountDialog(true)}
                        />
                    )}
                </Card>
            </div>
        </div>
        <AccountingAccountFormModal
            ref={accountingAccountFormModalRef}
            handleCreateAccount={handleCreateAccount}
            selectedAccount={selectedNode}
            visible={showNewAccountDialog}
            onHide={() => { setShowNewAccountDialog(false); }}
        />
        <EditAccountingAccountFormModal
            ref={editAccountingAccountFormModalRef}
            handleUpdateAccount={handleUpdateAccount}
            selectedAccount={selectedNode}
            visible={showEditAccountDialog}
            onHide={() => { setShowEditAccountDialog(false); }}
        />
    </>)
}