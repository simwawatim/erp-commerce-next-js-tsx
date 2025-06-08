import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Employee {
  id: number;
  user: User;
  role: string;
  hourly_rate: number | string | null;
}

const ROLE_LABELS: Record<string, string> = {
  MANUFACTURING: 'Manufacturing Staff',
  SERVICE: 'Service Staff',
  HR: 'HR',
  FINANCE: 'Finance',
  SALES: 'Sales',
  ADMIN: 'Administrator',
};

const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newEmployee, setNewEmployee] = useState<{
    user: User;
    role: string;
    hourly_rate: string;
  }>({
    user: {
      id: 0,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
    },
    role: 'SALES',
    hourly_rate: '0',
  });

  const rowsPerPage = 1;

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Employee[]>('http://127.0.0.1:8000/api/employees/');
      const data = res.data;
      const startIndex = (currentPage - 1) * rowsPerPage;
      setEmployees(data.slice(startIndex, startIndex + rowsPerPage));
      setTotalPages(Math.ceil(data.length / rowsPerPage));
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`);
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleUpdate = async (emp: Employee) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/employees/${emp.id}/`, {
        user: {
          username: emp.user.username,
          first_name: emp.user.first_name,
          last_name: emp.user.last_name,
          email: emp.user.email,
        },
        role: emp.role,
        hourly_rate: emp.hourly_rate,
      });
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleCreate = async () => {
    try {
      const { username, first_name, last_name, email } = newEmployee.user;
      if (!username || !first_name || !last_name || !email || !newEmployee.hourly_rate) {
        alert('All fields required');
        return;
      }

      await axios.post('http://127.0.0.1:8000/api/employees/', {
        user: {
          username,
          first_name,
          last_name,
          email,
        },
        role: newEmployee.role,
        hourly_rate: newEmployee.hourly_rate,
      });

      setIsCreateModalOpen(false);
      setNewEmployee({
        user: { id: 0, username: '', first_name: '', last_name: '', email: '' },
        role: 'SALES',
        hourly_rate: '0',
      });
      fetchEmployees();
    } catch (err) {
      console.error('Create failed', err);
      alert('Creation failed');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Employee
        </button>
      </div>

      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Username</th>
            <th className="p-3">Role</th>
            <th className="p-3 text-right">Hourly Rate</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="p-3">
                {editingEmployee?.id === emp.id ? (
                  <>
                    <input
                      type="text"
                      value={editingEmployee.user.first_name}
                      onChange={e =>
                        setEditingEmployee({
                          ...editingEmployee,
                          user: { ...editingEmployee.user, first_name: e.target.value },
                        })
                      }
                      className="w-24 mr-1 border rounded px-1"
                    />
                    <input
                      type="text"
                      value={editingEmployee.user.last_name}
                      onChange={e =>
                        setEditingEmployee({
                          ...editingEmployee,
                          user: { ...editingEmployee.user, last_name: e.target.value },
                        })
                      }
                      className="w-24 border rounded px-1"
                    />
                  </>
                ) : (
                  `${emp.user.first_name} ${emp.user.last_name}`
                )}
              </td>
              <td className="p-3">
                {editingEmployee?.id === emp.id ? (
                  <input
                    type="text"
                    value={editingEmployee.user.username}
                    onChange={e =>
                      setEditingEmployee({
                        ...editingEmployee,
                        user: { ...editingEmployee.user, username: e.target.value },
                      })
                    }
                    className="w-full border rounded px-1"
                  />
                ) : (
                  emp.user.username
                )}
              </td>
              <td className="p-3">
                {editingEmployee?.id === emp.id ? (
                  <select
                    value={editingEmployee.role}
                    onChange={e => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  ROLE_LABELS[emp.role]
                )}
              </td>
              <td className="p-3 text-right">
                {editingEmployee?.id === emp.id ? (
                  <input
                    type="number"
                    value={editingEmployee.hourly_rate ?? ''}
                    onChange={e =>
                      setEditingEmployee({ ...editingEmployee, hourly_rate: e.target.value })
                    }
                    className="w-24 text-right border rounded px-2 py-1"
                  />
                ) : emp.hourly_rate !== null ? (
                  `K${emp.hourly_rate}`
                ) : (
                  '—'
                )}
              </td>
              <td className="p-3 text-right">
                {editingEmployee?.id === emp.id ? (
                  <>
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                      onClick={() => handleUpdate(editingEmployee)}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-300 rounded"
                      onClick={() => setEditingEmployee(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-3 py-1 bg-yellow-400 rounded mr-2"
                      onClick={() => setEditingEmployee(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal for creation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg min-h-[600px] overflow-y-auto">
          <div className="space-y-6 max-w-md mx-auto">
            {['username', 'first_name', 'last_name', 'email'].map(field => (
              <input
                key={field}
                type={field === 'email' ? 'email' : 'text'}
                placeholder={field.replace('_', ' ').toUpperCase()}
                value={(newEmployee.user as any)[field]}
                onChange={e =>
                  setNewEmployee(prev => ({
                    ...prev,
                    user: { ...prev.user, [field]: e.target.value },
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
            ))}

            <select
              value={newEmployee.role}
              onChange={e => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
            >
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Hourly Rate"
              value={newEmployee.hourly_rate}
              onChange={e =>
                setNewEmployee(prev => ({ ...prev, hourly_rate: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
            />

            <div className="flex justify-end space-x-3">
             <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-red-700 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesTable;
