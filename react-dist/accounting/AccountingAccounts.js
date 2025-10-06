import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { FilterService } from "primereact/api";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useAccountingAccounts } from "./hooks/useAccountingAccounts.js";
import { accountingAccountsService } from "../../services/api/index.js"; // Definición de tipos TypeScript
// Configuración de filtros
FilterService.register("customSearch", (value, filter) => {
  if (filter === undefined || filter === null || filter.trim() === "") {
    return true;
  }
  if (value === undefined || value === null) {
    return false;
  }
  return value.toString().toLowerCase().includes(filter.toLowerCase());
});

// Datos estáticos
const accountLevels = [{
  label: "Clase",
  value: "clase"
}, {
  label: "Grupo",
  value: "grupo"
}, {
  label: "Cuenta",
  value: "cuenta"
}, {
  label: "SubCuenta",
  value: "subcuenta"
}, {
  label: "Auxiliar",
  value: "auxiliar"
}, {
  label: "SubAuxiliar",
  value: "subauxiliar"
}];
const accountTypeNames = {
  asset: "Activo",
  liability: "Pasivo",
  equity: "Patrimonio",
  income: "Ingresos",
  expense: "Gastos",
  cost: "Costos",
  memorandum: "Cuentas de Orden",
  fiscal: "Cuentas Fiscales",
  control: "Cuentas de Control"
};
const accountClasses = [{
  id: 1,
  name: "Activo",
  type: "asset"
}, {
  id: 2,
  name: "Pasivo",
  type: "liability"
}, {
  id: 3,
  name: "Patrimonio",
  type: "equity"
}, {
  id: 4,
  name: "Ingresos",
  type: "income"
}, {
  id: 5,
  name: "Gastos",
  type: "expense"
}, {
  id: 6,
  name: "Costos de venta",
  type: "cost"
}, {
  id: 7,
  name: "Costos de producción",
  type: "cost"
}, {
  id: 8,
  name: "Cuentas de orden deudoras",
  type: "memorandum"
}, {
  id: 9,
  name: "Cuentas de orden acreedoras",
  type: "memorandum"
}];

// Función para validar códigos de cuenta
const validateCode = (code, level, parentCode) => {
  const levelStructure = {
    clase: {
      digits: 1
    },
    grupo: {
      digits: 2,
      parentDigits: 1
    },
    cuenta: {
      digits: 4,
      parentDigits: 2
    },
    subcuenta: {
      digits: 6,
      parentDigits: 4
    },
    auxiliar: {
      digits: 8,
      parentDigits: 6
    },
    subauxiliar: {
      digits: 10,
      parentDigits: 8
    }
  };
  const {
    digits,
    parentDigits
  } = levelStructure[level];

  /*if (code.length !== digits) {
    return {
      valid: false,
      message: `El código debe tener exactamente ${digits} dígitos`,
    };
  }*/

  if (parentDigits && parentCode) {
    const parentPart = parentCode.substring(0, parentDigits);
    if (!code.startsWith(parentPart)) {
      return {
        valid: false,
        message: `Debe comenzar con el código padre (${parentPart})`
      };
    }
  }
  return {
    valid: true
  };
};
const createAccountingAccount = async accountData => {
  try {
    const response = await accountingAccountsService.createAccount(accountData);
    return response;
  } catch (error) {
    console.error("Error creating accounting account:", error);
    throw error;
  }
};

