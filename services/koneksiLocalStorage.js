export function saveAuthData(responseData) {

    const expiresAt = Date.now() + (responseData.expires_in * 1000);

    localStorage.setItem('token', responseData.access_token);
    localStorage.setItem('token_expires_at', expiresAt.toString());
    localStorage.setItem('provider_slug', responseData.extensions.provider_slug);
}

function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('provider_slug');
}

export function getValidToken() {

    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('token_expires_at');

    if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
        clearAuthData();
        return null;
    }

    return token;
}

export function saveConsultationClaimUrl(url, patientId, appointmentId) {
    const now = new Date();

    const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59, 999
    );

    localStorage.setItem(`consultation_claim_url_${patientId}_${appointmentId}`, url);
    localStorage.setItem(`consultation_claim_url_${patientId}_${appointmentId}_expires_at`, endOfDay.getTime().toString());
}

export function clearConsultationClaimUrl(patientId, appointmentId) {
    localStorage.removeItem(`consultation_claim_url_${patientId}_${appointmentId}`);
    localStorage.removeItem(`consultation_claim_url_${patientId}_${appointmentId}_expires_at`);
}

export function getValidConsultationClaimUrl(patientId, appointmentId) {

    const url = localStorage.getItem(`consultation_claim_url_${patientId}_${appointmentId}`);
    const expiresAt = localStorage.getItem(`consultation_claim_url_${patientId}_${appointmentId}_expires_at`);

    if (!url || !expiresAt || Date.now() > parseInt(expiresAt)) {
        clearConsultationClaimUrl();
        return null;
    }

    return url;
}

export function saveConsultationClaimId(url, patientId, appointmentId) {
    const now = new Date();

    const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59, 999
    );

    localStorage.setItem(`consultation_claim_id_${patientId}_${appointmentId}`, url);
    localStorage.setItem(`consultation_claim_id_${patientId}_${appointmentId}_expires_at`, endOfDay.getTime().toString());
}

export function clearConsultationClaimId(patientId, appointmentId) {
    localStorage.removeItem(`consultation_claim_id_${patientId}_${appointmentId}`);
    localStorage.removeItem(`consultation_claim_id_${patientId}_${appointmentId}_expires_at`);
}

export function getValidConsultationClaimId(patientId, appointmentId) {

    const id = localStorage.getItem(`consultation_claim_id_${patientId}_${appointmentId}`);
    const expiresAt = localStorage.getItem(`consultation_claim_id_${patientId}_${appointmentId}_expires_at`);

    if (!id || !expiresAt || Date.now() > parseInt(expiresAt)) {
        clearConsultationClaimId();
        return null;
    }

    return id;
}

export function saveProductsPreauthorizationUrl(url, patientId, appointmentId) {
    const now = new Date();

    const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59, 999
    );

    localStorage.setItem(`products_preauthorization_url_${patientId}_${appointmentId}`, url);
    localStorage.setItem(`products_preauthorization_url_${patientId}_${appointmentId}_expires_at`, endOfDay.getTime().toString());
}

export function clearProductsPreauthorizationUrl(patientId, appointmentId) {
    localStorage.removeItem(`products_preauthorization_url_${patientId}_${appointmentId}`);
    localStorage.removeItem(`products_preauthorization_url_${patientId}_${appointmentId}_expires_at`);
}

export function getValidProductsPreauthorizationUrl(patientId, appointmentId) {

    const url = localStorage.getItem(`products_preauthorization_url_${patientId}_${appointmentId}`);
    const expiresAt = localStorage.getItem(`products_preauthorization_url_${patientId}_${appointmentId}_expires_at`);

    if (!url || !expiresAt || Date.now() > parseInt(expiresAt)) {
        clearProductsPreauthorizationUrl();
        return null;
    }

    return url;
}