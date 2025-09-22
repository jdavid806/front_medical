import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useEntitieConfigCreate } from "./hooks/useEntitiesConfigCreate.js";
import { useEntitieConfigById } from "./hooks/useEntitiesConfigByid.js";
import { useEntitiesConfigDelete } from "./hooks/useEntitiesConfigDelete.js";
import { useEntitiesConfigUpdate } from "./hooks/useEntitiesConfigUpdate.js";
import { useEntitieConfigTable } from "./hooks/useEntitiesConfigTable.js";
import { EntitiesConfiTable } from "./table/EntitiesConfiTable.js";
import EntitiesConfigModal from "./modal/EntitiesConfigModal.js";
export const EntitiesConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    entities,
    loading,
    error,
    refreshEntities
  } = useEntitieConfigTable();
  const {
    createEntities,
    loading: createLoading
  } = useEntitieConfigCreate();
  const {
    updateEntities,
    loading: updateLoading
  } = useEntitiesConfigUpdate();
  const {
    fetchEntitiesById,
    entitiesById,
    setEntitiesById
  } = useEntitieConfigById();
  const {
    deleteEntity,
    loading: deleteLoading
  } = useEntitiesConfigDelete();
  const onCreate = () => {
    setInitialData(undefined);
    setEntitiesById(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      const entitiesData = {
        name: data.name,
        entity_code: data.entity_code,
        document_type: data.document_type,
        document_number: data.document_number,
        email: data.email,
        address: data.address,
        phone: data.phone,
        city_id: data.city_id,
        country_id: data.country_id,
        department_id: data.department_id,
        tax_charge_id: data.tax_charge_id || 0,
        withholding_tax_id: data.withholding_tax_id || 0,
        koneksi_sponsor_slug: data.koneksi_sponsor_slug || null
      };
      if (entitiesById) {
        await updateEntities(entitiesById.id.toString(), entitiesData);
        // Solo si no hay error, mostrar éxito y cerrar modal
        SwalManager.success('Entidad actualizada correctamente');
        await refreshEntities();
        setShowFormModal(false);
      } else {
        await createEntities(entitiesData);
        // Solo si no hay error, mostrar éxito y cerrar modal
        SwalManager.success('Entidad creada correctamente');
        await refreshEntities();
        setShowFormModal(false);
      }
    } catch (error) {
      // El error ya fue manejado y mostrado en el SweetAlert del hook
      // NO cerrar el modal - mantenerlo abierto para que el usuario corrija el error
      console.error("Error saving entity:", error);
    }
  };
  const handleTableEdit = async id => {
    try {
      await fetchEntitiesById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };
  const handleDeleteEntities = async id => {
    try {
      const success = await deleteEntity(id);
      if (success) {
        await refreshEntities();
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
    }
  };
  useEffect(() => {
    if (entitiesById) {
      const data = {
        name: entitiesById.name,
        entity_code: entitiesById.entity_code,
        document_type: entitiesById.document_type,
        document_number: entitiesById.document_number,
        email: entitiesById.email,
        address: entitiesById.address,
        phone: entitiesById.phone,
        city_id: entitiesById.city_name || entitiesById.city_id,
        country_id: entitiesById.country_name || entitiesById.country_id,
        department_id: entitiesById.department_name || entitiesById.department_id,
        tax_charge_id: entitiesById.tax_charge_id || null,
        withholding_tax_id: entitiesById.withholding_tax_id || 0,
        koneksi_sponsor_slug: entitiesById.koneksi_sponsor_slug || null
      };
      setInitialData(data);
    }
  }, [entitiesById]);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-4 p-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), createLoading || updateLoading ? 'Procesando...' : 'Nueva Entidad')), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(EntitiesConfiTable, {
    onEditItem: handleTableEdit,
    entities: entities,
    onDeleteItem: handleDeleteEntities,
    loading: loading
  }), /*#__PURE__*/React.createElement(EntitiesConfigModal, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setEntitiesById(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    loading: createLoading || updateLoading || deleteLoading
  }));
};