import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: false },
  },
};

type EmployeeSummary = {
  totals: Record<string, number>;
  graph: { labels: string[]; counts: number[] };
};

type SalesSummary = {
  total_sales: number;
  total_orders: number;
  pending_orders: number;
  monthly_sales: {
    labels: string[];
    data: number[];
  };
};

type FinanceSummary = {
  total_income: number;
  total_expense: number;
  monthly_data: {
    labels: string[];
    income: number[];
    expense: number[];
  };
};

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);

  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary | null>(null);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole ? storedRole.toUpperCase() : null);
  }, []);

  useEffect(() => {
    // Only fetch data if role exists and is valid
    if (role && ["ADMIN", "HR", "SALES", "FINANCE"].includes(role)) {
      fetch("http://127.0.0.1:8000/api/employee-summary/")
        .then((res) => res.json())
        .then(setEmployeeSummary)
        .catch((err) => console.error("Failed to fetch employee summary:", err));

      fetch("http://127.0.0.1:8000/api/sales-summary/")
        .then((res) => res.json())
        .then(setSalesSummary)
        .catch((err) => console.error("Failed to fetch sales summary:", err));

      fetch("http://127.0.0.1:8000/api/finance-summary/")
        .then((res) => res.json())
        .then(setFinanceSummary)
        .catch((err) => console.error("Failed to fetch finance summary:", err));
    }
  }, [role]);

  if (role === null) {
    return <div className="p-6">Checking user role...</div>;
  }

  if (!["ADMIN", "HR", "SALES", "FINANCE"].includes(role)) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p>You do not have permission to view this dashboard.</p>
      </div>
    );
  }

  // Wait for data to load
  if (!employeeSummary || !salesSummary || !financeSummary) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  // Destructure summaries for easier use
  const { totals, graph } = employeeSummary;
  const { total_sales, total_orders, pending_orders, monthly_sales } = salesSummary;
  const { total_income, total_expense, monthly_data } = financeSummary;

  // Employee Chart data
  const employeeBarData = {
    labels: graph.labels,
    datasets: [
      {
        label: "Employees by Role",
        data: graph.counts,
        backgroundColor: [
          "rgba(37,99,235,0.6)",   // Blue
          "rgba(220,38,38,0.6)",   // Red
          "rgba(34,197,94,0.6)",   // Green
          "rgba(234,179,8,0.6)",   // Yellow
          "rgba(129,140,248,0.6)", // Indigo
          "rgba(168,85,247,0.6)",  // Purple
        ],
      },
    ],
  };

  const salesBarData = {
    labels: monthly_sales.labels,
    datasets: [
      {
        label: "Total Sales (K)",
        data: monthly_sales.data,
        backgroundColor: "rgba(37,99,235,0.6)",
      },
    ],
  };

  const financeBarData = {
    labels: monthly_data.labels,
    datasets: [
      {
        label: "Income (K)",
        data: monthly_data.income,
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Expense (K)",
        data: monthly_data.expense,
        backgroundColor: "rgba(220,38,38,0.6)",
      },
    ],
  };

  // Role based render helpers
  const showEmployee = role === "ADMIN" || role === "HR";
  const showSalesFinance = role === "ADMIN" || role === "SALES" || role === "FINANCE";

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 flex flex-col p-6 space-y-6">

        {/* Employee Section */}
        {showEmployee && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {role === "ADMIN" || role === "HR" ? (
                <>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Sales Employees</p>
                    <h2 className="text-2xl font-bold text-blue-600">{totals["SALES"] || 0}</h2>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Finance Employees</p>
                    <h2 className="text-2xl font-bold text-red-600">{totals["FINANCE"] || 0}</h2>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">HR Employees</p>
                    <h2 className="text-2xl font-bold text-green-600">{totals["HR"] || 0}</h2>
                  </div>
                </>
              ) : null}
            </div>

            <div className="bg-white p-6 rounded-xl shadow" style={{ height: 300 }}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Employee Distribution by Role</h3>
              <Bar options={options} data={employeeBarData} />
            </div>
          </>
        )}

        {/* Sales & Finance Section */}
        {showSalesFinance && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {role === "ADMIN" || role === "SALES" ? (
                <>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Total Sales</p>
                    <h2 className="text-2xl font-bold text-blue-600">K{total_sales.toLocaleString()}</h2>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Orders</p>
                    <h2 className="text-2xl font-bold text-blue-600">{total_orders.toLocaleString()}</h2>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Pending</p>
                    <h2 className="text-2xl font-bold text-yellow-600">{pending_orders.toLocaleString()}</h2>
                  </div>
                </>
              ) : null}

              {role === "ADMIN" || role === "FINANCE" ? (
                <>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Total Income</p>
                    <h2 className="text-2xl font-bold text-green-600">K{total_income.toLocaleString()}</h2>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Total Expense</p>
                    <h2 className="text-2xl font-bold text-red-600">K{total_expense.toLocaleString()}</h2>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                    <p className="text-gray-500">Net Profit</p>
                    <h2 className="text-2xl font-bold text-purple-600">K{(total_income - total_expense).toLocaleString()}</h2>
                  </div>
                </>
              ) : null}
            </div>

            {role === "ADMIN" || role === "SALES" ? (
              <div className="bg-white p-6 rounded-xl shadow" style={{ height: 220 }}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Monthly Overview</h3>
                <Bar options={options} data={salesBarData} />
              </div>
            ) : null}

            {role === "ADMIN" || role === "FINANCE" ? (
              <div className="bg-white p-6 rounded-xl shadow" style={{ height: 220 }}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Finance Monthly Overview</h3>
                <Bar options={options} data={financeBarData} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
