import React, { useEffect, useState } from 'react';
import { UserAvailabilityTable } from "./components/UserAvailabilityTable.js";
import UserAvailabilityFormModal from "./components/UserAvailabilityFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
import { useUserAvailabilitiesTable } from "./hooks/useUserAvailabilitiesTable.js";
import { useUserAvailability } from "./hooks/useUserAvailability.js";
import { useUserAvailabilityUpdate } from "./hooks/useUserAvailabilityUpdate.js";
import { useUserAvailabilityDelete } from "./hooks/useUserAvailabilityDelete.js";
import { useUserAvailabilityCreate } from "./hooks/useUserAvailabilityCreate.js";
import { convertHHMMToDate } from "../../services/utilidades.js";
export const UserAvailabilityApp = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    availabilities,
    fetchData: fetchAvailabilities
  } = useUserAvailabilitiesTable();
  const {
    createUserAvailability
  } = useUserAvailabilityCreate();
  const {
    updateUserAvailability
  } = useUserAvailabilityUpdate();
  const {
    deleteUserAvailability
  } = useUserAvailabilityDelete();
  const {
    userAvailability,
    setUserAvailability,
    fetchUserAvailability
  } = useUserAvailability();
  const onCreate = () => {
    setInitialData(undefined);
    setUserAvailability(null);
    setShowFormModal(true);
  };

  // Determinar si está completo
  const isComplete = availabilities && availabilities.length > 0;
  const showValidations = isConfigurationContext;
  useEffect(() => {
    onConfigurationComplete?.(isComplete);
  }, [availabilities, onConfigurationComplete, isComplete]);
  const handleSubmit = async data => {
    const finalData = {
      ...data,
      appointment_type_id: data.appointment_type_id.toString() || '1',
      appointment_duration: data.appointment_duration || 1
    };
    try {
      if (userAvailability) {
        await updateUserAvailability(userAvailability.id, finalData);
      } else {
        await createUserAvailability(finalData);
      }
      fetchAvailabilities();
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleTableEdit = id => {
    fetchUserAvailability(id);
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteUserAvailability(id);
    if (confirmed) fetchAvailabilities();
  };
  useEffect(() => {
    if (userAvailability) {
      const data = {
        user_id: userAvailability?.user_id.toString() ?? '',
        office: userAvailability?.office ?? '',
        module_id: userAvailability?.module_id ?? '',
        otp_enabled: userAvailability.is_active,
        appointment_type_id: userAvailability?.appointment_type_id.toString() ?? '',
        branch_id: userAvailability?.branch_id?.toString() ?? '1',
        appointment_duration: userAvailability?.appointment_duration ?? 0,
        days_of_week: Array.isArray(userAvailability?.days_of_week) ? userAvailability.days_of_week.map(day => parseInt(day)) : (userAvailability?.days_of_week ? [userAvailability.days_of_week] : []).map(day => parseInt(day)),
        start_time: convertHHMMToDate(userAvailability?.start_time),
        end_time: convertHHMMToDate(userAvailability?.end_time),
        free_slots: userAvailability?.free_slots.map(slot => ({
          start_time: convertHHMMToDate(slot.start_time),
          end_time: convertHHMMToDate(slot.end_time)
        })) ?? []
      };
      console.log(userAvailability, data);
      setInitialData(data);
    }
  }, [userAvailability]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, showValidations && /*#__PURE__*/React.createElement("div", {
    className: "validation-section mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`
  }, /*#__PURE__*/React.createElement("i", {
    className: `${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`
  }), isComplete ? 'Horarios configurados correctamente! Puede continuar al siguiente módulo.' : 'Configure al menos un rol de Horarios para habilitar el botón "Siguiente Módulo"')), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Horarios de Atenci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo"))), /*#__PURE__*/React.createElement(UserAvailabilityTable, {
    availabilities: availabilities,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(UserAvailabilityFormModal, {
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
    },
    initialData: initialData
  })));
};