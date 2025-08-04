import { useEffect } from "react";
import { ThirdPartyService } from "../../../../services/api/classes/thirdPartyService.js";
import { useState } from "react";
export const useThirdParties = () => {
  const [thirdParties, setThirdParties] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchThirdParties() {
    const thirdPartyService = new ThirdPartyService();
    const thirdParties = await thirdPartyService.getAll();
    setThirdParties(thirdParties.data);
  }
  useEffect(() => {
    fetchThirdParties();
  }, []);
  return {
    thirdParties,
    fetchThirdParties,
    loading
  };
};