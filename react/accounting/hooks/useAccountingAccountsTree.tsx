import { useEffect, useState } from "react";
import { accountingAccountsService } from "../../../services/api";

export interface AccountingAccountNode {
    id: number;
    account_code: string;
    account_label: string;
    account: string;
    sub_account: string | null;
    auxiliary: string | null;
    sub_auxiliary: string | null;
    account_name: string;
    category: string;
    account_type: string;
    account_type_name: string;
    initial_balance: number;
    status: string;
    level: string;
    nature_code: string;
    nature_label: string;
    depth: number;
    children: AccountingAccountNode[];
}

export const useAccountingAccountsTree = () => {
    const [data, setData] = useState<AccountingAccountNode[]>([]);
    const [filteredData, setFilteredData] = useState<AccountingAccountNode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAccountingAccountsTree = async (): Promise<AccountingAccountNode[]> => {
        try {
            const response: { data: AccountingAccountNode[] } = await accountingAccountsService.getAccountingAccountsTree();
            setData(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching accounting accounts tree:", error);
            return [];
        }
    };

    const findNodePath = (nodes: AccountingAccountNode[], targetId: number): AccountingAccountNode[] => {
        const findPathRecursive = (
            currentNode: AccountingAccountNode,
            currentPath: AccountingAccountNode[]
        ): AccountingAccountNode[] | null => {
            const newPath = [...currentPath, currentNode];

            if (currentNode.id === targetId) {
                return newPath;
            }
            if (currentNode.children && currentNode.children.length > 0) {
                for (const child of currentNode.children) {
                    const result = findPathRecursive(child, newPath);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        };

        for (const node of nodes) {
            const path = findPathRecursive(node, []);
            if (path) {
                return path;
            }
        }

        return [];
    };

    const filterTreeByAccountCode = (nodes: AccountingAccountNode[], searchTerm: string) => {
        if (!searchTerm) {
            setFilteredData(nodes);
            return;
        }

        const filteredNodes: AccountingAccountNode[] = [];

        const searchLower = searchTerm.toLowerCase();

        const filterRecursive = (node: AccountingAccountNode) => {
            const matches = node.account_label &&
                node.account_label.toLowerCase().includes(searchLower);
            if (matches) {
                return { ...node };
            }

            if (node.children && node.children.length > 0) {
                const filteredChildren: AccountingAccountNode[] = [];

                for (const child of node.children) {
                    const filteredChild = filterRecursive(child);
                    if (filteredChild) {
                        filteredChildren.push(filteredChild);
                    }
                }

                if (filteredChildren.length > 0) {
                    return {
                        ...node,
                        children: filteredChildren
                    };
                }
            }

            return null;
        };

        for (const node of nodes) {
            const filteredNode = filterRecursive(node);
            if (filteredNode) {
                filteredNodes.push(filteredNode);
            }
        }

        setFilteredData(filteredNodes);
    };

    useEffect(() => {
        fetchAccountingAccountsTree();
    }, []);

    useEffect(() => {
        filterTreeByAccountCode(data, searchTerm);
    }, [data, searchTerm]);

    return {
        fetchAccountingAccountsTree,
        filteredData,
        searchTerm,
        setSearchTerm,
        findNodePath
    };
};
