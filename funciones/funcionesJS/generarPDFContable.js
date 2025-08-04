import { generarFormatoReciboCaja } from "./formatosContable/formatoReciboCaja.js";
import { generarFormatoFacturaVenta } from "./formatosContable/formatoFacturaVenta.js";
import { generarFormatoFacturaCompra } from "./formatosContable/formatoFacturaCompra.js";
import { generarFormatoFacturaEntidad } from "./formatosContable/formatoFacturaEntidad.js";
import { generarFormatoNotaDebitoCredito } from "./formatosContable/formatoNotaDebitoCredito.js";
import { generarFormatoOrdenCompra } from "./formatosContable/formatoOrdenCompra.js";
export function generarFormatoContable(name, object, tipo) {
  switch (name) {
    case "ReciboCaja":
      generarFormatoReciboCaja(object, tipo);
      break;

    case "FacturaVenta":
      generarFormatoFacturaVenta(object, tipo);
      break;

    case "FacturaCompra":
      generarFormatoFacturaCompra(object, tipo);
      break;

    case "FacturaEntidad":
      generarFormatoFacturaEntidad(object, tipo);
      break;

    case "NotaDebitoCredito":
      generarFormatoNotaDebitoCredito(object, tipo);
      break;

      case "OrdenCompra":
      generarFormatoOrdenCompra(object, tipo);
      break;
    default:
      break;
  }
}

export default generarFormatoContable;
