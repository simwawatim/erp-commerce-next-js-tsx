import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  image?: string | null;
  name: string;
  description?: string | null;
  is_available: boolean;
  quantity: number;
  cost_per_unit: number | string;
  created_at: string;
  updated_at: string;

}

const PLACEHOLDER_IMAGE = 'https://res.cloudinary.com/demo/image/upload/v1689803100/ai/hiker.jpg';

const ProductsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    is_available: true,
    quantity: 0,
    cost_per_unit: 0,
  });

  const rowsPerPage = 2;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>('http://127.0.0.1:8000/api/products/');
      if (Array.isArray(response.data)) {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const paginatedProducts = response.data.slice(startIndex, startIndex + rowsPerPage);
        setProducts(paginatedProducts);
        setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdate = async (product: Product) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/products/${product.id}/`, product);
      setProducts(products.map(p => (p.id === product.id ? response.data : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCreate = async () => {
    try {
      if (!newProduct.name) {
        alert('Please enter a Name');
        return;
      }

      const payload = {
        name: newProduct.name,
        description: newProduct.description || '',
        is_available: newProduct.is_available ?? true,
        quantity_on_hand: Number(newProduct.quantity) || 0,
        cost_per_unit: Number(newProduct.cost_per_unit) || 0,
      };

      await axios.post('http://127.0.0.1:8000/api/products/', payload);
      setCurrentPage(1);
      await fetchProducts();
      setIsCreateModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        is_available: true,
        quantity: 1,
        cost_per_unit: 1,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Check console for details.');
    }
  };

  const getStatusBadge = (isAvailable: boolean) =>
    isAvailable ? (
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
    ) : (
      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Unavailable</span>
    );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatKwacha = (value?: number | null) =>
    typeof value === 'number' && !isNaN(value) ? `K${value.toFixed(2)}` : 'K0.00';

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </div>

      <table className="min-w-full bg-white rounded shadow-sm overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {['Image', 'Name', 'Description', 'Status', 'Quantity', 'Cost', 'Created', 'Updated', 'Actions'].map(col => (
              <th key={col} className="p-3 text-left text-sm font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="p-3 align-middle">
                  <img
                    src={product.image || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                    onError={e => ((e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE)}
                  />
                </td>
                <td className="p-3 align-middle font-semibold text-gray-900">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td
                  className="p-3 align-middle text-gray-700 max-w-xs truncate"
                  title={product.description || ''}
                >
                  {editingProduct?.id === product.id ? (
                    <input
                      value={editingProduct.description || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
                     
                    />
                  ) : (
                    product.description || '—'
                  )}
                </td>
                <td className="p-3 align-middle">
                  {editingProduct?.id === product.id ? (
                    <select
                      value={editingProduct.is_available ? 'true' : 'false'}
                      onChange={e => setEditingProduct({ ...editingProduct, is_available: e.target.value === 'true' })}
                      className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  ) : (
                    getStatusBadge(product.is_available)
                  )}
                </td>
                <td className="p-3 align-middle text-center">
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.quantity}
                      onChange={e => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                      className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
               <td className="p-3 align-middle text-right font-mono">
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={product.cost_per_unit}
                    onChange={e => setEditingProduct({ ...editingProduct, cost_per_unit: Number(e.target.value) })}
                    className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
                  />
                ) : (
                  product.cost_per_unit
                )}
              </td>

                <td className="p-3 align-middle text-center text-sm text-gray-500">{formatDate(product.created_at)}</td>
                <td className="p-3 align-middle text-center text-sm text-gray-500">{formatDate(product.updated_at)}</td>
                <td className="p-3 align-middle text-right space-x-2 whitespace-nowrap">
                {editingProduct?.id === product.id ? (
                  <>
                    <button
                      onClick={() => editingProduct && handleUpdate(editingProduct)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center space-x-4 text-gray-700">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Prev
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg min-h-[600px] overflow-y-auto">
          
            <div className="space-y-6 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Name *"
                required
                value={newProduct.name || ''}
                onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <textarea
                placeholder="Description *"
                required
                value={newProduct.description || ''}
                onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
                rows={4}
              />
              <label className="inline-flex items-center space-x-2 max-w-md">
                <input
                  type="checkbox"
                  checked={newProduct.is_available ?? true}
                  onChange={e => setNewProduct(prev => ({ ...prev, is_available: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>Available</span>
              </label>
              <input
                type="number"
                min={1}
                required
                placeholder="Quantity On Hand *"
                value={newProduct.quantity|| ''}
                onChange={e =>
                  setNewProduct(prev => ({
                    ...prev,
                    quantity_on_hand: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <input
                type="number"
                min={0.01}
                step="0.01"
                required
                placeholder="Cost Per Unit (Kwacha) *"
                value={newProduct.cost_per_unit || ''}
                onChange={e =>
                  setNewProduct(prev => ({
                    ...prev,
                    cost_per_unit: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
            </div>

            <div className="mt-8 flex justify-end space-x-4 max-w-md mx-auto">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-red-700 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsTable;
