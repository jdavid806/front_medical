import { useState, useEffect } from 'react';
import { cashControlService, paymentMethodService, userService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { CashControlReportItem, UserDto } from '../../models/models';

export const useCashControlReport = () => {
    const [cashControlReportItems, setCashControlReportItems] = useState<CashControlReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCashControlReport = async ({
        whoDeliversIds,
        whoValidateIds,
        startDate,
        endDate
    }: {
        whoDeliversIds?: string[];
        whoValidateIds?: string[];
        startDate?: string | null;
        endDate?: string | null;
    } = {
            whoDeliversIds: [],
            whoValidateIds: [],
            startDate: null,
            endDate: null
        }
    ) => {
        try {
            const [cashClosures, users, paymentMethods] = await Promise.all([
                cashControlService.report({
                    who_delivers_ids: whoDeliversIds,
                    who_validate_ids: whoValidateIds,
                    start_date: startDate,
                    end_date: endDate
                }),
                userService.getAll(),
                paymentMethodService.getAll()
            ]) as [{ data: CashControlReportItem[] }, UserDto[], any[]];

            console.log(cashClosures, users, paymentMethods);


            const finalCashClosures: CashControlReportItem[] = cashClosures.data.map((cashClosure) => {

                const whoDelivers = users.find((user) => user.external_id === cashClosure.who_delivers)
                const whoDeliversName = whoDelivers ? `${whoDelivers.first_name || ''} ${whoDelivers.middle_name || ''} ${whoDelivers.last_name || ''} ${whoDelivers.second_last_name || ''}` : '--';

                const whoValidate = users.find((user) => user.external_id === cashClosure.who_validate)
                const whoValidateName = whoValidate ? `${whoValidate.first_name || ''} ${whoValidate.middle_name || ''} ${whoValidate.last_name || ''} ${whoValidate.second_last_name || ''}` : '--';

                const details = cashClosure.details.map((detail) => {
                    const paymentMethod = paymentMethods.find((paymentMethod) => paymentMethod.id === detail.payment_method_id)
                    const paymentMethodName = paymentMethod ? paymentMethod.method : '--';
                    return {
                        ...detail,
                        payment_method_name: paymentMethodName
                    }
                })

                return {
                    ...cashClosure,
                    who_delivers_name: whoDeliversName,
                    who_validate_name: whoValidateName,
                    details
                }
            })
            setCashControlReportItems(finalCashClosures);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCashControlReport();
    }, []);

    return {
        cashControlReportItems,
        fetchCashControlReport,
        loading
    };
};