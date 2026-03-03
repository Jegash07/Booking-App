import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ selectedSeats, showtime, user, setError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const handleBookingAndPayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        if (selectedSeats.length === 0) {
            setError('Please select at least one seat to proceed.');
            return;
        }

        try {
            setProcessing(true);
            setError('');

            const totalAmount = selectedSeats.length * showtime.price;
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            // 1. Fetch Payment Intent Logic mapped from backend natively
            const intentRes = await axios.post('http://localhost:5000/api/payment/create-payment-intent', { amount: totalAmount }, config);
            const clientSecret = intentRes.data.clientSecret;

            // 2. Validate abstract payment confirmation via Stripe generic payload securely
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: user.name, email: user.email }
                }
            });

            if (result.error) {
                setError(`Payment Failed: ${result.error.message}`);
                setProcessing(false);
                return;
            }

            // 3. Confirm Native booking transaction with backend after successful payment processing!
            await axios.post('http://localhost:5000/api/bookings', {
                showtimeId: showtime._id,
                seatsBooked: selectedSeats,
                totalAmount
            }, config);

            alert('Payment Successful & Booking Confirmed! Enjoy your movie.');
            navigate('/my-bookings');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Booking process failed generically.');
            setProcessing(false);
        }
    };

    return (
        <div className="mt-4 pt-3 border-top border-secondary">
            <h5 className="mb-3 text-white fw-bold">Secure Card Payment</h5>
            <div className="p-3 bg-dark border border-secondary rounded shadow-sm mb-4">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px', color: '#e0e6ed', '::placeholder': { color: '#888' },
                        },
                        invalid: { color: '#9e2146' },
                    }
                }} />
            </div>

            <Button
                variant="danger"
                className="w-100 py-3 fw-bold fs-5 btn-primary-custom shadow"
                disabled={selectedSeats.length === 0 || processing || !stripe}
                onClick={handleBookingAndPayment}
            >
                {processing ? 'Processing Securely...' : `Pay ₹${(selectedSeats.length * showtime.price).toFixed(2)} & Book Ticket`}
            </Button>
        </div>
    );
};

export default CheckoutForm;
