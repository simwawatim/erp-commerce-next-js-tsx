import React from 'react';

const SalesTable = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

  const salesData = [
    {
      id: 1,
      product: 'Wireless Headphones',
      customer: 'John Smith',
      date: '2023-06-15',
      quantity: 2,
      unitPrice: 129.99,
      revenue: 259.98,
      paymentMethod: 'Credit Card',
      status: 'Completed'
    },
    {
      id: 2,
      product: 'Smart Watch',
      customer: 'Sarah Johnson',
      date: '2023-06-14',
      quantity: 1,
      unitPrice: 199.99,
      revenue: 199.99,
      paymentMethod: 'PayPal',
      status: 'Completed'
    },
    {
      id: 3,
      product: 'Bluetooth Speaker',
      customer: 'Michael Brown',
      date: '2023-06-13',
      quantity: 3,
      unitPrice: 89.99,
      revenue: 269.97,
      paymentMethod: 'Credit Card',
      status: 'Shipped'
    },
    {
      id: 4,
      product: 'Laptop Backpack',
      customer: 'Emily Davis',
      date: '2023-06-12',
      quantity: 1,
      unitPrice: 49.99,
      revenue: 49.99,
      paymentMethod: 'Bank Transfer',
      status: 'Processing'
    },
    {
      id: 5,
      product: 'Wireless Charger',
      customer: 'David Wilson',
      date: '2023-06-11',
      quantity: 2,
      unitPrice: 29.99,
      revenue: 59.98,
      paymentMethod: 'Credit Card',
      status: 'Completed'
    },
    {
      id: 6,
      product: 'External SSD',
      customer: 'Jessica Lee',
      date: '2023-06-10',
      quantity: 1,
      unitPrice: 129.99,
      revenue: 129.99,
      paymentMethod: 'PayPal',
      status: 'Completed'
    },
    {
      id: 7,
      product: 'Smartphone Holder',
      customer: 'Robert Taylor',
      date: '2023-06-09',
      quantity: 4,
      unitPrice: 19.99,
      revenue: 79.96,
      paymentMethod: 'Credit Card',
      status: 'Cancelled'
    }
  ];

  const totalPagesCalculated = Math.ceil(salesData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = salesData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPagesCalculated) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Completed: 'bg-green-100 text-green-800',
      Shipped: 'bg-blue-100 text-blue-800',
      Processing: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Product</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Customer</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Date</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Qty</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Unit Price</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Revenue</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Payment</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {currentRows.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="p-4 text-slate-900 font-medium">{sale.product}</td>
              <td className="p-4 text-slate-600">{sale.customer}</td>
              <td className="p-4 text-slate-600">{sale.date}</td>
              <td className="p-4 text-slate-600">{sale.quantity}</td>
              <td className="p-4 text-slate-600">{formatCurrency(sale.unitPrice)}</td>
              <td className="p-4 text-slate-900 font-medium">{formatCurrency(sale.revenue)}</td>
              <td className="p-4 text-slate-600">{sale.paymentMethod}</td>
              <td className="p-4">{getStatusBadge(sale.status)}</td>
              <td className="p-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" title="View Details">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
                <button className="text-red-500 hover:text-red-700" title="Refund">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="text-slate-600">
          Page {currentPage} of {totalPagesCalculated}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPagesCalculated }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPagesCalculated}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;