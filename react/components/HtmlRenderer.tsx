import React from 'react';

export const HtmlRenderer = ({ htmlContent }) => {
    // Función para sanitizar el HTML (opcional pero recomendado)
    const sanitizeHtml = (html) => {
        // Aquí podrías usar una librería como DOMPurify
        return html;
    };

    return (
        <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
            className="html-content" // Puedes añadir clases para estilos
        />
    );
};
