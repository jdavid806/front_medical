import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { SystemConfigData } from './interfaces';
import { useSaveSystemConfig } from './hooks/useSaveSystemConfig';
import { useSystemConfigs } from './hooks/useSystemConfigs';
import { Toast } from 'primereact/toast';

export const SystemConfigApp = () => {

    const { handleSubmit, control, setValue } = useForm<SystemConfigData>({
        defaultValues: {
            BILLING_AFTER_CONSULTATION: false
        }
    });

    const { systemConfigs } = useSystemConfigs();
    const { saveSystemConfig, toast } = useSaveSystemConfig();

    const onSubmit = (data: SystemConfigData) => {
        try {
            saveSystemConfig(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        systemConfigs.forEach(config => {
            setValue(config.key_ as keyof SystemConfigData, config.value as any);
        });
    }, [systemConfigs]);

    return (<>
        <Toast ref={toast} />
        <Card title="Configuración del sistema">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex flex-column gap-3 mb-3">
                    <Controller
                        name="BILLING_AFTER_CONSULTATION"
                        control={control}
                        render={({ field }) => (
                            <div className="d-flex align-items-center gap-2">
                                <Checkbox
                                    inputId="billingAfterConsultation"
                                    checked={field.value}
                                    {...field}
                                />
                                <label htmlFor="billingAfterConsultation" className="ml-2">Facturar después de la consulta</label>
                            </div>
                        )}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Button
                        type="submit"
                        label="Guardar"
                        icon={<i className="fa fa-save me-2"></i>}
                        className="p-button-primary"
                    />
                </div>
            </form>
        </Card>
    </>);
};