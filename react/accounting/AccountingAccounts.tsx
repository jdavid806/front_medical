import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
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
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useAccountingAccounts } from "./hooks/useAccountingAccounts";
import { accountingAccountsService } from "../../services/api";

// Definición de tipos TypeScript
type AccountLevel =
  | "clase"
  | "grupo"
  | "cuenta"
  | "subcuenta"
  | "auxiliar"
  | "subauxiliar";
type AccountStatus = "active" | "inactive";

type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense"
  | "cost"
  | "memorandum"
  | "fiscal"
  | "control";

interface ApiAccountingAccount {
  id: number;
  account_code: string;
  account_name: string;
  status: string;
  initial_balance: string;
  account_type: string;
  account: string;
  sub_account: string;
  auxiliary: string;
  sub_auxiliary: string;
  created_at: string;
  updated_at: string;
}

interface AccountingAccountChildren {
  id: number;
  account_code: string;
  account_name: string;
  status: AccountStatus;
  account_level: AccountLevel;
  fiscal_difference: boolean;
  parent_id?: string;
  nature: "Débito" | "Crédito";
  account_type: AccountType;
  account_class?: number;
  auxiliary?: string;
  auxiliary_name?: string;
  initial_balance?: string;
}
interface AccountingAccount {
  id: number;
  account_code: string;
  account_name: string;
  status: AccountStatus;
  account_level: AccountLevel;
  fiscal_difference: boolean;
  parent_id?: string;
  children?: AccountingAccountChildren[];
  nature: "Débito" | "Crédito";
  account_type: AccountType;
  account_class?: number;
  auxiliary?: string;
  auxiliary_name?: string;
  initial_balance?: string; // Agregamos esta propiedad
}

interface TableRow {
  tipo: string;
  codigo: string;
  nombre: string;
  naturaleza: string;
  account_type: string;
}

interface NewAccountForm {
  tipo: AccountLevel;
  codigo: string;
  nombre: string;
  fiscalDifference: boolean;
  activa: boolean;
  initialBalance?: number;
  accountType?: AccountType;
}

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
const accountLevels = [
  { label: "Clase", value: "clase" },
  { label: "Grupo", value: "grupo" },
  { label: "Cuenta", value: "cuenta" },
  { label: "SubCuenta", value: "subcuenta" },
  { label: "Auxiliar", value: "auxiliar" },
  { label: "SubAuxiliar", value: "subauxiliar" },
];

const accountTypeNames: Record<AccountType, string> = {
  asset: "Activo",
  liability: "Pasivo",
  equity: "Patrimonio",
  income: "Ingresos",
  expense: "Gastos",
  cost: "Costos",
  memorandum: "Cuentas de Orden",
  fiscal: "Cuentas Fiscales",
  control: "Cuentas de Control",
};

const accountClasses = [
  { id: 1, name: "Activo", type: "asset" },
  { id: 2, name: "Pasivo", type: "liability" },
  { id: 3, name: "Patrimonio", type: "equity" },
  { id: 4, name: "Ingresos", type: "income" },
  { id: 5, name: "Gastos", type: "expense" },
  { id: 6, name: "Costos de venta", type: "cost" },
  { id: 7, name: "Costos de producción", type: "cost" },
  { id: 8, name: "Cuentas de orden deudoras", type: "memorandum" },
  { id: 9, name: "Cuentas de orden acreedoras", type: "memorandum" },
];

// Función para validar códigos de cuenta
const validateCode = (
  code: string,
  level: AccountLevel,
  parentCode?: string
): { valid: boolean; message?: string } => {
  const levelStructure: Record<
    AccountLevel,
    { digits: number; parentDigits?: number }
  > = {
    clase: { digits: 1 },
    grupo: { digits: 2, parentDigits: 1 },
    cuenta: { digits: 4, parentDigits: 2 },
    subcuenta: { digits: 6, parentDigits: 4 },
    auxiliar: { digits: 8, parentDigits: 6 },
    subauxiliar: { digits: 10, parentDigits: 8 },
  };

  const { digits, parentDigits } = levelStructure[level];

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
        message: `Debe comenzar con el código padre (${parentPart})`,
      };
    }
  }

  return { valid: true };
};

const createAccountingAccount = async (accountData: {
  account_code: string;
  status: string;
  account_name: string;
  initial_balance: number;
  account_type: string;
  account: string;
  sub_account: string;
  auxiliary: string;
  sub_auxiliary: string;
}) => {
  try {
    const response = await accountingAccountsService.createAccount(accountData);

    return response;
  } catch (error) {
    console.error("Error creating accounting account:", error);
    throw error;
  }
};

