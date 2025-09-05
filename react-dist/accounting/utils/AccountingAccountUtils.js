export const natureSeverity = nature_code => {
  switch (nature_code) {
    case 'debit':
      return 'success';
    case 'credit':
      return 'danger';
    default:
      return 'secondary';
  }
};
export const getNextLevel = currentLevel => {
  const levels = ["Clase", "Grupo", "Cuenta", "Sub cuenta", "Auxiliar"];
  const currentIndex = levels.indexOf(currentLevel);
  return levels[currentIndex + 1] || "Auxiliar";
};