import { useState } from "react";
import { branchService } from "../../../../../services/api";
import { ErrorHandler } from "../../../../../services/errorHandler";

export const useBranch = () => {
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranchHook = async (id: any) => {
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
    fetchBranchHook,
  };
};
