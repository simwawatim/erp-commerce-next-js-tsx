import React from 'react';

const ProductViewComponent = () => {
  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Single Main Image */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
          <img
            src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg"
            alt="Model wearing white tee."
            className="w-full rounded-lg object-cover sm:rounded-lg"
          />
        </div>

        {/* Product Info Section */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:max-w-7xl lg:grid lg:grid-cols-3 lg:gap-x-8 lg:pt-16 lg:pb-24 lg:px-8">
          {/* Title */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Basic Tee 6-Pack
            </h1>
          </div>

          {/* Price and Add to Cart */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">$192</p>

            <form className="mt-10">




              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add to Cart
              </button>
            </form>
          </div>

          {/* Description */}
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-4 text-base text-gray-700">
              The Basic Tee 6-Pack lets you express your style with three grayscale options. Put on a heather gray tee, go classic with white, or bold with black.
            </p>

            <h3 className="mt-10 text-sm font-medium text-gray-900">Highlights</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
              <li>Hand cut and sewn locally</li>
              <li>Dyed with our proprietary colors</li>
              <li>Pre-washed & pre-shrunk</li>
              <li>Ultra-soft 100% cotton</li>
            </ul>

            <h3 className="mt-10 text-sm font-medium text-gray-900">Details</h3>
            <p className="mt-2 text-sm text-gray-600">
              The 6-Pack includes two black, two white, and two heather gray Basic Tees. Subscribe for early access to exclusive color drops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewComponent;