// Componente principal
export const AccountingAccounts = () => {
  // Estados
  const [accounts, setAccounts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeAccordionKeys, setActiveAccordionKeys] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filters, setFilters] = useState({
    codigo: {
      value: "",
      matchMode: "customSearch"
    },
    nombre: {
      value: "",
      matchMode: "customSearch"
    }
  });
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    tipo: "clase",
    codigo: "",
    nombre: "",
    fiscalDifference: false,
    activa: true,
    initialBalance: 0,
    accountType: "asset"
  });
  const [codeValidation, setCodeValidation] = useState({
    valid: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditAccountDialog, setShowEditAccountDialog] = useState(false);
  const [editAccount, setEditAccount] = useState({
    tipo: "clase",
    codigo: "",
    nombre: "",
    fiscalDifference: false,
    activa: true,
    initialBalance: 0,
    accountType: "asset"
  });

  // Usar el hook para obtener los datos
  const {
    accounts: apiAccounts,
    isLoading,
    error,
    refreshAccounts
  } = useAccountingAccounts();
  console.log("apiAccounts", apiAccounts);
  const toast = useRef(null);

  // Función para validar todo el formulario
  const validateForm = (isEditMode = false) => {
    const errors = {};

    // Solo validar código si no estamos en modo edición
    if (!isEditMode) {
      if (!newAccount.codigo) {
        errors.codigo = "El código es requerido";
      } else if (!codeValidation.valid) {
        errors.codigo = codeValidation.message || "Código inválido";
      }
    }

    // Validar código
    if (!newAccount.codigo) {
      errors.codigo = "El código es requerido";
    } else if (!codeValidation.valid) {
      errors.codigo = codeValidation.message || "Código inválido";
    }

    // Validar nombre
    if (!newAccount.nombre) {
      errors.nombre = "El nombre es requerido";
    } else if (newAccount.nombre.length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar tipo de cuenta si es nivel clase
    if (!selectedAccount && !newAccount.accountType) {
      errors.accountType = "El tipo de cuenta es requerido";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateEditForm = () => {
    const errors = {};

    // Validar solo el nombre en modo edición
    if (!editAccount.nombre || editAccount.nombre.trim().length < 3) {
      errors.nombre = "El nombre es requerido y debe tener al menos 3 caracteres";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Transformar datos de la API a estructura de árbol jerárquico
  const transformApiDataToTree = useCallback(apiData => {
    if (!apiData || apiData.length === 0) return [];

    // 1. Crear las clases contables (nivel 1)
    const tree = accountClasses.map(cls => {
      const classNode = {
        id: -cls.id,
        account_code: cls.id.toString(),
        account_name: cls.name,
        status: "active",
        account_level: "clase",
        account_type: cls.type,
        fiscal_difference: false,
        nature: cls.type === "asset" || cls.type === "expense" || cls.type === "cost" ? "Débito" : "Crédito",
        account_class: cls.id,
        children: [],
        auxiliary: "null",
        auxiliary_name: "null"
      };
      return classNode;
    });

    // 2. Crear un mapa para acceso rápido a los nodos
    const nodeMap = new Map();
    tree.forEach(cls => nodeMap.set(cls.account_code, cls));

    // 3. Procesar todas las cuentas de la API
    apiData.forEach(apiAccount => {
      const accountType = apiAccount.account_type.toLowerCase();
      const nature = ["asset", "expense", "cost"].includes(accountType) ? "Débito" : "Crédito";
      const accountClass = parseInt(apiAccount.account_code.charAt(0));
      const codeLength = apiAccount.account_code.length;

      // Determinar el nivel basado en la longitud del código
      const level = codeLength === 1 ? "clase" : codeLength === 2 ? "grupo" : codeLength === 4 ? "cuenta" : codeLength === 6 ? "subcuenta" : codeLength === 8 ? "auxiliar" : "subauxiliar";

      // Solo crear el nodo si no existe ya
      if (!nodeMap.has(apiAccount.account_code)) {
        const newNode = {
          id: apiAccount.id,
          account_code: apiAccount.account_code,
          account_name: apiAccount.account_name,
          status: apiAccount.status === "active" ? "active" : "inactive",
          account_level: level,
          account_type: accountType,
          fiscal_difference: false,
          nature: nature,
          account_class: accountClass,
          children: []
        };
        nodeMap.set(apiAccount.account_code, newNode);

        // Encontrar y enlazar con el padre
        const parentDigits = {
          clase: 0,
          grupo: 1,
          cuenta: 2,
          subcuenta: 4,
          auxiliar: 6,
          subauxiliar: 8
        }[level];
        const parentCode = parentDigits ? apiAccount.account_code.substring(0, parentDigits) : null;
        if (parentCode) {
          const parentNode = nodeMap.get(parentCode);
          if (parentNode) {
            if (!parentNode.children) {
              parentNode.children = [];
            }
            parentNode.children.push(newNode);
            newNode.parent_id = parentCode;
          }
        } else if (level === "grupo") {
          // Vincular grupos a su clase
          const classCode = apiAccount.account_code.charAt(0);
          const classNode = nodeMap.get(classCode);
          if (classNode) {
            if (!classNode.children) {
              classNode.children = [];
            }
            classNode.children.push(newNode);
            newNode.parent_id = classCode;
          }
        }
      }
    });

    // Función para ordenar recursivamente el árbol
    const sortTree = nodes => {
      nodes.sort((a, b) => {
        // Primero por clase contable
        if (a.account_class !== b.account_class) {
          return (a.account_class || 0) - (b.account_class || 0);
        }
        // Luego por código de cuenta
        return a.account_code.localeCompare(b.account_code);
      });
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };
    sortTree(tree);
    return tree;
  }, []);
  // Transformar datos cuando cambian
  useEffect(() => {
    if (!isLoading && !error && apiAccounts) {
      const transformedData = transformApiDataToTree(apiAccounts);
      setAccounts(transformedData);
      if (transformedData.length > 0) {
        // Si hay una cuenta seleccionada, mantenerla seleccionada
        if (selectedAccount) {
          const newPath = findNodePath(transformedData, selectedAccount.id);
          if (newPath) {
            setSelectedPath(newPath);
            setTableData(newPath.map(node => ({
              tipo: node.account_level.charAt(0).toUpperCase() + node.account_level.slice(1),
              codigo: node.account_code,
              nombre: node.account_name,
              naturaleza: node.nature,
              account_type: accountTypeNames[node.account_type]
            })));
          }
        } else {
          // Si no hay cuenta seleccionada, seleccionar la primera
          handleAccountSelect(transformedData[0].id);
        }
      }
    } else {
      setAccounts([]);
      setTableData([]);
      setSelectedAccount(null);
    }
  }, [apiAccounts, isLoading, error, transformApiDataToTree, selectedAccount]);

  // Funciones auxiliares
  const findNodePath = useCallback((nodes, id, path = []) => {
    for (const node of nodes) {
      if (node.id === id) return [...path, node];
      if (node.children) {
        const found = findNodePath(node.children, id, [...path, node]);
        console.log("found", found);
        if (found) return found;
      }
    }
    return null;
  }, []);
  const getActiveIndexesFromPath = useCallback((nodes, path) => {
    let currentNodes = nodes;
    const activeIndexes = {};
    let currentPath = "root";
    for (const pathNode of path.slice(0, -1)) {
      const index = currentNodes.findIndex(n => n.id === pathNode.id);
      if (index === -1) break;
      if (!activeIndexes[currentPath]) {
        activeIndexes[currentPath] = [];
      }
      if (!activeIndexes[currentPath].includes(index)) {
        activeIndexes[currentPath].push(index);
      }
      currentNodes = currentNodes[index].children || [];
      currentPath = pathNode.id.toString();
    }
    return activeIndexes;
  }, []);

  // Handlers
  const handleAccountSelect = useCallback((id, parentId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const path = findNodePath(accounts, id);
    if (path) {
      const account = path[path.length - 1];
      setSelectedAccount(account);
      setSelectedPath(path);
      console.log("Selected account:", account);
      setTableData(path.map(node => ({
        tipo: node.account_level.charAt(0).toUpperCase() + node.account_level.slice(1),
        codigo: node.account_code,
        nombre: node.account_name,
        naturaleza: node.nature,
        account_type: accountTypeNames[node.account_type]
      })));
      const newActiveIndexes = getActiveIndexesFromPath(accounts, path);
      console.log("newActiveIndexes:", newActiveIndexes);
      setActiveAccordionKeys(prev => ({
        ...prev,
        ...newActiveIndexes
      }));
    }
  }, [accounts, findNodePath, getActiveIndexesFromPath]);

  // Función para manejar la actualización de cuenta
  const handleUpdateAccount = async () => {
    if (!validateEditForm() || !selectedAccount) return;
    setIsSubmitting(true);
    try {
      // Extraer los componentes del código
      const accountParts = {
        account: selectedAccount.account_code.substring(0, 1),
        sub_account: selectedAccount.account_code.length >= 2 ? selectedAccount.account_code.substring(0, 2) : "00",
        auxiliary: selectedAccount.account_code.length >= 6 ? selectedAccount.account_code.substring(4, 6) : "00",
        sub_auxiliary: selectedAccount.account_code.length >= 8 ? selectedAccount.account_code.substring(6, 8) : "00"
      };
      const accountData = {
        account_code: selectedAccount.account_code,
        status: editAccount.activa ? "active" : "inactive",
        account_name: editAccount.nombre.trim(),
        initial_balance: editAccount.initialBalance || 0,
        account_type: selectedAccount.account_type,
        account: accountParts.account,
        sub_account: accountParts.sub_account,
        auxiliary: accountParts.auxiliary,
        sub_auxiliary: accountParts.sub_auxiliary,
        fiscal_difference: editAccount.fiscalDifference
      };

      // Hacer la llamada PUT directamente
      const response = await accountingAccountsService.updateAccount(selectedAccount.id, accountData);

      // Mostrar mensaje de éxito
      toast.current?.show({
        severity: "success",
        summary: "Cuenta actualizada",
        detail: `La cuenta ${response.account_name} se ha actualizado correctamente`,
        life: 5000
      });

      // Cerrar diálogo y resetear formulario
      setShowEditAccountDialog(false);
      setFormErrors({});

      // Refrescar datos
      await refreshAccounts();

      // Actualizar la cuenta seleccionada con los nuevos datos
      if (selectedAccount) {
        const updatedAccount = {
          ...selectedAccount,
          account_name: editAccount.nombre.trim(),
          status: editAccount.activa ? "active" : "inactive",
          fiscal_difference: editAccount.fiscalDifference,
          initial_balance: editAccount.initialBalance?.toString() || "0"
        };
        setSelectedAccount(updatedAccount);

        // Actualizar también el path seleccionado
        setSelectedPath(prevPath => {
          return prevPath.map(account => account.id === updatedAccount.id ? updatedAccount : account);
        });

        // Actualizar la tabla de datos
        setTableData(prevTableData => {
          return prevTableData.map(item => {
            if (item.codigo === updatedAccount.account_code) {
              return {
                ...item,
                nombre: updatedAccount.account_name
              };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error("Error al actualizar cuenta:", error);
      let errorMessage = "Ocurrió un error al actualizar la cuenta";
      if (error instanceof Error) {
        errorMessage = error.message;

        // Si es error de validación del servidor (422)
        if (errorMessage.includes("Error de validación")) {
          const serverErrors = {};
          error.message.split("\n").forEach(line => {
            const [field, message] = line.split(": ");
            if (field && message) {
              serverErrors[field] = message;
            }
          });
          setFormErrors(serverErrors);
        }
      }
      toast.current?.show({
        severity: "error",
        summary: "Error al actualizar cuenta",
        detail: errorMessage,
        life: 7000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Función para abrir el diálogo de edición
  const handleOpenEditAccountDialog = () => {
    if (!selectedAccount) return;
    const initialBalance = selectedAccount.initial_balance ? parseFloat(selectedAccount.initial_balance) : 0;
    setEditAccount({
      tipo: selectedAccount.account_level,
      codigo: selectedAccount.account_code,
      nombre: selectedAccount.account_name,
      fiscalDifference: selectedAccount.fiscal_difference || false,
      activa: selectedAccount.status === "active",
      initialBalance: initialBalance,
      accountType: selectedAccount.account_type
    });

    // Limpiar errores al abrir el diálogo
    setFormErrors({});
    setShowEditAccountDialog(true);
  };
  const displayCleanCode = (code, level) => {
    if (!code) return "";
    const maxDigits = {
      clase: 1,
      grupo: 2,
      cuenta: 4,
      subcuenta: 6,
      auxiliar: 8,
      subauxiliar: 10
    }[level];

    // Tomamos solo los dígitos relevantes para el nivel actual
    return code.substring(0, maxDigits);
  };
  // Renderizar el acordeón con la jerarquía
  const renderAccordion = useCallback((data, depth = 0, parentId = "root") => {
    return data.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activeAccordionKeys[parentId]?.includes(index) || false;
      const isSelected = selectedAccount?.id === item.id;
      const levelClass = `level-${item.account_level}`;
      console.log("levelClass", levelClass);
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: `${item.id}-${depth}-${index}`,
        header: /*#__PURE__*/React.createElement("div", {
          className: classNames("accordion-header-content", {
            "selected-account": isSelected,
            "has-children": hasChildren,
            [levelClass]: true
          }),
          onClick: e => {
            e.stopPropagation();
            e.preventDefault();
            handleAccountSelect(item.id, parentId);
          },
          style: {
            borderLeft: `4px solid var(--${levelClass}-color)`
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "account-code"
        }, displayCleanCode(item.account_code, item.account_level)), /*#__PURE__*/React.createElement("span", {
          className: "account-name"
        }, item.account_name), hasChildren && /*#__PURE__*/React.createElement("i", {
          className: `pi pi-chevron-${isActive ? "down" : "right"} accordion-arrow`
        }), /*#__PURE__*/React.createElement("span", {
          className: `nature-badge ${item.nature.toLowerCase()}`
        }, item.nature), /*#__PURE__*/React.createElement("span", {
          className: `account-type-badge ${item.account_type}`
        }, accountTypeNames[item.account_type]), item.account_level !== "clase" && /*#__PURE__*/React.createElement("span", {
          className: "account-level-badge"
        }, item.account_level))
      }, hasChildren && /*#__PURE__*/React.createElement(Accordion, {
        multiple: true,
        activeIndex: activeAccordionKeys[item.id.toString()] || [],
        onTabChange: e => {
          setActiveAccordionKeys(prev => ({
            ...prev,
            [item.id.toString()]: e.index
          }));
        }
      }, renderAccordion(item.children || [], depth + 1, item.id.toString())));
    });
  }, [activeAccordionKeys, handleAccountSelect, selectedAccount]);

  // Filtrar cuentas
  const filteredAccounts = useMemo(() => {
    if (!filters.codigo.value && !filters.nombre.value) return accounts;
    const filterNodes = nodes => {
      return nodes.map(node => {
        const matchesCode = !filters.codigo.value || node.account_code.toLowerCase().includes(filters.codigo.value.toLowerCase());
        const matchesName = !filters.nombre.value || node.account_name.toLowerCase().includes(filters.nombre.value.toLowerCase());
        const filteredChildren = node.children ? filterNodes(node.children) : undefined;
        if (matchesCode || matchesName || filteredChildren && filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        return null;
      }).filter(node => node !== null);
    };
    return filterNodes(accounts);
  }, [accounts, filters]);
  const accordionContent = useMemo(() => renderAccordion(filteredAccounts, 0), [filteredAccounts, renderAccordion]);

  // Funciones para crear nueva cuenta
  const getNextLevel = currentLevel => {
    const levels = ["clase", "grupo", "cuenta", "subcuenta", "auxiliar", "subauxiliar"];
    const currentIndex = levels.indexOf(currentLevel);
    return levels[currentIndex + 1] || "subauxiliar";
  };
  const handleCreateAccount = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const accountType = selectedAccount?.account_type || newAccount.accountType;
      if (!accountType) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo determinar el tipo de cuenta",
          life: 5000
        });
        return;
      }
      console.log("selected", selectedAccount);
      return;

      // Extraer los componentes del código
      const accountCode = newAccount.codigo;
      const accountParts = {
        account: accountCode.substring(0, 1),
        sub_account: accountCode.length >= 2 ? accountCode.substring(0, 2) : "00",
        auxiliary: accountCode.length >= 6 ? accountCode.substring(4, 6) : "00",
        sub_auxiliary: accountCode.length >= 8 ? accountCode.substring(6, 8) : "00"
      };
      const accountData = {
        account_code: accountCode,
        status: newAccount.activa ? "active" : "inactive",
        account_name: newAccount.nombre.trim(),
        initial_balance: newAccount.initialBalance || 0.0,
        account_type: accountType,
        account: accountParts.account,
        sub_account: accountParts.sub_account,
        auxiliary: accountParts.auxiliary,
        sub_auxiliary: accountParts.sub_auxiliary
      };

      // Enviar al API
      const createdAccount = await createAccountingAccount(accountData);

      // Mostrar mensaje de éxito
      toast.current?.show({
        severity: "success",
        summary: "Cuenta creada",
        detail: `La cuenta ${createdAccount.account_name} se ha creado correctamente`,
        life: 5000
      });

      // Cerrar diálogo y resetear formulario
      setShowNewAccountDialog(false);
      setNewAccount({
        tipo: "clase",
        codigo: "",
        nombre: "",
        fiscalDifference: false,
        activa: true,
        initialBalance: 0,
        accountType: "asset"
      });
      setFormErrors({});

      // Refrescar datos
      await refreshAccounts();

      // Seleccionar la nueva cuenta creada
      const transformedData = transformApiDataToTree(apiAccounts);
      const newAccountNode = findNodePath(transformedData, createdAccount.id);
      if (newAccountNode) {
        handleAccountSelect(createdAccount.id);
      }
    } catch (error) {
      let errorMessage = "Ocurrió un error al crear la cuenta";
      if (error instanceof Error) {
        errorMessage = error.message;

        // Si es error de validación del servidor (422)
        if (errorMessage.includes("Error de validación")) {
          // Extraer errores específicos para mostrarlos en los campos correspondientes
          const serverErrors = {};
          error.message.split("\n").forEach(line => {
            const [field, message] = line.split(": ");
            if (field && message) {
              serverErrors[field] = message;
            }
          });
          setFormErrors(serverErrors);
        }
      }
      toast.current?.show({
        severity: "error",
        summary: "Error al crear cuenta",
        detail: errorMessage,
        life: 7000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const checkAccountExists = code => {
    const checkInTree = nodes => {
      for (const node of nodes) {
        if (node.account_code === code) return true;
        if (node.children && checkInTree(node.children)) return true;
      }
      return false;
    };
    return checkInTree(accounts);
  };
  const handleOpenNewAccountDialog = () => {
    if (selectedAccount) {
      const nextLevel = getNextLevel(selectedAccount.account_level);
      setNewAccount(prev => ({
        ...prev,
        tipo: nextLevel,
        codigo: selectedAccount.account_code.padEnd(nextLevel === "grupo" ? 2 : nextLevel === "cuenta" ? 4 : nextLevel === "subcuenta" ? 6 : nextLevel === "auxiliar" ? 8 : 10, "0"),
        accountType: selectedAccount.account_type // Heredar el tipo de cuenta del padre
      }));

      // Validar el código automático generado
      setCodeValidation(validateCode(selectedAccount.account_code.padEnd(nextLevel === "grupo" ? 2 : nextLevel === "cuenta" ? 4 : nextLevel === "subcuenta" ? 6 : nextLevel === "auxiliar" ? 8 : 10, "0"), nextLevel, selectedAccount.account_code));
    } else {
      setNewAccount(prev => ({
        ...prev,
        tipo: "clase",
        codigo: "",
        accountType: "asset" // Valor por defecto para cuentas de nivel clase
      }));
    }
    setShowNewAccountDialog(true);
  };
  // Renderizado condicional
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center min-h-screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center p-5"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-spinner pi-spin text-2xl mr-2"
    }), /*#__PURE__*/React.createElement("span", null, "Cargando datos contables...")));
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center min-h-screen"
    }, /*#__PURE__*/React.createElement(Message, {
      severity: "error",
      text: `Error al cargar las cuentas: ${error}`,
      className: "w-full md:w-6"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "accounting-container"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".fiscal-icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-7"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0 fs-5 text-muted"
  }, "Estructura Contable"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 w-100 w-md-auto"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-float-label flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputText, {
    id: "searchCode",
    value: filters.codigo.value,
    onChange: e => setFilters({
      ...filters,
      codigo: {
        ...filters.codigo,
        value: e.target.value
      }
    }),
    className: "w-100"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchCode"
  }, "C\xF3digo")), /*#__PURE__*/React.createElement("span", {
    className: "p-float-label flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputText, {
    id: "searchName",
    value: filters.nombre.value,
    onChange: e => setFilters({
      ...filters,
      nombre: {
        ...filters.nombre,
        value: e.target.value
      }
    }),
    className: "w-100"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchName"
  }, "Nombre")))), /*#__PURE__*/React.createElement("div", {
    className: "account-accordion-container flex-grow-1"
  }, /*#__PURE__*/React.createElement(Accordion, {
    multiple: true,
    activeIndex: activeAccordionKeys["root"] || [],
    onTabChange: e => {
      setActiveAccordionKeys(prev => ({
        ...prev,
        ["root"]: e.index
      }));
    }
  }, accordionContent))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 gap-2"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "flex-grow-1 border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0 fs-5 text-muted"
  }, "Jerarqu\xEDa de la Cuenta"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Subcuenta",
    icon: "pi pi-plus",
    className: "p-button-sm p-button-outlined",
    onClick: handleOpenNewAccountDialog,
    disabled: !selectedAccount,
    tooltip: "Crear una nueva subcuenta bajo la seleccionada",
    tooltipOptions: {
      position: "top"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Editar Cuenta",
    icon: "pi pi-pencil",
    className: "p-button-sm p-button-outlined p-button-secondary",
    onClick: handleOpenEditAccountDialog,
    disabled: !selectedAccount,
    tooltip: "Editar la cuenta seleccionada",
    tooltipOptions: {
      position: "top"
    }
  })), /*#__PURE__*/React.createElement(DataTable, {
    value: tableData,
    emptyMessage: "Seleccione una cuenta del plan",
    className: "p-datatable-sm",
    scrollable: true,
    scrollHeight: "flex",
    responsiveLayout: "scroll"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Nivel",
    style: {
      width: "15%"
    },
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge level-${rowData.tipo.toLowerCase()}`
    }, rowData.tipo)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    style: {
      width: "15%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    style: {
      width: "30%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "naturaleza",
    header: "Naturaleza",
    style: {
      width: "15%"
    },
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `nature-badge ${rowData.naturaleza.toLowerCase()}`
    }, rowData.naturaleza)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account_type",
    header: "Tipo",
    style: {
      width: "25%"
    },
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `account-type-badge`
    }, rowData.account_type)
  }))))))))))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Nueva Cuenta",
    visible: showNewAccountDialog,
    style: {
      width: "90vw",
      maxWidth: "600px"
    },
    onHide: () => {
      setShowNewAccountDialog(false);
      setFormErrors({});
    },
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      onClick: () => {
        setShowNewAccountDialog(false);
        setFormErrors({});
      },
      className: "p-button-text",
      disabled: isSubmitting
    }), /*#__PURE__*/React.createElement(Button, {
      label: isSubmitting ? "Creando..." : "Crear",
      icon: isSubmitting ? "pi pi-spinner pi-spin" : "pi pi-check",
      onClick: handleCreateAccount,
      autoFocus: true,
      disabled: isSubmitting || !newAccount.codigo || !newAccount.nombre || !codeValidation.valid || checkAccountExists(newAccount.codigo)
    })),
    breakpoints: {
      "960px": "75vw",
      "640px": "90vw"
    },
    modal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid grid formgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountType"
  }, "Tipo de Cuenta"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountType",
    value: newAccount.tipo,
    options: accountLevels,
    onChange: e => {
      const newType = e.value;
      setNewAccount(prev => ({
        ...prev,
        tipo: newType
      }));

      // Validar el código cuando cambia el tipo
      if (newAccount.codigo) {
        const validation = validateCode(newAccount.codigo, newType, selectedAccount?.account_code);
        setCodeValidation(validation);

        // Verificar si la cuenta ya existe
        if (validation.valid && checkAccountExists(newAccount.codigo)) {
          setFormErrors(prev => ({
            ...prev,
            codigo: "Esta cuenta ya existe"
          }));
        } else {
          setFormErrors(prev => {
            const newErrors = {
              ...prev
            };
            delete newErrors.codigo;
            return newErrors;
          });
        }
      }
    },
    optionLabel: "label",
    placeholder: "Seleccione el tipo",
    disabled: !!selectedAccount || isSubmitting,
    className: classNames("w-full", {
      "p-invalid": !!formErrors.accountType
    })
  }), selectedAccount && /*#__PURE__*/React.createElement("small", {
    className: "block mt-1 text-500"
  }, "Creando una subcuenta de nivel ", newAccount.tipo, " para la cuenta", " ", selectedAccount.account_name), formErrors.accountType && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, formErrors.accountType)), !selectedAccount && /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountTypeSelect"
  }, "Tipo de Cuenta *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountTypeSelect",
    value: newAccount.accountType,
    options: [{
      label: "Activo",
      value: "asset"
    }, {
      label: "Pasivo",
      value: "liability"
    }, {
      label: "Patrimonio",
      value: "equity"
    }, {
      label: "Ingresos",
      value: "income"
    }, {
      label: "Gastos",
      value: "expense"
    }, {
      label: "Costos",
      value: "cost"
    }, {
      label: "Cuentas de Orden",
      value: "memorandum"
    }, {
      label: "Cuentas Fiscales",
      value: "fiscal"
    }, {
      label: "Cuentas de Control",
      value: "control"
    }],
    onChange: e => setNewAccount({
      ...newAccount,
      accountType: e.value
    }),
    placeholder: "Seleccione el tipo",
    disabled: isSubmitting,
    className: classNames("w-full", {
      "p-invalid": !!formErrors.accountType
    })
  }), formErrors.accountType && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, formErrors.accountType)), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountCode"
  }, "C\xF3digo *"), /*#__PURE__*/React.createElement(InputText, {
    id: "accountCode",
    value: newAccount.codigo // Cambiamos a mostrar el código completo
    ,
    onChange: e => {
      console.log(e);

      // Permitimos solo dígitos
      const cleanValue = e.target.value;

      // Limitamos la longitud según el tipo de cuenta
      const maxLength = {
        clase: 1,
        grupo: 2,
        cuenta: 4,
        subcuenta: 6,
        auxiliar: 8,
        subauxiliar: 10
      }[newAccount.tipo];
      const truncatedValue = cleanValue.substring(0, Number.MAX_SAFE_INTEGER);

      // Para niveles inferiores a clase, aseguramos que comience con el código padre
      let fullCode = truncatedValue;
      if (selectedAccount && newAccount.tipo !== "clase") {
        const parentDigits = {
          grupo: 1,
          cuenta: 2,
          subcuenta: 4,
          auxiliar: 6,
          subauxiliar: 8
        }[newAccount.tipo];
        const parentPart = selectedAccount.account_code.substring(0, Number.MAX_SAFE_INTEGER);
        fullCode = parentPart + truncatedValue.substring(parentPart.length);
      }
      setNewAccount(prev => ({
        ...prev,
        codigo: fullCode
      }));
      const validation = validateCode(fullCode, newAccount.tipo, selectedAccount?.account_code);
      setCodeValidation(validation);

      // Verificar si la cuenta ya existe
      if (validation.valid) {
        if (checkAccountExists(fullCode)) {
          setFormErrors(prev => ({
            ...prev,
            codigo: "Esta cuenta ya existe"
          }));
        } else {
          setFormErrors(prev => {
            const newErrors = {
              ...prev
            };
            delete newErrors.codigo;
            return newErrors;
          });
        }
      }
    },
    required: true,
    disabled: isSubmitting,
    className: classNames("w-full", {
      "p-invalid": !!formErrors.codigo || !codeValidation.valid && newAccount.codigo
    })
    /*maxLength={
      {
        clase: 1,
        grupo: 2,
        cuenta: 4,
        subcuenta: 6,
        auxiliar: 8,
        subauxiliar: 10,
      }[newAccount.tipo]
    }*/
  }), !codeValidation.valid && newAccount.codigo && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, codeValidation.message), formErrors.codigo && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, formErrors.codigo), selectedAccount && /*#__PURE__*/React.createElement("small", {
    className: "block mt-1 text-500"
  }, "C\xF3digo padre: ", selectedAccount.account_code)), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountName"
  }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, {
    id: "accountName",
    value: newAccount.nombre,
    onChange: e => {
      setNewAccount({
        ...newAccount,
        nombre: e.target.value
      });
      if (e.target.value.trim().length >= 3) {
        setFormErrors(prev => {
          const newErrors = {
            ...prev
          };
          delete newErrors.nombre;
          return newErrors;
        });
      }
    },
    required: true,
    disabled: isSubmitting,
    className: classNames("w-full", {
      "p-invalid": !!formErrors.nombre
    })
  }), formErrors.nombre && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, formErrors.nombre)), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "initialBalance"
  }, "Saldo Inicial"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "initialBalance",
    value: newAccount.initialBalance || 0,
    onValueChange: e => setNewAccount({
      ...newAccount,
      initialBalance: e.value || 0
    }),
    mode: "currency",
    currency: "COP",
    locale: "es-CO",
    disabled: isSubmitting,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "newFiscalDifference",
    checked: newAccount.fiscalDifference,
    onChange: e => setNewAccount({
      ...newAccount,
      fiscalDifference: e.checked ?? false
    }),
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newFiscalDifference",
    className: "ml-2"
  }, "Cuenta de diferencia fiscal")), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "newActive",
    checked: newAccount.activa,
    onChange: e => setNewAccount({
      ...newAccount,
      activa: e.checked ?? false
    }),
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newActive",
    className: "ml-2"
  }, "Cuenta activa")))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Editar Cuenta",
    visible: showEditAccountDialog,
    style: {
      width: "90vw",
      maxWidth: "600px"
    },
    onHide: () => {
      setShowEditAccountDialog(false);
      setFormErrors({});
    },
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      onClick: () => {
        setShowEditAccountDialog(false);
        setFormErrors({});
      },
      className: "p-button-text",
      disabled: isSubmitting
    }), /*#__PURE__*/React.createElement(Button, {
      label: isSubmitting ? "Actualizando..." : "Actualizar",
      icon: isSubmitting ? "pi pi-spinner pi-spin" : "pi pi-check",
      onClick: handleUpdateAccount,
      autoFocus: true,
      disabled: isSubmitting || !editAccount.nombre?.trim()
    })),
    breakpoints: {
      "960px": "75vw",
      "640px": "90vw"
    },
    modal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid grid formgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "editAccountType"
  }, "Tipo de Cuenta"), /*#__PURE__*/React.createElement(InputText, {
    id: "editAccountType",
    value: accountLevels.find(l => l.value === editAccount.tipo)?.label || editAccount.tipo,
    disabled: true,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "editAccountCode"
  }, "C\xF3digo"), /*#__PURE__*/React.createElement(InputText, {
    id: "editAccountCode",
    value: editAccount.codigo,
    disabled: true,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "editAccountName"
  }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, {
    id: "editAccountName",
    value: editAccount.nombre,
    onChange: e => {
      setEditAccount({
        ...editAccount,
        nombre: e.target.value
      });
      if (e.target.value.trim().length >= 3) {
        setFormErrors(prev => {
          const newErrors = {
            ...prev
          };
          delete newErrors.nombre;
          return newErrors;
        });
      }
    },
    className: classNames("w-full", {
      "p-invalid": !!formErrors.nombre
    })
  }), formErrors.nombre && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, formErrors.nombre)), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "editInitialBalance"
  }, "Saldo Inicial *"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "editInitialBalance",
    value: editAccount.initialBalance || 0,
    onValueChange: e => setEditAccount({
      ...editAccount,
      initialBalance: e.value || 0
    }),
    mode: "currency",
    currency: "COP",
    locale: "es-CO",
    className: classNames("w-full", {
      "p-invalid": !!formErrors.initial_balance
    })
  }), formErrors.initial_balance && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, formErrors.initial_balance)), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "editFiscalDifference",
    checked: editAccount.fiscalDifference,
    onChange: e => setEditAccount({
      ...editAccount,
      fiscalDifference: e.checked ?? false
    }),
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "editFiscalDifference",
    className: "ml-2"
  }, "Cuenta de diferencia fiscal")), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "editActive",
    checked: editAccount.activa,
    onChange: e => setEditAccount({
      ...editAccount,
      activa: e.checked ?? false
    }),
    disabled: isSubmitting
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "editActive",
    className: "ml-2"
  }, "Cuenta activa")))), /*#__PURE__*/React.createElement("style", null, `
                .accounting-container {
                    padding: 1rem;
                    min-height: calc(100vh - 2rem);
                }
                
                .card {
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                }
                
                .account-accordion-container {
                    overflow-y: auto;
                    max-height: 60vh;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                
                .accordion-header-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border-radius: 6px;
                    margin: 2px 0;
                    position: relative;
                }
                
                .accordion-header-content:hover {
                    background-color: #f3f4f6;
                }
                
                .accordion-header-content.selected-account {
                    background-color: #e0e7ff;
                    font-weight: 600;
                }
                
                .account-code {
                    font-weight: 600;
                    color: #1f2937;
                    width: 103px;
                    font-family: monospace;
                }
                
                .account-name {
                    color: #374151;
                    flex-grow: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .accordion-arrow {
                    color: #6b7280;
                    transition: transform 0.2s;
                }
                
                .fiscal-icon {
                    color: #f59e0b;
                    margin-left: auto;
                    margin-right: 0.5rem;
                }

                .nature-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }

                .nature-badge.débito {
                    background-color: #fee2e2;
                    color: #b91c1c;
                }

                .nature-badge.crédito {
                    background-color: #dcfce7;
                    color: #166534;
                }

                .account-type-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                    background-color: #e0f2fe;
                    color: #0369a1;
                }
                
                .account-level-badge {
                    display: inline-block;
                    padding: 0.15rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    font-weight: 500;
                    margin-left: 0.5rem;
                    background-color: #f3f4f6;
                    color: #4b5563;
                    text-transform: capitalize;
                }

                /* Colores para cada nivel */
                .accordion-header-content.level-clase {
                    --level-clase-color: #3b82f6;
                    font-weight: 600;
                }

                .accordion-header-content.level-grupo {
                    --level-grupo-color: #6366f1;
                }

                .accordion-header-content.level-cuenta {
                    --level-cuenta-color: #8b5cf6;
                }

                .accordion-header-content.level-subcuenta {
                    --level-subcuenta-color: #ec4899;
                }

                .accordion-header-content.level-auxiliar {
                    --level-auxiliar-color: #f59e0b;
                }

                .accordion-header-content.level-subauxiliar {
                    --level-subauxiliar-color: #10b981;
                }

                .level-auxiliar { border-left-color: #f59e0b; }
                .level-subauxiliar { border-left-color: #10b981; }

                /* Estilos para los badges en la tabla */
                .badge.level-clase {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                
                .badge.level-grupo {
                    background-color: #e0e7ff;
                    color: #4338ca;
                }
                
                .badge.level-cuenta {
                    background-color: #ede9fe;
                    color: #5b21b6;
                }
                
                .badge.level-subcuenta {
                    background-color: #f3e8ff;
                    color: #7e22ce;
                }
                
                .badge.level-auxiliar {
                    background-color: #fce7f3;
                    color: #9d174d;
                }
                
                .badge.level-subauxiliar {
                    background-color: #ecfccb;
                    color: #365314;
                }

                /* Líneas de jerarquía */
                .p-accordion .p-accordion-tab {
                    position: relative;
                }

                .p-accordion .p-accordion-tab:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: 16px;
                    top: 0;
                    height: 100%;
                    width: 1px;
                    background-color: #e5e7eb;
                }

                /* Mejoras para móviles */
                @media (max-width: 768px) {
                    .accordion-header-content {
                        flex-direction: column;
                        align-items: flex-start;}
                    
                    .account-level-badge, .nature-badge, .account-type-badge {
                        display: none;
                    }

                    .account-code {
                        width: 60px;
                    }
                }
            `));
};