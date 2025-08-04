import { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { getDispensedClaim } from "../../../services/koneksiService.js";
export const useDispensedClaim = () => {
  const [dispensedClaim, setDispensedClaim] = useState(null);
  const [dispensedClaimFiles, setDispensedClaimFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchDispensedClaim = async claimId => {
    try {
      const data = await getDispensedClaim({
        claimId
      });
      setDispensedClaimFiles(data.files);
      setDispensedClaim(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    dispensedClaim,
    dispensedClaimFiles,
    fetchDispensedClaim,
    loading
  };
};