import React, { useState } from "react";
import { IconCheck, IconCreditCard, IconShoppingCart } from "../../constants";
import Button from "../Button";
import Card from "../Card";

const MaterialCheckout: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-2">
      <div className="max-w-2xl mx-auto">
        <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary shadow-lg">
              <IconShoppingCart className="w-8 h-8" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1 tracking-tight drop-shadow">Material Checkout</h1>
              <div className="text-xs text-neutral-500">Complete your purchase in a few easy steps.</div>
            </div>
          </div>
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 flex flex-col items-center ${step >= 1 ? "text-primary" : "text-neutral-400"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? "border-primary bg-primary/10" : "border-neutral-300 bg-white"}`}>1</div>
              <span className="text-xs mt-2">Shipping</span>
            </div>
            <div className={`flex-1 h-1 ${step > 1 ? "bg-primary" : "bg-neutral-200"} mx-2 rounded-full`} />
            <div className={`flex-1 flex flex-col items-center ${step >= 2 ? "text-primary" : "text-neutral-400"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? "border-primary bg-primary/10" : "border-neutral-300 bg-white"}`}>2</div>
              <span className="text-xs mt-2">Payment</span>
            </div>
            <div className={`flex-1 h-1 ${step > 2 ? "bg-primary" : "bg-neutral-200"} mx-2 rounded-full`} />
            <div className={`flex-1 flex flex-col items-center ${step === 3 ? "text-primary" : "text-neutral-400"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 ${step === 3 ? "border-primary bg-primary/10" : "border-neutral-300 bg-white"}`}>{orderPlaced ? <IconCheck className="w-6 h-6" /> : 3}</div>
              <span className="text-xs mt-2">Done</span>
            </div>
          </div>
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <h2 className="text-lg font-bold text-primary mb-2">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                  <input
                    className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                  <input
                    className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Address Line 1</label>
                <input
                  className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Address Line 2</label>
                <input
                  className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                  name="addressLine2"
                  value={address.addressLine2}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">City</label>
                  <input
                    className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">State</label>
                  <input
                    className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Pincode</label>
                  <input
                    className="border rounded px-3 py-2 w-full text-base focus:border-primary transition"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" variant="primary" className="px-8 py-2 text-lg font-semibold rounded-lg shadow-lg">
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}
          {/* Step 2: Payment */}
          {step === 2 && (
            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                handlePlaceOrder();
              }}
            >
              <h2 className="text-lg font-bold text-primary mb-2">Payment Method</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-primary"
                  />
                  <span className="font-semibold text-neutral-700">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-primary"
                  />
                  <span className="font-semibold text-neutral-700 flex items-center gap-2">
                    <IconCreditCard className="w-5 h-5" /> Credit/Debit Card
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="accent-primary"
                  />
                  <span className="font-semibold text-neutral-700">UPI / Netbanking</span>
                </label>
              </div>
              {paymentMethod === "card" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Card Number</label>
                    <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" required />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Expiry</label>
                    <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" required placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">CVV</label>
                    <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" required />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name on Card</label>
                    <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" required />
                  </div>
                </div>
              )}
              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">UPI ID</label>
                  <input className="border rounded px-3 py-2 w-full text-base focus:border-primary transition" required placeholder="yourname@upi" />
                </div>
              )}
              <div className="flex justify-between mt-6">
                <Button type="button" variant="secondary" className="px-8 py-2 text-lg font-semibold rounded-lg shadow" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" className="px-8 py-2 text-lg font-semibold rounded-lg shadow-lg">
                  Place Order
                </Button>
              </div>
            </form>
          )}
          {/* Step 3: Order Placed */}
          {step === 3 && orderPlaced && (
            <div className="flex flex-col items-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                <IconCheck className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">Order Placed Successfully!</h2>
              <div className="text-base text-gray-700 mb-4 text-center">
                Thank you for your purchase.<br />
                Your order will be processed and shipped soon.
              </div>
              <Button
                variant="primary"
                className="mt-2 px-8 py-2 text-lg font-semibold rounded-lg shadow"
                onClick={() => window.location.href = "/"}
              >
                Go to Home
              </Button>
            </div>
          )}
        </Card>
      </div>
      <style>{`
        .shadow-2xl { box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12); }
        .drop-shadow { filter: drop-shadow(0 2px 8px #22c55e33); }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-bounce-slow { animation: bounce-slow 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default MaterialCheckout;
