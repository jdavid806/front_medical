import React, { useState, useCallback, useImperativeHandle } from 'react';
import { generateUUID } from "../../services/utilidades.js";
import { WebCreatorLogo } from "./components/WebCreatorLogo.js";
import { WebCreatorMenuBar } from "./components/WebCreatorMenuBar.js";
import { WebCreatorButton } from "./components/WebCreatorButton.js";
import { WebCreatorInput } from "./components/WebCreatorInput.js";
import { WebCreatorPanelView } from "./WebCreatorPanelView.js"; // NUEVA interfaz para configuración de tabs
export const WebCreatorSplitterEditor = /*#__PURE__*/React.forwardRef(({
  onPanelClick,
  onComponentClick
}, ref) => {
  const defaultPanelStyles = {
    padding: 6,
    margin: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    boxShadow: ''
  };
  const [rootPanel, setRootPanel] = useState({
    uuid: generateUUID(),
    component: null,
    children: [],
    layout: 'vertical',
    cols: 12,
    styles: defaultPanelStyles
  });
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [hoveredPanel, setHoveredPanel] = useState(null);

  // Función recursiva para encontrar un panel y su padre
  const findPanelAndParent = useCallback((currentPanel, uuid, parent = null) => {
    if (currentPanel.uuid === uuid) {
      return {
        panel: currentPanel,
        parent
      };
    }
    if (currentPanel.children && currentPanel.children.length > 0) {
      for (const child of currentPanel.children) {
        const result = findPanelAndParent(child, uuid, currentPanel);
        if (result) return result;
      }
    }
    return null;
  }, []);
  const addComponentToPanel = useCallback((panel, component) => {
    component.panel = panel;
    setRootPanel(prev => {
      const updatePanelComponent = currentPanel => {
        if (currentPanel.uuid === panel.uuid) {
          return {
            ...currentPanel,
            component
          };
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updatePanelComponent)
          };
        }
        return currentPanel;
      };
      return updatePanelComponent(prev);
    });
  }, []);
  const updateComponentInPanel = useCallback(component => {
    setRootPanel(prev => {
      const updatePanelComponent = currentPanel => {
        if (currentPanel.uuid === component.panel.uuid) {
          return {
            ...currentPanel,
            component
          };
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updatePanelComponent)
          };
        }
        return currentPanel;
      };
      return updatePanelComponent(prev);
    });

    // También actualiza el estado del componente seleccionado si es el mismo panel
    if (selectedPanel?.uuid === component.panel.uuid) {
      setSelectedComponent(component);
    }
  }, [selectedPanel]);
  const addSiblingPanel = useCallback((panel, direction) => {
    setRootPanel(prev => {
      const result = findPanelAndParent(prev, panel.uuid);
      if (!result) return prev;
      const {
        parent
      } = result;
      const newPanel = {
        uuid: generateUUID(),
        component: null,
        children: [],
        cols: 6,
        // Por defecto 6 columnas (mitad)
        minCols: 1,
        styles: defaultPanelStyles
      };

      // Si no tiene padre, estamos en el nivel raíz
      if (!parent) {
        const newRoot = {
          uuid: generateUUID(),
          component: null,
          children: [],
          layout: direction === 'above' || direction === 'below' ? 'vertical' : 'horizontal',
          cols: 12,
          styles: defaultPanelStyles
        };
        if (direction === 'above' || direction === 'left') {
          newRoot.children = [{
            ...newPanel,
            cols: 6
          }, {
            ...prev,
            cols: 6
          }];
        } else {
          newRoot.children = [{
            ...prev,
            cols: 6
          }, {
            ...newPanel,
            cols: 6
          }];
        }
        return newRoot;
      }
      const updateParentWithSibling = currentPanel => {
        if (currentPanel.uuid === parent.uuid) {
          const childIndex = currentPanel.children.findIndex(child => child.uuid === panel.uuid);
          if (childIndex === -1) return currentPanel;
          const newChildren = [...currentPanel.children];
          const isVerticalParent = currentPanel.layout === 'vertical';
          const isHorizontalDirection = direction === 'left' || direction === 'right';
          if (isVerticalParent && isHorizontalDirection || !isVerticalParent && !isHorizontalDirection) {
            const newContainer = {
              uuid: generateUUID(),
              component: null,
              children: [],
              layout: isHorizontalDirection ? 'horizontal' : 'vertical',
              cols: currentPanel.children[childIndex].cols || 12,
              styles: defaultPanelStyles
            };
            if (direction === 'above' || direction === 'left') {
              newContainer.children = [{
                ...newPanel,
                cols: 6
              }, {
                ...currentPanel.children[childIndex],
                cols: 6
              }];
            } else {
              newContainer.children = [{
                ...currentPanel.children[childIndex],
                cols: 6
              }, {
                ...newPanel,
                cols: 6
              }];
            }
            newChildren[childIndex] = newContainer;
          } else {
            // Calcular columnas disponibles
            const totalUsedCols = currentPanel.children.reduce((sum, child) => sum + (child.cols || 0), 0);
            const availableCols = 12 - totalUsedCols;
            if (availableCols <= 0) {
              // Redistribuir columnas equitativamente
              const newCols = Math.floor(12 / (currentPanel.children.length + 1));
              newChildren.forEach(child => {
                child.cols = newCols;
              });
              newPanel.cols = newCols;
            } else {
              // Usar columnas disponibles
              newPanel.cols = Math.min(6, availableCols);
              // Ajustar el panel actual para mantener total de 12
              currentPanel.children[childIndex].cols = (currentPanel.children[childIndex].cols || 0) - newPanel.cols;
            }
            if (direction === 'above' || direction === 'left') {
              newChildren.splice(childIndex, 0, newPanel);
            } else {
              newChildren.splice(childIndex + 1, 0, newPanel);
            }
          }
          return {
            ...currentPanel,
            children: newChildren
          };
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updateParentWithSibling)
          };
        }
        return currentPanel;
      };
      return updateParentWithSibling(prev);
    });
  }, [findPanelAndParent]);
  const addChildPanel = useCallback((panel, layout) => {
    setRootPanel(prev => {
      const updatePanelWithChildren = currentPanel => {
        if (currentPanel.uuid === panel.uuid) {
          // Guardar el componente actual antes de convertir en contenedor
          const existingComponent = currentPanel.component;
          const newChild = {
            uuid: generateUUID(),
            component: null,
            children: [],
            cols: 6,
            minCols: 1,
            styles: defaultPanelStyles
          };
          if (currentPanel.children && currentPanel.children.length > 0) {
            // Redistribuir columnas equitativamente
            const newCols = Math.floor(12 / (currentPanel.children.length + 1));
            const adjustedChildren = currentPanel.children.map(child => ({
              ...child,
              cols: newCols
            }));
            return {
              ...currentPanel,
              layout,
              children: [...adjustedChildren, {
                ...newChild,
                cols: newCols
              }]
            };
          }
          const secondChild = {
            uuid: generateUUID(),
            component: null,
            children: [],
            cols: 6,
            minCols: 1,
            styles: defaultPanelStyles
          };

          // Si el panel tenía un componente, lo movemos al primer hijo
          if (existingComponent) {
            newChild.component = existingComponent;
          }
          return {
            ...currentPanel,
            layout,
            children: [{
              ...newChild,
              cols: 6
            }, {
              ...secondChild,
              cols: 6
            }],
            component: null
          };
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updatePanelWithChildren)
          };
        }
        return currentPanel;
      };
      return updatePanelWithChildren(prev);
    });
  }, []);
  const removePanel = useCallback(panel => {
    setRootPanel(prev => {
      const result = findPanelAndParent(prev, panel.uuid);
      if (!result) return prev;
      const {
        parent
      } = result;
      if (!parent) return prev;
      const updateParentChildren = currentPanel => {
        if (currentPanel.uuid === parent.uuid) {
          const newChildren = currentPanel.children.filter(child => child.uuid !== panel.uuid);
          if (newChildren.length === 0) {
            return {
              ...currentPanel,
              children: [],
              layout: undefined
            };
          }

          // Redistribuir columnas equitativamente
          const newCols = Math.floor(12 / newChildren.length);
          const adjustedChildren = newChildren.map(child => ({
            ...child,
            cols: newCols
          }));
          return {
            ...currentPanel,
            children: adjustedChildren
          };
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updateParentChildren)
          };
        }
        return currentPanel;
      };
      return updateParentChildren(prev);
    });
  }, [findPanelAndParent]);
  const updatePanelCols = useCallback((panel, newCols) => {
    if (newCols < 1 || newCols > 12) return;
    setRootPanel(prev => {
      const result = findPanelAndParent(prev, panel.uuid);
      if (!result) return prev;
      const {
        parent
      } = result;
      if (!parent) return prev;
      const updateCols = currentPanel => {
        if (currentPanel.uuid === parent.uuid) {
          const panelIndex = currentPanel.children.findIndex(child => child.uuid === panel.uuid);
          if (panelIndex === -1) return currentPanel;

          // Calcular columnas totales usadas por los hermanos
          const siblings = currentPanel.children.filter((_, index) => index !== panelIndex);
          const totalSiblingCols = siblings.reduce((sum, sibling) => sum + (sibling.cols || 0), 0);

          // Verificar si hay suficientes columnas disponibles
          const availableCols = 12 - totalSiblingCols;
          if (newCols <= availableCols) {
            // Hay espacio suficiente, actualizar el panel
            const updatedChildren = currentPanel.children.map((child, index) => {
              if (index === panelIndex) {
                return {
                  ...child,
                  cols: newCols
                };
              }
              return child;
            });
            return {
              ...currentPanel,
              children: updatedChildren
            };
          } else {
            // No hay suficiente espacio, no hacer cambios
            return currentPanel;
          }
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updateCols)
          };
        }
        return currentPanel;
      };
      return updateCols(prev);
    });
  }, [findPanelAndParent]);
  const updatePanel = useCallback(panel => {
    setRootPanel(prev => {
      const updatePanelStylesRecursive = currentPanel => {
        if (currentPanel.uuid === panel.uuid) {
          return {
            ...currentPanel,
            styles: {
              ...currentPanel.styles,
              ...panel.styles
            }
          };
        }
        if (currentPanel.children && currentPanel.children.length > 0) {
          return {
            ...currentPanel,
            children: currentPanel.children.map(updatePanelStylesRecursive)
          };
        }
        return currentPanel;
      };
      return updatePanelStylesRecursive(prev);
    });
  }, []);

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    addComponentToPanel,
    updateComponentInPanel,
    addSiblingPanel,
    addChildPanel,
    removePanel,
    updatePanelCols,
    getRootPanel: () => rootPanel,
    updatePanel
  }));
  const handlePanelClick = (panel, event) => {
    event.stopPropagation();
    setSelectedPanel(panel);
    setSelectedComponent(null);
    onPanelClick(panel);
  };
  const handleComponentClick = (component, event) => {
    event.stopPropagation();
    setSelectedComponent(component);
    setSelectedPanel(null);
    onComponentClick(component);
  };
  const renderComponent = component => {
    switch (component.type) {
      case "logo":
        return /*#__PURE__*/React.createElement(WebCreatorLogo, {
          component: component
        });
      case "menubar":
        return /*#__PURE__*/React.createElement(WebCreatorMenuBar, {
          component: component
        });
      case "button":
        return /*#__PURE__*/React.createElement(WebCreatorButton, {
          component: component
        });
      case "sidebar":
        return /*#__PURE__*/React.createElement("div", null, "Sidebar settings");
      case "input":
        return /*#__PURE__*/React.createElement(WebCreatorInput, {
          component: component
        });
      default:
        return /*#__PURE__*/React.createElement("div", null, "Unknown component type");
    }
  };

  // Función recursiva para renderizar los paneles
  const renderPanel = panel => {
    const isSelected = selectedPanel?.uuid === panel.uuid;
    const isHovered = hoveredPanel === panel.uuid;
    const hasComponent = panel.component !== null;
    const hasChildren = panel.children && panel.children.length > 0;

    // Calcular ancho basado en columnas
    const widthPercentage = (panel.cols || 12) / 12 * 100;

    // Aplicar estilos configurados o usar valores por defecto
    const panelStyle = {
      flex: `0 0 ${widthPercentage}%`,
      minWidth: '20px',
      minHeight: '20px',
      border: isSelected ? '3px solid #3B82F6' : isHovered ? '2px solid #93C5FD' : `${panel.styles?.borderWidth || 0}px solid ${panel.styles?.borderColor || '#e5e7eb'}`,
      borderRadius: (panel.styles?.borderRadius || 6) + 'px',
      margin: (panel.styles?.margin || 0) + 2 + 'px',
      padding: (panel.styles?.padding || 0) + 2 + 'px',
      backgroundColor: panel.styles?.backgroundColor || '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.1)' : panel.styles?.boxShadow || 'none'
    };
    const containerStyle = {
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: panel.layout === 'vertical' ? 'column' : 'row',
      alignItems: panel.styles?.alignItems || 'center',
      justifyContent: panel.styles?.justifyContent || 'center',
      gap: '4px'
    };
    if (hasChildren) {
      return /*#__PURE__*/React.createElement("div", {
        style: panelStyle,
        onClick: e => handlePanelClick(panel, e),
        onMouseEnter: () => setHoveredPanel(panel.uuid),
        onMouseLeave: () => setHoveredPanel(null)
      }, /*#__PURE__*/React.createElement("div", {
        style: containerStyle
      }, panel.children.map(child => /*#__PURE__*/React.createElement("div", {
        key: child.uuid,
        style: {
          flex: `0 0 ${(child.cols || 12) / 12 * 100}%`,
          position: 'relative'
        }
      }, renderPanel(child), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: '4px',
          right: '4px',
          display: 'flex',
          gap: '4px',
          zIndex: 10
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: e => {
          e.stopPropagation();
          if (child.cols && child.cols > 1) {
            updatePanelCols(child, child.cols - 1);
          }
        },
        style: {
          background: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          fontSize: '12px'
        },
        title: "Reducir columnas"
      }, "-"), /*#__PURE__*/React.createElement("span", {
        style: {
          background: 'rgba(255,255,255,0.9)',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      }, child.cols), /*#__PURE__*/React.createElement("button", {
        onClick: e => {
          e.stopPropagation();
          // Calcular columnas disponibles
          const totalUsedCols = panel.children.reduce((sum, sibling) => {
            if (sibling.uuid !== child.uuid) {
              return sum + (sibling.cols || 0);
            }
            return sum;
          }, 0);
          const availableCols = 12 - totalUsedCols;
          if (child.cols && child.cols < availableCols) {
            updatePanelCols(child, child.cols + 1);
          }
        },
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          fontSize: '12px'
        },
        title: "Aumentar columnas"
      }, "+"))))));
    } else if (hasComponent) {
      const isComponentSelected = selectedComponent?.uuid === panel.component?.uuid;
      return /*#__PURE__*/React.createElement("div", {
        style: panelStyle,
        onClick: e => handlePanelClick(panel, e),
        onMouseEnter: () => setHoveredPanel(panel.uuid),
        onMouseLeave: () => setHoveredPanel(null)
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isComponentSelected ? '2px solid #10B981' : 'none',
          borderRadius: '4px',
          backgroundColor: '#F9FAFB',
          cursor: 'pointer'
        },
        onClick: e => {
          e.stopPropagation();
          handleComponentClick(panel.component, e);
        },
        onMouseEnter: e => {
          e.stopPropagation();
          setHoveredPanel(panel.uuid);
        },
        onMouseLeave: e => {
          e.stopPropagation();
          setHoveredPanel(null);
        }
      }, renderComponent(panel.component)));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        style: panelStyle,
        onClick: e => handlePanelClick(panel, e),
        onMouseEnter: () => setHoveredPanel(panel.uuid),
        onMouseLeave: () => setHoveredPanel(null)
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#6B7280',
          fontSize: '14px'
        }
      }, "Panel vac\xEDo"));
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WebCreatorPanelView, {
    panel: rootPanel,
    updatePanelCols: updatePanelCols,
    selectedPanel: selectedPanel,
    selectedComponent: selectedComponent,
    hoveredPanel: hoveredPanel,
    handlePanelClick: handlePanelClick,
    handleComponentClick: handleComponentClick,
    setHoveredPanel: setHoveredPanel
  }));
});