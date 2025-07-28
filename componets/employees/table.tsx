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
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newEmployee, setNewEmployee] = useState<{
    user: User;
    role: string;
  }>({
    user: {
      id: 0,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
    },
    role: 'SALES',
  });

  const rowsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Employee[]>('https://uat.pythonanywhere.com/api/employees/');
      const data = res.data;
      setEmployees(data);
      setTotalPages(Math.ceil(data.length / rowsPerPage));
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://uat.pythonanywhere.com/api/employees/${id}/`);
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleUpdate = async (emp: Employee) => {
    try {
      await axios.put(`https://uat.pythonanywhere.com/api/employees/${emp.id}/`, {
        user: {
          username: emp.user.username,
          first_name: emp.user.first_name,
          last_name: emp.user.last_name,
          email: emp.user.email,
        },
        role: emp.role,
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
      if (!username || !first_name || !last_name || !email) {
        alert('All fields required');
        return;
      }

      await axios.post('https://uat.pythonanywhere.com/api/employees/', {
        user: {
          username,
          first_name,
          last_name,
          email,
        },
        role: newEmployee.role,
      });

      setIsCreateModalOpen(false);
      setNewEmployee({
        user: { id: 0, username: '', first_name: '', last_name: '', email: '' },
        role: 'SALES',
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

  const filteredEmployees = employees.filter(emp => {
    const matchesRole = selectedRole === 'ALL' || emp.role === selectedRole;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      emp.user.first_name.toLowerCase().includes(query) ||
      emp.user.last_name.toLowerCase().includes(query) ||
      emp.user.username.toLowerCase().includes(query) ||
      emp.user.email.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRole, searchQuery]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Employee
        </button>
      </div>

      {/* Filter and Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700 whitespace-nowrap">Filter by Role:</label>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Roles</option>
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map(emp => (
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
                      className="w-24 border border-gray-300 rounded px-2 py-1"
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
                      className="w-24 border border-gray-300 rounded px-2 py-1 ml-2"
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
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  emp.user.username
                )}
              </td>
              <td className="p-3">
                {editingEmployee?.id === emp.id ? (
                  <input
                    type="email"
                    value={editingEmployee.user.email}
                    onChange={e =>
                      setEditingEmployee({
                        ...editingEmployee,
                        user: { ...editingEmployee.user, email: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  emp.user.email
                )}
              </td>
              <td className="p-3">
                {editingEmployee?.id === emp.id ? (
                  <select
                    value={editingEmployee.role}
                    onChange={e =>
                      setEditingEmployee({ ...editingEmployee, role: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
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
                  <>
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                      onClick={() => handleUpdate(editingEmployee)}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
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
          Page {currentPage} of {Math.ceil(filteredEmployees.length / rowsPerPage)}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === Math.ceil(filteredEmployees.length / rowsPerPage)}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Create Modal */}
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
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              ))}

              <select
                value={newEmployee.role}
                onChange={e => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {Object.entries(ROLE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-red-700 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">
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
