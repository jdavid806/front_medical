import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import { SeeDetailTableAction } from "../../components/table-actions/SeeDetailTableAction.js";
import { RequestCancellationTableAction } from "../../components/table-actions/RequestCancellationTableAction.js";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction.js";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
export const PatientClinicalRecordsTable = ({
  records,
  onSeeDetail,
  onCancelItem,
  onPrintItem,
  onDownloadItem,
  onShareItem
}) => {
  const [tableRecords, setTableRecords] = useState([]);
  useEffect(() => {
    const mappedRecords = records.map(clinicalRecord => {
      return {
        id: clinicalRecord.id,
        clinicalRecordName: clinicalRecord.clinical_record_type.name,
        description: clinicalRecord.description || '--',
        doctorName: `${clinicalRecord.created_by_user.first_name} ${clinicalRecord.created_by_user.middle_name} ${clinicalRecord.created_by_user.last_name} ${clinicalRecord.created_by_user.second_last_name}`,
        status: clinicalRecord.clinical_record_type_id,
        patientId: clinicalRecord.patient_id
      };
    });
    setTableRecords(mappedRecords);
  }, [records]);
  const columns = [{
    data: 'clinicalRecordName'
  }, {
    data: 'doctorName'
  }, {
    data: 'description'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    // 3: (cell, data: PatientClinicalRecordsTableItem) => (
    //     <span
    //         className={`badge badge-phoenix badge-phoenix-${clinicalRecordStates[data.status]}`}
    //     >
    //         {clinicalRecordStateColors[data.status]}
    //     </span>
    // ),
    3: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "text-end align-middle"
    }, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(SeeDetailTableAction, {
      onTrigger: () => onSeeDetail && onSeeDetail(data.id)
    }), data.status === 'approved' && /*#__PURE__*/React.createElement(RequestCancellationTableAction, {
      onTrigger: () => onCancelItem && onCancelItem(data.id)
    }), /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: () => onPrintItem && onPrintItem(data.id, data.clinicalRecordName)
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: () => onDownloadItem && onDownloadItem(data.id, data.clinicalRecordName)
    }), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("hr", {
      className: "dropdown-divider"
    })), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Compartir"), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: () => onShareItem && onShareItem(data.id, 'whatsapp', data.clinicalRecordName, data.patientId)
    }), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "email",
      onTrigger: () => onShareItem && onShareItem(data.id, 'email', data.clinicalRecordName, data.patientId)
    })))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableRecords,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Nombre de la historia"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Doctor(a)"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Observaciones"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  }, "Acciones")))))));
};