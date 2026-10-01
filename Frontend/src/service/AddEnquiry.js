import api from '../Api/axios';

/**
 * Service to handle adding a new enquiry.
 * @param {Object} enquiryData - Data for the new enquiry.
 * @param {string} enquiryData.customerName - Name of the customer.
 * @param {string} enquiryData.companyName - Company name.
 * @param {string} enquiryData.email - Email address.
 * @param {string} enquiryData.phone - 10-digit phone number.
 * @param {string} [enquiryData.source] - Lead source (e.g. Website, LinkedIn, Google).
 * @param {string} [enquiryData.priority] - Priority (Hot, Warm, Cold).
 * @param {string} [enquiryData.notes] - Initial notes or requirements.
 * @param {string|null} [enquiryData.assignedTo] - Sales executive ID or null.
 * @returns {Promise<Object>} API response data.
 */
export const addEnquiry = async (enquiryData) => {
  const payload = {
    ...enquiryData,
    source: enquiryData.source ? enquiryData.source.toLowerCase() : 'website',
    // assignedTo: enquiryData.assignedTo || null
  };

  const response = await api.post("/Enquiry/manager/enquiry", payload);
  return response.data;
};

// Aliases for flexible imports
export const createEnquiry = addEnquiry;

export default addEnquiry;
