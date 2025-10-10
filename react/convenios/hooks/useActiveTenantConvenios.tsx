import { useEffect, useState } from "react";
import { convenioTenantService } from "../../../services/api";

export const useActiveTenantConvenios = () => {

    const [convenios, setConvenios] = useState<any[]>([]);

    const fetchActiveTenantConvenios = async () => {
        try {
            const response = await convenioTenantService.getConveniosActivos();
            const mappedConvenios = response.convenios.map((convenio) => ({
                ...convenio,
                label: convenio.tenant_b.tenant_id,

            }));
            console.log("mappedConvenios", mappedConvenios);
            setConvenios(mappedConvenios);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    useEffect(() => {
        fetchActiveTenantConvenios();
    }, []);

    return {
        convenios
    }
};
