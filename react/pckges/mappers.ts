import { PrescriptionPackagesFormInputs, PrescriptionPackagesFormData } from "./PrescriptionPackagesForm";

interface PackageItem {
    id: number;
    type: string;
    prescriptions?: Prescription;
}

interface Prescription {
    concentration?: string | null;
    frequency?: string | null;
    duration_days?: number | null;
    medication_type?: string | null;
    quantity?: string | null;
    instructions?: string | null;
    days_incapacity?: number | null;
    reason?: string | null;
    user_id?: number | null;
    specialty_id?: number | null;
    medication_frequency?: string | null;
    start_date?: string | null; // Date as string in ISO format
    end_date?: string | null;   // Date as string in ISO format
    note?: string | null;
    medication?: string | null;
}

export class PrescriptionPackagesMapper {
    static toFormDataFromFormInputs({
        formInputs,
        exams,
        prescriptions,
        referrals,
        disabilities,
    }: {
        formInputs: PrescriptionPackagesFormInputs,
        exams: any[],
        prescriptions: any[],
        referrals: any | null,
        disabilities: any | null,
    }): PrescriptionPackagesFormData {

        console.log('Form inputs', formInputs);
        console.log('Exams', exams);
        console.log('Prescriptions', prescriptions);
        console.log('Referrals', referrals);
        console.log('Disabilities', disabilities);

        const mappedExams: PackageItem[] = exams.map((exam: any) => {
            return {
                id: exam.id,
                type: "Examen",
                prescriptions: {
                    quantity: "1"
                }
            }
        })

        const mappedPrescriptions: PackageItem[] = prescriptions.map((prescription: any) => {
            return {
                id: 1,
                type: "medicamento",
                prescriptions: {
                    concentration: prescription.concentration,
                    duration_days: +prescription.duration,
                    frequency: prescription.frequency,
                    instructions: prescription.observations,
                    medication: prescription.medication,
                    medication_frequency: String(prescription.take_every_hours),
                    medication_type: prescription.medication_type,
                    quantity: String(prescription.quantity),
                }
            }
        })

        const mappedReferrals: PackageItem[] = referrals ? [
            {
                id: 1,
                type: "Remision",
                prescriptions: {
                    specialty_id: referrals.receiver_user_specialty_id,
                    user_id: referrals.receiver_user_id,
                    reason: referrals.note
                }
            }
        ] : [];

        const mappedDisabilities: PackageItem[] = disabilities ? [
            {
                id: 1,
                type: "Incapacidad",
                prescriptions: {
                    days_incapacity: disabilities.days_disability,
                    reason: disabilities.reason,
                }
            }
        ] : [];

        const mappedData = {
            name: formInputs.name,
            description: formInputs.description,
            cie11: formInputs.cie11,
            cups: formInputs.cups,
            items: [...mappedExams, ...mappedPrescriptions, ...mappedReferrals, ...mappedDisabilities]
        }

        console.log('mappedData', mappedData);

        return mappedData
    }
}
