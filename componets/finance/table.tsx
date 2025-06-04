import React from 'react';

const FinanceTable = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

  const financialData = [
    {
      id: 1,
      date: '2023-06-15',
      description: 'Product Sales',
      category: 'Revenue',
      amount: 1250.00,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      balance: 5820.50
    },
    {
      id: 2,
      date: '2023-06-14',
      description: 'Office Rent',
      category: 'Expense',
      amount: -1200.00,
      paymentMethod: 'Bank Transfer',
      status: 'Processed',
      balance: 4570.50
    },
    {
      id: 3,
      date: '2023-06-13',
      description: 'Web Hosting',
      category: 'Expense',
      amount: -29.99,
      paymentMethod: 'PayPal',
      status: 'Processed',
      balance: 5770.50
    },
    {
      id: 4,
      date: '2023-06-12',
      description: 'Consulting Fees',
      category: 'Revenue',
      amount: 850.00,
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
      balance: 5800.49
    },
    {
      id: 5,
      date: '2023-06-11',
      description: 'Marketing Campaign',
      category: 'Expense',
      amount: -450.00,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      balance: 4950.49
    },
    {
      id: 6,
      date: '2023-06-10',
      description: 'Product Sales',
      category: 'Revenue',
      amount: 980.50,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      balance: 5400.49
    },
    {
      id: 7,
      date: '2023-06-09',
      description: 'Equipment Purchase',
      category: 'Expense',
      amount: -1200.00,
      paymentMethod: 'Bank Transfer',
      status: 'Processed',
      balance: 4420.49
    }
  ];

  const totalPages = Math.ceil(financialData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = financialData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Completed: 'bg-green-100 text-green-800',
      Processed: 'bg-blue-100 text-blue-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Financial Transactions</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Export
          </button>
          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            New Transaction
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Date</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Description</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Category</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Amount</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Payment Method</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Balance</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {currentRows.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="p-4 text-slate-600">{transaction.date}</td>
              <td className="p-4 text-slate-900 font-medium">{transaction.description}</td>
              <td className="p-4 text-slate-600">{transaction.category}</td>
              <td className={`p-4 font-medium ${getAmountColor(transaction.amount)}`}>
                {formatCurrency(transaction.amount)}
              </td>
              <td className="p-4 text-slate-600">{transaction.paymentMethod}</td>
              <td className="p-4">{getStatusBadge(transaction.status)}</td>
              <td className="p-4 text-slate-900 font-medium">{formatCurrency(transaction.balance)}</td>
              <td className="p-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM4 21q-.425 0-.712-.288Q3 20.425 3 20v-2.825q0-.2.075-.387.075-.188.225-.338l10.3-10.3 4.25 4.25-10.3 10.3q-.15.15-.337.225-.188.075-.388.075Zm14.775-12.85l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387Z"/>
                  </svg>
                </button>
                <button className="text-red-500 hover:text-red-700" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/>
                  </svg>
                </button>
                <button className="text-purple-500 hover:text-purple-700" title="Receipt">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3h18v-3h-3V2ZM15 15H9v-1.5h6Zm0-3H9v-1.5h6Zm0-3H9V7.5h6Z"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-slate-600">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, financialData.length)} of {financialData.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
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
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Total Revenue</h3>
          <p className="text-2xl font-semibold text-green-600">{formatCurrency(3080.50)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
          <p className="text-2xl font-semibold text-red-600">{formatCurrency(-2879.99)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Current Balance</h3>
          <p className="text-2xl font-semibold text-blue-600">{formatCurrency(4420.49)}</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceTable;