
import React, { useState, useMemo, useRef } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Smartphone, Receipt, CheckCircle2, Plus, Minus, Scan, ChevronRight, X } from 'lucide-react';
import { Product, Sale, SaleItem, PaymentMethod, BusinessSettings, MobileProvider } from '../types';

interface SalesProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  settings: BusinessSettings;
}

const Sales: React.FC<SalesProps> = ({ products, setProducts, sales, setSales, settings }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skuInput, setSkuInput] = useState('');
  const [qtyInput, setQtyInput] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const skuRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product, qty: number = 1) => {
    if (product.quantity <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        const newQty = existing.quantity + qty;
        return prev.map(item => item.productId === product.id 
          ? { ...item, quantity: newQty, total: newQty * item.price }
          : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        quantity: qty, 
        price: product.sellingPrice,
        total: product.sellingPrice * qty
      }];
    });
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.sku.toLowerCase() === skuInput.toLowerCase());
    if (product) {
      addToCart(product, qtyInput);
      setSkuInput('');
      setQtyInput(1); // Reset to 1 after add
    } else {
      skuRef.current?.classList.add('ring-red-500', 'ring-2');
      setTimeout(() => skuRef.current?.classList.remove('ring-red-500', 'ring-2'), 500);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const setManualQuantity = (productId: string, qty: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, qty);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * (settings.financial.taxRate / 100);
  const total = subtotal + tax;

  const handleCheckout = (method: PaymentMethod, provider?: MobileProvider) => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    setMobileMenuOpen(false);
    
    setTimeout(() => {
      const newSale: Sale = {
        id: `INV-${Date.now()}`,
        timestamp: new Date().toISOString(),
        items: [...cart],
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod: method,
        mobileProvider: provider,
        staffId: 'staff-01'
      };

      setSales([newSale, ...sales]);
      
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(item => item.productId === p.id);
        if (cartItem) {
          return { ...p, quantity: p.quantity - cartItem.quantity };
        }
        return p;
      }));

      setCart([]);
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
      
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-semibold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all
                  ${selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start overflow-y-auto no-scrollbar max-h-[70vh]">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.quantity <= 0}
              className={`p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:shadow-lg transition-all active:scale-95 flex flex-col gap-2 relative group
                ${product.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="overflow-hidden rounded-xl">
                <img src={product.image} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              </div>
              <div>
                <p className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-indigo-600 font-black">{settings.financial.currency} {product.sellingPrice}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${product.quantity <= 5 ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {product.quantity} left
                  </span>
                </div>
              </div>
              {product.quantity <= 0 && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-red-600 uppercase shadow-xl">Out of Stock</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-[420px] flex flex-col gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        {showSuccess && (
          <div className="absolute inset-0 z-50 bg-indigo-600 flex flex-col items-center justify-center text-white animate-in slide-in-from-top duration-500">
            <CheckCircle2 size={84} className="mb-4 animate-bounce" />
            <h3 className="text-3xl font-black">Transaction Saved!</h3>
            <p className="text-indigo-100 font-bold">Inventory levels adjusted.</p>
          </div>
        )}

        {/* Mobile Money Sub-menu */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-[60] bg-slate-900/90 backdrop-blur-md flex flex-col p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black text-white">Select Provider</h4>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><X size={28} /></button>
            </div>
            <div className="space-y-4">
              {[
                { id: MobileProvider.AIRTEL, color: 'bg-red-600', label: 'Airtel Money' },
                { id: MobileProvider.MTN, color: 'bg-amber-400 text-slate-900', label: 'MTN Mobile Money' },
                { id: MobileProvider.ZAMTEL, color: 'bg-emerald-600', label: 'Zamtel Kwacha' }
              ].map(provider => (
                <button
                  key={provider.id}
                  onClick={() => handleCheckout(PaymentMethod.MOBILE_MONEY, provider.id)}
                  className={`w-full p-6 ${provider.color} rounded-3xl flex items-center justify-between font-black text-lg shadow-xl active:scale-95 transition-all`}
                >
                  {provider.label}
                  <ChevronRight size={24} />
                </button>
              ))}
            </div>
            <p className="mt-auto text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Total: {settings.financial.currency} {total.toFixed(2)}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <ShoppingCart className="text-indigo-600" />
            Current Order
          </h3>
          <button onClick={() => setCart([])} className="text-xs font-black text-red-500 hover:underline px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg">Reset Cart</button>
        </div>

        {/* Quick Add Bar with Quantity Multiplier */}
        <form onSubmit={handleQuickAdd} className="mt-2 flex gap-2">
          <div className="w-20">
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Qty</label>
            <input 
              type="number"
              min="1"
              className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-black text-center transition-all"
              value={qtyInput}
              onChange={e => setQtyInput(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Product SKU / Barcode</label>
            <div className="relative group">
              <Scan className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                ref={skuRef}
                type="text"
                placeholder="Scan or type..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-all placeholder:text-slate-400"
                value={skuInput}
                onChange={e => setSkuInput(e.target.value)}
              />
            </div>
          </div>
        </form>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2 mt-4 no-scrollbar min-h-0">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-30">
              <div className="p-8 bg-slate-100 dark:bg-slate-700 rounded-full">
                <ShoppingCart size={64} />
              </div>
              <p className="font-black text-lg">Order is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="group flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all animate-in slide-in-from-right duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={products.find(p => p.id === item.productId)?.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Unit: {settings.financial.currency} {item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input 
                      type="number"
                      className="w-16 text-center bg-transparent border-none outline-none font-black text-sm text-slate-900 dark:text-white"
                      value={item.quantity}
                      onChange={e => setManualQuantity(item.productId, parseInt(e.target.value) || 0)}
                    />
                    <button 
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-black text-lg text-slate-900 dark:text-white">{settings.financial.currency} {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals Section */}
        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
            <span className="font-black text-slate-900 dark:text-white">{settings.financial.currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tax ({settings.financial.taxRate}%)</span>
            <span className="font-black text-slate-900 dark:text-white">{settings.financial.currency} {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Net Total</span>
            <span className="text-4xl font-black text-indigo-600 tracking-tighter">{settings.financial.currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 flex-shrink-0">
          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => handleCheckout(PaymentMethod.CASH)}
            className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <Banknote className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Cash</span>
          </button>
          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => handleCheckout(PaymentMethod.CARD)}
            className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <CreditCard className="text-blue-600" />
            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Card</span>
          </button>
          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <Smartphone className="text-amber-600" />
            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Mobile</span>
          </button>
        </div>

        <button 
          disabled={cart.length === 0 || isProcessing}
          onClick={() => handleCheckout(PaymentMethod.CASH)}
          className="w-full mt-4 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-300 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:shadow-none flex-shrink-0"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              Finalizing Transaction...
            </>
          ) : (
            <>
              <Receipt size={24} />
              Quick Cash Checkout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sales;
