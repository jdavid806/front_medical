import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { PatientSearch } from "./components/PatientSearch.js";
import { NotAvailable } from "./components/NotAvailable.js";
import { useLandingAvailabilities } from "./hooks/useLandingAvailabilities.js";
export const LandingApp = () => {
  const {
    data: availabilities,
    loading,
    error,
    fetchAvailabilities,
    isLandingAvailableNow
  } = useLandingAvailabilities();
  useEffect(() => {
    fetchAvailabilities();
  }, [fetchAvailabilities]);
  if (error) {
    return /*#__PURE__*/React.createElement("p", null, "Error: ", error);
  }

  // Loading spinner
  if (loading) {
    return /*#__PURE__*/React.createElement(Container, {
      className: "py-5 d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(Spinner, {
      animation: "border"
    }));
  }

  // Disponibilidad
  const available = isLandingAvailableNow();
  return /*#__PURE__*/React.createElement(Container, {
    className: "py-5"
  }, available ? /*#__PURE__*/React.createElement(PatientSearch, null) : /*#__PURE__*/React.createElement(NotAvailable, {
    availabilities: availabilities
  }));
};