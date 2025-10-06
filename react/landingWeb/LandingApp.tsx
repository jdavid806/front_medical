import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { PatientSearch } from "./components/PatientSearch";
import { NotAvailable } from "./components/NotAvailable";
import { useLandingAvailabilities } from "./hooks/useLandingAvailabilities";

export const LandingApp: React.FC = () => {
  const { data: availabilities, loading, error, fetchAvailabilities, isLandingAvailableNow } =
    useLandingAvailabilities();

  useEffect(() => {
    fetchAvailabilities();
  }, [fetchAvailabilities]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Loading spinner
  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  // Disponibilidad
  const available = isLandingAvailableNow();

  return (
    <Container className="py-5">
      {available ? <PatientSearch /> : <NotAvailable availabilities={availabilities} />}
    </Container>
  );
};
