import axios from 'axios';

// URL ya Heroku backend yako (badili ipasavyo)
const API_BASE_URL = 'https://your-backend.herokuapp.com/api';

export const verifyPayment = async (deviceId, paymentRef, amount) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payment/verify`, {
      deviceId,
      paymentRef,
      amount
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkPaymentStatus = async (deviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/status`, {
      params: { deviceId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
