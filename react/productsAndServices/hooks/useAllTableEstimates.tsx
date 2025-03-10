import { useState, useEffect } from "react";
import { estimatesService } from "../../../services/api/index.js";
import { EstimateDto } from "../../models/models.js";

export const useAllTableEstimates = () => {
  const [estimates, setEstimates] = useState<EstimateDto[]>([]);

  const fetchEstimates = async () => {
    estimatesService.getAllEstimates().then((estimates: EstimateDto[]) => {
      console.log(estimates);
      setEstimates(
        estimates.map((estimate: any) => ({
          id: estimate.id,
          estimate_date: estimate.attributes["fecha de creacion"],
          dueDate: estimate.attributes["fecha de vencimiento"],
          amount_paid: "100000",
          missing_amount: "1000000",
          quantity: estimate.attributes.cantidad,
        }))
      );
    });
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  return { estimates, fetchEstimates };
};
