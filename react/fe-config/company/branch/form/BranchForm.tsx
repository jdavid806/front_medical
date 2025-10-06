import React, { useState } from "react";
import { useEffect } from "react";
import { cityService, countryService } from "../../../../../services/api/index";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

interface BranchFormInputs {
  name: string;
  email: string;
  phone: number | null;
  address: string;
  city: string;
  country: string;
  id?: string;
  isEditing?: boolean;
}

interface BranchFormProps {
  onHandleSubmit: (data: BranchFormInputs) => void;
  initialData?: BranchFormInputs;
}

export const BranchForm: React.FC<BranchFormProps> = ({
  onHandleSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BranchFormInputs>({
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: null,
      address: "",
      city: "",
      country: "",
    },
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  useEffect(() => {
    reset(
      initialData || {
        name: "",
        email: "",
        phone: null,
        address: "",
        city: "",
        country: "",
      }
    );
    loadCountries().then((response) => {
      if (initialData) {
        const foundCountry = response.find(
          (country: any) => country.name === initialData.country
        );
        if (foundCountry) {
          setSelectedCountry(foundCountry);
          loadCities(foundCountry.id).then((response) => {
            const foundCity = response.find(
              (city: any) => city.name === initialData.city
            );
            if (foundCity) {
              setSelectedCity(foundCity);
            }
          });
        }
      }
    });
  }, [initialData, reset]);

  async function loadCities(countryId: any) {
    const dataCities: any = await cityService.getByCountry(countryId);
    setCities(dataCities);
    return dataCities;
  }

  async function loadCountries() {
    const dataCountries: any = await countryService.getAll();
    setCountries(dataCountries.data);
    return dataCountries.data;
  }

  const onSubmit = (data: BranchFormInputs) => {
    const dataFormatted: any = {
      name: data.name,
      email: data.email,
      phone: data?.phone?.toString(),
      address: data.address,
      country: selectedCountry.name,
      city: selectedCity.name,
    };
    onHandleSubmit(dataFormatted);
  };

  const getFormErrorMessage = (name: keyof BranchFormInputs) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="row">
        {/* Columna Izquierda */}
        <div className="col-md-6">
          <div className="field">
            <label htmlFor="name" className="block mb-2">
              Nombre *
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "El nombre es requerido",
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("name")}
          </div>

          <div className="field">
            <label htmlFor="email" className="block mb-2">
              Correo
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("email")}
          </div>

          <div className="field">
            <label htmlFor="phone" className="block mb-2">
              Telefono
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <InputNumber
                  id={field.name}
                  {...field}
                  value={field.value ?? null}
                  onChange={(e) => field.onChange(e.value)}
                  useGrouping={false}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("phone")}
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="col-md-6">
          <div className="field">
            <label htmlFor="address" className="block mb-2">
              Dirección
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("address")}
          </div>

          <div className="field">
            <label htmlFor="country" className="block mb-2">
              País
            </label>
            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  {...field}
                  value={selectedCountry}
                  onChange={async (e) => {
                    setSelectedCountry(e.value);
                    await loadCities(e.value.id);
                  }}
                  options={countries}
                  optionLabel="name"
                  placeholder="Seleccione País"
                  filter
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("country")}
          </div>

          <div className="field">
            <label htmlFor="city" className="block mb-2">
              Ciudad
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  {...field}
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.value);
                  }}
                  options={cities}
                  optionLabel="name"
                  placeholder="Seleccione Ciudad"
                  filter
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {getFormErrorMessage("city")}
          </div>
        </div>
      </div>

      {/* Botones - Ocupan el ancho completo */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              type="button"
              className="p-button-text w-30"
              onClick={() => reset()}
            />
            <Button
              label={initialData?.isEditing ? "Actualizar" : "Guardar"}
              icon="pi pi-check"
              type="submit"
              className="w-30 ml-2"
            />
          </div>
        </div>
      </div>
    </form>
  );
};