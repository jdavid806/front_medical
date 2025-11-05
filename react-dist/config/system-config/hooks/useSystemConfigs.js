import { useEffect, useState } from "react";
import SystemConfigService from "../../../../services/api/classes/systemConfigService.js";
export const useSystemConfigs = () => {
  const [systemConfigs, setSystemConfigs] = useState([]);
  const getSystemConfigs = async () => {
    try {
      const service = new SystemConfigService();
      const data = await service.getAllSystemConfigs();
      setSystemConfigs(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getSystemConfigs();
  }, []);
  return {
    systemConfigs,
    getSystemConfigs
  };
};