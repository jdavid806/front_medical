import { useState, useEffect } from "react";
import { historyPreadmission } from "../../../services/api";
import { HistoryPreadmissionDto } from "../../models/models";

export const usePreadmissions = () => {
  const patientId = new URLSearchParams(window.location.search).get(
    "patient_id"
  );
  const [preadmissions, setPreadmissions] = useState<HistoryPreadmissionDto[]>(
    []
  );

  const fetchPreadmissions = async () => {
    const data = (await historyPreadmission.getHistoryPatient(
      patientId,
      0
    )) as HistoryPreadmissionDto[];

    setPreadmissions(
      data.map((item: any) => {
        return {
          ...item,
          imc: (item.weight / (item.size / 100) ** 2).toFixed(2) + "kg/m2",
          weight: item.weight.toString() + "lb",
          size: item.size.toString() + "cm",
          glycemia: item.glycemia.toString() + "mg/dl",
          createdAt: new Date(item.created_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      })
    );
  };

  useEffect(() => {
    fetchPreadmissions();
  }, []);

  return { preadmissions, fetchPreadmissions };
};
