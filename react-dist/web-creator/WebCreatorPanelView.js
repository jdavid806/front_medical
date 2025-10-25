import React from 'react';
import { WebCreatorComponentView } from "./WebCreatorComponentView.js";
export const WebCreatorPanelView = props => {
  const {
    panel,
    updatePanelCols,
    selectedPanel,
    selectedComponent,
    hoveredPanel,
    handlePanelClick,
    handleComponentClick,
    setHoveredPanel
  } = props;
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
    }, /*#__PURE__*/React.createElement(WebCreatorPanelView, {
      panel: child,
      updatePanelCols: updatePanelCols,
      selectedPanel: selectedPanel,
      selectedComponent: selectedComponent,
      hoveredPanel: hoveredPanel,
      handlePanelClick: handlePanelClick,
      handleComponentClick: handleComponentClick,
      setHoveredPanel: setHoveredPanel
    }), /*#__PURE__*/React.createElement("div", {
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
    }, /*#__PURE__*/React.createElement(WebCreatorComponentView, {
      component: panel.component
    })));
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