// hooks/useCompanyMutation.ts
import { useState } from 'react';
import { companyService } from "../../../../services/api/index.js";
export const useCompanyMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const uploadFile = async (file, companyId, fileType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const modelType = fileType === 'logo' ? 'App\\Models\\logoFile' : 'App\\Models\\waterMark';
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", modelType);
        formData.append("model_id", companyId.toString());
        console.log("Subiendo archivo:", {
          modelType,
          companyId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });

        // @ts-ignore - Usar la función global guardarArchivo
        guardarArchivo(formData, true).then(async response => {
          console.log("✅ Archivo subido exitosamente:", response);

          // @ts-ignore - Usar la función global getUrlImage
          const file_url = await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true);
          resolve({
            file_url: file_url,
            model_type: response.file.model_type,
            model_id: response.file.model_id,
            id: response.file.id
          });
        }).catch(error => {
          console.error("❌ Error subiendo archivo:", error);
          reject(error);
        });
      } catch (error) {
        console.error("❌ Error en uploadFile:", error);
        reject(error);
      }
    });
  };
  const guardarInformacionGeneral = async (formData, logoFile, marcaAguaFile, companyId) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      console.log("🚀 Iniciando proceso de guardado...");
      let finalCompanyId = companyId;
      let response;

      // Si es una compañía nueva, primero crearla para obtener el ID
      if (!companyId) {
        console.log("📝 Creando nueva compañía primero...");
        const infoGeneralBasica = {
          legal_name: formData.legal_name,
          document_type: formData.document_type,
          document_number: formData.document_number,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          country: formData.country,
          city: formData.city,
          logo: null,
          watermark: null
        };
        response = await companyService.createCompany(infoGeneralBasica);
        if (response.data && response.data.id) {
          finalCompanyId = response.data.id;
        } else {
          throw new Error("No se pudo obtener el ID de la compañía creada");
        }
      }
      if (!finalCompanyId || finalCompanyId <= 0) {
        throw new Error("ID de compañía inválido");
      }

      // PRIMERO: Subir archivos (si existen)
      let logoUrl = null;
      let watermarkUrl = null;
      if (logoFile) {
        try {
          const uploadedLogo = await uploadFile(logoFile, finalCompanyId, 'logo');
          logoUrl = uploadedLogo.file_url;
        } catch (fileError) {
          throw new Error(`Error al subir el logo: ${fileError}`);
        }
      }
      if (marcaAguaFile) {
        try {
          const uploadedWatermark = await uploadFile(marcaAguaFile, finalCompanyId, 'watermark');
          watermarkUrl = uploadedWatermark.file_url;
        } catch (fileError) {
          throw new Error(`Error al subir la marca de agua: ${fileError}`);
        }
      }
      const infoGeneralCompleta = {
        legal_name: formData.legal_name,
        document_type: formData.document_type,
        document_number: formData.document_number,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        country: formData.country,
        city: formData.city
      };

      // Solo incluir logo y watermark si se subieron archivos
      if (logoUrl) {
        infoGeneralCompleta.logo = `App\\Models\\logoFile/${logoUrl.split('/').pop()}`;
      }
      if (watermarkUrl) {
        infoGeneralCompleta.watermark = `App\\Models\\waterMark/${watermarkUrl.split('/').pop()}`;
      }
      console.log("📦 Payload final para actualizar:", infoGeneralCompleta);
      if (companyId) {
        // Actualizar compañía existente
        response = await companyService.updateCompany(finalCompanyId, infoGeneralCompleta);
      } else {
        response = await companyService.updateCompany(finalCompanyId, infoGeneralCompleta);
      }
      console.log("🎉 Proceso completado exitosamente");
      setIsSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la información general';
      setError(errorMessage);
      console.error('❌ Error en guardarInformacionGeneral:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const reset = () => {
    setError(null);
    setIsSuccess(false);
  };
  return {
    guardarInformacionGeneral,
    isLoading,
    error,
    isSuccess,
    reset,
    uploadFile
  };
};