import React from "react";
import { usePatients } from "../hooks/usePatients";
import { PatientTable } from "../PatientTable";

export const PatientTablePage = () => {

    const { patients } = usePatients()

    return (
        <PatientTable items={patients} />
    );
};

