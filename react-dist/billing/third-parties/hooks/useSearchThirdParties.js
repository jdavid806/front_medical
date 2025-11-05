import { useState } from "react";
import { thirdPartyService } from "../../../../services/api/index.js";
export const useSearchThirdParties = () => {
  const [thirdParties, setThirdParties] = useState([]);
  const searchThirdParties = async (query, type) => {
    try {
      const filteredThirdParties = await thirdPartyService.getByFilters({
        per_page: 1000000,
        search: query,
        type: type
      });
      setThirdParties(filteredThirdParties.data.map(thirdParty => ({
        ...thirdParty,
        label: `${thirdParty.name}, Tel: ${thirdParty.phone}, Doc: ${(thirdParty.document_type + ' ' + thirdParty.document_number).trim()}`
      })));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    thirdParties,
    searchThirdParties
  };
};