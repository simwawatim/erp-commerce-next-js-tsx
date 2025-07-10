import React, { useEffect, useState } from 'react';
import {
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

interface BarChartData {
  name: string;
  sales: number;
}

const ProductSalesSection = () => {
  const [data, setData] = useState<{
    cards: CardData[];
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
    <div className="max-w-7xl mx-auto p-6 mb-12">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Products & Sales Overview</h2>

      {/* Two cards side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {data.cards.slice(0, 2).map(({ label, value }) => {
          // Safe label for URL
          const safeLabel = encodeURIComponent(label.trim() || 'Label');

          return (
            <div
              key={label}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">{label}</h3>
              <p className="text-5xl font-bold text-indigo-600">{value}</p>
              <div className="mt-5 w-full h-40 rounded-lg overflow-hidden">
                <img
                  src={`https://via.placeholder.com/400x200?text=${safeLabel}`}
                  alt={label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // fallback if image fails to load
                    (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-width bar chart */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Quarterly Sales</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.barChart}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontWeight: '600' }} />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: '#6b7280', fontWeight: '600' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px', borderColor: '#d1d5db' }}
              labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            />
            <Bar dataKey="sales" fill={COLORS[0]} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductSalesSection;
