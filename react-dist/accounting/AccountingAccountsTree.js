import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { useAccountingAccountsTree } from "./hooks/useAccountingAccountsTree.js";
import { InputText } from "primereact/inputtext";
import { natureSeverity } from "./utils/AccountingAccountUtils.js";
export const AccountingAccountsTree = /*#__PURE__*/forwardRef(({
  onNodeSelect
}, ref) => {
  const {
    fetchAccountingAccountsTree,
    searchTerm,
    setSearchTerm,
    filteredData,
    findNodePath
  } = useAccountingAccountsTree();
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const refresh = async () => {
    const data = await fetchAccountingAccountsTree();
    const updatedNodePath = findNodePath(data, selectedNode?.id || 0);
    const updatedNode = updatedNodePath[updatedNodePath.length - 1];
    setSelectedNode(updatedNode);
    onNodeSelect?.(updatedNode, updatedNodePath);
  };
  useImperativeHandle(ref, () => ({
    refresh
  }));
  const toggleNode = accountCode => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(accountCode)) {
      newExpandedNodes.delete(accountCode);
    } else {
      newExpandedNodes.add(accountCode);
    }
    setExpandedNodes(newExpandedNodes);
  };
  const renderAccountHeader = node => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between gap-2 align-items-center w-100 flex-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: selectedNode?.account_code === node.account_code ? 'fw-bold' : 'text-primary'
    }, node.account_label), /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `badge bg-${natureSeverity(node.nature_code)} opacity-75`
    }, node.nature_label), /*#__PURE__*/React.createElement("span", {
      className: `badge bg-info opacity-75`
    }, node.account_type_name), /*#__PURE__*/React.createElement("span", {
      className: `badge bg-secondary opacity-75`
    }, node.level)));
  };
  const renderTree = (nodes, level = 0) => {
    return nodes.map(node => /*#__PURE__*/React.createElement("div", {
      key: node.id,
      className: `tree-node level-${level} mb-2`
    }, /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: expandedNodes.has(node.account_code) ? 0 : null,
      onTabChange: () => {
        toggleNode(node.account_code);
        setSelectedNode(node);
        onNodeSelect?.(node, findNodePath(filteredData, node.id));
      },
      className: "mb-2"
    }, /*#__PURE__*/React.createElement(AccordionTab, {
      header: renderAccountHeader(node)
    }, node.children && node.children.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 ps-4 border-start border-secondary"
    }, renderTree(node.children, level + 1))))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center w-100 gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Refrescar",
    onClick: refresh,
    className: "p-button-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-sync-alt",
    style: {
      marginLeft: "10px"
    }
  })), /*#__PURE__*/React.createElement(InputText, {
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    placeholder: "Buscar"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "account-tree"
  }, renderTree(filteredData)))));
});