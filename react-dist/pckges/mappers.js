export class PrescriptionPackagesMapper {
  static toFormDataFromFormInputs({
    formInputs,
    exams,
    prescriptions,
    referrals,
    disabilities
  }) {
    console.log('Form inputs', formInputs);
    console.log('Exams', exams);
    console.log('Prescriptions', prescriptions);
    console.log('Referrals', referrals);
    console.log('Disabilities', disabilities);
    const mappedExams = exams.map(exam => {
      return {
        id: exam.id,
        type: "Examen",
        prescriptions: {
          quantity: "1"
        }
      };
    });
    const mappedPrescriptions = prescriptions.map(prescription => {
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
          quantity: String(prescription.quantity)
        }
      };
    });
    const mappedReferrals = referrals ? [{
      id: 1,
      type: "Remision",
      prescriptions: {
        specialty_id: referrals.receiver_user_specialty_id,
        user_id: referrals.receiver_user_id,
        reason: referrals.note
      }
    }] : [];
    const mappedDisabilities = disabilities ? [{
      id: 1,
      type: "Incapacidad",
      prescriptions: {
        days_incapacity: disabilities.days_disability,
        reason: disabilities.reason
      }
    }] : [];
    const mappedData = {
      name: formInputs.name,
      description: formInputs.description,
      cie11: formInputs.cie11,
      cups: formInputs.cups,
      items: [...mappedExams, ...mappedPrescriptions, ...mappedReferrals, ...mappedDisabilities]
    };
    console.log('mappedData', mappedData);
    return mappedData;
  }
}