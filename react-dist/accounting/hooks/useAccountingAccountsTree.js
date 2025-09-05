import { useEffect, useState } from "react";
import { accountingAccountsService } from "../../../services/api/index.js";
export const useAccountingAccountsTree = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchAccountingAccountsTree = async () => {
    try {
      const response = await accountingAccountsService.getAccountingAccountsTree();
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching accounting accounts tree:", error);
      return [];
    }
  };
  const findNodePath = (nodes, targetId) => {
    const findPathRecursive = (currentNode, currentPath) => {
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
  const filterTreeByAccountCode = (nodes, searchTerm) => {
    if (!searchTerm) {
      setFilteredData(nodes);
      return;
    }
    const filteredNodes = [];
    const searchLower = searchTerm.toLowerCase();
    const filterRecursive = node => {
      const matches = node.account_label && node.account_label.toLowerCase().includes(searchLower);
      if (matches) {
        return {
          ...node
        };
      }
      if (node.children && node.children.length > 0) {
        const filteredChildren = [];
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