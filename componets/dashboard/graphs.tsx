import React from "react";
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
import { DollarSign, Users, Ban } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const hrData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Employees",
      data: [50, 52, 55, 54, 56],
      backgroundColor: "rgba(34,197,94,0.6)", // green
    },
  ],
};

const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Total Sales ($)",
      data: [30000, 35000, 40000, 42000, 45200],
      backgroundColor: "rgba(37,99,235,0.6)", // blue
    },
  ],
};

const financeData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Profit ($)",
      data: [20000, 22000, 25000, 28000, 31300],
      backgroundColor: "rgba(220,38,38,0.6)", // red
    },
    {
      label: "Expenses ($)",
      data: [10000, 11000, 12000, 13000, 13900],
      backgroundColor: "rgba(244,63,94,0.6)", // lighter red
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1 flex flex-col">

        {/* HR Section */}
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Employees</p>
              <h2 className="text-2xl font-bold text-green-600">56</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">On Leave</p>
              <h2 className="text-2xl font-bold text-yellow-600">3</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">New Hires</p>
              <h2 className="text-2xl font-bold text-green-600">5</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow" style={{ height: 220 }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">HR Monthly Overview</h3>
            <Bar options={options} data={hrData} />
          </div>
        </main>

        {/* Sales Section */}
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Total Sales</p>
              <h2 className="text-2xl font-bold text-blue-600">$45,200</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Orders</p>
              <h2 className="text-2xl font-bold text-blue-600">320</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-2xl font-bold text-yellow-600">14</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow" style={{ height: 220 }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Monthly Overview</h3>
            <Bar options={options} data={salesData} />
          </div>
        </main>

        {/* Finance Section */}
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Expenses</p>
              <h2 className="text-2xl font-bold text-red-600">$13,900</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Profit</p>
              <h2 className="text-2xl font-bold text-green-600">$31,300</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-gray-500">Budget Left</p>
              <h2 className="text-2xl font-bold text-purple-600">$10,000</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow" style={{ height: 220 }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Finance Monthly Overview</h3>
            <Bar options={options} data={financeData} />
          </div>
        </main>

      </div>
    </div>
  );
}
