import React from "react";
import { useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { convenioTenantService } from "../../../services/api";
import { get } from "react-hook-form";

interface Clinica {
  id: number;
  idConvenio?: number;
  nombre: string;
  convenioActivo: boolean;
}

export function useConvenios(toastRef: React.RefObject<Toast>) {
  const [convenios, setConvenios] = useState<Clinica[]>([]);
  const [conveniosDisponibles, setConveniosDisponibles] = useState<Clinica[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tenant = window.location.hostname;
  const subdominio = tenant.split(".")[0];

  // quiero utilizar Promiseall para cargar ambos datos al inicio
  const fetchData = async () => {
    await Promise.all([fetchConveniosActivos(), getConveniosAvailable()]);
  };

  useEffect(() => {
    async function loadData() {
      const response = await getTenantWithDomainById(subdominio);
      if (response) {
        localStorage.setItem("tenantId", response.id);
      }
      await fetchData();
    }
    loadData();
  }, [subdominio]);

  // 🔹 GET Tenant by Domain
  const getTenantWithDomainById = async (id: string) => {
    try {
      setLoading(true);
      const response = await convenioTenantService.getTenantWithDomainById(id);
      return response.data;
    } catch (err) {
      console.error(err);
      setError("Error al obtener el tenant con dominio");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET Convenios Activos
  const fetchConveniosActivos = async () => {
    try {
      setLoading(true);
      const response = await convenioTenantService.getConveniosActivos();

      console.log("Response convenios activos:", response.convenios);

      // 🚀 Aquí adaptamos la estructura real a Clinica[]
      const data: Clinica[] = response.convenios.map((c: any) => ({
        id: c.tenant_b.id,
        idConvenio: c.id,
        nombre: c.tenant_b.tenant_id ?? "Sin nombre",
        convenioActivo: c.status === "activo",
      }));

      setConvenios(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar convenios activos");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET Farmacias con Recetas
  const getFarmaciasWithRecetasConvenio = async (payload: any) => {
    try {
      setLoading(true);
      const response =
        await convenioTenantService.getFarmaciasWithRecetasConvenio(payload);
      return response.data;
    } catch (err) {
      console.error(err);
      setError("Error al cargar farmacias con recetas");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET Convenios Disponibles
  const getConveniosAvailable = async () => {
    try {
      setLoading(true);
      const response = await convenioTenantService.getConveniosAvailable();
      const data: Clinica[] = response.data.map((c: any) => ({
        id: c.id,
        nombre: c.tenant_id ?? "Sin nombre",
        convenioActivo: false,
      }));
      setConveniosDisponibles(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar convenios disponibles");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear Convenio
  const crearConvenio = async (tenantB: number, module: string) => {
    try {
      setLoading(true);

      if (module !== "farmacia") {
        toastRef.current?.show({
          severity: "warn",
          summary: "Módulo no disponible",
          detail:
            "Estos módulos aún no se encuentran disponibles para convenios. Contactar al admin.",
        });
        return;
      }

      // Obtener tenantA desde localStorage
      const tenantA = localStorage.getItem("tenantId");
      if (!tenantA) {
        throw new Error("TenantA no encontrado en localStorage");
      }

      const payload = {
        tenant_a_id: Number(tenantA),
        tenant_b_id: tenantB,
        modules: [module],
        status: "activo",
      };

      console.log("Payload convenio:", payload);

      await convenioTenantService.createConvenio(payload);

      setConvenios((prev) =>
        prev.map((c) => (c.id === tenantB ? { ...c, convenioActivo: true } : c))
      );

      await fetchData();

      toastRef.current?.show({
        severity: "success",
        summary: "Convenio creado",
        detail: `Convenio con ${module} activado exitosamente.`,
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el convenio");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancelar Convenio
  const cancelarConvenio = async (id: number) => {
    try {
      setLoading(true);

      await convenioTenantService.cancelConvenio(id);

      setConvenios((prev) =>
        prev.map((c) => (c.id === id ? { ...c, convenioActivo: false } : c))
      );

      await fetchData();

      toastRef.current?.show({
        severity: "info",
        summary: "Convenio cancelado",
        detail: "El convenio ha sido cancelado correctamente.",
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo cancelar el convenio");
    } finally {
      setLoading(false);
    }
  };

  return {
    convenios,
    conveniosDisponibles,
    loading,
    error,
    // Métodos expuestos del servicio
    getTenantWithDomainById,
    fetchConveniosActivos,
    getFarmaciasWithRecetasConvenio,
    crearConvenio,
    cancelarConvenio,
  };
}
