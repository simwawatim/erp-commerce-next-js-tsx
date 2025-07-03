import React from "react";

const Cart = () => {
  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-8">
      {/* Cart Items */}
      <div className="w-1/2 overflow-y-auto border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        <ul role="list" className="divide-y divide-gray-200">
          <li className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src="https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"
                alt="Throwback Hip Bag"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3>Throwback Hip Bag</h3>
                <p>$90.00</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Salmon</p>
              <div className="flex flex-1 items-end justify-between text-sm mt-auto">
                <p className="text-gray-500">Qty 1</p>
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
          <li className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src="https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-02.jpg"
                alt="Medium Stuff Satchel"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3>Medium Stuff Satchel</h3>
                <p>$32.00</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Blue</p>
              <div className="flex flex-1 items-end justify-between text-sm mt-auto">
                <p className="text-gray-500">Qty 1</p>
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Order Summary with Checkout Form */}
      <div className="w-1/2 border border-gray-200 rounded-lg bg-gray-50 p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {/* Subtotal and Checkout Button Row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-gray-900">Subtotal: $122.00</p>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
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

          {/* You can put another Checkout button here if you want */}
          {/* <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
          >
            Place Order
          </button> */}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            or{" "}
            <button className="font-medium text-indigo-600 hover:text-indigo-500">
              Continue Shopping &rarr;
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
