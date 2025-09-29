import { useCompanyGeneral } from "./useCompanyGeneral.js";
import { useCompanyMutation } from "./useCompanyMutation.js";
export const useCompany = () => {
  const companyData = useCompanyGeneral();
  const companyMutation = useCompanyMutation();
  const guardarInformacionGeneral = async (formData, logoFile, marcaAguaFile) => {
    const companyId = companyData.company?.id;
    const result = await companyMutation.guardarInformacionGeneral(formData, logoFile, marcaAguaFile, companyId);
    if (result) {
      console.log("✅ Guardado exitoso, recargando datos...");
      setTimeout(() => {
        companyData.refetch();
        console.log("🔄 Datos recargados");
      }, 2000);
    }
    return result;
  };
  return {
    company: companyData.company,
    loading: companyData.loading,
    error: companyData.error,
    refetch: companyData.refetch,
    guardarInformacionGeneral,
    mutationLoading: companyMutation.isLoading,
    mutationError: companyMutation.error,
    mutationSuccess: companyMutation.isSuccess,
    resetMutation: companyMutation.reset
  };
};