import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaQrcode } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const TourPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract reservation data passed from state
  const {
    currentUser,
    firstName,
    lastName,
    date,
    phone,
    guestCount,
    tourId,
    tourName,
    totalPrice
  } = location.state ?? {};

  // Redirect if no reservation data is present (direct URL access)
  useEffect(() => {
    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Please fill in tour details before paying.',
      });
      navigate('/tours/home');
    }
  }, [currentUser, navigate]);

  // States for payment selections and inputs
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');

  // QR Code Inputs
  const [transactionId, setTransactionId] = useState('');

  if (!currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validations
    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length !== 16 || isNaN(Number(cleanCard))) {
        return Swal.fire('Error', 'Please enter a valid 16-digit card number.', 'error');
      }
      if (cvv.length !== 3 || isNaN(Number(cvv))) {
        return Swal.fire('Error', 'Please enter a valid 3-digit CVV.', 'error');
      }
      if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
        return Swal.fire('Error', 'Please enter a valid expiration date (MM / YY).', 'error');
      }
    } else {
      if (transactionId.length !== 12 || isNaN(Number(transactionId))) {
        return Swal.fire('Error', 'Please enter a valid 12-digit UPI / Bank Transaction Ref ID.', 'error');
      }
    }

    setLoading(true);

    // Show Processing loader
    Swal.fire({
      title: paymentMethod === 'card' ? 'Processing secure card payment...' : 'Verifying transaction reference...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simulate Payment Gateway Response Delay
    setTimeout(async () => {
      try {
        // 2. Create Tour Reservation Record in DB
        const newReservation = {
          currentUser,
          firstName,
          lastName,
          date,
          phone,
          guestCount
        };

        const response = await axios.post("/tours/tourReservations", newReservation);

        // 3. Close loading and show success
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Tour Booked Successfully',
          text: response.data.message || 'Your payment was processed and booking is complete!',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          navigate('/tours/home');
        });

      } catch (err) {
        Swal.close();
        console.error("Tour booking failed:", err);
        Swal.fire('Error', err.response?.data?.message || 'Something went wrong during reservation.', 'error');
      }
    }, 1500);
  };

  return (
    <div className='lg:p-24 p-6 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-extrabold text-gray-900'>Secure Tour Checkout</h1>
        <p className='text-gray-500 mt-1'>Complete your payment to confirm your booking for {tourName}</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-12'>
        {/* Left Side: Payment Form */}
        <div className='flex-1 bg-white p-8 rounded-2xl border shadow-sm h-fit'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Choose Payment Method</h2>

          {/* Payment Tabs */}
          <div className='flex gap-4 mb-8'>
            <button
              type='button'
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all duration-200 ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <FaCreditCard size={20} />
              Credit/Debit Card
            </button>
            <button
              type='button'
              onClick={() => setPaymentMethod('qr')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all duration-200 ${
                paymentMethod === 'qr'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <FaQrcode size={20} />
              UPI / Bank QR Code
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {paymentMethod === 'card' ? (
              // Card Details Fields
              <div className='space-y-4'>
                <div>
                  <label className='block font-semibold text-gray-700 mb-1'>Card Number</label>
                  <input
                    type='text'
                    required
                    maxLength={19}
                    placeholder='4111 2222 3333 4444'
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                      const matches = val.match(/\d{4,16}/g);
                      const match = (matches && matches[0]) || '';
                      const parts = [];
                      for (let i = 0, len = match.length; i < len; i += 4) {
                        parts.push(match.substring(i, i + 4));
                      }
                      if (parts.length > 0) {
                        setCardNumber(parts.join(' '));
                      } else {
                        setCardNumber(val);
                      }
                    }}
                    className='border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <p className='text-gray-400 text-xs mt-1'>Enter the 16 digit card number on the front side.</p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block font-semibold text-gray-700 mb-1'>CVV</label>
                    <input
                      type='password'
                      required
                      maxLength={3}
                      placeholder='123'
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      className='border rounded-lg p-3 w-full text-center focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                    <p className='text-gray-400 text-xs mt-1'>3-digit code on back</p>
                  </div>
                  <div>
                    <label className='block font-semibold text-gray-700 mb-1'>Expiry Date</label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        required
                        maxLength={2}
                        placeholder='MM'
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value.replace(/[^0-9]/g, ''))}
                        className='border rounded-lg p-3 w-full text-center focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      />
                      <input
                        type='text'
                        required
                        maxLength={2}
                        placeholder='YY'
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value.replace(/[^0-9]/g, ''))}
                        className='border rounded-lg p-3 w-full text-center focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      />
                    </div>
                    <p className='text-gray-400 text-xs mt-1'>Month / Year (e.g. 12 / 28)</p>
                  </div>
                </div>
              </div>
            ) : (
              // QR Code Scanning Fields
              <div className='flex flex-col items-center text-center space-y-4'>
                <p className='text-gray-600 text-sm'>
                  Scan the UPI QR code below using any banking or payment app (Google Pay, PhonePe, Paytm, etc.) to pay.
                </p>

                <div className='p-4 border-2 border-dashed border-blue-200 rounded-2xl bg-gray-50'>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=rtms@bank&pn=RTMS%20Tours&am=${totalPrice}&cu=INR`}
                    alt='Payment QR Code'
                    className='w-[200px] h-[200px]'
                  />
                </div>

                <div className='w-full text-left space-y-2 mt-4'>
                  <label className='block font-semibold text-gray-700'>Transaction Reference ID (12 Digits)</label>
                  <input
                    type='text'
                    required
                    maxLength={12}
                    placeholder='e.g., 202410803456'
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.replace(/[^0-9]/g, ''))}
                    className='border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <p className='text-gray-400 text-xs'>
                    Enter the 12-digit transaction ID / UTR number from your payment receipt.
                  </p>
                </div>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='bg-[#41A4FF] hover:bg-blue-600 text-white font-bold p-4 w-full rounded-xl transition-all duration-200 shadow-lg mt-6'
            >
              {paymentMethod === 'card' ? 'Confirm and Pay Now' : 'Submit Reference and Book'}
            </button>

            <div className='flex items-center justify-center gap-2 text-gray-400 mt-4 text-sm'>
              <FaLock />
              <span>Payments are secured and encrypted.</span>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className='w-full lg:w-[400px] bg-gray-50 p-8 rounded-2xl border h-fit'>
          <h3 className='text-lg font-bold text-gray-800 border-b pb-4 mb-4'>Booking Summary</h3>

          <div className='space-y-4 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Tour Package</span>
              <span className='font-semibold text-gray-800 text-right'>{tourName}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Customer Name</span>
              <span className='font-semibold text-gray-800'>{firstName} {lastName}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Start Date</span>
              <span className='font-semibold text-gray-800'>{date}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Guests</span>
              <span className='font-semibold text-gray-800'>{guestCount} Persons</span>
            </div>

            <div className='border-t pt-4 mt-4 space-y-2'>
              <div className='flex justify-between text-base font-extrabold text-gray-900'>
                <span>Total Charge</span>
                <span>Rs. {totalPrice?.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPayment;
