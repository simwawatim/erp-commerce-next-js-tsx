import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const dummyData = {
  HR: {
    cards: [
      { label: 'Total Employees', value: 150 },
      { label: 'Active Employees', value: 120 },
      { label: 'On Leave', value: 30 },
    ],
    pieChart: [
      { name: 'Managers', value: 10 },
      { name: 'Recruiters', value: 20 },
      { name: 'Interns', value: 5 },
    ],
    barChart: [
      { name: 'Q1', hires: 5 },
      { name: 'Q2', hires: 10 },
      { name: 'Q3', hires: 7 },
      { name: 'Q4', hires: 3 },
    ],
  },
  Finance: {
    cards: [
      { label: 'Total Budget', value: 500000 },
      { label: 'Expenses', value: 320000 },
      { label: 'Remaining', value: 180000 },
    ],
    pieChart: [
      { name: 'Payroll', value: 200000 },
      { name: 'Operations', value: 80000 },
      { name: 'Compliance', value: 40000 },
    ],
    barChart: [
      { name: 'Q1', expense: 120000 },
      { name: 'Q2', expense: 100000 },
      { name: 'Q3', expense: 70000 },
      { name: 'Q4', expense: 30000 },
    ],
  },
  Sales: {
    cards: [
      { label: 'Total Sales', value: 1000000 },
      { label: 'Targets Achieved', value: 800000 },
      { label: 'Pending Deals', value: 200000 },
    ],
    pieChart: [
      { name: 'Retail', value: 400000 },
      { name: 'Wholesale', value: 300000 },
      { name: 'Online', value: 300000 },
    ],
    barChart: [
      { name: 'Q1', sales: 200000 },
      { name: 'Q2', sales: 250000 },
      { name: 'Q3', sales: 300000 },
      { name: 'Q4', sales: 250000 },
    ],
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    minimumFractionDigits: 0,
  }).format(value);

const RoleSection = ({ role, color }: { role: keyof typeof dummyData; color: string }) => {
  const roleData = dummyData[role];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{role} Overview</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {roleData.cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl shadow bg-gradient-to-br from-${color}-100 to-${color}-200 text-${color}-900`}
          >
            <h4 className="text-sm font-semibold">{card.label}</h4>
            <p className="text-2xl font-bold mt-1">
              {card.label.includes('Sales') || card.label.includes('Budget') || card.label.includes('Expenses') || card.label.includes('Remaining')
                ? formatCurrency(card.value)
                : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{role} Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData.pieChart}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {roleData.pieChart.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{role} Quarterly Data</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={roleData.barChart}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={Object.keys(roleData.barChart[0]).find((k) => k !== 'name')!}
                fill={COLORS[0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CorporateDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Corporate Dashboard</h1>

      <RoleSection role="HR" color="blue" />
      <RoleSection role="Finance" color="green" />
      <RoleSection role="Sales" color="purple" />
    </div>
  );
};

export default CorporateDashboard;
