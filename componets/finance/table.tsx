import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Transaction {
  id: number;
  description: string;
  amount: number | string;
  module: string;
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
    } catch (err) {
      setError('Failed to load financial transactions.');
      console.error(err);
    } finally {
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

  const formatCurrency = (amount: number | string) =>
    new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(Number(amount));

  const getAmountColor = (amount: number | string) =>
    Number(amount) >= 0 ? 'text-green-600' : 'text-red-600';

  // ✅ Export to Excel
  const exportToExcel = () => {
    const data = financialData.map(transaction => ({
      Date: new Date(transaction.timestamp).toLocaleDateString(),
      Description: transaction.description,
      Module: transaction.module,
      Amount: Number(transaction.amount).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Transactions');

    XLSX.writeFile(workbook, 'financial_transactions.xlsx');
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Financial Transactions', 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [['Date', 'Description', 'Module', 'Amount']],
      body: financialData.map(t => [
        new Date(t.timestamp).toLocaleDateString(),
        t.description,
        t.module,
        Number(t.amount).toFixed(2),
      ]),
      theme: 'striped',
    });

    doc.save('financial_transactions.pdf');
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
          <button
            onClick={exportToExcel}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Export to PDF
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
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No financial transactions found.
              </td>
            </tr>
          ) : (
            currentRows.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="p-4 text-slate-600">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </td>
                <td className="p-4 text-slate-900 font-medium">{transaction.description}</td>
                <td className="p-4 text-slate-600">{transaction.module}</td>
                <td className={`p-4 font-medium ${getAmountColor(transaction.amount)}`}>
                  {formatCurrency(transaction.amount)}
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