// Componente principal
export const AccountingAccounts: React.FC = () => {
  // Estados
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [activeAccordionKeys, setActiveAccordionKeys] = useState<{
    [key: string]: number[];
  }>({});
  const [selectedPath, setSelectedPath] = useState<AccountingAccount[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountingAccount | null>(null);
  const [filters, setFilters] = useState({
    codigo: { value: "", matchMode: "customSearch" },
    nombre: { value: "", matchMode: "customSearch" },
  });
  const [showNewAccountDialog, setShowNewAccountDialog] =
    useState<boolean>(false);
  const [newAccount, setNewAccount] = useState<NewAccountForm>({
    tipo: "clase",
    codigo: "",
    nombre: "",
    fiscalDifference: false,
    activa: true,
    initialBalance: 0,
    accountType: "asset",
  });
  const [codeValidation, setCodeValidation] = useState<{
    valid: boolean;
    message?: string;
  }>({ valid: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditAccountDialog, setShowEditAccountDialog] =
    useState<boolean>(false);
  const [editAccount, setEditAccount] = useState<NewAccountForm>({
    tipo: "clase",
    codigo: "",
    nombre: "",
    fiscalDifference: false,
    activa: true,
    initialBalance: 0,
    accountType: "asset",
  });

  // Usar el hook para obtener los datos
  const {
    accounts: apiAccounts,
    isLoading,
    error,
    refreshAccounts,
  } = useAccountingAccounts();
  console.log("apiAccounts", apiAccounts);
  const toast = useRef<Toast>(null);

  // Función para validar todo el formulario
  const validateForm = (isEditMode = false): boolean => {
    const errors: Record<string, string> = {};

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

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar solo el nombre en modo edición
    if (!editAccount.nombre || editAccount.nombre.trim().length < 3) {
      errors.nombre =
        "El nombre es requerido y debe tener al menos 3 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Transformar datos de la API a estructura de árbol jerárquico
  const transformApiDataToTree = useCallback(
    (apiData: ApiAccountingAccount[]): AccountingAccount[] => {
      if (!apiData || apiData.length === 0) return [];

      // 1. Crear las clases contables (nivel 1)
      const tree: AccountingAccount[] = accountClasses.map((cls) => {
        const classNode: AccountingAccount = {
          id: -cls.id,
          account_code: cls.id.toString(),
          account_name: cls.name,
          status: "active",
          account_level: "clase",
          account_type: cls.type as AccountType,
          fiscal_difference: false,
          nature:
            cls.type === "asset" ||
              cls.type === "expense" ||
              cls.type === "cost"
              ? "Débito"
              : "Crédito",
          account_class: cls.id,
          children: [],
          auxiliary: "null",
          auxiliary_name: "null",
        };
        return classNode;
      });

      // 2. Crear un mapa para acceso rápido a los nodos
      const nodeMap = new Map<string, AccountingAccount>();
      tree.forEach((cls) => nodeMap.set(cls.account_code, cls));

      // 3. Procesar todas las cuentas de la API
      apiData.forEach((apiAccount) => {
        const accountType =
          apiAccount.account_type.toLowerCase() as AccountType;
        const nature = ["asset", "expense", "cost"].includes(accountType)
          ? "Débito"
          : "Crédito";
        const accountClass = parseInt(apiAccount.account_code.charAt(0));
        const codeLength = apiAccount.account_code.length;

        // Determinar el nivel basado en la longitud del código
        const level: AccountLevel =
          codeLength === 1
            ? "clase"
            : codeLength === 2
              ? "grupo"
              : codeLength === 4
                ? "cuenta"
                : codeLength === 6
                  ? "subcuenta"
                  : codeLength === 8
                    ? "auxiliar"
                    : "subauxiliar";

        // Solo crear el nodo si no existe ya
        if (!nodeMap.has(apiAccount.account_code)) {
          const newNode: AccountingAccount = {
            id: apiAccount.id,
            account_code: apiAccount.account_code,
            account_name: apiAccount.account_name,
            status: apiAccount.status === "active" ? "active" : "inactive",
            account_level: level,
            account_type: accountType,
            fiscal_difference: false,
            nature: nature,
            account_class: accountClass,
            children: [],
          };

          nodeMap.set(apiAccount.account_code, newNode);

          // Encontrar y enlazar con el padre
          const parentDigits = {
            clase: 0,
            grupo: 1,
            cuenta: 2,
            subcuenta: 4,
            auxiliar: 6,
            subauxiliar: 8,
          }[level];

          const parentCode = parentDigits
            ? apiAccount.account_code.substring(0, parentDigits)
            : null;

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
      const sortTree = (nodes: AccountingAccount[]) => {
        nodes.sort((a, b) => {
          // Primero por clase contable
          if (a.account_class !== b.account_class) {
            return (a.account_class || 0) - (b.account_class || 0);
          }
          // Luego por código de cuenta
          return a.account_code.localeCompare(b.account_code);
        });

        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            sortTree(node.children);
          }
        });
      };

      sortTree(tree);

      return tree;
    },
    []
  );
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
            setTableData(
              newPath.map((node) => ({
                tipo:
                  node.account_level.charAt(0).toUpperCase() +
                  node.account_level.slice(1),
                codigo: node.account_code,
                nombre: node.account_name,
                naturaleza: node.nature,
                account_type: accountTypeNames[node.account_type],
              }))
            );
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
  const findNodePath = useCallback(
    (
      nodes: AccountingAccount[],
      id: number,
      path: AccountingAccount[] = []
    ): AccountingAccount[] | null => {
      for (const node of nodes) {
        if (node.id === id) return [...path, node];
        if (node.children) {
          const found = findNodePath(node.children, id, [...path, node]);
          console.log("found", found);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const getActiveIndexesFromPath = useCallback(
    (
      nodes: AccountingAccount[],
      path: AccountingAccount[]
    ): { [key: string]: number[] } => {
      let currentNodes = nodes;
      const activeIndexes: { [key: string]: number[] } = {};
      let currentPath = "root";

      for (const pathNode of path.slice(0, -1)) {
        const index = currentNodes.findIndex((n) => n.id === pathNode.id);
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
    },
    []
  );

  // Handlers
  const handleAccountSelect = useCallback(
    (id: number, parentId?: string, event?: React.MouseEvent) => {
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
        setTableData(
          path.map((node) => ({
            tipo:
              node.account_level.charAt(0).toUpperCase() +
              node.account_level.slice(1),
            codigo: node.account_code,
            nombre: node.account_name,
            naturaleza: node.nature,
            account_type: accountTypeNames[node.account_type],
          }))
        );

        const newActiveIndexes = getActiveIndexesFromPath(accounts, path);
        console.log("newActiveIndexes:", newActiveIndexes);

        setActiveAccordionKeys((prev) => ({
          ...prev,
          ...newActiveIndexes,
        }));
      }
    },
    [accounts, findNodePath, getActiveIndexesFromPath]
  );

  // Función para manejar la actualización de cuenta
  const handleUpdateAccount = async () => {
    if (!validateEditForm() || !selectedAccount) return;

    setIsSubmitting(true);

    try {
      // Extraer los componentes del código
      const accountParts = {
        account: selectedAccount.account_code.substring(0, 1),
        sub_account:
          selectedAccount.account_code.length >= 2
            ? selectedAccount.account_code.substring(0, 2)
            : "00",
        auxiliary:
          selectedAccount.account_code.length >= 6
            ? selectedAccount.account_code.substring(4, 6)
            : "00",
        sub_auxiliary:
          selectedAccount.account_code.length >= 8
            ? selectedAccount.account_code.substring(6, 8)
            : "00",
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
        fiscal_difference: editAccount.fiscalDifference,
      };

      // Hacer la llamada PUT directamente
      const response = await accountingAccountsService.updateAccount(selectedAccount.id, accountData)

      // Mostrar mensaje de éxito
      toast.current?.show({
        severity: "success",
        summary: "Cuenta actualizada",
        detail: `La cuenta ${response.account_name} se ha actualizado correctamente`,
        life: 5000,
      });

      // Cerrar diálogo y resetear formulario
      setShowEditAccountDialog(false);
      setFormErrors({});

      // Refrescar datos
      await refreshAccounts();

      // Actualizar la cuenta seleccionada con los nuevos datos
      if (selectedAccount) {
        const updatedAccount: AccountingAccount = {
          ...selectedAccount,
          account_name: editAccount.nombre.trim(),
          status: editAccount.activa ? "active" : "inactive",
          fiscal_difference: editAccount.fiscalDifference,
          initial_balance: editAccount.initialBalance?.toString() || "0",
        };
        setSelectedAccount(updatedAccount);

        // Actualizar también el path seleccionado
        setSelectedPath((prevPath) => {
          return prevPath.map((account) =>
            account.id === updatedAccount.id ? updatedAccount : account
          );
        });

        // Actualizar la tabla de datos
        setTableData((prevTableData) => {
          return prevTableData.map((item) => {
            if (item.codigo === updatedAccount.account_code) {
              return {
                ...item,
                nombre: updatedAccount.account_name,
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
          const serverErrors: Record<string, string> = {};
          error.message.split("\n").forEach((line) => {
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
        life: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Función para abrir el diálogo de edición
  const handleOpenEditAccountDialog = () => {
    if (!selectedAccount) return;

    const initialBalance = selectedAccount.initial_balance
      ? parseFloat(selectedAccount.initial_balance)
      : 0;

    setEditAccount({
      tipo: selectedAccount.account_level,
      codigo: selectedAccount.account_code,
      nombre: selectedAccount.account_name,
      fiscalDifference: selectedAccount.fiscal_difference || false,
      activa: selectedAccount.status === "active",
      initialBalance: initialBalance,
      accountType: selectedAccount.account_type,
    });

    // Limpiar errores al abrir el diálogo
    setFormErrors({});
    setShowEditAccountDialog(true);
  };
  const displayCleanCode = (code: string, level: AccountLevel): string => {
    if (!code) return "";

    const maxDigits = {
      clase: 1,
      grupo: 2,
      cuenta: 4,
      subcuenta: 6,
      auxiliar: 8,
      subauxiliar: 10,
    }[level];

    // Tomamos solo los dígitos relevantes para el nivel actual
    return code.substring(0, maxDigits);
  };
  // Renderizar el acordeón con la jerarquía
  const renderAccordion = useCallback(
    (
      data: AccountingAccount[],
      depth: number = 0,
      parentId: string = "root"
    ): React.ReactNode[] => {
      return data.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive =
          activeAccordionKeys[parentId]?.includes(index) || false;
        const isSelected = selectedAccount?.id === item.id;
        const levelClass = `level-${item.account_level}`;
        console.log("levelClass", levelClass);
        return (
          <AccordionTab
            key={`${item.id}-${depth}-${index}`}
            header={
              <div
                className={classNames("accordion-header-content", {
                  "selected-account": isSelected,
                  "has-children": hasChildren,
                  [levelClass]: true,
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAccountSelect(item.id, parentId);
                }}
                style={{
                  borderLeft: `4px solid var(--${levelClass}-color)`,
                }}
              >
                <span className="account-code">
                  {displayCleanCode(item.account_code, item.account_level)}
                </span>
                <span className="account-name">{item.account_name}</span>
                {hasChildren && (
                  <i
                    className={`pi pi-chevron-${isActive ? "down" : "right"
                      } accordion-arrow`}
                  />
                )}
                <span className={`nature-badge ${item.nature.toLowerCase()}`}>
                  {item.nature}
                </span>
                <span className={`account-type-badge ${item.account_type}`}>
                  {accountTypeNames[item.account_type]}
                </span>
                {item.account_level !== "clase" && (
                  <span className="account-level-badge">
                    {item.account_level}
                  </span>
                )}
              </div>
            }
          >
            {hasChildren && (
              <Accordion
                multiple
                activeIndex={activeAccordionKeys[item.id.toString()] || []}
                onTabChange={(e) => {
                  setActiveAccordionKeys((prev) => ({
                    ...prev,
                    [item.id.toString()]: e.index as number[],
                  }));
                }}
              >
                {renderAccordion(
                  item.children || [],
                  depth + 1,
                  item.id.toString()
                )}
              </Accordion>
            )}
          </AccordionTab>
        );
      });
    },
    [activeAccordionKeys, handleAccountSelect, selectedAccount]
  );

  // Filtrar cuentas
  const filteredAccounts = useMemo(() => {
    if (!filters.codigo.value && !filters.nombre.value) return accounts;

    const filterNodes = (nodes: AccountingAccount[]): AccountingAccount[] => {
      return nodes
        .map((node) => {
          const matchesCode =
            !filters.codigo.value ||
            node.account_code
              .toLowerCase()
              .includes(filters.codigo.value.toLowerCase());
          const matchesName =
            !filters.nombre.value ||
            node.account_name
              .toLowerCase()
              .includes(filters.nombre.value.toLowerCase());

          const filteredChildren = node.children
            ? filterNodes(node.children)
            : undefined;

          if (
            matchesCode ||
            matchesName ||
            (filteredChildren && filteredChildren.length > 0)
          ) {
            return { ...node, children: filteredChildren };
          }
          return null;
        })
        .filter((node) => node !== null) as AccountingAccount[];
    };

    return filterNodes(accounts);
  }, [accounts, filters]);

  const accordionContent = useMemo(
    () => renderAccordion(filteredAccounts, 0),
    [filteredAccounts, renderAccordion]
  );

  // Funciones para crear nueva cuenta
  const getNextLevel = (currentLevel: AccountLevel): AccountLevel => {
    const levels: AccountLevel[] = [
      "clase",
      "grupo",
      "cuenta",
      "subcuenta",
      "auxiliar",
      "subauxiliar",
    ];
    const currentIndex = levels.indexOf(currentLevel);
    return levels[currentIndex + 1] || "subauxiliar";
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const accountType =
        selectedAccount?.account_type || newAccount.accountType;
      if (!accountType) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo determinar el tipo de cuenta",
          life: 5000,
        });
        return;
      }

      console.log("selected", selectedAccount);

      return


      // Extraer los componentes del código
      const accountCode = newAccount.codigo;
      const accountParts = {
        account: accountCode.substring(0, 1),
        sub_account:
          accountCode.length >= 2 ? accountCode.substring(0, 2) : "00",
        auxiliary: accountCode.length >= 6 ? accountCode.substring(4, 6) : "00",
        sub_auxiliary:
          accountCode.length >= 8 ? accountCode.substring(6, 8) : "00",
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
        sub_auxiliary: accountParts.sub_auxiliary,
      };

      // Enviar al API
      const createdAccount = await createAccountingAccount(accountData);

      // Mostrar mensaje de éxito
      toast.current?.show({
        severity: "success",
        summary: "Cuenta creada",
        detail: `La cuenta ${createdAccount.account_name} se ha creado correctamente`,
        life: 5000,
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
        accountType: "asset",
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
          const serverErrors: Record<string, string> = {};
          error.message.split("\n").forEach((line) => {
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
        life: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkAccountExists = (code: string): boolean => {
    const checkInTree = (nodes: AccountingAccount[]): boolean => {
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
      setNewAccount((prev) => ({
        ...prev,
        tipo: nextLevel,
        codigo: selectedAccount.account_code.padEnd(
          nextLevel === "grupo"
            ? 2
            : nextLevel === "cuenta"
              ? 4
              : nextLevel === "subcuenta"
                ? 6
                : nextLevel === "auxiliar"
                  ? 8
                  : 10,
          "0"
        ),
        accountType: selectedAccount.account_type, // Heredar el tipo de cuenta del padre
      }));

      // Validar el código automático generado
      setCodeValidation(
        validateCode(
          selectedAccount.account_code.padEnd(
            nextLevel === "grupo"
              ? 2
              : nextLevel === "cuenta"
                ? 4
                : nextLevel === "subcuenta"
                  ? 6
                  : nextLevel === "auxiliar"
                    ? 8
                    : 10,
            "0"
          ),
          nextLevel,
          selectedAccount.account_code
        )
      );
    } else {
      setNewAccount((prev) => ({
        ...prev,
        tipo: "clase",
        codigo: "",
        accountType: "asset", // Valor por defecto para cuentas de nivel clase
      }));
    }
    setShowNewAccountDialog(true);
  };
  // Renderizado condicional
  if (isLoading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-center p-5">
          <i className="pi pi-spinner pi-spin text-2xl mr-2"></i>
          <span>Cargando datos contables...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <Message
          severity="error"
          text={`Error al cargar las cuentas: ${error}`}
          className="w-full md:w-6"
        />
      </div>
    );
  }

  return (
    <div className="accounting-container">
      <Tooltip target=".fiscal-icon" />
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            <div className="card border-0">
              <div className="card-body p-2">
                <div className="row g-2">
                  {/* Panel izquierdo - Estructura contable */}
                  <div className="col-12 col-md-7">
                    <Card className="h-100 border">
                      <div className="d-flex flex-column h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="m-0 fs-5 text-muted">
                            Estructura Contable
                          </h4>
                          <div className="d-flex gap-2 w-100 w-md-auto">
                            <span className="p-float-label flex-grow-1">
                              <InputText
                                id="searchCode"
                                value={filters.codigo.value}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    codigo: {
                                      ...filters.codigo,
                                      value: e.target.value,
                                    },
                                  })
                                }
                                className="w-100"
                              />
                              <label htmlFor="searchCode">Código</label>
                            </span>
                            <span className="p-float-label flex-grow-1">
                              <InputText
                                id="searchName"
                                value={filters.nombre.value}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    nombre: {
                                      ...filters.nombre,
                                      value: e.target.value,
                                    },
                                  })
                                }
                                className="w-100"
                              />
                              <label htmlFor="searchName">Nombre</label>
                            </span>
                          </div>
                        </div>

                        <div className="account-accordion-container flex-grow-1">
                          <Accordion
                            multiple
                            activeIndex={activeAccordionKeys["root"] || []}
                            onTabChange={(e) => {
                              setActiveAccordionKeys((prev) => ({
                                ...prev,
                                ["root"]: e.index as number[],
                              }));
                            }}
                          >
                            {accordionContent}
                          </Accordion>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Panel derecho - Jerarquía de la cuenta */}
                  <div className="col-12 col-md-5">
                    <div className="d-flex flex-column h-100 gap-2">
                      <Card className="flex-grow-1 border">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="m-0 fs-5 text-muted">
                            Jerarquía de la Cuenta
                          </h4>
                          <Button
                            label="Nueva Subcuenta"
                            icon="pi pi-plus"
                            className="p-button-sm p-button-outlined"
                            onClick={handleOpenNewAccountDialog}
                            disabled={!selectedAccount}
                            tooltip="Crear una nueva subcuenta bajo la seleccionada"
                            tooltipOptions={{ position: "top" }}
                          />

                          <Button
                            label="Editar Cuenta"
                            icon="pi pi-pencil"
                            className="p-button-sm p-button-outlined p-button-secondary"
                            onClick={handleOpenEditAccountDialog}
                            disabled={!selectedAccount}
                            tooltip="Editar la cuenta seleccionada"
                            tooltipOptions={{ position: "top" }}
                          />
                        </div>

                        <DataTable
                          value={tableData}
                          emptyMessage="Seleccione una cuenta del plan"
                          className="p-datatable-sm"
                          scrollable
                          scrollHeight="flex"
                          responsiveLayout="scroll"
                        >
                          <Column
                            field="tipo"
                            header="Nivel"
                            style={{ width: "15%" }}
                            body={(rowData: TableRow) => (
                              <span
                                className={`badge level-${rowData.tipo.toLowerCase()}`}
                              >
                                {rowData.tipo}
                              </span>
                            )}
                          />
                          <Column
                            field="codigo"
                            header="Código"
                            style={{ width: "15%" }}
                          />
                          <Column
                            field="nombre"
                            header="Nombre"
                            style={{ width: "30%" }}
                          />
                          <Column
                            field="naturaleza"
                            header="Naturaleza"
                            style={{ width: "15%" }}
                            body={(rowData: TableRow) => (
                              <span
                                className={`nature-badge ${rowData.naturaleza.toLowerCase()}`}
                              >
                                {rowData.naturaleza}
                              </span>
                            )}
                          />
                          <Column
                            field="account_type"
                            header="Tipo"
                            style={{ width: "25%" }}
                            body={(rowData: TableRow) => (
                              <span className={`account-type-badge`}>
                                {rowData.account_type}
                              </span>
                            )}
                          />
                        </DataTable>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Diálogo para nueva cuenta */}
      <Dialog
        header="Crear Nueva Cuenta"
        visible={showNewAccountDialog}
        style={{ width: "90vw", maxWidth: "600px" }}
        onHide={() => {
          setShowNewAccountDialog(false);
          setFormErrors({});
        }}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => {
                setShowNewAccountDialog(false);
                setFormErrors({});
              }}
              className="p-button-text"
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? "Creando..." : "Crear"}
              icon={isSubmitting ? "pi pi-spinner pi-spin" : "pi pi-check"}
              onClick={handleCreateAccount}
              autoFocus
              disabled={
                isSubmitting ||
                !newAccount.codigo ||
                !newAccount.nombre ||
                !codeValidation.valid ||
                checkAccountExists(newAccount.codigo)
              }
            />
          </div>
        }
        breakpoints={{ "960px": "75vw", "640px": "90vw" }}
        modal
      >
        <div className="p-fluid grid formgrid">
          <div className="field col-12">
            <label htmlFor="accountType">Tipo de Cuenta</label>
            <Dropdown
              id="accountType"
              value={newAccount.tipo}
              options={accountLevels}
              onChange={(e) => {
                const newType = e.value;
                setNewAccount((prev) => ({
                  ...prev,
                  tipo: newType,
                }));

                // Validar el código cuando cambia el tipo
                if (newAccount.codigo) {
                  const validation = validateCode(
                    newAccount.codigo,
                    newType,
                    selectedAccount?.account_code
                  );
                  setCodeValidation(validation);

                  // Verificar si la cuenta ya existe
                  if (
                    validation.valid &&
                    checkAccountExists(newAccount.codigo)
                  ) {
                    setFormErrors((prev) => ({
                      ...prev,
                      codigo: "Esta cuenta ya existe",
                    }));
                  } else {
                    setFormErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.codigo;
                      return newErrors;
                    });
                  }
                }
              }}
              optionLabel="label"
              placeholder="Seleccione el tipo"
              disabled={!!selectedAccount || isSubmitting}
              className={classNames("w-full", {
                "p-invalid": !!formErrors.accountType,
              })}
            />
            {selectedAccount && (
              <small className="block mt-1 text-500">
                Creando una subcuenta de nivel {newAccount.tipo} para la cuenta{" "}
                {selectedAccount.account_name}
              </small>
            )}
            {formErrors.accountType && (
              <small className="p-error block mt-1">
                {formErrors.accountType}
              </small>
            )}
          </div>

          {!selectedAccount && (
            <div className="field col-12">
              <label htmlFor="accountTypeSelect">Tipo de Cuenta *</label>
              <Dropdown
                id="accountTypeSelect"
                value={newAccount.accountType}
                options={[
                  { label: "Activo", value: "asset" },
                  { label: "Pasivo", value: "liability" },
                  { label: "Patrimonio", value: "equity" },
                  { label: "Ingresos", value: "income" },
                  { label: "Gastos", value: "expense" },
                  { label: "Costos", value: "cost" },
                  { label: "Cuentas de Orden", value: "memorandum" },
                  { label: "Cuentas Fiscales", value: "fiscal" },
                  { label: "Cuentas de Control", value: "control" },
                ]}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, accountType: e.value })
                }
                placeholder="Seleccione el tipo"
                disabled={isSubmitting}
                className={classNames("w-full", {
                  "p-invalid": !!formErrors.accountType,
                })}
              />
              {formErrors.accountType && (
                <small className="p-error block mt-1">
                  {formErrors.accountType}
                </small>
              )}
            </div>
          )}

          <div className="field col-12">
            <label htmlFor="accountCode">Código *</label>
            <InputText
              id="accountCode"
              value={newAccount.codigo} // Cambiamos a mostrar el código completo
              onChange={(e) => {
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
                  subauxiliar: 10,
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
                    subauxiliar: 8,
                  }[newAccount.tipo];

                  const parentPart = selectedAccount.account_code.substring(
                    0,
                    Number.MAX_SAFE_INTEGER
                  );
                  fullCode =
                    parentPart + truncatedValue.substring(parentPart.length);
                }

                setNewAccount((prev) => ({
                  ...prev,
                  codigo: fullCode,
                }));

                const validation = validateCode(
                  fullCode,
                  newAccount.tipo,
                  selectedAccount?.account_code
                );
                setCodeValidation(validation);

                // Verificar si la cuenta ya existe
                if (validation.valid) {
                  if (checkAccountExists(fullCode)) {
                    setFormErrors((prev) => ({
                      ...prev,
                      codigo: "Esta cuenta ya existe",
                    }));
                  } else {
                    setFormErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.codigo;
                      return newErrors;
                    });
                  }
                }
              }}
              required
              disabled={isSubmitting}
              className={classNames("w-full", {
                "p-invalid":
                  !!formErrors.codigo ||
                  (!codeValidation.valid && newAccount.codigo),
              })}
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
            />
            {!codeValidation.valid && newAccount.codigo && (
              <small className="p-error block mt-1">
                {codeValidation.message}
              </small>
            )}
            {formErrors.codigo && (
              <small className="p-error block mt-1">{formErrors.codigo}</small>
            )}
            {selectedAccount && (
              <small className="block mt-1 text-500">
                Código padre: {selectedAccount.account_code}
              </small>
            )}
          </div>

          <div className="field col-12">
            <label htmlFor="accountName">Nombre *</label>
            <InputText
              id="accountName"
              value={newAccount.nombre}
              onChange={(e) => {
                setNewAccount({ ...newAccount, nombre: e.target.value });
                if (e.target.value.trim().length >= 3) {
                  setFormErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.nombre;
                    return newErrors;
                  });
                }
              }}
              required
              disabled={isSubmitting}
              className={classNames("w-full", {
                "p-invalid": !!formErrors.nombre,
              })}
            />
            {formErrors.nombre && (
              <small className="p-error block mt-1">{formErrors.nombre}</small>
            )}
          </div>

          <div className="field col-12">
            <label htmlFor="initialBalance">Saldo Inicial</label>
            <InputNumber
              id="initialBalance"
              value={newAccount.initialBalance || 0}
              onValueChange={(e) =>
                setNewAccount({ ...newAccount, initialBalance: e.value || 0 })
              }
              mode="currency"
              currency="COP"
              locale="es-CO"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="field-checkbox col-12 md:col-6">
            <Checkbox
              inputId="newFiscalDifference"
              checked={newAccount.fiscalDifference}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  fiscalDifference: e.checked ?? false,
                })
              }
              disabled={isSubmitting}
            />
            <label htmlFor="newFiscalDifference" className="ml-2">
              Cuenta de diferencia fiscal
            </label>
          </div>

          <div className="field-checkbox col-12 md:col-6">
            <Checkbox
              inputId="newActive"
              checked={newAccount.activa}
              onChange={(e) =>
                setNewAccount({ ...newAccount, activa: e.checked ?? false })
              }
              disabled={isSubmitting}
            />
            <label htmlFor="newActive" className="ml-2">
              Cuenta activa
            </label>
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Editar Cuenta"
        visible={showEditAccountDialog}
        style={{ width: "90vw", maxWidth: "600px" }}
        onHide={() => {
          setShowEditAccountDialog(false);
          setFormErrors({});
        }}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => {
                setShowEditAccountDialog(false);
                setFormErrors({});
              }}
              className="p-button-text"
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? "Actualizando..." : "Actualizar"}
              icon={isSubmitting ? "pi pi-spinner pi-spin" : "pi pi-check"}
              onClick={handleUpdateAccount}
              autoFocus
              disabled={isSubmitting || !editAccount.nombre?.trim()}
            />
          </div>
        }
        breakpoints={{ "960px": "75vw", "640px": "90vw" }}
        modal
      >
        <div className="p-fluid grid formgrid">
          <div className="field col-12">
            <label htmlFor="editAccountType">Tipo de Cuenta</label>
            <InputText
              id="editAccountType"
              value={
                accountLevels.find((l) => l.value === editAccount.tipo)
                  ?.label || editAccount.tipo
              }
              disabled
              className="w-full"
            />
          </div>

          <div className="field col-12">
            <label htmlFor="editAccountCode">Código</label>
            <InputText
              id="editAccountCode"
              value={editAccount.codigo}
              disabled
              className="w-full"
            />
          </div>

          <div className="field col-12">
            <label htmlFor="editAccountName">Nombre *</label>
            <InputText
              id="editAccountName"
              value={editAccount.nombre}
              onChange={(e) => {
                setEditAccount({ ...editAccount, nombre: e.target.value });
                if (e.target.value.trim().length >= 3) {
                  setFormErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.nombre;
                    return newErrors;
                  });
                }
              }}
              className={classNames("w-full", {
                "p-invalid": !!formErrors.nombre,
              })}
            />
            {formErrors.nombre && (
              <small className="p-error block mt-1">{formErrors.nombre}</small>
            )}
          </div>

          <div className="field col-12">
            <label htmlFor="editInitialBalance">Saldo Inicial *</label>
            <InputNumber
              id="editInitialBalance"
              value={editAccount.initialBalance || 0}
              onValueChange={(e) =>
                setEditAccount({ ...editAccount, initialBalance: e.value || 0 })
              }
              mode="currency"
              currency="COP"
              locale="es-CO"
              className={classNames("w-full", {
                "p-invalid": !!formErrors.initial_balance,
              })}
            />
            {formErrors.initial_balance && (
              <small className="p-error block mt-1">
                {formErrors.initial_balance}
              </small>
            )}
          </div>

          <div className="field-checkbox col-12 md:col-6">
            <Checkbox
              inputId="editFiscalDifference"
              checked={editAccount.fiscalDifference}
              onChange={(e) =>
                setEditAccount({
                  ...editAccount,
                  fiscalDifference: e.checked ?? false,
                })
              }
              disabled={isSubmitting}
            />
            <label htmlFor="editFiscalDifference" className="ml-2">
              Cuenta de diferencia fiscal
            </label>
          </div>

          <div className="field-checkbox col-12 md:col-6">
            <Checkbox
              inputId="editActive"
              checked={editAccount.activa}
              onChange={(e) =>
                setEditAccount({ ...editAccount, activa: e.checked ?? false })
              }
              disabled={isSubmitting}
            />
            <label htmlFor="editActive" className="ml-2">
              Cuenta activa
            </label>
          </div>
        </div>
      </Dialog>
      <style>{`
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
            `}</style>
    </div>
  );
};
