import { useState, useEffect } from 'react';
import { assetsService } from "../../../../services/api/index.js";
export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const fetchAssets = async () => {
    try {
      const data = await assetsService.getAll();
      setAssets(data.data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchAssets();
  }, []);
  return {
    assets,
    fetchAssets
  };
};