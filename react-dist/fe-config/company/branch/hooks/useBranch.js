import { useState } from "react";
import { branchService } from "../../../../../services/api/index.js";
import { ErrorHandler } from "../../../../../services/errorHandler.js";
export const useBranch = () => {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchBranchHook = async id => {
    try {
      const data = await branchService.get(id);
      setBranch(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    branch,
    setBranch,
    fetchBranchHook
  };
};