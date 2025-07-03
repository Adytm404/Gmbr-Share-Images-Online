const API_URL = 'https://api.gmbr.web.id/upload';

/**
 * Uploads an image file to the specified API endpoint.
 * @param file The image file to upload.
 * @returns A promise that resolves with the custom URL of the uploaded image.
 * @throws Will throw an error if the upload fails or the API response is invalid.
 */
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            // Try to get more detailed error from response body
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `API Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (data.status === 'success' && data.custom_url) {
            return data.custom_url;
        } else {
            throw new Error(data.message || 'API did not return a success status or URL.');
        }
    } catch (error) {
        if (error instanceof Error) {
            // Provide a more user-friendly message for generic network errors
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to the upload service. Please check your network connection or try again later.');
            }
            throw new Error(`Upload failed: ${error.message}`);
        }
        throw new Error('An unknown network error occurred during upload.');
    }
};