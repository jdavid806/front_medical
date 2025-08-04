import { base64Biometric } from "../Citas/assets/js/biometric"
import { fetchWithToken, getLocationUrl } from "./koneksiHelpers"
import { token, providerSlug, EXCEPTIONS } from "./koneksiGlobals"
import { clearConsultationClaimUrl, clearProductsPreauthorizationUrl } from "./koneksiLocalStorage"

const beneficiaryId = ''
const biometricReadingId = ''
const claimId = ''

////////////////////////////// PACIENTES ////////////////////////////

export async function getSponsors() {

    const url = `providers/v1/providers/${providerSlug()}/sponsors`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json()

    return data
}

export async function getFormSlugs(sponsorSlug) {

    const url = `beneficiary-lookup/v1/sponsors/${sponsorSlug}/forms`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json()

    return data
}

export async function getBeneficiaryLocation({ sponsorSlug, formSlug, search }) {

    const url = `beneficiary-lookup/v1/sponsors/${sponsorSlug}/search`

    const { locationUrl } = await getLocationUrl({
        endpoint: url,
        method: "POST",
        data: {
            form_slug: formSlug,
            provider_slug: providerSlug(),
            inputs: [
                {
                    slug: formSlug,
                    value: search
                }
            ]
        }
    });

    return locationUrl;
}

export async function searchBeneficiary(locationUrl, koneksiPatientId) {

    let maxAttempts = 5;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const response = await fetchWithToken({
            endpoint: locationUrl,
            method: "GET",
            usePrefix: false
        });

        const data = await response.json();

        console.log(`Intento ${attempt}:`, data);

        if (data.content) {

            data.content.filter(p => p.identity_document_id === koneksiPatientId);

            return data.length ? data[0] : data.content[0];

        } else if (data.status === "IN_PROGRESS") {

            await new Promise(resolve => setTimeout(resolve, delay));

        } else {
            console.error(data);

            switch (data.code) {
                case "004-0300":
                    throw new Error(EXCEPTIONS.BENEFICIARY_SEARCH_ERROR);
                default:
                    break;
            }

            switch (data.error_code) {
                case "023-0500":
                    throw new Error(EXCEPTIONS.BENEFICIARY_NOT_FOUND);
                default:
                    break;
            }
        }
    }

    throw new Error(EXCEPTIONS.TIMEOUT_ERROR);
}

function validateBiometric() {

    const url = `arc/v1/providers/${providerSlug()}/biometric-reading`

    const response = fetchWithToken({
        endpoint: url,
        method: "POST",
        data: {
            beneficiary_id: beneficiaryId,
            type: "FINGERPRINT_READING",
            value: base64Biometric
        }
    });

    const data = response.json();
}

////////////////////////////// FIN PACIENTES ////////////////////////////

////////////////////////////// CONSULTAS MEDICAS ////////////////////////////

export async function getConsultationClaimLocationUrl({ beneficiaryId, sponsorSlug, productCode }) {

    const url = `arc/v1/providers/${providerSlug()}/outpatient-care-claim`

    const { responseData, locationUrl } = await getLocationUrl({
        endpoint: url,
        method: "POST",
        data: {
            beneficiary_id: beneficiaryId,
            sponsor_slug: sponsorSlug,
            provider_transaction_id: "00001",
            sponsor_parameters: {
                product_code: productCode
            }
        }
    });

    if (!locationUrl) {

        if (responseData) {

            switch (responseData.code) {
                case "025-0500":
                    if (responseData.errors.find(e => e.path === "sponsor_parameters.product_code")) {
                        throw new Error(EXCEPTIONS.INVALID_PRODUCT_ERROR);
                    }
                    break;
                default:
                    break;
            }
        }

        throw new Error(EXCEPTIONS.CLAIM_URL_ERROR);
    }

    return locationUrl;
}

