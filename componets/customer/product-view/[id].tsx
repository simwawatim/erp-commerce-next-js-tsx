import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../helpers/CartContext"; // Adjust path as needed

const ProductViewComponent = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

const PLACEHOLDER_IMAGE = "/placeholder.png";

  const getImageUrl = (src?: string) => {
  if (!src) return PLACEHOLDER_IMAGE;
  return src.startsWith("http") ? src : `http://127.0.0.1:8000${src}`;
};
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
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
              src={`http://127.0.0.1:8000${product.imageSrc}`}
              alt={product.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
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
              <button
                disabled={!product.quantity || product.quantity < 1}
                className={`flex-1 px-3 py-2 text-sm font-medium transition rounded-md
                  {!product.quantity || product.quantity < 1
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
                      imageSrc: getImageUrl(product.imageSrc),
                    });
                  }
                }}
              >
                Add to Cart
              </button>

              <button
                className="w-1/2 rounded-lg px-4 py-3 text-sm font-medium bg-gray-600 text-white hover:bg-green-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewComponent;
