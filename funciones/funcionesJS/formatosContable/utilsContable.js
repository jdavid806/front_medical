// export const formatDate = (value) => {
//   return value.toLocaleDateString("es-DO", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };
export const formatDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-"); 
};
export const formatCurrency = (value) => {
  return value.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
