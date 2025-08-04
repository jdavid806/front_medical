import { appointmentService, examTypeService, patientService, productService } from "../../../services/api/index.js";
import { getValidConsultationClaimUrl, saveConsultationClaimUrl, getValidConsultationClaimId, saveConsultationClaimId, getValidProductsPreauthorizationUrl, saveProductsPreauthorizationUrl } from "../../../services/koneksiLocalStorage.js";
import { completeDispensing, completeProductsPreauthorizationRequest, getAuthorizationStatus, getBeneficiaryLocation, getCompletedProductsPreauthorization, getConsultationClaim, getConsultationClaimLocationUrl, getFormSlugs, getProductsPreauthorizations, initConsultationClaim, initProductsPreauthorizatonRequest, searchBeneficiary, startDispensing } from "../../../services/koneksiService.js";

const btnAuthorizePatient = document.getElementById('btnAuthorizePatient');

const formSlugsSelect = document.getElementById('formSlugs');

const koneksiPatientContainer = document.getElementById('koneksiPatientContainer');
const koneksiPatientIdField = document.getElementById('koneksiPatientId');
const koneksiPatientLoadingContainer = document.getElementById('koneksiPatientLoadingContainer');
const koneksiPatientLoadingLabel = document.getElementById('koneksiPatientLoadingLabel');

const koneksiError = document.getElementById('koneksiError');
const koneksiErrorMessage = document.getElementById('koneksiErrorMessage');

const koneksiSuccess = document.getElementById('koneksiSuccess');
const koneksiSuccessMessage = document.getElementById('koneksiSuccessMessage');

const amountAuthorization = document.getElementById('amountAuthorisation');
const authorizationNumberEntity = document.getElementById('authorisationNumberEntity');

let patient = null;
let appointment = null;
let product = null;
let beneficiary = null;
let consultationClaim = null;
let productsPreauthorization = null;
let approvedProducts = [];

const formSlug = () => formSlugsSelect.value;
const sponsorSlug = () => patient.social_security.entity.koneksi_sponsor_slug;
const koneksiPatientId = () => koneksiPatientIdField.value;
const productCode = () => product.barcode;
const beneficiaryId = () => beneficiary?.id;

export const claimId = () => localStorage.getItem(`consultation_claim_id_${patient.id}_${appointment.id}`);

function updateLoadingText(loadingText) {
    koneksiPatientLoadingLabel.textContent = loadingText;
}

function showLoading(loadingText) {
    btnAuthorizePatient.classList.add('d-none');
    koneksiPatientLoadingContainer.classList.remove('d-none');
    koneksiError.classList.add('d-none');

    koneksiErrorMessage.textContent = '';

    updateLoadingText(loadingText);
}

function hideLoading() {
    koneksiPatientLoadingContainer.classList.add('d-none');
}

function showError(message) {
    koneksiError.classList.remove('d-none');
    btnAuthorizePatient.classList.remove('d-none');
    koneksiErrorMessage.textContent = message;

    hideLoading();
}

function showAuthorizationSuccess() {
    koneksiPatientLoadingContainer.classList.add('d-none');
    btnAuthorizePatient.classList.add('d-none');
    koneksiSuccess.classList.remove('d-none');

    koneksiSuccessMessage.textContent = 'Paciente autorizado con éxito.';
}

function setAuthorizationFields({ _amountAuthorization, _authorizationNumberEntity }) {
    amountAuthorization.value = _amountAuthorization;
    authorizationNumberEntity.value = _authorizationNumberEntity;
}

export async function init() {

    const patientId = document.getElementById('patientIdForUpdate').value;
    patient = await patientService.get(patientId);

    if (sponsorSlug()) {

        koneksiPatientContainer.classList.remove('d-none');

        koneksiPatientIdField.value = patient.document_number;

        const formSlugs = await getFormSlugs(sponsorSlug());
        setFormSlugOptions(formSlugs);

        const appointmentId = new URLSearchParams(window.location.search).get('id_cita');
        appointment = await appointmentService.get(appointmentId);

        const productId = appointment.product_id;
        product = await productService.getProductById(productId);

        if (getValidConsultationClaimId(patient.id, appointment.id)) {
            authorizePatient();
        }
    }
}

