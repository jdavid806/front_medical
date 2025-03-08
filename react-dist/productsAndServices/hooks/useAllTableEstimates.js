import { useState, useEffect } from "react";
import { estimatesService } from "../../../services/api/index.js";
export const useAllTableEstimates = () => {
  const [estimates, setEstimates] = useState([]);
  const fetchEstimates = async () => {
    estimatesService.getAllEstimates().then(estimates => {
      console.log(estimates);
      setEstimates(estimates.map(estimate => ({
        id: estimate.id,
        estimate_date: estimate.attributes["fecha de creacion"],
        dueDate: estimate.attributes["fecha de vencimiento"],
        amount_paid: "100000",
        missing_amount: "1000000",
        quantity: estimate.attributes.cantidad
      })));
    });
  };
  useEffect(() => {
    fetchEstimates();
  }, []);
  return {
    estimates,
    fetchEstimates
  };
};