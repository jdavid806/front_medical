import { useEffect, useState } from "react";
export const useAccountingAccountsTree = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const natureSeverity = nature_code => {
    switch (nature_code) {
      case 'debit':
        return 'success';
      case 'credit':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  const fetchAccountingAccountsTree = async () => {
    setData([{
      "id": 27,
      "account_code": "1",
      "account": "1",
      "sub_account": null,
      "auxiliary": null,
      "sub_auxiliary": null,
      "account_name": "Test Carlos",
      "account_type": "asset",
      "account_type_name": "Activo",
      "level": "Clase",
      "depth": 1,
      "nature_code": "debit",
      "nature_label": "Débito",
      "children": [{
        "id": 13,
        "account_code": "11",
        "account": "1",
        "sub_account": "1",
        "auxiliary": null,
        "sub_auxiliary": null,
        "account_name": "Disponible",
        "account_type": "asset",
        "account_type_name": "Activo",
        "level": "Grupo",
        "depth": 2,
        "nature_code": "debit",
        "nature_label": "Débito",
        "children": [{
          "id": 14,
          "account_code": "1105",
          "account": "1",
          "sub_account": "1",
          "auxiliary": "05",
          "sub_auxiliary": null,
          "account_name": "Caja",
          "account_type": "asset",
          "account_type_name": "Activo",
          "level": "Cuenta",
          "depth": 3,
          "nature_code": "debit",
          "nature_label": "Débito",
          "children": [{
            "id": 1,
            "account_code": "110501",
            "account": "1",
            "sub_account": "1",
            "auxiliary": "05",
            "sub_auxiliary": "01",
            "account_name": "Caja General",
            "account_type": "asset",
            "account_type_name": "Activo",
            "level": "Sub cuenta",
            "depth": 4,
            "nature_code": "debit",
            "nature_label": "Débito",
            "children": []
          }, {
            "id": 2,
            "account_code": "110505",
            "account": "1",
            "sub_account": "1",
            "auxiliary": "05",
            "sub_auxiliary": "05",
            "account_name": "Bancos",
            "account_type": "asset",
            "account_type_name": "Activo",
            "level": "Sub cuenta",
            "depth": 4,
            "nature_code": "debit",
            "nature_label": "Débito",
            "children": []
          }]
        }]
      }, {
        "id": 15,
        "account_code": "15",
        "account": "1",
        "sub_account": "5",
        "auxiliary": null,
        "sub_auxiliary": null,
        "account_name": "Propiedades, planta y equipo",
        "account_type": "asset",
        "account_type_name": "Activo",
        "level": "Grupo",
        "depth": 2,
        "nature_code": "debit",
        "nature_label": "Débito",
        "children": [{
          "id": 16,
          "account_code": "1504",
          "account": "1",
          "sub_account": "5",
          "auxiliary": "04",
          "sub_auxiliary": null,
          "account_name": "Terrenos",
          "account_type": "asset",
          "account_type_name": "Activo",
          "level": "Cuenta",
          "depth": 3,
          "nature_code": "debit",
          "nature_label": "Débito",
          "children": []
        }, {
          "id": 24,
          "account_code": "1505",
          "account": "1",
          "sub_account": "5",
          "auxiliary": "05",
          "sub_auxiliary": null,
          "account_name": "Oficinas",
          "account_type": "asset",
          "account_type_name": "Activo",
          "level": "Cuenta",
          "depth": 3,
          "nature_code": "debit",
          "nature_label": "Débito",
          "children": [{
            "id": 25,
            "account_code": "150505",
            "account": "1",
            "sub_account": "5",
            "auxiliary": "05",
            "sub_auxiliary": "05",
            "account_name": "Principal",
            "account_type": "asset",
            "account_type_name": "Activo",
            "level": "Sub cuenta",
            "depth": 4,
            "nature_code": "debit",
            "nature_label": "Débito",
            "children": []
          }]
        }]
      }]
    }]);
  };
  const findNodePath = (nodes, targetId) => {
    // Función recursiva para buscar el nodo y trackear el camino
    const findPathRecursive = (currentNode, currentPath) => {
      // Agregar el nodo actual al camino
      const newPath = [...currentPath, currentNode];

      // Si encontramos el nodo objetivo, retornar el camino
      if (currentNode.id === targetId) {
        return newPath;
      }

      // Buscar recursivamente en los hijos
      if (currentNode.children && currentNode.children.length > 0) {
        for (const child of currentNode.children) {
          const result = findPathRecursive(child, newPath);
          if (result) {
            return result;
          }
        }
      }

      // Si no se encuentra en este branch, retornar null
      return null;
    };

    // Buscar en todos los nodos raíz
    for (const node of nodes) {
      const path = findPathRecursive(node, []);
      if (path) {
        return path;
      }
    }

    // Si no se encuentra el nodo, retornar array vacío
    return [];
  };
  const filterTreeByAccountCode = (nodes, searchTerm) => {
    if (!searchTerm) {
      setFilteredData(nodes);
      return;
    }
    const filteredNodes = [];
    const searchLower = searchTerm.toLowerCase();
    const filterRecursive = node => {
      const matches = node.account_code && node.account_code.toLowerCase().includes(searchLower);
      if (matches) {
        return {
          ...node
        };
      }
      if (node.children && node.children.length > 0) {
        const filteredChildren = [];
        for (const child of node.children) {
          const filteredChild = filterRecursive(child);
          if (filteredChild) {
            filteredChildren.push(filteredChild);
          }
        }
        if (filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
      }
      return null;
    };
    for (const node of nodes) {
      const filteredNode = filterRecursive(node);
      if (filteredNode) {
        filteredNodes.push(filteredNode);
      }
    }
    setFilteredData(filteredNodes);
  };
  useEffect(() => {
    fetchAccountingAccountsTree();
  }, []);
  useEffect(() => {
    filterTreeByAccountCode(data, searchTerm);
  }, [data, searchTerm]);
  return {
    fetchAccountingAccountsTree,
    filteredData,
    searchTerm,
    setSearchTerm,
    natureSeverity,
    findNodePath
  };
};