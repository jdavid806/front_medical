import React from "react";
import { Card } from "primereact/card";
import { AccountingAccountsTree } from "./AccountingAccountsTree.js";
import { TreeAccountingAccountDetail } from "./TreeAccountingAccountDetail.js";
import { useState } from "react";
import { AccountingAccountFormModal } from "./AccountingAccountFormModal.js";
import { useAccountingAccountCreate } from "./hooks/useAccountingAccountCreate.js";
import { useRef } from "react";
import { EditAccountingAccountFormModal } from "./EditAccountingAccountFormModal.js";
import { useAccountingAccountUpdate } from "./hooks/useAccountingAccountUpdate.js";
export const AccountingAccountsV2 = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [showEditAccountDialog, setShowEditAccountDialog] = useState(false);
  const {
    createAccount
  } = useAccountingAccountCreate();
  const {
    updateAccount
  } = useAccountingAccountUpdate();
  const accountingAccountsTreeRef = useRef(null);
  const accountingAccountFormModalRef = useRef(null);
  const editAccountingAccountFormModalRef = useRef(null);
  const handleCreateAccount = async data => {
    try {
      await createAccount(data);
      setShowNewAccountDialog(false);
      accountingAccountFormModalRef.current?.resetForm();
      accountingAccountsTreeRef.current?.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateAccount = async data => {
    try {
      await updateAccount(data);
      setShowEditAccountDialog(false);
      editAccountingAccountFormModalRef.current?.resetForm();
      accountingAccountsTreeRef.current?.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-7 col-12"
  }, /*#__PURE__*/React.createElement(AccountingAccountsTree, {
    ref: accountingAccountsTreeRef,
    onNodeSelect: (node, path) => {
      setSelectedNode(node);
      setSelectedNodePath(path);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5 col-12"
  }, /*#__PURE__*/React.createElement(Card, null, !selectedNode && /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center h-100"
  }, /*#__PURE__*/React.createElement("h3", null, "Seleccione una cuenta")), selectedNode && /*#__PURE__*/React.createElement(TreeAccountingAccountDetail, {
    nodePath: selectedNodePath || [],
    onAddSubAccount: () => setShowNewAccountDialog(true),
    onEditAccount: () => setShowEditAccountDialog(true)
  })))), /*#__PURE__*/React.createElement(AccountingAccountFormModal, {
    ref: accountingAccountFormModalRef,
    handleCreateAccount: handleCreateAccount,
    selectedAccount: selectedNode,
    visible: showNewAccountDialog,
    onHide: () => {
      setShowNewAccountDialog(false);
    }
  }), /*#__PURE__*/React.createElement(EditAccountingAccountFormModal, {
    ref: editAccountingAccountFormModalRef,
    handleUpdateAccount: handleUpdateAccount,
    selectedAccount: selectedNode,
    visible: showEditAccountDialog,
    onHide: () => {
      setShowEditAccountDialog(false);
    }
  }));
};