async function authorizePatient() {

    showLoading('Buscando paciente...');

    const beneficiaryLocationUrl = await getBeneficiaryLocation({
        sponsorSlug: sponsorSlug(),
        formSlug: formSlug(),
        search: koneksiPatientId()
    });

    try {

        beneficiary = await searchBeneficiary(beneficiaryLocationUrl);

    } catch (error) {

        console.log(error);

        showError(error.message);

        return;
    }

    if (!beneficiaryId()) {

        showError('No se encontró el paciente. Verifica el ID o intenta con otro campo de busqueda.');

        return;
    }

    updateLoadingText('Autorizando paciente...');

    handleAttentionTypeAuthorization();
}

async function handleAttentionTypeAuthorization() {
    switch (appointment.attention_type) {
        case "CONSULTATION":
            handleConsultationAuthorization();
            break;
        case "PROCEDURE":
            handleProcedureAuthorization();
        default:
            break;
    }
}

async function handleConsultationAuthorization() {

    let consultationClaimLocationUrl = getValidConsultationClaimUrl(patient.id, appointment.id);

    if (!consultationClaimLocationUrl) {

        try {

            consultationClaimLocationUrl = await getConsultationClaimLocationUrl({
                beneficiaryId: beneficiaryId(),
                sponsorSlug: sponsorSlug(),
                productCode: productCode()
            });

            saveConsultationClaimUrl(consultationClaimLocationUrl, patient.id, appointment.id);

        } catch (error) {

            console.log(error);

            showError(error.message);

            return;
        }
    }

    try {

        const claimId = getValidConsultationClaimId(patient.id, appointment.id);

        if (claimId) {

            consultationClaim = await getConsultationClaim(claimId);

        } else {

            consultationClaim = await initConsultationClaim(consultationClaimLocationUrl, patient.id, appointment.id);
        }
    } catch (error) {

        console.log(error);

        showError(error.message);

        return;
    }

    setAuthorizationFields({
        _amountAuthorization: consultationClaim.amount,
        _authorizationNumberEntity: consultationClaim.sponsor_transaction_id
    });

    saveConsultationClaimId(consultationClaim.id, patient.id, appointment.id);

    showAuthorizationSuccess();
}

