import { useEffect, useState } from "react";
import { packagesService } from "../../../services/api";

export const useClinicalPackages = () => {
    const [clinicalPackages, setClinicalPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClinicalPackages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await packagesService.getAllPackages();
            const mappedResponse = response.data.map((pkg: any) => ({
                ...pkg,
                label: `${pkg.name} - Código ${pkg.cie11 ? "CIE11" : "CUPS"}: ${pkg.cie11 || pkg.cups}`,
            }));
            setClinicalPackages(mappedResponse);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicalPackages();
    }, []);

    return {
        clinicalPackages,
        loading,
        error,
        fetchClinicalPackages,
    };
};