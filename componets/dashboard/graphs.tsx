import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    minimumFractionDigits: 0,
  }).format(value);

interface CardData {
  label: string;
  value: number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface BarChartData {
  name: string;
  sales: number;
}

const ProductSalesSection = () => {
  const [data, setData] = useState<{
    cards: CardData[];
    pieChart: PieChartData[];
    barChart: BarChartData[];
  } | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/product-sales-summary/')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="mb-12 p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Products & Sales Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">{data.cards[0].label}</h3>
          <p className="text-4xl font-bold text-gray-900 mb-4">{data.cards[0].value}</p>
          <img
            className="w-full h-40 object-cover rounded"
            src={`https://via.placeholder.com/400x200?text=${encodeURIComponent(data.cards[0].label)}`}
            alt={data.cards[0].label}
          />
        </div>

        {/* Card 2: Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.pieChart}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.pieChart.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Card 3: Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Quarterly Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data.barChart}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="sales" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductSalesSection;