async function handleProcedureAuthorization() {

    const preauthorizedProducts = document.getElementById("koneksiPreauthorizedProducts");

    preauthorizedProducts.classList.add('d-none');

    const productTypeSlugMap = {
        "LABORATORY": "laboratory",
        "IMAGING": "diagnostic-test",
    }

    let productsPreauthorizatonLocationUrl = getValidProductsPreauthorizationUrl(patient.id, appointment.id);

    let products = [];

    if (appointment.exam_recipe_id) {
        throw new Error("TODO: Implementar autorización de procedimientos");
    }

    const appointmentProduct = await productService.getProductById(appointment.product_id);
    const exam = await examTypeService.get(appointmentProduct.exam_type_id);

    products.push({
        id: appointmentProduct.id,
        provider_product_code: appointmentProduct.barcode,
        product_type_slug: productTypeSlugMap[exam.type],
        quantity: 1
    });

    if (!productsPreauthorizatonLocationUrl) {

        try {

            productsPreauthorizatonLocationUrl = await initProductsPreauthorizatonRequest({
                beneficiaryId: beneficiaryId(),
                sponsorSlug: sponsorSlug(),
                doctorName: "Integracion Koneksi",
                doctorMedicalLicenseNumber: "898",
                doctorCountryCode: "DO",
                doctorSpecialtyName: "Medicina General",
                products
            });

            saveProductsPreauthorizationUrl(productsPreauthorizatonLocationUrl, patient.id, appointment.id);

        } catch (error) {

            console.log(error);

            showError(error.message);

            return;
        }
    }

    try {

        const productsPreauthorizations = await getProductsPreauthorizations(productsPreauthorizatonLocationUrl, patient.id, appointment.id);

        productsPreauthorization = {
            preauthorization_request_id: productsPreauthorizations.id,
            preauthorization_id: productsPreauthorizations.authorizations[0].id,
            preauthorization_code: productsPreauthorizations.authorizations[0].code,
            coverage_type: productsPreauthorizations.authorizations[0].coverage_type,
            product_type: productsPreauthorizations.authorizations[0].product_type
        }

    } catch (error) {

        console.log(error);

        showError(error.message);

        return;
    }

    try {

        await completeProductsPreauthorizationRequest(productsPreauthorization.preauthorization_request_id);

        const completedProductsPreauthorization = await getCompletedProductsPreauthorization(productsPreauthorization.preauthorization_code);

        const adminProducts = await productService.getProductsByIds(products.map(product => product.id));

        approvedProducts = completedProductsPreauthorization.approved_products.map(authorizedProduct => {

            const product = adminProducts.find(product => product.barcode === authorizedProduct.code);

            if (!product) {
                return
            }

            return {
                ...authorizedProduct,
                authorized_value: product.copayment
            }
        }).filter(Boolean);

        const totalAuthorizedValueElement = document.getElementById("totalAuthorizedValue");
        const preauthorizedProductsTableBody = document.getElementById("preauthorizedProductsTableBody");
        const templatePreauthorizedProduct = document.getElementById("templatePreauthorizedProduct");
        let totalAuthorizedValue = 0;

        preauthorizedProductsTableBody.innerHTML = "";

        approvedProducts.forEach(product => {
            const row = templatePreauthorizedProduct.content.cloneNode(true);
            row.querySelector("#productName").textContent = product.name;
            row.querySelector("#productQuantity").textContent = product.quantity;
            row.querySelector("#productAuthorizedValue").textContent = `$${product.authorized_value.toLocaleString()}`;
            totalAuthorizedValue += product.authorized_value * product.quantity;
            preauthorizedProductsTableBody.appendChild(row);
        });

        totalAuthorizedValueElement.textContent = `$${totalAuthorizedValue.toLocaleString()}`;

        preauthorizedProducts.classList.remove("d-none");

        setAuthorizationFields({
            _amountAuthorization: totalAuthorizedValue,
            _authorizationNumberEntity: completedProductsPreauthorization.code
        });

    } catch (error) {

        console.log(error);

        showError(error.message);

        return;
    }

    showAuthorizationSuccess();
}

export function completeAuthorization(providerTransactionId = null) {
    switch (appointment.attention_type) {
        case "CONSULTATION":
            completeConsultationAuthorization();
            break;
        case "PROCEDURE":
            if (providerTransactionId) {
                completeProcedureAuthorization(providerTransactionId);
                return;
            } else {
                throw new Error("providerTransactionId is required");
            }
        default:
            break;
    }
}

function completeConsultationAuthorization() {
    console.log("completeConsultationAuthorization");
}

async function completeProcedureAuthorization(providerTransactionId) {
    console.log("completeProcedureAuthorization");

    const dispensationUrl = await startDispensing({
        preauthorizationCode: productsPreauthorization.preauthorization_code,
        products: approvedProducts
    })

    console.log(dispensationUrl);

    const dispensation = await getAuthorizationStatus({
        locationUrl: dispensationUrl,
        patientId: patient.id,
        appointmentId: appointment.id
    })

    console.log(dispensation);

    const completedDispensation = await completeDispensing({
        claimId: dispensation.id,
        amountCovered: dispensation.amount_covered_by_sponsor,
        providerTransactionId
    })

    console.log(completedDispensation);
}

function setFormSlugOptions(formSlugs) {

    formSlugsSelect.innerHTML = '';

    formSlugs.forEach(formSlug => {
        const option = document.createElement('option');
        option.value = formSlug.slug
        option.textContent = formSlug.name
        formSlugsSelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    btnAuthorizePatient.addEventListener('click', authorizePatient);
});