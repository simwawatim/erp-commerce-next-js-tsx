"use client";

import React, { useState, useEffect } from "react";
import {
  Employee,
  CreateEmployeePayload,
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/services/employees/employees";

const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState<CreateEmployeePayload>({
    role: "USER",
    hourly_rate: "",
    user: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await fetchEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in formData) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
        },
      }));
    }
  };

  const handleAddEmployee = () => {
    setFormData({
      role: "USER",
      hourly_rate: "",
      user: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
      },
    });
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      role: employee.role,
      hourly_rate: employee.hourly_rate,
      user: {
        username: employee.user.username,
        email: employee.user.email,
        first_name: employee.user.first_name,
        last_name: employee.user.last_name,
      },
    });
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEmployee = await createEmployee(formData);
      setEmployees([...employees, newEmployee]);
      setShowAddModal(false);
    } catch (err) {
      setError("Failed to create employee");
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;

    try {
      const updatedEmployee = await updateEmployee(currentEmployee.id, formData);
      const updatedEmployees = employees.map((emp) =>
        emp.id === currentEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update employee");
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentEmployee) return;

    try {
      await deleteEmployee(currentEmployee.id);
      setEmployees(employees.filter((emp) => emp.id !== currentEmployee.id));
      setShowDeleteModal(false);
      if (currentRows.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError("Failed to delete employee");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Hourly Rate</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((employee) => (
              <tr key={employee.id} className="border-t">
                <td className="p-4">{employee.user.username}</td>
                <td className="p-4">{employee.user.email}</td>
                <td className="p-4">
                  {employee.user.first_name} {employee.user.last_name}
                </td>
                <td className="p-4">{employee.role}</td>
                <td className="p-4">${employee.hourly_rate}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <p className="text-gray-600">
            Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, employees.length)} of {employees.length}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {["username", "email", "first_name", "last_name"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData.user[field as keyof typeof formData.user]}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input
                  type="text"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TODO: Add modals for Edit and Delete as needed */}
    </div>
  );
};

export default EmployeesTable;
