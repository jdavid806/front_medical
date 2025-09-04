import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { AccountingAccountNode, useAccountingAccountsTree } from "./hooks/useAccountingAccountsTree";
import { InputText } from "primereact/inputtext";
import { Tag } from 'primereact/tag';

interface AccountingAccountsTreeProps {
    onNodeClick?: (node: AccountingAccountNode, path: AccountingAccountNode[]) => void;
}

interface AccountingAccountsTreeRef {
    refresh: () => void;
}

export const AccountingAccountsTree: React.FC<AccountingAccountsTreeProps> = forwardRef(({ onNodeClick }, ref: Ref<AccountingAccountsTreeRef>) => {

    const {
        fetchAccountingAccountsTree,
        searchTerm,
        setSearchTerm,
        filteredData,
        natureSeverity,
        findNodePath
    } = useAccountingAccountsTree();

    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [selectedNode, setSelectedNode] = useState<AccountingAccountNode | null>(null);

    const refresh = () => {
        fetchAccountingAccountsTree();
    };

    useImperativeHandle(ref, () => ({
        refresh
    }));

    const toggleNode = (accountCode: string) => {
        const newExpandedNodes = new Set(expandedNodes);
        if (newExpandedNodes.has(accountCode)) {
            newExpandedNodes.delete(accountCode);
        } else {
            newExpandedNodes.add(accountCode);
        }
        setExpandedNodes(newExpandedNodes);
    };

    const renderAccountHeader = (node: AccountingAccountNode) => {
        return (
            <div className="d-flex justify-content-between gap-2 align-items-center w-100">
                <span className={(selectedNode?.account_code === node.account_code ? 'fw-bold' : 'text-primary')}>
                    {node.account_code} - {node.account_name}
                </span>
                <div className="d-flex align-items-center gap-2">
                    <span className={`badge bg-${natureSeverity(node.nature_code)} opacity-75`}>{node.nature_label}</span>
                    <span className={`badge bg-info opacity-75`}>{node.account_type_name}</span>
                    <span className={`badge bg-secondary opacity-75`}>{node.level}</span>
                </div>
            </div>
        );
    };

    const renderTree = (nodes: AccountingAccountNode[], level = 0) => {
        return nodes.map((node) => (
            <div key={node.id} className={`tree-node level-${level} mb-2`}>
                <Accordion
                    activeIndex={expandedNodes.has(node.account_code) ? 0 : null}
                    onTabChange={() => {
                        toggleNode(node.account_code);
                        setSelectedNode(node);
                        console.log("node", node);
                        console.log("findNodePath", findNodePath(filteredData, node.id));
                        onNodeClick?.(node, findNodePath(filteredData, node.id));
                    }}
                    className="mb-2"
                >
                    <AccordionTab header={renderAccountHeader(node)}>
                        {node.children && node.children.length > 0 && (
                            <div className="mt-3 ps-4 border-start border-secondary">
                                {renderTree(node.children, level + 1)}
                            </div>
                        )}
                    </AccordionTab>
                </Accordion>
            </div>
        ));
    };

    return (<>
        <div className="container-fluid py-3">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center w-100 gap-2">
                        <Button
                            label="Refrescar"
                            icon={<i className="fas fa-sync-alt me-2"></i>}
                            onClick={refresh}
                            className="btn btn-outline-primary"
                        />
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar"
                        />
                    </div>
                </div>
                <div className="card-body">
                    <div className="account-tree">
                        {renderTree(filteredData)}
                    </div>
                </div>
            </div>
        </div>
    </>);
});
