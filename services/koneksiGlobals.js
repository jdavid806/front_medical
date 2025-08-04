export const apiUrl = "api.staging.osigudr";
export const token = () => localStorage.getItem("token");
export const providerSlug = () => localStorage.getItem("provider_slug");

export const EXCEPTIONS = {
    BENEFICIARY_SEARCH_ERROR: "Ha ocurrido un error al obtener la información del paciente. Por favor intenta nuevamente.",
    BENEFICIARY_NOT_FOUND: "El paciente consultado no existe.",
    TIMEOUT_ERROR: "Se ha agotado el tiempo de espera. Por favor intenta nuevamente.",
    INVALID_PRODUCT_ERROR: "El producto no es válido para el paciente consultado.",
    CLAIM_URL_ERROR: "No se pudo obtener la URL de la reclamación de consulta.",
    CLAIM_INFO_ERROR: "Ha ocurrido un error al obtener la información de la reclamación. Por favor intenta nuevamente.",
    PRODUCTS_PREAUTHORIZATION_REQUEST_ERROR: "Ha ocurrido un error al solicitar la preautorización de productos. Por favor intenta nuevamente.",
}