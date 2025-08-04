/**
 * Convierte un número a su representación en letras en español
 * @param num Número a convertir (hasta 999,999,999.99)
 * @returns Representación en letras del número
 */
export const numeroALetras = (num: number): string => {
    // Validar que sea un número
    if (isNaN(num)) return 'No es un número válido';
    
    // Redondear a 2 decimales
    const numero = Math.round(num * 100) / 100;
    
    // Partes del número
    const entero = Math.floor(numero);
    const decimal = Math.round((numero - entero) * 100);
    
    // Convertir parte entera
    let letras = convertirParteEntera(entero);
    
    // Convertir parte decimal si existe
    if (decimal > 0) {
      letras += ` con ${convertirParteEntera(decimal)}`;
      // Añadir "centavos" o "centavo" según corresponda
      letras += decimal === 1 ? ' centavo' : ' centavos';
    }
    
    return letras.charAt(0).toUpperCase() + letras.slice(1);
  };
  
  // Función auxiliar para convertir la parte entera
  const convertirParteEntera = (num: number): string => {
    if (num === 0) return 'cero';
    
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const veintis = ['', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    let resultado = '';
    
    // Millones
    if (num >= 1000000) {
      const millones = Math.floor(num / 1000000);
      resultado += (millones === 1 ? 'un millón' : `${convertirParteEntera(millones)} millones`) + ' ';
      num %= 1000000;
    }
    
    // Miles
    if (num >= 1000) {
      const miles = Math.floor(num / 1000);
      if (miles === 1) {
        resultado += 'mil ';
      } else {
        resultado += `${convertirParteEntera(miles)} mil `;
      }
      num %= 1000;
    }
    
    // Centenas
    if (num >= 100) {
      const centena = Math.floor(num / 100);
      if (num === 100) {
        resultado += 'cien ';
      } else {
        resultado += `${centenas[centena]} `;
      }
      num %= 100;
    }
    
    // Decenas y unidades
    if (num > 0) {
      if (num >= 10 && num < 20) {
        resultado += especiales[num - 10] + ' ';
      } else if (num >= 20 && num < 30) {
        resultado += veintis[num - 20] + ' ';
      } else {
        const decena = Math.floor(num / 10);
        const unidad = num % 10;
        
        if (decena > 0) {
          resultado += decenas[decena];
          if (unidad > 0) {
            resultado += ' y ';
          }
        }
        
        if (unidad > 0) {
          // Caso especial para "uno" que se convierte en "un" cuando es parte de un número mayor
          if (unidad === 1 && (resultado.includes('mil') || resultado.includes('millón'))) {
            resultado += 'un';
          } else {
            resultado += unidades[unidad];
          }
        }
        
        resultado += ' ';
      }
    }
    
    return resultado.trim();
  };