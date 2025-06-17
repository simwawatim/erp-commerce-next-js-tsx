import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface IUser {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface IEmployee {
  id: number;
  user: IUser;
  role: string;
  hourly_rate: string;
}

interface IPayroll {
  id: number;
  employee: IEmployee;
  bonus: string;
  deductions: string;
  net_pay: string;
  total_paid: string;
  status: string;
  pay_date: string;
}

interface IEmployeeOption {
  id: number;
  first_name: string;
  last_name: string;
}

const PayrollTable = () => {
  const [payrollData, setPayrollData] = useState<IPayroll[]>([]);
  const [employees, setEmployees] = useState<IEmployeeOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [bonus, setBonus] = useState('');
  const [deductions, setDeductions] = useState('');
  const [netPay, setNetPay] = useState('');
  const [totalPaid, setTotalPaid] = useState('');
  const [status, setStatus] = useState('Paid');
  const [payDate, setPayDate] = useState('');

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchPayrolls = () => {
    axios
      .get<IPayroll[]>('http://127.0.0.1:8000/api/payrolls/')
      .then((res) => setPayrollData(res.data))
      .catch((err) => console.error('Error fetching payroll:', err));
  };

  const fetchEmployees = () => {
    axios
      .get<IEmployeeOption[]>('http://127.0.0.1:8000/api/get-employee-by-name/')
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error('Error fetching employees:', err));
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Paid: 'bg-green-100 text-green-800',
      Processing: 'bg-blue-100 text-blue-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const totalPages = Math.ceil(payrollData.length / rowsPerPage);
  const currentRows = payrollData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleAddPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      employee_id: Number(employeeId),
      bonus: Number(bonus),
      deductions: Number(deductions),
      net_pay: Number(netPay),
      total_paid: Number(totalPaid),
      status,
      pay_date: payDate,
    };

    axios.post('http://127.0.0.1:8000/api/payrolls/', payload)
      .then(() => {
        fetchPayrolls();
        setIsModalOpen(false);
        setEmployeeId('');
        setBonus('');
        setDeductions('');
        setNetPay('');
        setTotalPaid('');
        setStatus('Paid');
        setPayDate('');
      })
      .catch((err) => alert('Error adding payroll: ' + err.message));
  };

  const handleDeletePayroll = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this payroll entry?')) return;

    axios.delete(`http://127.0.0.1:8000/api/payrolls/${id}/`)
      .then(() => fetchPayrolls())
      .catch((err) => alert('Error deleting payroll: ' + err.message));
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Payroll Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Payroll
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <h3 className="text-lg font-semibold mb-4">Add Payroll</h3>
            <form onSubmit={handleAddPayroll} className="space-y-4">

              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Bonus"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                step="0.01"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <input
                type="number"
                placeholder="Deductions"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                step="0.01"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <input
                type="number"
                placeholder="Net Pay"
                value={netPay}
                onChange={(e) => setNetPay(e.target.value)}
                step="0.01"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <input
                type="number"
                placeholder="Total Paid"
                value={totalPaid}
                onChange={(e) => setTotalPaid(e.target.value)}
                step="0.01"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              >
                <option value="Paid">Paid</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Employee</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Role</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Hourly Rate</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Bonus</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Deductions</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Net Pay</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Total Paid</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Pay Date</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-200">
              <td className="p-4">{item.employee.user.first_name} {item.employee.user.last_name}</td>
              <td className="p-4">{item.employee.role}</td>
              <td className="p-4">{formatCurrency(item.employee.hourly_rate)}</td>
              <td className="p-4 text-green-600">{formatCurrency(item.bonus)}</td>
              <td className="p-4 text-red-600">{formatCurrency(item.deductions)}</td>
              <td className="p-4 font-medium">{formatCurrency(item.net_pay)}</td>
              <td className="p-4">{formatCurrency(item.total_paid)}</td>
              <td className="p-4">{getStatusBadge(item.status)}</td>
              <td className="p-4 text-slate-600">{item.pay_date}</td>
              <td className="p-4">
                <button
                  onClick={() => handleDeletePayroll(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between text-sm">
        <div>
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, payrollData.length)} of {payrollData.length}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default PayrollTable;
