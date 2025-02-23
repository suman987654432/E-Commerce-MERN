// import { Modal, Button } from 'react-bootstrap';
// import { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import BASE_URL from '../config';

// const PaymentModal = ({ show, onHide, onPaymentComplete, amount, formData }) => {
//     const [loading, setLoading] = useState(false);

//     const handleRazorpayPayment = async () => {
//         try {
//             setLoading(true);
//             const amountInPaise = Math.round(amount * 100);

//             // Create Razorpay order
//             const orderResponse = await axios.post(`${BASE_URL}/payment/create-order`, {
//                 amount: amountInPaise
//             });

//             if (!orderResponse.data.success) {
//                 throw new Error('Failed to create order');
//             }

//             const options = {
//                 key: "rzp_test_6ZJO0F4mj2cEnZ", // Your test key
//                 amount: amountInPaise,
//                 currency: "INR",
//                 name: "Your Store",
//                 description: "Test Transaction",
//                 order_id: orderResponse.data.order.id,
//                 handler: async function (response) {
//                     try {
//                         // Verify payment
//                         const verifyResponse = await axios.post(`${BASE_URL}/payment/verify`, {
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature
//                         });

//                         if (verifyResponse.data.success) {
//                             // Create order in your system
//                             await handleOrderCreation(true, response.razorpay_payment_id);
//                             toast.success('Payment successful!');
//                             onPaymentComplete(true);
//                         } else {
//                             throw new Error('Payment verification failed');
//                         }
//                     } catch (error) {
//                         console.error('Payment verification error:', error);
//                         toast.error('Payment verification failed');
//                         onPaymentComplete(false);
//                     }
//                 },
//                 prefill: {
//                     name: formData.fullName,
//                     email: formData.email,
//                     contact: formData.phone
//                 },
//                 theme: {
//                     color: "#3399cc"
//                 }
//             };

//             const razorpay = new window.Razorpay(options);
//             razorpay.open();
//         } catch (error) {
//             console.error('Payment error:', error);
//             toast.error('Payment failed');
//             onPaymentComplete(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOrderCreation = async (isPaid = false, paymentId = null) => {
//         try {
//             const orderData = {
//                 fullName: formData.fullName,
//                 email: formData.email,
//                 phone: formData.phone,
//                 address: formData.address,
//                 city: formData.city,
//                 state: formData.state,
//                 pincode: formData.pincode,
//                 items: formData.items,
//                 amount: amount,
//                 paymentMethod: isPaid ? 'razorpay' : 'cod',
//                 paymentId: paymentId,
//                 status: isPaid ? 'paid' : 'pending',
//                 orderDate: new Date()
//             };

//             const response = await axios.post(`${BASE_URL}/payment/order`, orderData);
//             return response.data;
//         } catch (error) {
//             console.error('Order creation error:', error);
//             throw error;
//         }
//     };

//     const handleCOD = async () => {
//         try {
//             setLoading(true);
//             await handleOrderCreation();
//             toast.success('Order placed successfully with COD');
//             onPaymentComplete(true);
//         } catch (error) {
//             console.error('COD error:', error);
//             toast.error('Failed to place COD order');
//             onPaymentComplete(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Modal show={show} onHide={onHide} centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Choose Payment Method</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className="payment-details mb-4">
//                     <h4>Amount to Pay: ₹{amount}</h4>
//                     <div className="payment-options mt-3">
//                         <Button 
//                             variant="primary" 
//                             onClick={handleRazorpayPayment}
//                             disabled={loading}
//                             className="w-100 mb-2"
//                         >
//                             {loading ? 'Processing...' : 'Pay Online (Test Mode)'}
//                         </Button>
//                         <Button 
//                             variant="secondary" 
//                             onClick={handleCOD}
//                             disabled={loading}
//                             className="w-100"
//                         >
//                             {loading ? 'Processing...' : 'Cash on Delivery'}
//                         </Button>
//                     </div>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="outline-secondary" onClick={onHide}>
//                     Cancel
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default PaymentModal; 