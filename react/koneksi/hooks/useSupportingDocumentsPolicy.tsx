import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { ModuleDto } from '../../models/models';
import { getSupportingDocumentsPolicy } from '../../../services/koneksiService';

export const useSupportingDocumentsPolicy = () => {
    const [supportingDocuments, setSupportingDocuments] = useState<ModuleDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSupportingDocumentsPolicy = async ({ preauthorizationId }) => {
        try {
            const data = await getSupportingDocumentsPolicy({ preauthorizationId });
            setSupportingDocuments(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        supportingDocuments,
        fetchSupportingDocumentsPolicy,
        loading
    };
};

