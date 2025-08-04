import { apiUrl, token } from "./koneksiGlobals";
import { getValidToken, saveAuthData } from "./koneksiLocalStorage";

async function authenticate() {

    const url = `https://${apiUrl}.com/v1/oauth/token?grant_type=client_credentials`
    const encriptedToken = btoa("do-integraciones-koneksi-1:Koneksi2024.")

    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encriptedToken}`
        }
    })

    const data = await response.json()

    saveAuthData(data);
}

async function validateAuthentication() {
    if (!getValidToken()) {
        await authenticate()
    }
}

export async function fetchWithToken({ endpoint, method, data = null, formData = null, customHeaders = {}, usePrefix = true }) {

    await validateAuthentication();

    const prefix = usePrefix ? `https://${apiUrl}.com/` : '';

    return fetch(`${prefix}${endpoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token()}`,
            ...customHeaders
        },
        body: data ? JSON.stringify(data) : formData
    })
}

export async function getLocationUrl({ endpoint, method, data = null, customHeaders = {} }) {

    const response = await fetchWithToken({
        endpoint, method, data, customHeaders
    });

    const locationUrl = response.headers.get("Location");
    const contentType = response.headers.get("content-type");

    let responseData = null;

    if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
    } else {
        responseData = await response.text();
    }

    return {
        responseData,
        locationUrl
    };
}