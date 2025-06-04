import React from 'react';

const PayrollTable = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 5;

  const payrollData = [
    {
      id: 1,
      employee: 'John Smith',
      position: 'Software Engineer',
      salary: 8500.00,
      bonus: 1200.00,
      deductions: 450.00,
      netPay: 9250.00,
      status: 'Paid',
      paymentDate: '2023-06-30'
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      position: 'Marketing Manager',
      salary: 7200.00,
      bonus: 800.00,
      deductions: 380.00,
      netPay: 7620.00,
      status: 'Paid',
      paymentDate: '2023-06-30'
    },
    {
      id: 3,
      employee: 'Michael Brown',
      position: 'Sales Executive',
      salary: 6500.00,
      bonus: 1500.00,
      deductions: 320.00,
      netPay: 7680.00,
      status: 'Pending',
      paymentDate: '2023-07-05'
    },
    {
      id: 4,
      employee: 'Emily Davis',
      position: 'HR Specialist',
      salary: 5800.00,
      bonus: 500.00,
      deductions: 290.00,
      netPay: 6010.00,
      status: 'Paid',
      paymentDate: '2023-06-30'
    },
    {
      id: 5,
      employee: 'David Wilson',
      position: 'Accountant',
      salary: 6800.00,
      bonus: 600.00,
      deductions: 340.00,
      netPay: 7060.00,
      status: 'Paid',
      paymentDate: '2023-06-30'
    },
    {
      id: 6,
      employee: 'Jessica Lee',
      position: 'UX Designer',
      salary: 7500.00,
      bonus: 900.00,
      deductions: 375.00,
      netPay: 8025.00,
      status: 'Processing',
      paymentDate: '2023-07-05'
    },
    {
      id: 7,
      employee: 'Robert Taylor',
      position: 'Operations Manager',
      salary: 7800.00,
      bonus: 1000.00,
      deductions: 390.00,
      netPay: 8410.00,
      status: 'Paid',
      paymentDate: '2023-06-30'
    }
  ];

  const totalPages = Math.ceil(payrollData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = payrollData.slice(indexOfFirstRow, indexOfLastRow);

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
      Paid: 'bg-green-100 text-green-800',
      Processing: 'bg-blue-100 text-blue-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Payroll Management</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Run Payroll
          </button>
          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            Add Employee
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Employee</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Position</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Salary</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Bonus</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Deductions</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Net Pay</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Payment Date</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {currentRows.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-gray-50">
              <td className="p-4 text-slate-900 font-medium">{payroll.employee}</td>
              <td className="p-4 text-slate-600">{payroll.position}</td>
              <td className="p-4 text-slate-600">{formatCurrency(payroll.salary)}</td>
              <td className="p-4 text-green-600">{formatCurrency(payroll.bonus)}</td>
              <td className="p-4 text-red-600">{formatCurrency(payroll.deductions)}</td>
              <td className="p-4 text-slate-900 font-medium">{formatCurrency(payroll.netPay)}</td>
              <td className="p-4">{getStatusBadge(payroll.status)}</td>
              <td className="p-4 text-slate-600">{payroll.paymentDate}</td>
              <td className="p-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" title="View Payslip">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-1 3.5h-1v-1h1v1zm1.5 0h-1v-1h1v1zm1.5 0h-1v-1h1v1z"/>
                  </svg>
                </button>
                <button className="text-purple-500 hover:text-purple-700" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-slate-600">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, payrollData.length)} of {payrollData.length} entries
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
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Payroll</h3>
          <p className="text-2xl font-semibold text-blue-600">{formatCurrency(50100.00)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Total Bonuses</h3>
          <p className="text-2xl font-semibold text-green-600">{formatCurrency(6500.00)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Total Deductions</h3>
          <p className="text-2xl font-semibold text-red-600">{formatCurrency(2545.00)}</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollTable;