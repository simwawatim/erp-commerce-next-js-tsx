import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  module: string; // assuming this maps to your "category"
  timestamp: string;
}

const FinanceTable = () => {
  const [financialData, setFinancialData] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;

  const fetchFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Transaction[]>('http://127.0.0.1:8000/api/financial-transactions/');
      setFinancialData(response.data);
    } 
    catch (err) {
      setError('Failed to load financial transactions.');
      console.error(err);
    }
    
    finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const totalPages = Math.ceil(financialData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = financialData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(amount);

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      Completed: 'bg-green-100 text-green-800',
      Processed: 'bg-blue-100 text-blue-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          statusClasses[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const getAmountColor = (amount: number) => (amount >= 0 ? 'text-green-600' : 'text-red-600');
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/financial-transactions/${id}/`);
      fetchFinancialData();
    } catch (err) {
      alert('Failed to delete transaction.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="overflow-x-auto p-4 bg-white rounded shadow">
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
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Module</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Amount</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No financial transactions found.
              </td>
            </tr>
          ) : (
            currentRows.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="p-4 text-slate-600">{new Date(transaction.timestamp).toLocaleDateString()}</td>
                <td className="p-4 text-slate-900 font-medium">{transaction.description}</td>
                <td className="p-4 text-slate-600">{transaction.module}</td>
                <td className={`p-4 font-medium ${getAmountColor(transaction.amount)}`}>
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
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
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
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
    </div>
  );
};

export default FinanceTable;
