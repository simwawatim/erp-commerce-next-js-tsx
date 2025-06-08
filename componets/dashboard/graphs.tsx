import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const CorporateDashboard = () => {
  const [loading, setLoading] = useState(true);

  type RevenueDatum = { name: string; sales: number; services: number };
  type PayrollDatum = { name: string; value: number };
  type FinanceDatum = { name: string; revenue: number; expenses: number };

  const [revenueData, setRevenueData] = useState<RevenueDatum[]>([]);
  const [payrollData, setPayrollData] = useState<PayrollDatum[]>([]);
  const [financeData, setFinanceData] = useState<FinanceDatum[]>([]);

  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [totalProfit, setTotalProfit] = useState<number | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, expRes, profRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/financial/revenue/'),
          axios.get('http://127.0.0.1:8000/api/financial/expenses/'),
          axios.get('http://127.0.0.1:8000/api/financial/profit/')
        ]);

        setTotalRevenue(revRes.data.revenue);
        setTotalExpenses(expRes.data.expenses);
        setTotalProfit(profRes.data.profit);
      } catch (error) {
        console.error('Error fetching financial summary:', error);
      }

      // Simulate chart data loading (replace with real data if needed)
      setRevenueData([
        { name: 'Jan', sales: 4000, services: 2400 },
        { name: 'Feb', sales: 3000, services: 1398 },
        { name: 'Mar', sales: 2000, services: 9800 },
        { name: 'Apr', sales: 2780, services: 3908 },
        { name: 'May', sales: 1890, services: 4800 },
        { name: 'Jun', sales: 2390, services: 3800 },
      ]);

      setPayrollData([
        { name: 'IT', value: 35 },
        { name: 'Sales', value: 25 },
        { name: 'Marketing', value: 20 },
        { name: 'Operations', value: 20 },
      ]);

      setFinanceData([
        { name: 'Jan', revenue: 4000, expenses: 2400 },
        { name: 'Feb', revenue: 3000, expenses: 1398 },
        { name: 'Mar', revenue: 2000, expenses: 9800 },
        { name: 'Apr', revenue: 2780, expenses: 3908 },
        { name: 'May', revenue: 1890, expenses: 4800 },
        { name: 'Jun', revenue: 2390, expenses: 3800 },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const renderSkeletonCard = () => (
    <div className="bg-gray-100 animate-pulse p-4 rounded-lg shadow h-28"></div>
  );

  const renderSkeletonChart = () => (
    <div className="bg-gray-100 animate-pulse p-4 rounded-lg shadow h-[300px]"></div>
  );

  const formatKwacha = (value: number | null) =>
    value !== null
      ? new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', minimumFractionDigits: 0 }).format(value)
      : 'K0';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
          </>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-blue-800">Total Revenue</h3>
              <p className="text-2xl font-semibold text-blue-600">{formatKwacha(totalRevenue)}</p>
              <p className="text-green-600 text-sm mt-1">↑ 12% vs last quarter</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-green-800">Total Expenses</h3>
              <p className="text-2xl font-semibold text-green-600">{formatKwacha(totalExpenses)}</p>
              <p className="text-red-600 text-sm mt-1">↑ 5% vs last quarter</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-purple-800">Net Profit</h3>
              <p className="text-2xl font-semibold text-purple-600">{formatKwacha(totalProfit)}</p>
              <p className="text-green-600 text-sm mt-1">↑ 24% vs last quarter</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
        {loading ? (
          <>
            {renderSkeletonChart()}
            {renderSkeletonChart()}
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Revenue Streams</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Product Sales" />
                  <Bar dataKey="services" fill="#82ca9d" name="Services" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Payroll by Department</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={payrollData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {payrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {loading ? (
          <>
            {renderSkeletonChart()}
            {renderSkeletonChart()}
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#ff7300" fill="#ff7300" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Profit Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financeData.map(item => ({
                  ...item,
                  profit: item.revenue - item.expenses
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Net Profit" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CorporateDashboard;
