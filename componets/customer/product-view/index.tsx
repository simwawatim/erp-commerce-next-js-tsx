import React from 'react';

const ProductViewComponent= () => {
  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div className="flex items-center">
                <a href="#" className="mr-2 text-sm font-medium text-gray-900">Men</a>
                <svg className="h-5 w-4 text-gray-300" viewBox="0 0 16 20" fill="currentColor">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <a href="#" className="mr-2 text-sm font-medium text-gray-900">Clothing</a>
                <svg className="h-5 w-4 text-gray-300" viewBox="0 0 16 20" fill="currentColor">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <a href="#" aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">Basic Tee 6-Pack</a>
            </li>
          </ol>
        </nav>

        {/* Image Gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
          <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg" alt="Gray, white, and black shirts laying flat." className="row-span-2 aspect-[3/4] w-full rounded-lg object-cover hidden lg:block" />
          <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg" alt="Model wearing black tee." className="col-start-2 aspect-[3/2] w-full rounded-lg object-cover hidden lg:block" />
          <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg" alt="Model wearing gray tee." className="col-start-2 row-start-2 aspect-[3/2] w-full rounded-lg object-cover hidden lg:block" />
          <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg" alt="Model wearing white tee." className="row-span-2 aspect-[4/5] w-full object-cover sm:rounded-lg lg:aspect-[3/4]" />
        </div>

        {/* Product Info Section */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:pt-16 lg:pb-24 lg:px-8">
          {/* Title */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Basic Tee 6-Pack</h1>
          </div>

          {/* Price and Add to Cart */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">$192</p>

            {/* Reviews */}
            <div className="mt-6">
              <div className="flex items-center">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0L7.302 7.285l-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382L10.868 2.884z" />
                  </svg>
                ))}
                <svg className="h-5 w-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0L7.302 7.285l-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382L10.868 2.884z" />
                </svg>
                <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">117 reviews</a>
              </div>
            </div>

            {/* Add to Bag Form */}
            <form className="mt-10">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-4 flex items-center gap-x-3">
                  <input aria-label="White" type="radio" name="color" className="size-8 appearance-none rounded-full bg-white checked:ring-2 ring-gray-400" />
                  <input aria-label="Gray" type="radio" name="color" className="size-8 appearance-none rounded-full bg-gray-300 checked:ring-2 ring-gray-400" />
                  <input aria-label="Black" type="radio" name="color" className="size-8 appearance-none rounded-full bg-black checked:ring-2 ring-gray-900" />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="size" className="block text-sm font-medium text-gray-900">Size</label>
                <select id="size" name="size" className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>2XL</option>
                </select>
              </div>

              <button type="submit" className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Add to Cart
              </button>
            </form>
          </div>

          {/* Description */}
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-4 text-base text-gray-700">The Basic Tee 6-Pack lets you express your style with three grayscale options. Put on a heather gray tee, go classic with white, or bold with black.</p>

            <h3 className="mt-10 text-sm font-medium text-gray-900">Highlights</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
              <li>Hand cut and sewn locally</li>
              <li>Dyed with our proprietary colors</li>
              <li>Pre-washed & pre-shrunk</li>
              <li>Ultra-soft 100% cotton</li>
            </ul>

            <h3 className="mt-10 text-sm font-medium text-gray-900">Details</h3>
            <p className="mt-2 text-sm text-gray-600">The 6-Pack includes two black, two white, and two heather gray Basic Tees. Subscribe for early access to exclusive color drops.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewComponent;
