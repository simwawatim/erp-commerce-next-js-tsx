"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../helpers/CartContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [customerExists, setCustomerExists] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  });

  const router = useRouter();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("✅ Token found:", token);

      fetch("https://uat.pythonanywhere.com/api/customer/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Customer not found");
          return res.json();
        })
        .then((data) => {
          setCustomerExists(true);
          setCustomerInfo(data);
        })
        .catch((err) => {
          console.warn("Customer fetch failed:", err.message);
          setCustomerExists(false);
        });
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      Swal.fire("Cart is empty", "Add items before checking out", "warning");
      return;
    }

    setLoading(true);

    const payload = {
      name: customerExists ? customerInfo.name : nameRef.current?.value,
      email: customerExists ? customerInfo.email : emailRef.current?.value,
      address: customerExists
        ? customerInfo.address
        : addressRef.current?.value,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("https://uat.pythonanywhere.com/api/buy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        await fetch("https://uat.pythonanywhere.com/ai/api/feed/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            products: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              sales: [item.quantity],
            })),
          }),
        });

        Swal.fire({
          title: "Order Submitted!",
          text: data.message || "Thank you for your purchase.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        clearCart();

        setTimeout(() => {
          router.push("/customer/dashboard");
        }, 2000);
      } else {
        const errorText =
          typeof data.error === "string"
            ? data.error
            : Object.values(data).flat().join("\n");

        Swal.fire({
          title: "Order Failed",
          text: errorText || "An error occurred. Please check your inputs.",
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if all customer info fields are non-empty strings
  const allCustomerInfoPresent =
    customerInfo.name.trim() !== "" &&
    customerInfo.email.trim() !== "" &&
    customerInfo.address.trim() !== "";

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
                    >
                      -
                    </button>
                    <span>Qty {item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.id, item.quantity)}
                      className="rounded border px-2 py-1 text-gray-700 hover:bg-gray-200"
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
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>

        {/* Checkout Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              name="name"
              required
              disabled={customerExists}
              className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm ${
                customerExists ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="John Doe"
              defaultValue={customerInfo.name}
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
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              required
              disabled={customerExists}
              className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm ${
                customerExists ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="john@example.com"
              defaultValue={customerInfo.email}
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
              ref={addressRef}
              id="address"
              name="address"
              rows={3}
              required
              disabled={customerExists}
              className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm ${
                customerExists ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="123 Main St, City, Country"
              defaultValue={customerInfo.address}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Order"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            or{" "}
            <a href="/customer/dashboard">
              <button className="font-medium text-indigo-600 hover:text-indigo-500">
                Continue Shopping →
              </button>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
