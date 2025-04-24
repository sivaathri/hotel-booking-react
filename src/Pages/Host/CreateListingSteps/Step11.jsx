import React from 'react';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';

const styles = `
  @keyframes checkmark {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes circle {
    0% {
      stroke-dashoffset: 283;
    }
    100% {
      stroke-dashoffset: 75;
    }
  }

  .animate-checkmark circle {
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: circle 1s ease-in-out forwards;
  }

  .animate-checkmark path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: checkmark 0.5s ease-in-out 0.5s forwards;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Step11 = ({ formData, setFormData, showSuccessAnimation }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">App Owner Payment</h2>
      <div className="space-y-4">
        {showSuccessAnimation ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-green-500 animate-checkmark" 
                  viewBox="0 0 52 52"
                >
                  <circle 
                    className="animate-circle" 
                    cx="26" 
                    cy="26" 
                    r="25" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  />
                  <path 
                    className="animate-check" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-semibold mt-6 text-green-600">Payment Successful!</h3>
            <p className="text-gray-600 mt-2">Thank you for listing your property with TripNGrub</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Payment Amount: ₹1500</p>
              <p className="text-sm text-gray-600">This is a one-time payment for listing your property on TripNGrub</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choose Payment Method</h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 border rounded-lg text-center ${formData.paymentMethod === 'debit_card'
                      ? 'border-black bg-gray-100'
                      : 'hover:border-gray-400'
                    }`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'debit_card' }))}
                >
                  <FiCreditCard className="mx-auto mb-2" />
                  Debit Card
                </button>

                <button
                  className={`p-4 border rounded-lg text-center ${formData.paymentMethod === 'upi'
                      ? 'border-black bg-gray-100'
                      : 'hover:border-gray-400'
                    }`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                >
                  <FiShield className="mx-auto mb-2" />
                  UPI Payment
                </button>
              </div>

              {formData.paymentMethod === 'debit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardDetails.cardNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cardDetails: { ...prev.cardDetails, cardNumber: e.target.value }
                      }))}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter card number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={formData.cardDetails.expiryDate}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardDetails: { ...prev.cardDetails, expiryDate: e.target.value }
                        }))}
                        className="w-full p-2 border rounded-lg"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        value={formData.cardDetails.cvv}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardDetails: { ...prev.cardDetails, cvv: e.target.value }
                        }))}
                        className="w-full p-2 border rounded-lg"
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Scan the QR code to pay</p>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <QRCodeSVG
                        value={`upi://pay?pa=athrimr-2@okicici&pn=TripNGrub&am=1500&cu=INR`}
                        size={192}
                        level="H"
                        includeMargin={true}
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">UPI ID: athrimr-2@okicici</p>
                    <p className="mt-1 text-sm text-gray-600">Amount: ₹1500</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Step11; 