import { useEffect } from "react";
import { resourcesAdminService } from "../../../services/api";
import { useState } from "react";

export const useAdvancePayments = () => {
  const [advances, setAdvances] = useState<any>([]);
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
