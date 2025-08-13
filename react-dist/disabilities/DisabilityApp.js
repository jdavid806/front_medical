import React from 'react';
import DisabilityTable from "./components/DisabilityTable.js";
import { getColumns } from "./enums/columns.js";
import { useGetData } from "./hooks/useGetData.js";
const DisabilityApp = ({
  patientId
}) => {
  const {
    data,
    loading,
    error,
    reload
  } = useGetData(patientId);
  const editDisability = id => {
    console.log('Editando discapacidad:', id);
  };
  const deleteDisability = id => {
    console.log('Eliminando discapacidad:', id);
    // Después de eliminar, podrías llamar reload() para refrescar los datos
  };
  const columns = getColumns({
    editDisability,
    deleteDisability
  });
  if (!patientId) {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert alert-warning"
    }, /*#__PURE__*/React.createElement("strong", null, "Advertencia:"), " No se ha proporcionado un ID de paciente. Por favor, aseg\xFArese de que la URL incluya el par\xE1metro ", /*#__PURE__*/React.createElement("code", null, "patient_id"), " o ", /*#__PURE__*/React.createElement("code", null, "id"), ".");
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", error, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger ms-2",
      onClick: reload
    }, "Reintentar"));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DisabilityTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: reload
  }));
};
export default DisabilityApp;