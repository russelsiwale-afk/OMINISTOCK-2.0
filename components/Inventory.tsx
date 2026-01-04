
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Camera, Download, X, AlertCircle, AlertTriangle } from 'lucide-react';
import { Product, BusinessSettings } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: BusinessSettings;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', sku: '', category: '', costPrice: 0, sellingPrice: 0, quantity: 0, supplier: '', reorderThreshold: 5
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.name) {
      alert("Product name is required");
      return;
    }

    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name || 'Unnamed Product',
      sku: newProduct.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      category: newProduct.category || 'General',
      costPrice: Number(newProduct.costPrice) || 0,
      sellingPrice: Number(newProduct.sellingPrice) || 0,
      quantity: Number(newProduct.quantity) || 0,
      supplier: newProduct.supplier || 'Unknown Supplier',
      reorderThreshold: Number(newProduct.reorderThreshold) || 5,
      image: `https://picsum.photos/200/200?random=${Date.now()}`
    };
    
    setProducts(prev => [...prev, product]);
    setShowAddModal(false);
    setNewProduct({
      name: '', sku: '', category: '', costPrice: 0, sellingPrice: 0, quantity: 0, supplier: '', reorderThreshold: 5
    });
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Download size={18} />
            Export Data
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Pricing</th>
                <th className="px-6 py-5">Stock Status</th>
                <th className="px-6 py-5">Supplier</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Package size={80} />
                      <p className="font-black text-xl">Inventory empty</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group animate-in fade-in slide-in-from-left-4 duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white leading-tight">{product.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{settings.financial.currency} {product.sellingPrice}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cost: {product.costPrice}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <p className={`text-xs font-black ${product.quantity <= product.reorderThreshold ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {product.quantity} In Stock
                      </p>
                      <div className="w-24 bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${product.quantity <= product.reorderThreshold ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((product.quantity / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{product.supplier}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setProductToDelete(product.id)} 
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Delete Product?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                This action is permanent and will remove <span className="text-slate-900 dark:text-white">"{products.find(p => p.id === productToDelete)?.name}"</span> from all reports and stock lists.
              </p>
            </div>
            <div className="flex gap-4 p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-3xl transition-all"
              >
                Keep Item
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 font-black text-white bg-red-600 rounded-3xl shadow-xl shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 border border-slate-200 dark:border-slate-700 my-auto">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Register Product</h3>
                <p className="text-sm font-bold text-slate-500">Inventory Management System</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-700 rounded-2xl transition-all"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Display Name</label>
                <input 
                  autoFocus
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all placeholder:text-slate-400 placeholder:font-bold" 
                  value={newProduct.name || ''} 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Arabica Beans"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">SKU / Barcode ID</label>
                <div className="relative">
                  <input 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono font-bold transition-all" 
                    value={newProduct.sku || ''} 
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                    placeholder="SCAN-ID-000"
                  />
                  <Camera className="absolute right-5 top-4.5 text-slate-400" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Industry Category</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all placeholder:text-slate-400" 
                  value={newProduct.category || ''} 
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  placeholder="e.g. Beverages"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Starting Quantity</label>
                <input 
                  type="number"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all" 
                  value={newProduct.quantity || ''} 
                  onChange={e => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Acquisition Cost ({settings.financial.currency})</label>
                <input 
                  type="number"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all" 
                  value={newProduct.costPrice || ''} 
                  onChange={e => setNewProduct({...newProduct, costPrice: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Retail Price ({settings.financial.currency})</label>
                <input 
                  type="number"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all" 
                  value={newProduct.sellingPrice || ''} 
                  onChange={e => setNewProduct({...newProduct, sellingPrice: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="px-10 py-8 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setShowAddModal(false)} 
                className="px-8 py-4 text-slate-500 font-black hover:bg-slate-200 dark:hover:bg-slate-700 rounded-[32px] transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handleAddProduct} 
                className="px-12 py-4 bg-indigo-600 text-white font-black rounded-[32px] shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Plus size={24} />
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Package = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16.5 9.4 7.5 4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export default Inventory;
