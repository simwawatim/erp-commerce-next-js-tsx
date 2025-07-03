import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "../helpers/CartContext";

interface Product {
  id: number;
  name: string;
  color: string;
  price: string;
  imageSrc: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.png";

const getImageUrl = (src?: string) => {
  console.log(src);
  if (!src) {
    console.log("Image src missing. Using placeholder.");
    return PLACEHOLDER_IMAGE;
  }

  const finalUrl = src.startsWith("http")
    ? src
    : `http://127.0.0.1:8000${src}`;

  console.log("Constructed image URL:", finalUrl);
  return finalUrl;
};

const CustomerHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { addToCart } = useCart();

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

  const handleBuy = (productName: string) => {
    alert(`Buying "${productName}"...`);
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <Link href={`/customer/product-view`} passHref>
                <img
                  src={getImageUrl(product.imageSrc)}
                  alt={`Image of ${product.name}`}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:h-80 cursor-pointer"
                />
              </Link>

              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                  onClick={() => handleBuy(product.name)}
                >
                  Buy
                </button>

                <button
                  className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 transition"
                  onClick={() => {
                    addToCart();
                    alert(`Added ${product.name} to cart`);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
