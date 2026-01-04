
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { Product, Sale, Expense, BusinessSettings } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  settings: BusinessSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, expenses, settings }) => {
  // Stats Calculation
  const totalSales = useMemo(() => sales.reduce((acc, s) => acc + s.total, 0), [sales]);
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const grossProfit = useMemo(() => totalSales - (totalSales * 0.4), [totalSales]); // Mock COGS 40%
  const netProfit = grossProfit - totalExpenses;
  
  const lowStockCount = products.filter(p => p.quantity <= p.reorderThreshold).length;

  // Mock Sales Data for Chart
  const salesData = [
    { name: 'Mon', sales: 4000, profit: 2400 },
    { name: 'Tue', sales: 3000, profit: 1398 },
    { name: 'Wed', sales: 2000, profit: 9800 },
    { name: 'Thu', sales: 2780, profit: 3908 },
    { name: 'Fri', sales: 1890, profit: 4800 },
    { name: 'Sat', sales: 2390, profit: 3800 },
    { name: 'Sun', sales: 3490, profit: 4300 },
  ];

  const pieData = [
    { name: 'Coffee', value: 400 },
    { name: 'Milk', value: 300 },
    { name: 'Accessories', value: 300 },
    { name: 'Snacks', value: 200 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value={`${settings.financial.currency} ${totalSales.toLocaleString()}`} 
          trend="+12.5%" 
          isPositive={true}
          icon={<DollarSign className="text-indigo-600" />}
        />
        <StatCard 
          title="Net Profit" 
          value={`${settings.financial.currency} ${netProfit.toLocaleString()}`} 
          trend="-2.1%" 
          isPositive={false}
          icon={<TrendingUp className="text-emerald-600" />}
        />
        <StatCard 
          title="Total Orders" 
          value={sales.length.toString()} 
          trend="+8.4%" 
          isPositive={true}
          icon={<ShoppingCart className="text-amber-600" />}
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockCount.toString()} 
          trend={lowStockCount > 0 ? "Alert" : "Clean"} 
          isPositive={lowStockCount === 0}
          icon={<AlertTriangle className={lowStockCount > 0 ? "text-red-600" : "text-slate-400"} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Sales Revenue Trend</h3>
            <select className="text-sm bg-slate-50 dark:bg-slate-700 border-none rounded-lg px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Sales by Category</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-xs text-slate-500">Units</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-lg">Top Performing Products</h3>
          <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Units Sold</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.slice(0, 4).map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.category}</td>
                  <td className="px-6 py-4 text-sm">{(450 - i * 80)}</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {settings.financial.currency} {((450 - i * 80) * p.sellingPrice).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <TrendingUp size={12} className="mr-1" /> +{(15 - i * 2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive, icon }: any) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold mb-2">{value}</h4>
      <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {trend}
      </div>
    </div>
    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
      {icon}
    </div>
  </div>
);

export default Dashboard;
