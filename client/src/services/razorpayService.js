import axios from 'axios';
import BASE_URL from '../config';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const createRazorpayOrder = async (amount) => {
  try {
    // Convert amount to paise and ensure it's an integer
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      throw new Error('Invalid amount');
    }

    console.log('Creating order with amount (in paise):', amountInPaise);

    const response = await axios.post(`${BASE_URL}/payment/create-order`, {
      amount: amountInPaise
    });

    console.log('Order creation response:', response.data);

    if (!response.data || !response.data.id) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server error:', error.response.data);
      throw new Error(error.response.data.details || 'Server error');
    }
    throw error;
  }
};

export { loadRazorpayScript, createRazorpayOrder }; 