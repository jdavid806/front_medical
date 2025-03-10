import { useState, useEffect } from 'react';
import { branchService } from "../../../services/api/index.js";
export const useBranchesForSelect = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBranches = async () => {
    try {
      const data = await branchService.getAll();
      const mappedData = data.map(item => {
        return {
          value: item.id.toString(),
          label: item.address
        };
      });
      console.log('branches', data, mappedData);
      setBranches(mappedData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchBranches().finally(() => setLoading(false));
  }, []);
  return {
    branches,
    loading
  };
};