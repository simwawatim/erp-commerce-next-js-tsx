import axios from 'axios';
import React from 'react';

interface Sale {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price?: number;
  date_ordered: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const SalesTable = () => {
  const [salesData, setSalesData] = React.useState<Sale[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  const getProductPrice = (productId: number): number => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  const fetchSalesRecords = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sales-orders/');
      if (Array.isArray(response.data)) {
        const simplifiedData: Sale[] = response.data.map((item: any) => ({
          id: item.id,
          product_id: item.product?.id ?? 0,
          name: item.product?.name || '—',
          quantity: item.quantity,
          price: parseFloat(item.price ?? '0'),
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  React.useEffect(() => {
    fetchSalesRecords();
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(salesData.length / rowsPerPage);
  const currentRows = salesData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Sales Records</h2>
      </div>

      <table className="min-w-full bg-white rounded shadow-sm overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-3 text-left text-sm font-medium w-12">ID</th>
            <th className="p-3 text-left text-sm font-medium w-48">Product Name</th>
            <th className="p-3 text-center text-sm font-medium w-24">Qty</th>
            <th className="p-3 text-right text-sm font-medium w-32 whitespace-nowrap">Price (K)</th>
            <th className="p-3 text-right text-sm font-medium w-32 whitespace-nowrap">Total (K)</th>
            <th className="p-3 text-left text-sm font-medium w-40">Date Ordered</th>
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
            currentRows.map(sale => {
              const price = sale.price ?? getProductPrice(sale.product_id);
              const total = price * sale.quantity;

              return (
                <tr key={sale.id} className="hover:bg-gray-100">
                  <td className="p-3 text-left">{sale.id}</td>
                  <td className="p-3 font-semibold text-gray-900">{sale.name}</td>
                  <td className="p-3 text-center">{sale.quantity}</td>
                  <td className="p-3 text-right whitespace-nowrap">K{price.toFixed(2)}</td>
                  <td className="p-3 text-right font-semibold whitespace-nowrap">K{total.toFixed(2)}</td>
                  <td className="p-3 text-sm text-gray-600 text-left">
                    {sale.date_ordered ? new Date(sale.date_ordered).toLocaleDateString() : '—'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default SalesTable;
