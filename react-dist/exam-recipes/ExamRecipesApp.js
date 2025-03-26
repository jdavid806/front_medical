import React, { useEffect, useState } from 'react';
import { useExamRecipes } from "./hooks/useExamRecipes.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { PrintTableAction } from "../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../components/table-actions/ShareTableAction.js";
import CustomDataTable from "../components/CustomDataTable.js";
import { userService } from "../../services/api/index.js";
const patientId = new URLSearchParams(window.location.search).get('patient_id');
export const ExamRecipesApp = () => {
  const {
    examRecipes
  } = useExamRecipes(patientId);
  const [tableExamRecipes, setTableExamRecipes] = useState([]);
  useEffect(() => {
    const mappedExamRecipes = examRecipes.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).map(prescription => ({
      id: prescription.id,
      doctor: `${prescription.user.first_name || ''} ${prescription.user.middle_name || ''} ${prescription.user.last_name || ''} ${prescription.user.second_last_name || ''}`,
      exams: prescription.details.map(detail => detail.exam_type.name).join(', '),
      patientId: prescription.patient_id,
      created_at: new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(prescription.created_at))
    }));
    setTableExamRecipes(mappedExamRecipes);
  }, [examRecipes]);
  const columns = [{
    data: 'doctor'
  }, {
    data: 'exams'
  }, {
    data: 'created_at'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    3: (cell, data) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "text-end flex justify-cointent-end"
    }, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: () => {
        //@ts-ignore
        crearDocumento(data.id, "Impresion", "RecetaExamen", "Completa", "Receta_de_examenes");
      }
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: () => {
        //@ts-ignore
        crearDocumento(data.id, "Descarga", "RecetaExamen", "Completa", "Receta_de_examenes");
      }
    }), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("hr", {
      className: "dropdown-divider"
    })), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Compartir"), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: async () => {
        const user = await userService.getLoggedUser();
        //@ts-ignore
        enviarDocumento(data.id, "Descarga", "RecetaExamen", "Completa", data.patientId, user.id, "Receta_de_examenes");
      }
    }))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableExamRecipes,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Doctor"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Examenes recetados"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};