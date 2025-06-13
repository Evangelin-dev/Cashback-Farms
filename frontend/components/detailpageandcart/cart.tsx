import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconMinus, IconPlus, IconShoppingCart, IconTrash, MOCK_MATERIALS } from "../../constants";
import Button from "../Button";
import Card from "../Card";

// Example mock cart items
const mockCartItems = [
  {
    id: "mat-1",
    name: "UltraTech Cement PPC",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.ultratechcement.com%2Ffor-homebuilders%2Fhome-building-explained-single%2Fdescriptive-articles%2Fbuilding-materials-used-in-construction&psig=AOvVaw1GTEqrlFIiItLpLe8uJLVv&ust=1749894009978000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCC36uN7o0DFQAAAAAdAAAAABAEhttps://www.ultratechcement.com/content/ultratechcement/in/en/home/for-homebuilders/home-building-explained-single/descriptive-articles/building-materials-used-in-construction/_jcr_content/root/container/container_1646056284/teaser_copy.coreimg.jpeg/1702026227155/building-materials-1.jpeg",
    price: 420,
    quantity: 2,
    vendor: "Acme Supplies",
    moq: 1,
  },
  {
    id: "mat-2",
    name: "Red Clay Bricks",
    imageUrl: "https://5.imimg.com/data5/SELLER/Default/2022/7/ZW/GL/GL/1468580/red-clay-bricks-500x500.jpg",
    price: 8,
    quantity: 100,
    vendor: "BrickMart",
    moq: 50,
  },
  {
    id: "mat-3",
    name: "River Sand (Fine Grade)",
    imageUrl: "https://5.imimg.com/data5/SELLER/Default/2022/7/ZW/GL/GL/1468580/river-sand-500x500.jpg",
    price: 1200,
    quantity: 1,
    vendor: "SandHub",
    moq: 1,
  },
];

