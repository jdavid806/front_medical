import { useCompanyGeneral } from "./useCompanyGeneral";
import { useCompanyMutation } from "./useCompanyMutation";

export const useCompany = () => {
  const companyData = useCompanyGeneral();
  const companyMutation = useCompanyMutation();

  const guardarInformacionGeneral = async (
    formData: any,
    logoFile?: File,
    marcaAguaFile?: File
  ) => {
    const companyId = companyData.company?.id;

    try {
      const result = await companyMutation.guardarInformacionGeneral(
        formData,
        logoFile,
        marcaAguaFile,
        companyId
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
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
    resetMutation: companyMutation.reset,
  };
};
