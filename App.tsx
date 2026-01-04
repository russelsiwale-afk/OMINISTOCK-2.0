
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calculator, 
  Settings, 
  MessageSquare, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { Product, Sale, Expense, BusinessSettings, UserRole } from './types';
import { INITIAL_PRODUCTS, INITIAL_EXPENSES, DEFAULT_SETTINGS } from './constants';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Accounting from './components/Accounting';
import AIAdvisor from './components/AIAdvisor';
import SettingsPanel from './components/SettingsPanel';

type Tab = 'dashboard' | 'inventory' | 'sales' | 'accounting' | 'ai' | 'settings';

const APP_LOGO = "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/omnistock-logo.png";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Persistent State Initialization
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('omnistock_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('omnistock_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('omnistock_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('omnistock_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [currentUser] = useState({ role: UserRole.ADMIN, name: 'Alex Admin' });

  // Persistence Syncing
  useEffect(() => {
    localStorage.setItem('omnistock_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omnistock_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('omnistock_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('omnistock_settings', JSON.stringify(settings));
  }, [settings]);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales (POS)', icon: ShoppingCart },
    { id: 'accounting', label: 'Accounting', icon: Calculator },
  ];

  const systemNavItems = [
    { id: 'ai', label: 'AI Advisor', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItemClass = (id: string) => `
    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
    ${activeTab === id 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50'}
  `;

  return (
    <div className={`min-h-screen flex ${settings.preferences.darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        fixed md:relative z-50 h-full flex flex-col transition-all duration-300 border-r border-slate-200 
        ${settings.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'}
      `}>
        <div className="p-4 flex items-center justify-between mb-4 flex-shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-xl p-1 shadow-sm">
                <img src={APP_LOGO} className="w-8 h-8 object-contain" alt="Omnistock Logo" />
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-700 via-blue-800 to-green-600 bg-clip-text text-transparent">Omnistock</span>
            </div>
          ) : (
            <img src={APP_LOGO} className="w-10 h-10 object-contain mx-auto" alt="Logo" />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 hidden md:block"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 flex flex-col no-scrollbar">
          <nav className="space-y-2">
            {mainNavItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={navItemClass(item.id)}>
                <item.icon size={22} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div className="flex-1 min-h-[60px]"></div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3 pb-6">
            {systemNavItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={navItemClass(item.id)}>
                <item.icon size={22} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className={`
            flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer
            ${!isSidebarOpen && 'justify-center'}
          `}>
            <img src="https://picsum.photos/40/40" className="rounded-full shadow-sm" alt="User" />
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{currentUser.name}</span>
                <span className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider truncate">{UserRole.ADMIN}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold">
            {activeTab === 'dashboard' && 'Business Intelligence'}
            {activeTab === 'inventory' && 'Inventory Control'}
            {activeTab === 'sales' && 'Point of Sale'}
            {activeTab === 'accounting' && 'Financial Ledger'}
            {activeTab === 'ai' && 'AI Business Advisor'}
            {activeTab === 'settings' && 'System Configuration'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full relative">
              <AlertCircle size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-medium">{settings.profile.name}</p>
              <p className="text-sm font-bold text-indigo-600">{settings.financial.currency} Active</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
          {activeTab === 'dashboard' && <Dashboard products={products} sales={sales} expenses={expenses} settings={settings} />}
          {activeTab === 'inventory' && <Inventory products={products} setProducts={setProducts} settings={settings} />}
          {activeTab === 'sales' && <Sales products={products} setProducts={setProducts} sales={sales} setSales={setSales} settings={settings} />}
          {activeTab === 'accounting' && <Accounting sales={sales} expenses={expenses} setExpenses={setExpenses} products={products} settings={settings} />}
          {activeTab === 'ai' && <AIAdvisor products={products} sales={sales} expenses={expenses} settings={settings} />}
          {activeTab === 'settings' && <SettingsPanel settings={settings} setSettings={setSettings} />}
        </div>
      </main>
    </div>
  );
};

export default App;
