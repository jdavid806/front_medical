import React, { useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { useSystemConfiguration } from "./hooks/useSystemConfiguration.js";
import { SystemConfigurationStyles } from "./styles/SystemConfigurationStyles.js";
import { configurationSteps } from "./types/steps.js";
import { StepperNavigation } from "./StepperNavigation.js";
import { StepperPanel } from "primereact/stepperpanel";
import { useConfigurationProgress } from "./hooks/useConfigurationProgress.js";
export const SystemConfiguration = ({
  onSave,
  onCancel,
  initialStep = 0
}) => {
  const stepperRef = useRef(null);
  const {
    activeIndex,
    goToNext,
    goToPrevious,
    goToStep,
    totalSteps,
    currentStep,
    isLoading,
    error,
    savedConfig,
    hasSavedProgress,
    isRestoredFromSave,
    resetToInitial
  } = useSystemConfiguration({
    steps: configurationSteps,
    initialStep
  });
  const {
    clearProgress,
    saveProgress
  } = useConfigurationProgress();
  const [canProceedFromCompany, setCanProceedFromCompany] = useState(false);
  const [canProceedFromContabilidad, setCanProceedFromContabilidad] = useState(false);
  const [canProceedFromEspecialidades, setCanProceedFromEspecialidades] = useState(false);
  const [canProceedFromServicios, setCanProceedFromServicios] = useState(false);
  const [canProceedFromUsuarios, setCanProceedFromUsuarios] = useState(false);
  const [canProceedFromRoles, setCanProceedFromRoles] = useState(false);
  const [canProceedFromHorarios, setCanProceedFromHorarios] = useState(false);
  const [canProceedFromPrecios, setCanProceedFromPrecios] = useState(false);
  const [contabilidadSubSteps, setContabilidadSubSteps] = useState([false, false, false, false, false]);

  // Obtener la configuración parseada correctamente
  const getParsedConfig = () => {
    if (!savedConfig) return null;

    // Si config_tenants es un string, parsearlo
    if (savedConfig.config_tenants && typeof savedConfig.config_tenants === "string") {
      try {
        return JSON.parse(savedConfig.config_tenants);
      } catch (error) {
        console.error("Error parseando config_tenants:", error);
        return null;
      }
    }
    return savedConfig.config_tenants || savedConfig;
  };
  const parsedConfig = getParsedConfig();
  const handleFinalSave = async () => {
    try {
      console.log("🏁 Finalizando configuración del sistema...");
      await clearProgress();
      await saveProgress(currentStep.id, activeIndex, true);
      onSave?.({
        currentStep: currentStep.id,
        stepIndex: activeIndex,
        contabilidadSubSteps: currentStep.id === "contabilidad" ? contabilidadSubSteps : undefined,
        empresaCompleta: currentStep.id === "empresa" ? canProceedFromCompany : undefined,
        especialidadesCompletas: currentStep.id === "especialidades" ? canProceedFromEspecialidades : undefined,
        serviciosCompletos: currentStep.id === "servicios" ? canProceedFromServicios : undefined,
        usuariosCompletos: currentStep.id === "usuarios" ? canProceedFromUsuarios : undefined,
        rolesCompletos: currentStep.id === "roles" ? canProceedFromRoles : undefined,
        horariosCompletos: currentStep.id === "horarios" ? canProceedFromHorarios : undefined,
        preciosCompletos: currentStep.id === "precios" ? canProceedFromPrecios : undefined
      });
      window.location.href = "/Dashboard";
    } catch (error) {
      console.error("❌ Error al finalizar configuración:", error);
    }
  };
  const handleCompanyConfigComplete = () => {
    console.log("✅ Configuración de empresa completada");
    setCanProceedFromCompany(true);
  };
  const handleContabilidadConfigComplete = subStepCompletion => {
    setContabilidadSubSteps(subStepCompletion);
    const allSubStepsComplete = subStepCompletion.every(step => step === true);
    setCanProceedFromContabilidad(allSubStepsComplete);
  };
  const handleEspecialidadesConfigComplete = isComplete => {
    setCanProceedFromEspecialidades(isComplete);
  };
  const handleServiciosConfigComplete = isComplete => {
    setCanProceedFromServicios(isComplete);
  };
  const handleUsuariosConfigComplete = isComplete => {
    setCanProceedFromUsuarios(isComplete);
  };
  const handleRolesConfigComplete = isComplete => {
    setCanProceedFromRoles(isComplete);
  };
  const handleHorariosConfigComplete = isComplete => {
    setCanProceedFromHorarios(isComplete);
  };
  const handlePreciosConfigComplete = isComplete => {
    setCanProceedFromPrecios(isComplete);
  };

  // Determinar si el botón "Siguiente" debe estar deshabilitado
  const isNextDisabled = currentStep.id === "empresa" && !canProceedFromCompany || currentStep.id === "contabilidad" && !canProceedFromContabilidad || currentStep.id === "especialidades" && !canProceedFromEspecialidades || currentStep.id === "servicios" && !canProceedFromServicios || currentStep.id === "usuarios" && !canProceedFromUsuarios || currentStep.id === "roles" && !canProceedFromRoles || currentStep.id === "horarios" && !canProceedFromHorarios || currentStep.id === "precios" && !canProceedFromPrecios;

  // Mostrar loading mientras se carga el progreso
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container-fluid mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Configuraci\xF3n General del Sistema",
      className: "text-center shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-5"
    }, /*#__PURE__*/React.createElement(ProgressBar, {
      mode: "indeterminate",
      style: {
        height: "4px"
      }
    }), /*#__PURE__*/React.createElement("p", {
      className: "mt-3 text-muted"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-cloud-download me-2"
    }), isRestoredFromSave ? "Restaurando progreso guardado..." : "Inicializando configuración..."))))));
  }

  // Mostrar error si hay problemas cargando el progreso
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container-fluid mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Configuraci\xF3n General del Sistema",
      className: "text-center shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-warning"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-exclamation-triangle me-2"
    }), error), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 justify-content-center"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Reintentar",
      icon: "pi pi-refresh",
      onClick: () => window.location.reload(),
      className: "p-button-outlined"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Continuar sin progreso",
      icon: "pi pi-play",
      onClick: resetToInitial,
      className: "p-button-primary"
    })))))));
  }
  const progressValue = (activeIndex + 1) / totalSteps * 100;

  // Calcular progreso detallado para contabilidad
  const getContabilidadProgress = () => {
    if (currentStep.id !== "contabilidad") return null;
    const completedSubSteps = contabilidadSubSteps.filter(Boolean).length;
    const totalSubSteps = contabilidadSubSteps.length;
    const subStepProgress = completedSubSteps / totalSubSteps * 100;
    return {
      completedSubSteps,
      totalSubSteps,
      subStepProgress
    };
  };
  const contabilidadProgress = getContabilidadProgress();
  const getModuleSpecificMessage = () => {
    switch (currentStep.id) {
      case "empresa":
        return !canProceedFromCompany ? 'Complete todos los módulos de empresa para habilitar el botón "Siguiente Módulo"' : "¡Empresa configurada correctamente! Puede continuar al siguiente módulo.";
      case "contabilidad":
        return !canProceedFromContabilidad ? `Complete todos los submódulos de contabilidad para habilitar el botón "Siguiente Módulo" (${contabilidadProgress?.completedSubSteps}/${contabilidadProgress?.totalSubSteps})` : "¡Todos los submódulos de contabilidad están completos! Puede continuar al siguiente módulo.";
      case "especialidades":
        return !canProceedFromEspecialidades ? 'Configure al menos una especialidad activa para habilitar el botón "Siguiente Módulo"' : "¡Especialidades configuradas correctamente! Puede continuar al siguiente módulo.";
      case "servicios":
        return !canProceedFromServicios ? 'Configure al menos un servicio para habilitar el botón "Siguiente Módulo"' : "¡Servicios configurados correctamente! Puede continuar al siguiente módulo.";
      case "usuarios":
        return !canProceedFromUsuarios ? 'Configure al menos un usuario para habilitar el botón "Siguiente Módulo"' : "¡Usuarios configurados correctamente! Puede continuar al siguiente módulo.";
      case "roles":
        return !canProceedFromRoles ? 'Configure al menos un rol de usuario para habilitar el botón "Siguiente Módulo"' : "¡Roles configurados correctamente! Puede continuar al siguiente módulo.";
      case "horarios":
        return !canProceedFromHorarios ? 'Configure al menos un horario de atención para habilitar el botón "Siguiente Módulo"' : "¡Horarios configurados correctamente! Puede continuar al siguiente módulo.";
      case "precios":
        return !canProceedFromPrecios ? 'Configure al menos un precio para habilitar el botón "Siguiente Módulo"' : "¡Precios configurados correctamente! Puede continuar al siguiente módulo.";
      default:
        return "Complete la configuración de este módulo antes de continuar al siguiente.";
    }
  };

  // Verificar si mostrar alerta de éxito
  const shouldShowSuccessAlert = () => {
    switch (currentStep.id) {
      case "empresa":
        return canProceedFromCompany;
      case "contabilidad":
        return canProceedFromContabilidad;
      case "especialidades":
        return canProceedFromEspecialidades;
      case "servicios":
        return canProceedFromServicios;
      case "usuarios":
        return canProceedFromUsuarios;
      case "roles":
        return canProceedFromRoles;
      case "horarios":
        return canProceedFromHorarios;
      case "precios":
        return canProceedFromPrecios;
      default:
        return false;
    }
  };

  // Verificar si mostrar alerta de información
  const shouldShowInfoAlert = () => {
    switch (currentStep.id) {
      case "contabilidad":
        return !canProceedFromContabilidad && contabilidadProgress;
      case "empresa":
      case "especialidades":
      case "servicios":
      case "usuarios":
      case "roles":
      case "horarios":
      case "precios":
        return !shouldShowSuccessAlert();
      default:
        return false;
    }
  };
  const renderCurrentComponent = () => {
    const CurrentComponent = currentStep.component;

    // Definir qué steps son de configuración
    const configurationStepsIds = ["empresa", "contabilidad", "especialidades", "servicios", "usuarios", "roles", "horarios", "precios"];
    const isConfigurationContext = configurationStepsIds.includes(currentStep.id);
    if (currentStep.id === "empresa") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleCompanyConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "contabilidad") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleContabilidadConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "especialidades") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleEspecialidadesConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "servicios") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleServiciosConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "usuarios") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleUsuariosConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "roles") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleRolesConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "horarios") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handleHorariosConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    if (currentStep.id === "precios") {
      return /*#__PURE__*/React.createElement(CurrentComponent, {
        onConfigurationComplete: handlePreciosConfigComplete,
        isConfigurationContext: isConfigurationContext
      });
    }
    return /*#__PURE__*/React.createElement(CurrentComponent, null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n General del Sistema",
    className: "shadow-sm system-configuration-card"
  }, hasSavedProgress && parsedConfig && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info m-3 mb-0"
  }, /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle me-2"
  }), "Progreso restaurado: Continuando desde", " ", /*#__PURE__*/React.createElement("strong", null, parsedConfig.current_step), " (M\xF3dulo", " ", (parsedConfig.step_index ?? 0) + 1, ")"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-times",
    className: "p-button-text p-button-sm float-end",
    onClick: resetToInitial,
    tooltip: "Comenzar desde el inicio"
  })), /*#__PURE__*/React.createElement("div", {
    className: "row g-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 border-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 h-100 bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-primary mb-0 fw-bold"
  }, "M\xF3dulos de Configuraci\xF3n"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-outline-primary",
    onClick: resetToInitial
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-caret-left"
  }))), /*#__PURE__*/React.createElement(Stepper, {
    activeStep: activeIndex,
    orientation: "vertical",
    linear: false,
    className: "vertical-stepper overflow-auto"
  }, configurationSteps.map((step, index) => /*#__PURE__*/React.createElement(StepperPanel, {
    key: step.id,
    header: step.label,
    onClick: () => goToStep(index)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-9"
  }, /*#__PURE__*/React.createElement("div", {
    className: "configuration-content p-4 card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-section mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "M\xF3dulo ", activeIndex + 1, " de ", totalSteps), /*#__PURE__*/React.createElement("small", {
    className: "text-primary fw-bold"
  }, Math.round(progressValue), "% completado")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: progressValue,
    showValue: false,
    style: {
      height: "10px",
      borderRadius: "5px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "content-body mb-4"
  }, renderCurrentComponent()), /*#__PURE__*/React.createElement(StepperNavigation, {
    activeIndex: activeIndex,
    totalSteps: totalSteps,
    onPrevious: goToPrevious,
    onNext: goToNext,
    onSave: handleFinalSave,
    onCancel: onCancel,
    isNextDisabled: isNextDisabled
  }))))))), /*#__PURE__*/React.createElement("style", null, SystemConfigurationStyles));
};
export default SystemConfiguration;