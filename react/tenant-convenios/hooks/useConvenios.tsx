import { useState, useEffect } from "react";

interface Clinica {
  id: number;
  nombre: string;
  convenioActivo: boolean;
}

export function useConvenios() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simula fetch inicial
  useEffect(() => {
    fetchClinicas();
  }, []);

  const fetchClinicas = async () => {
    try {
      setLoading(true);
      // Aquí iría tu petición real al backend
      // const response = await fetch("/api/clinicas");
      // const data = await response.json();
      const data: Clinica[] = [
        { id: 1, nombre: "Clínica San José", convenioActivo: false },
        { id: 2, nombre: "Clínica Los Ángeles", convenioActivo: true },
        { id: 3, nombre: "Clínica El Bosque", convenioActivo: false },
      ];
      setClinicas(data);
    } catch (err) {
      setError("Error al cargar las clínicas");
    } finally {
      setLoading(false);
    }
  };

  const crearConvenio = async (id: number) => {
    try {
      setLoading(true);
      // await fetch(`/api/convenios/${id}`, { method: "POST" });
      setClinicas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, convenioActivo: true } : c
        )
      );
    } catch (err) {
      setError("No se pudo crear el convenio");
    } finally {
      setLoading(false);
    }
  };

  const cancelarConvenio = async (id: number) => {
    try {
      setLoading(true);
      // await fetch(`/api/convenios/${id}`, { method: "DELETE" });
      setClinicas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, convenioActivo: false } : c
        )
      );
    } catch (err) {
      setError("No se pudo cancelar el convenio");
    } finally {
      setLoading(false);
    }
  };

  return {
    clinicas,
    loading,
    error,
    crearConvenio,
    cancelarConvenio,
  };
}
