import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BranchTable } from "./table/BranchTable.js";
import { BranchFormModal } from "./modal/BranchFormModal.js";
import { branchService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { useBranch } from "./hooks/useBranch.js";
export const BranchApp = () => {
  const {
    branch,
    setBranch,
    fetchBranchHook
  } = useBranch();
  const [branches, setBranches] = useState([]);
  const [showBranchFormModal, setShowBranchFormModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    fetchBranches();
  }, []);
  useEffect(() => {
    if (branch) {
      setInitialData({
        name: branch?.name,
        email: branch?.email,
        phone: branch?.phone,
        address: branch?.address,
        city: branch?.city,
        country: branch?.country,
        isEditing: true,
        id: branch.id
      });
    }
  }, [branch]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowBranchFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (branch) {
        await branchService.update(branch?.id, data);
        SwalManager.success({
          title: "Sede actualizada"
        });
      } else {
        await branchService.create(data);
        SwalManager.success({
          title: "Sede creada"
        });
      }
    } catch (error) {
      console.error("Error creating/updating branch: ", error);
    } finally {
      setShowBranchFormModal(false);
      await fetchBranches();
    }
  };
  const handleHideBranchFormModal = () => {
    setShowBranchFormModal(false);
  };
  const handleTableEdit = id => {
    fetchBranchHook(id);
    setShowBranchFormModal(true);
  };
  async function fetchBranches() {
    try {
      const response = await branchService.getAll();
      setBranches(response);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: '13px'
    },
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Gesti\xF3n de Sucursales"), /*#__PURE__*/React.createElement("div", {
    className: "text-end",
    style: {
      marginRight: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nueva Sede"))), /*#__PURE__*/React.createElement(BranchTable, {
    branches: branches,
    onEditItem: handleTableEdit
  }), /*#__PURE__*/React.createElement(BranchFormModal, {
    title: branch ? "Editar Sede" : "Crear Sede",
    show: showBranchFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideBranchFormModal,
    initialData: initialData
  })));
};