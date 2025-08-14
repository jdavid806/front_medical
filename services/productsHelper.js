import { similarity } from "./utilidades";

/**
 * Busca productos con nombres similares al término de búsqueda
 * @param {string} searchTerm Término de búsqueda
 * @param {Array} products Array de productos
 * @param {number} [threshold=0.7] Umbral de similitud (0-1)
 * @returns {Array} Productos con similitud mayor al umbral
 */
export function findSimilarProducts(searchTerm, products, threshold = 0.7) {
    if (!searchTerm || !products || products.length === 0) {
        return [];
    }

    return products
        .map(product => {
            const productName = product.attributes?.name || '';
            const score = similarity(searchTerm, productName);
            return { ...product, similarityScore: score };
        })
        .filter(item => item.similarityScore >= threshold)
        .sort((a, b) => b.similarityScore - a.similarityScore);
}