import { resourcesAdminService } from "../../../services/api/index.js";
import { useState } from "react";
export const useAdvancePayments = () => {
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchAdvancePayments(thirdPartyId, type) {
    const data = await resourcesAdminService.getAdvancePayments(thirdPartyId, type);
    console.log("data:", data);
    setAdvances(data);
  }
  return {
    fetchAdvancePayments,
    loading,
    advances
  };
};