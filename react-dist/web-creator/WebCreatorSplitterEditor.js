import React, { useState, useCallback, useImperativeHandle } from 'react';
import { generateUUID } from "../../services/utilidades.js";
import { Splitter, SplitterPanel } from 'primereact/splitter';
export const WebCreatorSplitterEditor = /*#__PURE__*/React.forwardRef(({
  onPanelClick,
  onComponentClick
}, ref) => {
  const [panels, setPanels] = useState([{
    uuid: generateUUID(),
    component: null,
    children: [],
    size: 100,
    minSize: 20
  }]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Función recursiva para encontrar un panel y su padre
  const findPanelAndParent = useCallback((panelsList, uuid, parent = null) => {
    for (const panel of panelsList) {
      if (panel.uuid === uuid) {
        return {
          panel,
          parent
        };
      }
      if (panel.children && panel.children.length > 0) {
        const result = findPanelAndParent(panel.children, uuid, panel);
        if (result) return result;
      }
    }
    return null;
  }, []);
  const addComponentToPanel = useCallback((panel, component) => {
    setPanels(prev => {
      const updatePanelComponent = panelsList => {
        return panelsList.map(p => {
          if (p.uuid === panel.uuid) {
            return {
              ...p,
              component
            };
          }
          if (p.children && p.children.length > 0) {
            return {
              ...p,
              children: updatePanelComponent(p.children)
            };
          }
          return p;
        });
      };
      return updatePanelComponent(prev);
    });
  }, []);
  const addSiblingPanel = useCallback((panel, direction) => {
    setPanels(prev => {
      const result = findPanelAndParent(prev, panel.uuid);
      if (!result) return prev;
      const {
        parent
      } = result;
      const newPanel = {
        uuid: generateUUID(),
        component: null,
        children: [],
        size: 50,
        minSize: 10
      };

      // Si no tiene padre, estamos en el nivel raíz
      if (!parent) {
        const index = prev.findIndex(p => p.uuid === panel.uuid);
        if (index === -1) return prev;
        const newPanels = [...prev];
        // Ajustar el tamaño de los paneles existentes
        const adjustedPanels = newPanels.map(p => ({
          ...p,
          size: 100 / (newPanels.length + 1)
        }));
        if (direction === 'before') {
          return [newPanel, ...adjustedPanels];
        } else {
          adjustedPanels.splice(index + 1, 0, newPanel);
          return adjustedPanels;
        }
      }

      // Si tiene padre, actualizamos los children del padre
      const updateParentChildren = panelsList => {
        return panelsList.map(p => {
          if (p.uuid === parent.uuid) {
            const index = p.children.findIndex(child => child.uuid === panel.uuid);
            if (index === -1) return p;
            const newChildren = [...p.children];
            // Ajustar el tamaño de los children existentes
            const adjustedChildren = newChildren.map(child => ({
              ...child,
              size: 100 / (newChildren.length + 1)
            }));
            if (direction === 'before') {
              adjustedChildren.splice(index, 0, newPanel);
            } else {
              adjustedChildren.splice(index + 1, 0, newPanel);
            }
            return {
              ...p,
              children: adjustedChildren
            };
          }
          if (p.children && p.children.length > 0) {
            return {
              ...p,
              children: updateParentChildren(p.children)
            };
          }
          return p;
        });
      };
      return updateParentChildren(prev);
    });
  }, [findPanelAndParent]);
  const addChildPanel = useCallback((panel, layout) => {
    setPanels(prev => {
      const updatePanelWithChildren = panelsList => {
        return panelsList.map(p => {
          if (p.uuid === panel.uuid) {
            const newChild = {
              uuid: generateUUID(),
              component: null,
              children: [],
              size: 50,
              minSize: 10
            };

            // Si ya tiene children, añadimos uno nuevo
            if (p.children && p.children.length > 0) {
              const adjustedChildren = p.children.map(child => ({
                ...child,
                size: 100 / (p.children.length + 1)
              }));
              return {
                ...p,
                layout,
                children: [...adjustedChildren, newChild]
              };
            }

            // Si no tiene children, creamos dos paneles hijos
            const secondChild = {
              uuid: generateUUID(),
              component: null,
              children: [],
              size: 50,
              minSize: 10
            };
            return {
              ...p,
              layout,
              children: [newChild, secondChild],
              component: null // Limpiamos el componente si convertimos en contenedor
            };
          }
          if (p.children && p.children.length > 0) {
            return {
              ...p,
              children: updatePanelWithChildren(p.children)
            };
          }
          return p;
        });
      };
      return updatePanelWithChildren(prev);
    });
  }, []);
  const removePanel = useCallback(panel => {
    setPanels(prev => {
      const result = findPanelAndParent(prev, panel.uuid);
      if (!result) return prev;
      const {
        parent
      } = result;

      // Si no tiene padre, estamos en el nivel raíz
      if (!parent) {
        const newPanels = prev.filter(p => p.uuid !== panel.uuid);
        if (newPanels.length === 0) {
          // Si eliminamos todos los paneles, creamos uno nuevo
          return [{
            uuid: generateUUID(),
            component: null,
            children: [],
            size: 100,
            minSize: 20
          }];
        }

        // Ajustar los tamaños de los paneles restantes
        return newPanels.map(p => ({
          ...p,
          size: 100 / newPanels.length
        }));
      }

      // Si tiene padre, eliminamos de los children del padre
      const updateParentChildren = panelsList => {
        return panelsList.map(p => {
          if (p.uuid === parent.uuid) {
            const newChildren = p.children.filter(child => child.uuid !== panel.uuid);
            if (newChildren.length === 0) {
              // Si no quedan children, convertimos el panel en un panel simple
              return {
                ...p,
                children: [],
                layout: undefined
              };
            }

            // Ajustar los tamaños de los children restantes
            const adjustedChildren = newChildren.map(child => ({
              ...child,
              size: 100 / newChildren.length
            }));
            return {
              ...p,
              children: adjustedChildren
            };
          }
          if (p.children && p.children.length > 0) {
            return {
              ...p,
              children: updateParentChildren(p.children)
            };
          }
          return p;
        });
      };
      return updateParentChildren(prev);
    });
  }, [findPanelAndParent]);

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    addComponentToPanel,
    addSiblingPanel,
    addChildPanel,
    removePanel
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

  // Función recursiva para renderizar los paneles
  const renderPanel = panel => {
    const isSelected = selectedPanel?.uuid === panel.uuid;
    const hasComponent = panel.component !== null;
    const hasChildren = panel.children && panel.children.length > 0;
    const panelContent = hasComponent ? /*#__PURE__*/React.createElement("div", {
      className: "p-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: `p-3 h-100 w-100 d-flex align-items-center justify-content-center cursor-pointer ${selectedComponent?.uuid === panel.component?.uuid ? 'border border-3 border-primary' : 'border border-1 surface-border'}`,
      onClick: e => handleComponentClick(panel.component, e)
    }, panel.component?.name)) : hasChildren ? /*#__PURE__*/React.createElement(Splitter, {
      layout: panel.layout,
      style: {
        height: '100%',
        width: '100%'
      }
    }, panel.children.map(child => /*#__PURE__*/React.createElement(SplitterPanel, {
      key: child.uuid,
      size: child.size,
      minSize: child.minSize
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-2"
    }, renderPanel(child))))) : /*#__PURE__*/React.createElement("div", {
      className: "p-3 h-100 w-100 d-flex align-items-center justify-content-center text-400"
    }, "Panel vac\xEDo");
    return /*#__PURE__*/React.createElement("div", {
      className: `h-100 w-100 ${isSelected ? 'border border-3 border-primary' : 'border border-1 surface-border'}`,
      onClick: e => handlePanelClick(panel, e)
    }, panelContent);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "h-100 w-100"
  }, /*#__PURE__*/React.createElement(Splitter, {
    style: {
      height: '100%',
      width: '100%'
    }
  }, panels.map(panel => /*#__PURE__*/React.createElement(SplitterPanel, {
    key: panel.uuid,
    size: panel.size,
    minSize: panel.minSize
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2"
  }, renderPanel(panel))))));
});