export async function initConsultationClaim(locationUrl, patientId, appointmentId) {

    let maxAttempts = 5;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const response = await fetchWithToken({
            endpoint: locationUrl,
            method: "GET",
            usePrefix: false
        });

        const data = await response.json();

        console.log(`Intento ${attempt}:`, data);

        if (data.sponsor_transaction_id) {

            return data;

        } else if (data.status === "PENDING") {

            await new Promise(resolve => setTimeout(resolve, delay));

        } else {
            console.error(data);

            switch (data.code) {
                case "004-0300":
                    clearConsultationClaimUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.CLAIM_INFO_ERROR);
                default:
                    break;
            }

            switch (data.error_code) {
                case "023-0500":
                    clearConsultationClaimUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.BENEFICIARY_NOT_FOUND);
                case "024-0800":
                    clearConsultationClaimUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.CLAIM_INFO_ERROR);
                default:
                    break;
            }
        }
    }

    throw new Error(EXCEPTIONS.TIMEOUT_ERROR);
}

export async function getConsultationClaim(claimId) {

    const url = `arc/v2/providers/${providerSlug()}/claims/${claimId}`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json()

    return data
}

export async function cancelConsultationClaim(claimId) {

    const url = `arc/v1/providers/${providerSlug()}/outpatient-care-claim/${claimId}/void`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "POST"
    });

    const data = await response.json()

    return data
}

