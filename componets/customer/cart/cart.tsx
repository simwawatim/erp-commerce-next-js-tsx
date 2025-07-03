import React from "react";
import { useCart } from "../helpers/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleDecrement = (itemId: number, currentQty: number) => {
    if (currentQty <= 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, currentQty - 1);
    }
  };

  const handleIncrement = (itemId: number, currentQty: number) => {
    updateQuantity(itemId, currentQty + 1);
  };

  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-8">
      {/* Cart Items */}
      <div className="w-1/2 overflow-y-auto border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p>K{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-200"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span>Qty {item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.id, item.quantity)}
                      className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-200"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-auto">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Order Summary */}
      <div className="w-1/2 border border-gray-200 rounded-lg bg-gray-50 p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-gray-900">
            Subtotal: K{subtotal.toFixed(2)}
          </p>
          <button className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
            Checkout
          </button>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>

        {/* Checkout Form */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="123 Main St, City, Country"
            />
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            or{" "}
            <a href="/customer/dashboard">
                <button className="font-medium text-indigo-600 hover:text-indigo-500">
                    Continue Shopping &rarr;
                </button>
            </a>
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
