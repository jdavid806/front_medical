import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { cityService, countryService } from "../../../../../services/api/index";

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
  onCancel?: () => void;
  loading?: boolean;
  onFormChange?: (hasChanges: boolean) => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({
  onHandleSubmit,
  initialData,
  onCancel,
  loading = false,
  onFormChange,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
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
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Notificar cambios en el formulario
  useEffect(() => {
    onFormChange?.(isDirty);
  }, [isDirty, onFormChange]);

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
          setValue("country", foundCountry.name, { shouldDirty: true });
          loadCities(foundCountry.id).then((response) => {
            const foundCity = response.find(
              (city: any) => city.name === initialData.city
            );
            if (foundCity) {
              setSelectedCity(foundCity);
              setValue("city", foundCity.name, { shouldDirty: true });
            }
          });
        }
      }
    });
  }, [initialData, reset, setValue]);

  async function loadCities(countryId: any) {
    try {
      setIsLoadingCities(true);
      const dataCities: any = await cityService.getByCountry(countryId);
      setCities(dataCities);
      return dataCities;
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    } finally {
      setIsLoadingCities(false);
    }
  }

  async function loadCountries() {
    try {
      const dataCountries: any = await countryService.getAll();
      setCountries(dataCountries.data);
      return dataCountries.data;
    } catch (error) {
      console.error("Error loading countries:", error);
      return [];
    }
  }

  const onSubmit = (data: BranchFormInputs) => {
    const dataFormatted: any = {
      name: data.name,
      email: data.email,
      phone: data?.phone?.toString(),
      address: data.address,
      country: selectedCountry?.name || "",
      city: selectedCity?.name || "",
    };
    onHandleSubmit(dataFormatted);
  };

  const getFormErrorMessage = (name: keyof BranchFormInputs) => {
    return errors[name] && (
      <small className="p-error" style={{ display: 'block', height: '20px', lineHeight: '20px' }}>
        {errors[name]?.message}
      </small>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="row">
        {/* Columna izquierda */}
        <div className="col-md-6">
          <div className="field mb-3">
            <label htmlFor="name" className="font-medium block mb-2">
              Nombre de la Sucursal *
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "El nombre es requerido",
                maxLength: {
                  value: 100,
                  message: "El nombre no puede exceder 100 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.error })}
                    placeholder="Ingrese el nombre de la sucursal"
                  />
                  {getFormErrorMessage("name")}
                </div>
              )}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="email" className="font-medium block mb-2">
              Correo Electrónico
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.error })}
                    placeholder="ejemplo@empresa.com"
                  />
                  {getFormErrorMessage("email")}
                </div>
              )}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="phone" className="font-medium block mb-2">
              Teléfono
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <InputNumber
                    id={field.name}
                    value={field.value ?? null}
                    onChange={(e) => field.onChange(e.value)}
                    useGrouping={false}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder="Ingrese el número de teléfono"
                  />
                  {getFormErrorMessage("phone")}
                </div>
              )}
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <div className="field mb-3">
            <label htmlFor="country" className="font-medium block mb-2">
              País *
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "El país es requerido" }}
              render={({ field, fieldState }) => (
                <div>
                  <Dropdown
                    id={field.name}
                    value={selectedCountry}
                    onChange={async (e) => {
                      setSelectedCountry(e.value);
                      setSelectedCity(null);
                      setValue("city", "", { shouldDirty: true });

                      if (e.value) {
                        setValue("country", e.value.name, { shouldDirty: true });
                        await loadCities(e.value.id);
                      } else {
                        setValue("country", "", { shouldDirty: true });
                        setCities([]);
                      }
                    }}
                    options={countries}
                    optionLabel="name"
                    placeholder="Seleccione País"
                    filter
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error && !selectedCountry,
                    })}
                    showClear
                  />
                  {!selectedCountry && errors.country && (
                    <small className="p-error" style={{ display: 'block', height: '20px', lineHeight: '20px' }}>
                      {errors.country.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="city" className="font-medium block mb-2">
              Ciudad *
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: "La ciudad es requerida" }}
              render={({ field, fieldState }) => (
                <div>
                  <Dropdown
                    id={field.name}
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.value);
                      if (e.value) {
                        setValue("city", e.value.name, { shouldDirty: true });
                      } else {
                        setValue("city", "", { shouldDirty: true });
                      }
                    }}
                    options={cities}
                    optionLabel="name"
                    placeholder="Seleccione Ciudad"
                    filter
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error && !selectedCity,
                    })}
                    loading={isLoadingCities}
                    disabled={!selectedCountry}
                    showClear
                  />
                  {!selectedCity && errors.city && (
                    <small className="p-error" style={{ display: 'block', height: '20px', lineHeight: '20px' }}>
                      {errors.city.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="address" className="font-medium block mb-2">
              Dirección
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.error })}
                    placeholder="Ingrese la dirección completa"
                  />
                  {getFormErrorMessage("address")}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Botones centrados */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-center mt-4 gap-6">
            {onCancel && (
              <Button
                label="Cancelar"
                className="btn btn-phoenix-secondary"
                onClick={onCancel}
                disabled={loading}
                type="button"
                style={{
                  padding: "0 20px",
                  width: "200px",
                  height: "50px",
                  borderRadius: "0px",
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            )}
            <Button
              label={initialData?.isEditing ? "Actualizar" : "Guardar"}
              className="p-button-sm"
              loading={loading}
              style={{ padding: "0 40px", width: "200px", height: "50px" }}
              disabled={loading || !isDirty}
              type="submit"
            >
              <i className="fas fa-save"></i>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};