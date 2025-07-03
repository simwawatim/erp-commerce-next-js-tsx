import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "../helpers/CartContext";

interface Product {
  id: number;
  name: string;
  cost_per_unit: string;
  imageSrc: string;
  quantity?: number;
}

const PLACEHOLDER_IMAGE = "/placeholder.png";

const getImageUrl = (src?: string) => {
  if (!src) return PLACEHOLDER_IMAGE;
  return src.startsWith("http") ? src : `http://127.0.0.1:8000${src}`;
};

const CustomerHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => {
            // Find how many of this product are in the cart
            const cartItem = cartItems.find((item) => item.id === product.id);
            const cartQuantity = cartItem ? cartItem.quantity : 0;

            // Calculate if add to cart should be disabled
            const disableAddToCart = !product.quantity || cartQuantity >= product.quantity;

            // Calculate remaining stock after what's in cart
            const remainingStock = product.quantity ? product.quantity - cartQuantity : 0;

            return (
              <div key={product.id} className="group relative">
                <Link href={`/customer/product-view`} passHref>
                  <img
                    src={getImageUrl(product.imageSrc)}
                    alt={`Image of ${product.name}`}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:h-80 cursor-pointer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </Link>

                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500"></p>
                    <p className="mt-1 text-sm text-red-600">
                      {!product.quantity || product.quantity === 0
                        ? "Out of stock"
                        : disableAddToCart
                        ? "Max quantity reached"
                        : `In stock: ${remainingStock}`}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    K{product.cost_per_unit}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                  >
                    Buy
                  </button>

                  <button
                    disabled={disableAddToCart}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition rounded-md
                      ${disableAddToCart
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                      }`}
                    onClick={() => {
                      if (!disableAddToCart) {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.cost_per_unit),
                          quantity: 1,
                          imageSrc: getImageUrl(product.imageSrc),
                        });
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