function completeConsultation() {

    const url = `arc/v1/providers/${providerSlug()}/outpatient-care-claim/${claimId}/complete`

    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token()}`
        },
        body: JSON.stringify({
            "doctor_medical_license_number": "898",
            "doctor_country_code": "DO",
            "doctor_specialty_name": "Medicina General",
            "doctor_name": "Integracion Koneksi",
            "diagnoses": [
                {
                    "code": "Z00.0",
                    "coding_system": "ICD-10"
                }
            ],
            "biometric_reading_id": biometricReadingId,
            "document_number": "89798798",
            "document_date": new Date().toISOString(),
            "document_digital_signature": null,
            "medical_consultation_reason": "Aqui agregamos el motivo de la consulta",
            "illness_history": "Aqui agregamos el historial de la enfermedad/", //Opcional
            "illness_evolution_time": "Aqui agregamos el tiempo de evolucion.", //Opcional
            "non_standardized_diagnoses": "Agregamos un diagnosticos de GASTRITIS AGUDA y.COLITIS." //Opcional
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
    })
}

////////////////////////////// FIN CONSULTAS MEDICAS ////////////////////////////

////////////////////////////// LABORATORIO E IMAGENES ////////////////////////////

export async function initProductsPreauthorizatonRequest({
    beneficiaryId,
    sponsorSlug,
    doctorName,
    doctorMedicalLicenseNumber,
    doctorCountryCode,
    doctorSpecialtyName,
    products
}) {

    const url = `arc/v1/authorization-requests/`

    const { responseData, locationUrl } = await getLocationUrl({
        endpoint: url,
        method: "POST",
        data: {
            "beneficiary_id": beneficiaryId,
            "beneficiary_email": null,
            "beneficiary_phone_number": null,
            "sponsor_slug": sponsorSlug,
            "doctor_name": doctorName,
            "doctor_medical_license_number": doctorMedicalLicenseNumber,
            "doctor_country_code": doctorCountryCode,
            "doctor_specialty_name": doctorSpecialtyName,
            "diagnoses": [
                {
                    "coding_system": "ICD-10",
                    "code": "Z00.0",
                    "type": "MEDICAL_DIAGNOSIS"
                }
            ],
            "products": products
        }
    });

    if (!locationUrl) {

        if (responseData) {

            console.log(responseData);
        }

        throw new Error(EXCEPTIONS.PRODUCTS_PREAUTHORIZATION_REQUEST_ERROR);
    }

    return locationUrl;
}

export async function getProductsPreauthorizations(locationUrl, patientId, appointmentId) {

    let maxAttempts = 5;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const response = await fetchWithToken({
            endpoint: locationUrl,
            method: "GET",
            usePrefix: false
        });

        const data = await response.json();

        console.log(`Intento ${attempt}:`, data);

        if (data.authorizations) {

            return data;

        } else if (data.status === "PENDING") {

            await new Promise(resolve => setTimeout(resolve, delay));

        } else {
            console.error(data);

            switch (data.code) {
                case "004-0300":
                    clearProductsPreauthorizationUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.CLAIM_INFO_ERROR);
                default:
                    break;
            }

            switch (data.error_code) {
                case "023-0500":
                    clearProductsPreauthorizationUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.BENEFICIARY_NOT_FOUND);
                case "024-0800":
                    clearProductsPreauthorizationUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.CLAIM_INFO_ERROR);
                default:
                    break;
            }
        }
    }

    throw new Error(EXCEPTIONS.TIMEOUT_ERROR);
}

export async function completeProductsPreauthorizationRequest(preauthorizationRequestId) {

    const url = `arc/v1/authorization-requests/${preauthorizationRequestId}/complete`;

    await fetchWithToken({
        endpoint: url,
        method: "POST"
    });
}

export async function getCompletedProductsPreauthorization(preauthorizationCode) {

    const url = `dispensing/v1/documents/${preauthorizationCode}`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json();

    return data;
}

export async function startDispensing({ preauthorizationCode, products }) {

    const url = `dispensing/v1/documents/${preauthorizationCode}/dispensations`

    const { responseData, locationUrl } = await getLocationUrl({
        endpoint: url,
        method: "POST",
        data: {
            products: products,
            external_verifications: [
                {
                    type: "FINGERPRINT_READING",
                    value: base64Biometric
                }
            ],
            currency_code: "DOP"
        }
    });

    if (!locationUrl) {

        if (responseData) {

            console.log(responseData);
        }

        throw new Error(EXCEPTIONS.PRODUCTS_PREAUTHORIZATION_REQUEST_ERROR);
    }

    return locationUrl;
}

export async function getAuthorizationStatus({ locationUrl, patientId, appointmentId }) {

    let maxAttempts = 5;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const response = await fetchWithToken({
            endpoint: locationUrl,
            method: "GET",
            usePrefix: false
        });

        const data = await response.json();

        console.log(`Intento ${attempt}:`, data);

        if (data.status == "IN_PROGRESS" || data.status == "COMPLETED") {

            return data;

        } else if (data.status === "PENDING") {

            await new Promise(resolve => setTimeout(resolve, delay));

        } else {
            console.error(data);

            switch (data.code) {
                case "004-0300":
                    clearProductsPreauthorizationUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.CLAIM_INFO_ERROR);
                default:
                    break;
            }

            switch (data.error_code) {
                case "023-0500":
                    clearProductsPreauthorizationUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.BENEFICIARY_NOT_FOUND);
                case "024-0800":
                    clearProductsPreauthorizationUrl(patientId, appointmentId);
                    throw new Error(EXCEPTIONS.CLAIM_INFO_ERROR);
                default:
                    break;
            }
        }
    }

    throw new Error(EXCEPTIONS.TIMEOUT_ERROR);
}

export async function completeDispensing({ claimId, amountCovered, providerTransactionId }) {

    const url = `dispensing/v1/dispensations/${claimId}/complete`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "POST",
        data: {
            "amount": amountCovered, //Monto total de lo que cubre la aseguradora, campo amount_covered_by_sponsor del paso 3 
            "provider_transaction_id": providerTransactionId, //ID o Numero de factura del centro
            "document_date": new Date().toISOString(),
            "document_number": providerTransactionId //ID o Numero de factura del centro
        }
    });

    const data = await response.json();
}

export async function getSupportingDocumentsPolicy({ preauthorizationId }) {

    const url = `arc/v1/authorizations/${preauthorizationId}/document-policy`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json();

    return data;
}

export async function getDispensedClaim({ claimId }) {

    const url = `arc/v2/providers/${providerSlug()}/claims/${claimId}`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json();

    console.log("getDispensedClaim", data);

    return data;
}

export async function viewDocument({ fileId }) {

    const url = `arc/v2/authorizations/files/${fileId}`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const blob = await response.blob();
    const pdfURL = URL.createObjectURL(blob);

    window.open(pdfURL, '_blank');
}

export async function addFilesToPreauthorization({ preauthorizationId, urlParams, formData }) {
    let url = `arc/v1/authorization-requests/${preauthorizationId}/files`;

    const searchParams = new URLSearchParams();
    Object.entries(urlParams).forEach(([key, value]) => {
        searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "POST",
        formData
    });

    const data = await response.json();

    return data;
}