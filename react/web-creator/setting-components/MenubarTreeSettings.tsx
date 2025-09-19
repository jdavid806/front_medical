import React from "react";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";

interface MenuTreeProps {
    menuItems: MenuItem[];
    onMenuItemsChange: (menuItems: MenuItem[]) => void;
}

export const MenubarTreeSettings = ({ menuItems, onMenuItemsChange }: MenuTreeProps) => {
    const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null);
    const [editDialogVisible, setEditDialogVisible] = React.useState(false);
    const [newItem, setNewItem] = React.useState<MenuItem>({
        label: "",
        icon: "",
        url: ""
    });

    const convertToTreeNode = (menuItems: MenuItem[]): TreeNode[] => {
        return menuItems.map((item, index) => ({
            key: `${index}-${item.label}`,
            label: item.label,
            icon: item.icon,
            data: item,
            children: item.items ? convertToTreeNode(item.items as MenuItem[]) : undefined
        }));
    };

    const findAndUpdateItem = (
        items: MenuItem[],
        key: string,
        updates: Partial<MenuItem>
    ): MenuItem[] => {
        return items.map(item => {
            const itemKey = `${items.indexOf(item)}-${item.label}`;

            if (itemKey === key) {
                return { ...item, ...updates };
            }

            if (item.items) {
                return {
                    ...item,
                    items: findAndUpdateItem(item.items as MenuItem[], key, updates)
                };
            }

            return item;
        });
    };

    const findAndAddItem = (
        items: MenuItem[],
        parentKey: string | null,
        newItem: MenuItem
    ): MenuItem[] => {
        if (parentKey === null) {
            return [...items, newItem];
        }

        return items.map(item => {
            const itemKey = `${items.indexOf(item)}-${item.label}`;

            if (itemKey === parentKey) {
                return {
                    ...item,
                    items: [...(item.items || []), newItem]
                } as MenuItem;
            }

            if (item.items) {
                return {
                    ...item,
                    items: findAndAddItem(item.items as MenuItem[], parentKey, newItem)
                } as MenuItem;
            }

            return item;
        });
    };

    const findAndRemoveItem = (items: MenuItem[], key: string): MenuItem[] => {
        return items.filter(item => {
            const itemKey = `${items.indexOf(item)}-${item.label}`;

            if (itemKey === key) {
                return false;
            }

            if (item.items) {
                item.items = findAndRemoveItem(item.items as MenuItem[], key);
            }

            return true;
        });
    };

    const handleEdit = (node: TreeNode) => {
        setSelectedNode(node);
        setNewItem(node.data as MenuItem);
        setEditDialogVisible(true);
    };

    const handleSave = () => {
        if (selectedNode) {
            const updatedItems = findAndUpdateItem(
                menuItems,
                selectedNode.key as string,
                newItem
            );
            onMenuItemsChange(updatedItems);
        } else {
            const updatedItems = findAndAddItem(menuItems, null, newItem);
            onMenuItemsChange(updatedItems);
        }
        setEditDialogVisible(false);
        setSelectedNode(null);
        setNewItem({ label: "", icon: "", url: "" });
    };

    const handleAddSubmenu = () => {
        if (selectedNode) {
            const newSubItem: MenuItem = { label: "Nuevo Submenú", icon: "", url: "" };
            const updatedItems = findAndAddItem(
                menuItems,
                selectedNode.key as string,
                newSubItem
            );
            onMenuItemsChange(updatedItems);
        }
    };

    const handleDelete = () => {
        if (selectedNode) {
            const updatedItems = findAndRemoveItem(
                menuItems,
                selectedNode.key as string
            );
            onMenuItemsChange(updatedItems);
            setEditDialogVisible(false);
            setSelectedNode(null);
        }
    };

    const nodeTemplate = (node: TreeNode) => {
        return (
            <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                    {node.icon && <i className={`${node.icon} mr-2`} />}
                    <span>{node.label}</span>
                </div>
                <div>
                    <Button
                        icon={<i className="fas fa-edit" />}
                        className="p-button-text p-button-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(node);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="d-flex flex-column gap-2">
                <Button
                    label="Agregar Menú Principal"
                    icon={<i className="fas fa-plus" />}
                    onClick={() => {
                        setSelectedNode(null);
                        setNewItem({ label: "Nuevo Menú", icon: "", url: "" });
                        setEditDialogVisible(true);
                    }}
                />

                <Tree
                    value={convertToTreeNode(menuItems)}
                    nodeTemplate={nodeTemplate}
                    selectionMode="single"
                    onSelect={(e) => setSelectedNode(e.node)}
                    className="w-100"
                />
            </div>

            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={selectedNode ? "Editar Menú" : "Agregar Menú"}
                style={{ width: '50vw' }}
                footer={
                    <div>
                        <Button
                            label="Cancelar"
                            icon={<i className="fas fa-times" />}
                            onClick={() => setEditDialogVisible(false)}
                            className="p-button-text"
                        />
                        {selectedNode && (
                            <>
                                <Button
                                    label="Agregar Submenú"
                                    icon={<i className="fas fa-plus" />}
                                    onClick={handleAddSubmenu}
                                    className="p-button-success"
                                />
                                <Button
                                    label="Eliminar"
                                    icon={<i className="fas fa-trash" />}
                                    onClick={handleDelete}
                                    className="p-button-danger"
                                />
                            </>
                        )}
                        <Button
                            label="Guardar"
                            icon={<i className="fas fa-check" />}
                            onClick={handleSave}
                            autoFocus
                        />
                    </div>
                }
            >
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column">
                        <label htmlFor="label" className="form-label">Label</label>
                        <InputText
                            id="label"
                            value={newItem.label}
                            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                        />
                    </div>

                    <div className="d-flex flex-column">
                        <label htmlFor="icon" className="form-label">Icono (Clase FontAwesome)</label>
                        <InputText
                            id="icon"
                            value={newItem.icon || ""}
                            onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                            placeholder="fa-solid fa-house"
                        />
                    </div>

                    <div className="d-flex flex-column">
                        <label htmlFor="url" className="form-label">URL</label>
                        <InputText
                            id="url"
                            value={newItem.url || ""}
                            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                            placeholder="/ruta"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};