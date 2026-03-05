/**
 * Formio API Configuration
 * 
 * This module provides centralized API configuration for the Formio module.
 * It uses environment configuration to determine the correct API base URL.
 */

/**
 * Get the Formio API base URL from global configuration
 * Falls back to a reasonable default if not configured
 */
export const getFormioAPIBaseURL = () => {
    // Try to get from global config first
    const configuredURL = window?.globalConfigs?.getConfig("FORMIO_API_URL");

    if (configuredURL) {
        return configuredURL;
    }

    // Fallback to environment variable or default
    const envURL = process.env.REACT_APP_FORMIO_API_URL;

    if (envURL) {
        return envURL;
    }

    // Default fallback - use relative path that proxies through the same domain
    // This works in production when API is on same domain
    return `${window.location.origin}/formio-api`;
};

/**
 * Get the full URL for a Formio API endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/forms' or '/submissions')
 * @returns {string} Full URL for the endpoint
 */
export const getFormioAPIURL = (endpoint) => {
    const baseURL = getFormioAPIBaseURL();
    // Remove leading slash from endpoint if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseURL}${cleanEndpoint}`;
};

/**
 * Fetch wrapper for Formio API calls with error handling
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} Fetch promise
 */
export const formioAPIFetch = async (endpoint, options = {}) => {
    const url = getFormioAPIURL(endpoint);

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const fetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    return fetch(url, fetchOptions);
};
