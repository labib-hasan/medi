import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.10.172:5000';

console.log('API_URL used in api.js:', API_URL);

export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/doctors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/departments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};