export const DCart: React.FC = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Add this block to handle adding product from query param
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("productId");
    if (productId && !cartItems.some(item => item.id === productId)) {
      // Try to find the material in MOCK_MATERIALS
      const found = MOCK_MATERIALS.find(m => m.id === productId);
      if (found) {
        setCartItems(items => [
          ...items,
          {
            id: found.id,
            name: found.name,
            imageUrl: found.imageUrl,
            price: found.price,
            quantity: found.moq,
            vendor: found.vendor,
            moq: found.moq,
          }
        ]);
      }
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(item.moq, item.quantity + delta),
            }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary shadow-lg">
            <IconShoppingCart className="w-8 h-8" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1 tracking-tight drop-shadow">Your Cart</h1>
            <div className="text-xs text-neutral-500">Review your selected materials and proceed to checkout.</div>
          </div>
        </div>
        {/* Cart Items */}
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            <Card bodyClassName="p-0 shadow-2xl rounded-2xl border border-green-100">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <IconShoppingCart className="w-16 h-16 text-primary/20 mb-4" />
                  <div className="text-lg font-semibold text-neutral-400 mb-2">Your cart is empty</div>
                  <div className="text-sm text-neutral-500">Add materials to your cart to get started.</div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">Vendor</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {cartItems.map(item => (
                      <tr key={item.id} className="hover:bg-green-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover border border-green-100 shadow"
                          />
                          <span className="font-semibold text-neutral-800">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-500">{item.vendor}</td>
                        <td className="px-4 py-3 text-center text-green-700 font-bold">₹{item.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-green-200 transition"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= item.moq}
                              aria-label="Decrease quantity"
                            >
                              <IconMinus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-neutral-800">{item.quantity}</span>
                            <button
                              className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-green-200 transition"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <IconPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">MOQ: {item.moq}</div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="text-red-500 hover:text-red-700 transition"
                            onClick={() => handleRemove(item.id)}
                            aria-label="Remove item"
                          >
                            <IconTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
          {/* Order Summary and Delivery Info below the cart items */}
          <div className="w-full md:w-[900px] mx-auto flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-w-[350px]">
              <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100 min-h-[340px]">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <IconShoppingCart className="w-5 h-5" /> Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-700">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-neutral-700">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-6 py-3 text-lg font-semibold rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition"
                  disabled={cartItems.length === 0}
                  onClick={() => setShowLoginPopup(true)}
                >
                  Proceed to Checkout
                </Button>
                <div className="mt-4 text-xs text-neutral-400 text-center">
                  Secure checkout • Fast delivery • Quality guaranteed
                </div>
                {/* Popup for login/sign up */}
                {showLoginPopup && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-fade-in">
                      <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <div className="text-xl font-bold text-green-700 mb-2 text-center">Please Login / Sign Up</div>
                      <div className="text-gray-600 text-center mb-6">You need to be logged in to continue to checkout.</div>
                      <button
                        className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        onClick={() => setShowLoginPopup(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            <div className="flex-1">
              <Card bodyClassName="p-4 shadow-2xl rounded-xl bg-gradient-to-r from-blue-50 via-white to-blue-100 border border-blue-200">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
                  </svg>
                  <div>
                    <div className="font-semibold text-blue-700">Delivery Information</div>
                    <div className="text-xs text-blue-600">Free delivery for orders above ₹5,000. Fast shipping available in select cities.</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Add this block to handle adding product from query param
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("productId");
    if (productId && !cartItems.some(item => item.id === productId)) {
      // Try to find the material in MOCK_MATERIALS
      const found = MOCK_MATERIALS.find(m => m.id === productId);
      if (found) {
        setCartItems(items => [
          ...items,
          {
            id: found.id,
            name: found.name,
            imageUrl: found.imageUrl,
            price: found.price,
            quantity: found.moq,
            vendor: found.vendor,
            moq: found.moq,
          }
        ]);
      }
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(item.moq, item.quantity + delta),
            }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary shadow-lg">
            <IconShoppingCart className="w-8 h-8" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1 tracking-tight drop-shadow">Your Cart</h1>
            <div className="text-xs text-neutral-500">Review your selected materials and proceed to checkout.</div>
          </div>
        </div>
        {/* Cart Items */}
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            <Card bodyClassName="p-0 shadow-2xl rounded-2xl border border-green-100">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <IconShoppingCart className="w-16 h-16 text-primary/20 mb-4" />
                  <div className="text-lg font-semibold text-neutral-400 mb-2">Your cart is empty</div>
                  <div className="text-sm text-neutral-500">Add materials to your cart to get started.</div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">Vendor</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-primary uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {cartItems.map(item => (
                      <tr key={item.id} className="hover:bg-green-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover border border-green-100 shadow"
                          />
                          <span className="font-semibold text-neutral-800">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-500">{item.vendor}</td>
                        <td className="px-4 py-3 text-center text-green-700 font-bold">₹{item.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-green-200 transition"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= item.moq}
                              aria-label="Decrease quantity"
                            >
                              <IconMinus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-neutral-800">{item.quantity}</span>
                            <button
                              className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-green-200 transition"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <IconPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">MOQ: {item.moq}</div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="text-red-500 hover:text-red-700 transition"
                            onClick={() => handleRemove(item.id)}
                            aria-label="Remove item"
                          >
                            <IconTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
          {/* Order Summary and Delivery Info below the cart items */}
          <div className="w-full md:w-[900px] mx-auto flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-w-[350px]">
              <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100 min-h-[340px]">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <IconShoppingCart className="w-5 h-5" /> Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-700">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-neutral-700">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-6 py-3 text-lg font-semibold rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition"
                  disabled={cartItems.length === 0}
                  onClick={() => navigate("/materialcheckout")}
                >
                  Proceed to Checkout
                </Button>
                <div className="mt-4 text-xs text-neutral-400 text-center">
                  Secure checkout • Fast delivery • Quality guaranteed
                </div>
              </Card>
            </div>
            <div className="flex-1">
              <Card bodyClassName="p-4 shadow-2xl rounded-xl bg-gradient-to-r from-blue-50 via-white to-blue-100 border border-blue-200">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
                  </svg>
                  <div>
                    <div className="font-semibold text-blue-700">Delivery Information</div>
                    <div className="text-xs text-blue-600">Free delivery for orders above ₹5,000. Fast shipping available in select cities.</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;