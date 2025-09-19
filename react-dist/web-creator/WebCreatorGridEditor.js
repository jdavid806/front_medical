import React, { forwardRef, useImperativeHandle, useCallback, useState } from "react";
import { generateUUID } from "../../services/utilidades.js";
import { WebCreatorLogo } from "./components/WebCreatorLogo.js";
export const WebCreatorGridEditor = /*#__PURE__*/forwardRef(({
  onCellClick,
  onRowClick,
  onComponentClick
}, ref) => {
  const defaultColSpan = 2;
  const [grid, setGrid] = useState({
    rows: [{
      uuid: generateUUID(),
      cells: [{
        uuid: generateUUID(),
        colSpan: defaultColSpan,
        component: null
      }]
    }]
  });
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const addComponentToCell = useCallback((cell, component) => {
    const newGrid = grid.rows.map(row => {
      return {
        ...row,
        cells: row.cells.map(column => {
          if (column.uuid === cell.uuid) {
            return {
              ...column,
              component
            }; // Inmutabilidad
          }
          return column;
        })
      };
    });
    setGrid({
      rows: newGrid
    });
  }, [grid]);
  useImperativeHandle(ref, () => ({
    addComponentToCell,
    addRowUpper,
    addRowBelow,
    addColumn,
    addColumnBefore,
    addColumnAfter,
    removeColumn
  }));
  const handleSelectCell = ev => {
    setSelectedCell(ev);
    setSelectedRow(null);
    setSelectedComponent(null);
    onCellClick(ev);
  };
  const handleSelectRow = row => {
    setSelectedRow(row);
    setSelectedCell(null);
    setSelectedComponent(null);
    onRowClick(row);
  };
  const handleSelectComponent = component => {
    setSelectedComponent(component);
    setSelectedCell(null);
    setSelectedRow(null);
    onComponentClick(component);
  };
  const addRowUpper = useCallback(() => {
    if (!selectedRow) {
      // Si no hay fila seleccionada, agregar al inicio
      const newGrid = {
        rows: [{
          uuid: generateUUID(),
          cells: [{
            uuid: generateUUID(),
            colSpan: 1,
            component: null
          }]
        }, ...grid.rows]
      };
      setGrid(newGrid);
      return;
    }

    // Encontrar el índice de la fila seleccionada
    const selectedRowIndex = grid.rows.findIndex(row => row.uuid === selectedRow.uuid);
    if (selectedRowIndex === -1) return;

    // Insertar nueva fila arriba de la seleccionada
    const newRows = [...grid.rows];
    newRows.splice(selectedRowIndex, 0, {
      uuid: generateUUID(),
      cells: [{
        uuid: generateUUID(),
        colSpan: defaultColSpan,
        component: null
      }]
    });
    setGrid({
      rows: newRows
    });
  }, [grid, selectedRow]);
  const addRowBelow = useCallback(() => {
    if (!selectedRow) {
      // Si no hay fila seleccionada, agregar al final
      const newGrid = {
        rows: [...grid.rows, {
          uuid: generateUUID(),
          cells: [{
            uuid: generateUUID(),
            colSpan: defaultColSpan,
            component: null
          }]
        }]
      };
      setGrid(newGrid);
      return;
    }

    // Encontrar el índice de la fila seleccionada
    const selectedRowIndex = grid.rows.findIndex(row => row.uuid === selectedRow.uuid);
    if (selectedRowIndex === -1) return;

    // Insertar nueva fila debajo de la seleccionada
    const newRows = [...grid.rows];
    newRows.splice(selectedRowIndex + 1, 0, {
      uuid: generateUUID(),
      cells: [{
        uuid: generateUUID(),
        colSpan: defaultColSpan,
        component: null
      }]
    });
    setGrid({
      rows: newRows
    });
  }, [grid, selectedRow]);
  const addColumn = row => {
    const newGrid = [...grid.rows];
    const rowIndex = grid.rows.indexOf(row);
    newGrid[rowIndex].cells.push({
      uuid: generateUUID(),
      colSpan: defaultColSpan,
      component: null
    });
    setGrid({
      rows: newGrid
    });
  };
  const addColumnBefore = () => {
    if (!selectedCell) return;
    const newGrid = [...grid.rows];
    const rowIndex = grid.rows.indexOf(selectedCell.row);
    const cellIndex = selectedCell.row.cells.indexOf(selectedCell.cell);
    newGrid[rowIndex].cells.splice(cellIndex, 0, {
      uuid: generateUUID(),
      colSpan: defaultColSpan,
      component: null
    });
    setGrid({
      rows: newGrid
    });
  };
  const addColumnAfter = () => {
    if (!selectedCell) return;
    const newGrid = [...grid.rows];
    const rowIndex = grid.rows.indexOf(selectedCell.row);
    const cellIndex = selectedCell.row.cells.indexOf(selectedCell.cell);
    newGrid[rowIndex].cells.splice(cellIndex + 1, 0, {
      uuid: generateUUID(),
      colSpan: defaultColSpan,
      component: null
    });
    setGrid({
      rows: newGrid
    });
  };
  const removeColumn = () => {
    if (!selectedCell) return;
    const newGrid = [...grid.rows];
    const rowIndex = grid.rows.indexOf(selectedCell.row);
    const cellIndex = selectedCell.row.cells.indexOf(selectedCell.cell);
    newGrid[rowIndex].cells.splice(cellIndex, 1);
    setGrid({
      rows: newGrid
    });
  };
  const getComponentView = component => {
    switch (component.type) {
      case "logo":
        return /*#__PURE__*/React.createElement(WebCreatorLogo, {
          component: component
        });
      case "menubar":
        return /*#__PURE__*/React.createElement("div", null, "Menubar settings");
      case "button":
        return /*#__PURE__*/React.createElement("div", null, "Button settings");
      case "sidebar":
        return /*#__PURE__*/React.createElement("div", null, "Sidebar settings");
      default:
        return /*#__PURE__*/React.createElement("div", null, "Unknown component type");
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, grid.rows.map((row, index) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `row p-2 grid-row ${selectedRow?.uuid === row.uuid ? "border border-3 border-primary " : ""}`,
    key: index,
    onClick: e => {
      e.stopPropagation();
      handleSelectRow(row);
    }
  }, row.cells.map((column, index) => /*#__PURE__*/React.createElement("div", {
    className: `p-2 grid-cell col-md-${column.colSpan} cursor-pointer ${selectedCell?.cell.uuid === column.uuid ? "border border-3 border-primary " : ""}`,
    key: index,
    onClick: e => {
      e.stopPropagation();
      handleSelectCell({
        cell: column,
        row
      });
    }
  }, column.component && /*#__PURE__*/React.createElement("div", {
    className: selectedComponent?.uuid === column.component.uuid ? "border border-3 border-primary " : "",
    onClick: e => {
      e.stopPropagation();
      handleSelectComponent(column.component);
    }
  }, getComponentView(column.component))))))), /*#__PURE__*/React.createElement("style", null, `
                .grid-row {
                    height: 100px;
                    border: 1px solid #ccc;
                }
                .grid-row:hover {
                    border: 3px solid #ccc;
                }
                .grid-cell {
                    border: 1px solid #ccc;
                }
                .grid-cell:hover {
                    border: 3px solid #ccc;
                }
            `));
});