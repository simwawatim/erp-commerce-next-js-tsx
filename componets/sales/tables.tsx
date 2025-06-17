import axios from 'axios';
import React from 'react';

interface Sale {
  id: number;
  name: string;
  quantity: number;
  price: number;
  date_ordered: string;
}

interface Product {
  id: number;
  name: string;
}

const SalesTable = () => {
  const [salesData, setSalesData] = React.useState<Sale[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);  // <-- products list
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newSale, setNewSale] = React.useState({
    product_id: 0,
    quantity: 1,
    price: 0,
  });

  const fetchSalesRecords = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sales-orders/');
      if (Array.isArray(response.data)) {
        const simplifiedData: Sale[] = response.data.map((item: any) => ({
          id: item.id,
          name: item.product?.name || '—',
          quantity: item.quantity,
          price: item.price,
          date_ordered: item.date_ordered,
        }));
        setSalesData(simplifiedData);
      } else {
        console.error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-product-by-name');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  React.useEffect(() => {
    fetchSalesRecords();
    fetchProducts();  // fetch products on mount
  }, []);

  const totalPages = Math.ceil(salesData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = salesData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddSale = async () => {
    try {
      if (newSale.product_id <= 0 || newSale.price <= 0 || newSale.quantity <= 0) {
        alert('Please fill in all fields with valid values.');
        return;
      }

      const payload = {
        product_id: newSale.product_id,
        quantity: newSale.quantity,
        price: newSale.price,
      };

      await axios.post('http://127.0.0.1:8000/api/sales-orders/', payload);
      setIsAddModalOpen(false);
      setNewSale({ product_id: 0, quantity: 1, price: 0 });
      fetchSalesRecords();
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Failed to add sale.');
    }
  };

  const handleDeleteSale = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/sales-orders/${id}/`);
      fetchSalesRecords();
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Failed to delete sale.');
    }
  };

  return (
    <div className="overflow-x-auto p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Sales Records</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Sale
        </button>
      </div>

      <table className="min-w-full bg-white rounded shadow-sm overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {['ID', 'Product Name', 'Quantity', 'Price', 'Date Ordered', 'Actions'].map(col => (
              <th key={col} className="p-3 text-left text-sm font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                No sales found.
              </td>
            </tr>
          ) : (
            currentRows.map(sale => (
              <tr key={sale.id} className="hover:bg-gray-100">
                <td className="p-3">{sale.id}</td>
                <td className="p-3 font-semibold text-gray-900">{sale.name}</td>
                <td className="p-3 text-center">{sale.quantity}</td>
                <td className="p-3">{sale.price ?? '—'}</td>
                <td className="p-3 text-sm text-gray-600">
                  {sale.date_ordered ? new Date(sale.date_ordered).toLocaleDateString() : '—'}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteSale(sale.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
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

      {/* Add Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Sale</h3>
            <div className="space-y-4">

              {/* Dropdown for product selection */}
              <select
                value={newSale.product_id}
                onChange={e =>
                  setNewSale(prev => ({ ...prev, product_id: Number(e.target.value) }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value={0} disabled>
                  Select Product *
                </option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                placeholder="Quantity *"
                value={newSale.quantity}
                onChange={e => setNewSale(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                min={0.01}
                step="0.01"
                placeholder="Price *"
                value={newSale.price}
                onChange={e => setNewSale(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-red-700 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSale}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default SalesTable;
