"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "../helpers/CartContext";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  cost_per_unit: string;
  image: string | null;
  quantity?: number;
  predicted_sales?: number;
}

interface Prediction {
  id: number;
  name: string;
  predicted_sales: number;
}

const PLACEHOLDER_IMAGE = "/placeholder.png";

const getImageUrl = (src?: string | null) => {
  if (!src) return PLACEHOLDER_IMAGE;
  return src.startsWith("http") ? src : `http://127.0.0.1:8000${src}`;
};

const CustomerHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productRes = await fetch("http://127.0.0.1:8000/api/products");
        if (!productRes.ok) throw new Error("Failed to fetch products");
        const productsData = await productRes.json();
        setProducts(productsData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (searchQuery.trim().length === 0) {
        setPredictions([]);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/ai/api/predict/");
        if (!res.ok) throw new Error("Failed to fetch predictions");
        const data = await res.json();
        setPredictions(data.predictions || []);
      } catch (err) {
        console.error("Prediction fetch failed", err);
      }
    };

    fetchPredictions();
  }, [searchQuery]);

  const handleSearchSelect = (name: string) => {
    setSearchQuery(name);
    setPredictions([]);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* 🔍 Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {predictions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
              {predictions.slice(0, 5).map((pred) => (
                <li
                  key={pred.id}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                  onClick={() => handleSearchSelect(pred.name)}
                >
                  <div className="flex justify-between">
                    <span>{pred.name}</span>
                    <span className="text-green-600 text-sm">
                      {pred.predicted_sales} sales
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🛍 Products Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <Link href={`/customer/product-view/${product.id}`}>
                  <img
                    src={getImageUrl(product.image)}
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
                    <p className="mt-1 text-sm text-red-600">
                      {!product.quantity || product.quantity === 0
                        ? "Out of stock"
                        : `In stock: ${product.quantity}`}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    K{product.cost_per_unit}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  {/* Buy Button */}
                  <button
                    className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                    onClick={() => {
                      if (product.quantity && product.quantity > 0) {
                        clearCart();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.cost_per_unit),
                          quantity: 1,
                          imageSrc: getImageUrl(product.image),
                        });
                        router.push("/customer/cart");
                      }
                    }}
                  >
                    Buy
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    disabled={!product.quantity || product.quantity < 1}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition rounded-md ${
                      !product.quantity || product.quantity < 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (product.quantity && product.quantity >= 1) {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.cost_per_unit),
                          quantity: 1,
                          imageSrc: getImageUrl(product.image),
                        });
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
