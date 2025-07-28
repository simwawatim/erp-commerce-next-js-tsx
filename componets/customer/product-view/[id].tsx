"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../helpers/CartContext"; // Adjust path if needed

const ProductViewComponent = () => {
  const router = useRouter();
  const { id } = router.query;

  const { addToCart, clearCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const PLACEHOLDER_IMAGE = "/placeholder.png";

  const getImageUrl = (src?: string | null) => {
    if (!src) return PLACEHOLDER_IMAGE;
    return src.startsWith("http") ? src : `https://uat.pythonanywhere.com${src}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://uat.pythonanywhere.com/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading product...</p>;

  if (!product)
    return <p className="text-center mt-10 text-red-500">Product not found</p>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="w-full">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
              className="w-full h-[500px] object-cover rounded-xl border border-gray-200 shadow-sm"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-2xl text-indigo-600 font-semibold mb-6">
                K{product.cost_per_unit}
              </p>

              <p className="text-base text-gray-700 mb-6">
                {product.description || "No description provided."}
              </p>

              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Available Stock:</span>{" "}
                {product.quantity ?? 0} unit(s)
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              {/* Add to Cart */}
              <button
                disabled={!product.quantity || product.quantity < 1}
                className={`flex-1 px-3 py-2 text-sm font-medium transition rounded-md ${
                  !product.quantity || product.quantity < 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
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

              {/* Buy Now */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewComponent;
