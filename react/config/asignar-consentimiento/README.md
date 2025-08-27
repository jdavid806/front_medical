# Módulo Asignar Consentimiento

Este módulo React implementa la funcionalidad para visualizar y gestionar documentos de consentimiento informado para pacientes específicos, basado en la lógica original de `verDocumentos.php`.

## Estructura del Módulo

```
asignar-consentimiento/
├── AsignarConsentimiento.tsx      # Componente principal
├── index.ts                       # Exportaciones
├── components/                    # Componentes reutilizables
│   ├── DocumentTable.tsx         # Tabla de documentos con PrimeReact
│   ├── PatientBreadcrumb.tsx     # Navegación breadcrumb
│   └── DocumentFormModal.tsx     # Modal para crear/editar documentos
├── hooks/                        # Custom hooks
│   └── usePatientDocuments.ts    # Hook para manejo de datos
├── types/                        # Definiciones de tipos
│   ├── DocumentData.ts           # Interfaces principales
│   └── table-types.ts            # Tipos específicos de tabla
└── enums/                        # Configuraciones
    └── columns.tsx               # Definición de columnas de tabla
```

## Características Principales

### ✅ Implementado
- **Navegación breadcrumb** siguiendo el patrón de `verDocumentos.php`
- **Tabla de documentos** con PrimeReact y funcionalidades de búsqueda/filtrado
- **Modal para crear/editar** documentos de consentimiento
- **Manejo de estado** reactivo con hooks personalizados
- **Obtención de datos de paciente** desde URL parameters
- **Diseño responsivo** con Bootstrap y PrimeReact
- **Arquitectura modular** separada en componentes y hooks

### 🔄 Por Implementar
- Integración con servicios API reales para documentos
- Funcionalidad de visualización de documentos (PDF/viewer)
- Confirmación de eliminación con SweetAlert
- Manejo de errores mejorado
- Validaciones de formulario más robustas

## Uso

### Integración en PHP
```php
// En el archivo PHP donde se quiera usar este componente
<div id="asignar-consentimiento-app"></div>
<script type="module">
  import { AsignarConsentimiento } from './react-dist/config/asignar-consentimiento/index.js';
  import { createRoot } from 'react-dom/client';
  
  const container = document.getElementById('asignar-consentimiento-app');
  const root = createRoot(container);
  root.render(React.createElement(AsignarConsentimiento));
</script>
```

### URL Parameters
El componente extrae automáticamente el `patient_id` de los parámetros de la URL:
```
/ruta-al-modulo?patient_id=123
```

## Componentes Principales

### AsignarConsentimiento
Componente principal que integra toda la funcionalidad.

### DocumentTable
Tabla de documentos con:
- Búsqueda global
- Paginación
- Ordenamiento
- Botones de acción (ver, editar, eliminar)

### PatientBreadcrumb
Navegación tipo breadcrumb que muestra:
- Inicio → Pacientes → [Nombre Paciente] → Consentimientos Informados

### DocumentFormModal
Modal para crear y editar documentos con campos:
- Título del consentimiento
- Motivo/descripción
- Fecha

## Hooks Personalizados

### usePatientDocuments
Hook que maneja:
- Carga de datos del paciente
- Carga de documentos asociados
- Estados de loading y error
- Función de recarga

## Estilos y UI

- **PrimeReact** para componentes de tabla y formularios
- **Bootstrap** para layout y utilidades CSS
- **FontAwesome** para iconografía
- **Diseño consistente** con el módulo de consentimiento existente

## Datos Mock

Actualmente utiliza datos de ejemplo en `usePatientDocuments.ts`. Para producción, reemplazar con llamadas a API reales.

## Próximos Pasos

1. Implementar servicios API para documentos
2. Agregar funcionalidad de visualización de documentos
3. Mejorar validaciones y manejo de errores
4. Agregar tests unitarios
5. Optimizar performance con memoización
