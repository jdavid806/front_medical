import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { ModuleFormModal } from "./components/ModuleFormModal.js";
import { useModuleCreate } from "./hooks/useModuleCreate.js";
import { ModuleTable } from "./components/ModuleTable.js";
import { useModules } from "./hooks/useModules.js";
import { useModule } from "./hooks/useModule.js";
import { useEffect } from 'react';
import { useModuleUpdate } from "./hooks/useModuleUpdate.js";
import { useModuleDelete } from "./hooks/useModuleDelete.js";
export const ModuleApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    modules,
    fetchModules
  } = useModules();
  const {
    createModule
  } = useModuleCreate();
  const {
    updateModule
  } = useModuleUpdate();
  const {
    deleteModule
  } = useModuleDelete();
  const {
    module,
    fetchModule
  } = useModule();
  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    if (module) {
      await updateModule(module.id, data);
    } else {
      await createModule(data);
    }
    fetchModules();
    setShowFormModal(false);
  };
  const handleTableEdit = id => {
    fetchModule(id);
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteModule(id);
    if (confirmed) fetchModules();
  };
  useEffect(() => {
    setInitialData({
      name: module?.name || '',
      branch_id: module?.branch_id.toString() || '1',
      allowed_reasons: module?.allowed_reasons || []
    });
  }, [module]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Modulos"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Nuevo"))), /*#__PURE__*/React.createElement(ModuleTable, {
    modules: modules,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(ModuleFormModal, {
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
    },
    initialData: initialData
  })));
};