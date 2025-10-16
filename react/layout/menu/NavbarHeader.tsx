import { Menubar } from 'primereact/menubar';
import React from 'react';
import { navbarMenuStyle } from './styles/navBarMegaMenu';
import { useMenuItems } from './hooks/useMenuItems';

const NavbarHeader = () => {
    const { menuItems: menuItemsFromHook, loading } = useMenuItems();
    
    console.log("Menu items procesados:", menuItemsFromHook);

    const iconTemplate = (iconClass) => {
        return iconClass ? <i className={iconClass}></i> : null;
    };

    const processItems = (items) => {
        if (!items || !Array.isArray(items)) return [];
        
        return items.map(item => {
            const processedItem = { 
                label: item.label,
                url: item.url
            };

            if (item.icon) {
                processedItem.icon = () => iconTemplate(item.icon);
            }

            if (item.items && item.items.length > 0) {
                processedItem.items = processItems(item.items);
            }

            return processedItem;
        });
    };

    const processedItems = processItems(menuItemsFromHook);

    if (loading) {
        return <div>Cargando menú...</div>;
    }

    return (
        <>
            <Menubar
                model={processedItems}
                className="custom-responsive-megamenu"
            />
            <style>{navbarMenuStyle}</style>
        </>
    );
};

export default NavbarHeader;