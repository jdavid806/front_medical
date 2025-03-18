import React, { useState } from "react";
import { CustomSelectContainer } from "../components/CustomSelectContainer";
import { patientsSelect } from "../patients/consts/patientConsts";
import { PrimeReactProvider } from "primereact/api";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useEffect } from "react";
import {
  productService,
  patientService,
  estimatesService,
} from "../../services/api";
import { Calendar } from "primereact/calendar";

interface EstimateProduct {
  product_id: number;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}
export const EstimateForm = () => {
  const [discount, setDiscount] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [observations, setObservations] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [selectedService, setSelectedService] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [products, setProducts] = useState<EstimateProduct[]>([]);
  //totales
  const [priceTotal, setPriceTotal] = useState("");
  const [quantityTotal, setQuantityTotal] = useState("");
  const [discountTotal, setDiscountTotal] = useState("");
  const [total, setTotal] = useState("");

  const [services, setServices] = useState([]);
  const [servicePatient, setServicePatient] = useState([]);
  const [mappedServices, setMappedServices] = useState([]);
  const [mappedServicePatient, setMappedServicePatient] = useState([]);

  useEffect(() => {
    fetchProductsAndServices();
    fetchPatients();
  }, []);

  const fetchProductsAndServices = async () => {
    const data = await productService.getAllProducts();
    const mappedData = data.data.map((item: any) => {
      return {
        value: item.id,
        label: item.attributes.name,
      };
    });

    setServices(data.data);
    setMappedServices(mappedData);
  };

  const fetchPatients = async () => {
    const data = await patientService.getAll();
    const mappedData = data.map((item: any) => {
      return {
        value: item.id,
        label: item.first_name + " " + item.last_name,
      };
    });

    setServicePatient(data.data);
    setMappedServicePatient(mappedData);
  };

  function cambiarLabel() {
    const generarPara = (
      document.getElementById("generarPara") as HTMLSelectElement
    ).value;
    const patientSelectContent: any = document.getElementById(
      "patientSelectContent"
    );
    const depositSelectContent: any = document.getElementById(
      "depositSelectContent"
    );
    if (generarPara === "paciente") {
      patientSelectContent.style.display = "block";
      depositSelectContent.style.display = "none";
    } else if (generarPara === "entidad") {
      patientSelectContent.style.display = "none";
      depositSelectContent.style.display = "block";
    }
  }

  function handleInputDiscount(discountEvent: any) {
    setDiscount(discountEvent.target.value);
    const precio = parseFloat(price);
    const cantidad = parseFloat(quantity);
    const descuentoInput = discountEvent.target.value.trim();

    let descuento = 0;

    if (descuentoInput.endsWith("%")) {
      const porcentaje = parseFloat(descuentoInput.slice(0, -1));
      if (!isNaN(porcentaje)) {
        descuento = (precio * cantidad * porcentaje) / 100;
      }
    } else {
      descuento = parseFloat(descuentoInput);
      if (isNaN(descuento)) {
        descuento = 0;
      }
    }

    const subtotal = precio * cantidad - descuento;
    setSubtotal(subtotal.toFixed(2));
  }

  function handleAddProduct() {
    const descripcion = description;
    const precio = parseFloat(price);
    const cantidad = parseFloat(quantity);
    const descuentoInput = discount.trim();

    let descuento = 0;
    if (descuentoInput.endsWith("%")) {
      const porcentaje = parseFloat(descuentoInput.slice(0, -1));
      if (!isNaN(porcentaje)) {
        descuento = (precio * cantidad * porcentaje) / 100;
      }
    } else {
      descuento = parseFloat(descuentoInput);
      if (isNaN(descuento)) {
        descuento = 0;
      }
    }

    const total = precio * cantidad - descuento;

    const newProduct: EstimateProduct = {
      product_id: selectedService,
      description: descripcion,
      price: precio,
      quantity: cantidad,
      discount: descuento,
      total: total,
    };

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, newProduct];
      calculateTotals(updatedProducts);
      return updatedProducts;
    });
  }

  function handleDeleteProduct(index: number) {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  }

  function calculateTotals(updatedProducts: EstimateProduct[] = products) {
    const priceTotal = updatedProducts.reduce(
      (total, product) => total + product.price,
      0
    );
    const quantityTotal = updatedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );
    const discountTotal = updatedProducts.reduce(
      (total, product) => total + product.discount,
      0
    );
    const total = updatedProducts.reduce(
      (total, product) => total + product.total,
      0
    );
    setPriceTotal(priceTotal.toFixed(2));
    setQuantityTotal(quantityTotal.toFixed(2));
    setDiscountTotal(discountTotal.toFixed(2));
    setTotal(total.toFixed(2));
  }

  function handleProductChange(event: DropdownChangeEvent) {
    const product: any = services.find(
      (service: any) => service.id == event.value
    );
    if (product) {
      setPrice(product.attributes.purchase_price);
    }
    setSelectedService(event.value);
  }

  function selectedPatientChange(event: DropdownChangeEvent) {
    setSelectedPatient(event.value);
  }

  function saveEstimate() {
    const formattedDueDate = dueDate
      ? dueDate.toISOString().split("T")[0]
      : null;
    const requestData = {
      user_id: selectedPatient,
      deposit_id: 2,
      due_date: formattedDueDate,
      observations: observations,
      estimate: products.map((product: any) => {
        return {
          product_id: product.product_id,
          quantity: product.quantity,
          discount: product.discount,
        };
      }),
    };

    estimatesService
      .createEstimates(requestData)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error saving estimate:", error);
      });
  }

  return (
    <PrimeReactProvider
      value={{
        zIndex: {
          overlay: 100000,
        },
      }}
    >
      <div className="container mt-5">
        <h2 className="mb-5">Generar presupuesto</h2>
        <form id="productForm" className="d-flex flex-column gap-3 mb-5">
          <div className="row">
            <div className="form-group col-md-12" id="patientSelectContent">
              <label htmlFor="patients" className="form-label">
                Pacientes
              </label>
              <Dropdown
                inputId="patients"
                value={selectedPatient}
                onChange={selectedPatientChange}
                options={mappedServicePatient}
                optionLabel="label"
                optionValue="value"
                filter
                className="w-100"
                style={{
                  zIndex: 100000,
                }}
                panelStyle={{
                  zIndex: 100000,
                }}
                appendTo={document.body}
              />
            </div>
            <div className="form-group" id="depositSelectContent">
              <label htmlFor="deposito">Depósito</label>
              <select className="form-control" id="deposito">
                <option>General</option>
              </select>
            </div>
            <div className="form-group col-md-6">
              <label
                htmlFor="products_and_services_select"
                className="form-label"
              >
                Productos y servicios
              </label>
              <Dropdown
                inputId="products_and_services_select"
                value={selectedService}
                onChange={handleProductChange}
                options={mappedServices}
                optionLabel="label"
                optionValue="value"
                filter
                className="w-100"
                style={{
                  zIndex: 100000,
                }}
                panelStyle={{
                  zIndex: 100000,
                }}
                appendTo="self"
              />
            </div>
            <div className="col-md-6">
              <div className="mb-5">
                <label htmlFor="fechaVencimiento">Fecha de vencimiento:</label>
                <Calendar
                  value={dueDate}
                  onChange={(e: any) => setDueDate(e.value)}
                  appendTo={"self"}
                  className="w-100"
                />
              </div>
            </div>
          </div>

          <div className="d-flex align-items-end gap-3">
            <div className="row flex-1">
              <div className="form-group col-md-3">
                <label htmlFor="precio">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  id="precio"
                  value={price}
                  onChange={(price) => setPrice(price.target.value)}
                  readOnly
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  id="cantidad"
                  value={quantity}
                  onChange={(quantity) => setQuantity(quantity.target.value)}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="descuento">Descuento</label>
                <input
                  type="text"
                  className="form-control"
                  id="descuento"
                  value={discount}
                  onChange={handleInputDiscount}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="subtotal">Subtotal</label>
                <input
                  type="text"
                  className="form-control"
                  id="subtotal"
                  value={subtotal}
                  readOnly
                />
              </div>
            </div>
            <button
              type="button"
              className="d-flex btn btn-primary"
              onClick={handleAddProduct}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="form-group w-100 text-center">
            <label className="text-info">
              [si desea el descuento en % deberá colocar al final del numero el
              símbolo %, si es valor numérico solo colocar números]
            </label>
          </div>
        </form>

        <div className="card">
          <div className="card-body">
            <table id="productTable" className="table">
              <thead>
                <tr>
                  <th>Descripción del producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Descuento</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.discount}</td>
                    <td>{product.total}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDeleteProduct(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="fw-bold">
                <tr>
                  <td colSpan={1}>
                    <strong>Totales</strong>
                  </td>

                  <td>{priceTotal}COP</td>
                  <td>{quantityTotal}COP</td>
                  <td>{discountTotal}</td>
                  <td>{total}$ COP</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            <div className="row mt-5">
              <div className="col-md-12">
                <label htmlFor="observaciones">Observaciones o notas:</label>
                <textarea
                  id="observaciones"
                  className="form-control"
                  value={observations}
                  onInput={(e: any) => setObservations(e.target.value)}
                  rows={7}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  onClick={saveEstimate}
                  className="btn btn-outline-info"
                  type="button"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
};
