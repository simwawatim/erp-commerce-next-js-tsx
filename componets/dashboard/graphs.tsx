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

export default function Dashboard() {
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary | null>(null);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/employee-summary/")
      .then((res) => res.json())
      .then(setEmployeeSummary)
      .catch((err) => console.error("Failed to fetch employee summary:", err));

    fetch("http://127.0.0.1:8000/api/sales-summary/")
      .then((res) => res.json())
      .then(setSalesSummary)
      .catch((err) => console.error("Failed to fetch sales summary:", err));
  }, []);

  if (!employeeSummary || !salesSummary) {
    return <div className="p-6">Loading...</div>;
  }

  // Employee data
  const { totals, graph } = employeeSummary;
  const totalSalesEmployees = totals["SALES"] || 0;
  const totalFinanceEmployees = totals["FINANCE"] || 0;
  const totalHREmployees = totals["HR"] || 0;

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

  // Sales data
  const { total_sales, total_orders, pending_orders, monthly_sales } = salesSummary;
  const salesBarData = {
    labels: monthly_sales.labels,
    datasets: [
      {
        label: "Total Sales ($)",
        data: monthly_sales.data,
        backgroundColor: "rgba(37,99,235,0.6)",
      },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 flex flex-col p-6 space-y-6">

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Sales Employees</p>
            <h2 className="text-2xl font-bold text-blue-600">{totalSalesEmployees}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Finance Employees</p>
            <h2 className="text-2xl font-bold text-red-600">{totalFinanceEmployees}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">HR Employees</p>
            <h2 className="text-2xl font-bold text-green-600">{totalHREmployees}</h2>
          </div>
        </div>

        {/* Employee Chart */}
        <div className="bg-white p-6 rounded-xl shadow" style={{ height: 300 }}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Employee Distribution by Role</h3>
          <Bar options={options} data={employeeBarData} />
        </div>

        {/* Sales Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Total Sales</p>
            <h2 className="text-2xl font-bold text-blue-600">${total_sales.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Orders</p>
            <h2 className="text-2xl font-bold text-blue-600">{total_orders.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-600">{pending_orders.toLocaleString()}</h2>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow" style={{ height: 220 }}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Monthly Overview</h3>
          <Bar options={options} data={salesBarData} />
        </div>
      </div>
    </div>
  );
}
