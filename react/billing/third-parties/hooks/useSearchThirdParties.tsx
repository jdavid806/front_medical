import { useState } from "react";
import { ThirdPartyDto } from "../../../models/models";
import { thirdPartyService } from "../../../../services/api";

export const useSearchThirdParties = () => {
    const [thirdParties, setThirdParties] = useState<ThirdPartyDto[]>([]);

    const searchThirdParties = async (query: string, type: string) => {
        try {
            const filteredThirdParties = await thirdPartyService.getByFilters({
                per_page: 1000000,
                search: query,
                type: type,
            });

            setThirdParties(
                filteredThirdParties.data.map((thirdParty: ThirdPartyDto) => ({
                    ...thirdParty,
                    label: `${thirdParty.name}, Tel: ${thirdParty.phone}, Doc: ${(thirdParty.document_type + ' ' + thirdParty.document_number).trim()}`,
                }))
            );
        } catch (error) {
            console.error(error);
        }
    };

    return { thirdParties, searchThirdParties };
};
