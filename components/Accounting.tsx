
import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownLeft, Filter, Plus, X } from 'lucide-react';
import { Sale, Expense, Product, BusinessSettings } from '../types';

interface AccountingProps {
  sales: Sale[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  products: Product[];
  settings: BusinessSettings;
}

const Accounting: React.FC<AccountingProps> = ({ sales, expenses, setExpenses, products, settings }) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' });

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const grossProfit = totalRevenue - (totalRevenue * 0.4); // 40% COGS mock
  const netProfit = grossProfit - totalExpenses;

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;
    const exp: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      category: newExpense.category,
      amount: Number(newExpense.amount),
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([exp, ...expenses]);
    setShowAddExpense(false);
    setNewExpense({ category: '', amount: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="text-indigo-600" />
            </div>
            <span className="text-slate-500 font-medium">Total Revenue</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{settings.financial.currency} {totalRevenue.toLocaleString()}</h2>
          <p className="text-emerald-500 text-xs font-bold mt-2">+15% from last month</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <ArrowDownLeft className="text-red-600" />
            </div>
            <span className="text-slate-500 font-medium">Total Expenses</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{settings.financial.currency} {totalExpenses.toLocaleString()}</h2>
          <p className="text-slate-400 text-xs font-bold mt-2">Consistent spending</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-200 dark:shadow-none text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" />
            </div>
            <span className="text-indigo-100 font-medium">Net Profit</span>
          </div>
          <h2 className="text-3xl font-black">{settings.financial.currency} {netProfit.toLocaleString()}</h2>
          <p className="text-indigo-200 text-xs font-bold mt-2">Profitable this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Sales</h3>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl"><Filter size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {sales.length === 0 ? (
                <div className="p-10 text-center text-slate-400">No sales recorded yet</div>
              ) : sales.map(sale => (
                <div key={sale.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Sale: {sale.id}</p>
                      <p className="text-xs text-slate-500 font-semibold">{new Date(sale.timestamp).toLocaleDateString()} • {sale.paymentMethod}</p>
                    </div>
                  </div>
                  <p className="font-black text-emerald-600">+{settings.financial.currency} {sale.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expenses Tracker */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Expense Records</h3>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Plus size={14} /> Add New Entry
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {expenses.length === 0 ? (
                <div className="p-10 text-center text-slate-400">No expenses logged.</div>
              ) : expenses.map(exp => (
                <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center">
                      <ArrowDownLeft size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{exp.category}</p>
                      <p className="text-xs text-slate-500 font-semibold">{exp.description}</p>
                    </div>
                  </div>
                  <p className="font-black text-red-600">-{settings.financial.currency} {exp.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Record Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                <input 
                  autoFocus
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-all placeholder:text-slate-400"
                  placeholder="e.g. Utility Bills, Wages"
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Transaction Amount ({settings.financial.currency})</label>
                <input 
                  type="number"
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all placeholder:text-slate-400"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-semibold h-28 resize-none transition-all placeholder:text-slate-400"
                  placeholder="What was this expenditure for?"
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3 border-t border-slate-100 dark:border-slate-700">
              <button onClick={() => setShowAddExpense(false)} className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all">Discard</button>
              <button onClick={handleAddExpense} className="flex-1 py-4 font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">Submit Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
