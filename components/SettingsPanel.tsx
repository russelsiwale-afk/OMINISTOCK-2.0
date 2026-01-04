
import React, { useState } from 'react';
import { 
  User, Shield, CreditCard, Box, Bell, Smartphone, Globe, Moon, Save, 
  Trash2, Plus, Mail, ChevronRight, Info, Zap, Receipt, Layout, AlignCenter, AlignLeft, AlignRight, FileText
} from 'lucide-react';
import { BusinessSettings } from '../types';

interface SettingsPanelProps {
  settings: BusinessSettings;
  setSettings: React.Dispatch<React.SetStateAction<BusinessSettings>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings }) => {
  const [activeSubTab, setActiveSubTab] = useState('profile');

  const menu = [
    { id: 'profile', label: 'Business Profile', icon: User },
    { id: 'staff', label: 'User & Staff', icon: Shield },
    { id: 'financial', label: 'Financial', icon: CreditCard },
    { id: 'inventory', icon: Box, label: 'Inventory' },
    { id: 'receipt', icon: Receipt, label: 'Sales & Receipt' },
    { id: 'ai', icon: Zap, label: 'AI Assistant' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'system', icon: Globe, label: 'System Preferences' },
  ];

  const updateSetting = (category: keyof BusinessSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Sidebar Sub-nav */}
      <div className="w-full lg:w-64 space-y-1 overflow-x-auto lg:overflow-x-visible flex lg:flex-col pb-2 lg:pb-0 no-scrollbar">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold
              ${activeSubTab === item.id 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-600' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
          >
            <item.icon size={18} />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-10 shadow-sm overflow-y-auto no-scrollbar">
        {activeSubTab === 'profile' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Business Profile</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
              <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative group shadow-inner">
                <img src={settings.profile.logo} className="w-full h-full object-contain p-2" alt="" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                  <Plus className="text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-black">{settings.profile.name}</h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{settings.profile.type}</p>
                <button className="mt-2 text-sm font-bold text-indigo-600 hover:underline px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">Update Brand Assets</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SettingInput 
                label="Business Trading Name" 
                value={settings.profile.name} 
                onChange={v => updateSetting('profile', 'name', v)} 
              />
              <SettingInput 
                label="Business Category" 
                value={settings.profile.type} 
                onChange={v => updateSetting('profile', 'type', v)} 
              />
              <div className="col-span-1 sm:col-span-2">
                <SettingInput 
                  label="Registered Physical Address" 
                  value={settings.profile.address} 
                  onChange={v => updateSetting('profile', 'address', v)} 
                />
              </div>
              <SettingInput 
                label="Primary Contact Number" 
                value={settings.profile.contact} 
                onChange={v => updateSetting('profile', 'contact', v)} 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'receipt' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Receipt Customization</h3>
                <p className="text-sm font-bold text-slate-500">Visual identity for your printed and digital invoices.</p>
              </div>
              <Receipt className="text-indigo-600" size={32} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingInput 
                label="Document Header Title" 
                value={settings.receipt.title} 
                onChange={v => updateSetting('receipt', 'title', v)} 
                placeholder="e.g. TAX INVOICE"
              />
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Logo Alignment</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(pos => (
                    <button 
                      key={pos}
                      onClick={() => updateSetting('receipt', 'logoPosition', pos)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold
                        ${settings.receipt.logoPosition === pos 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
                    >
                      {pos === 'left' && <AlignLeft size={16} />}
                      {pos === 'center' && <AlignCenter size={16} />}
                      {pos === 'right' && <AlignRight size={16} />}
                      <span className="capitalize text-xs">{pos}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Header Information</label>
                <textarea 
                  className="w-full mt-2 px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white font-semibold h-24 resize-none transition-all placeholder:text-slate-400"
                  value={settings.receipt.headerMessage}
                  onChange={e => updateSetting('receipt', 'headerMessage', e.target.value)}
                  placeholder="Official header details..."
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Footer Disclaimers</label>
                <textarea 
                  className="w-full mt-2 px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white font-semibold h-24 resize-none transition-all placeholder:text-slate-400"
                  value={settings.receipt.footerMessage}
                  onChange={e => updateSetting('receipt', 'footerMessage', e.target.value)}
                  placeholder="Return policy, VAT number, etc..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Toggle Metadata visibility</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">Staff Attribution</span>
                  <Toggle checked={settings.receipt.showStaff} onChange={v => updateSetting('receipt', 'showStaff', v)} />
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">Itemized Barcodes</span>
                  <Toggle checked={settings.receipt.showBarcode} onChange={v => updateSetting('receipt', 'showBarcode', v)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'financial' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Financial & Tax</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Base Currency</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white font-black transition-all"
                  value={settings.financial.currency}
                  onChange={e => updateSetting('financial', 'currency', e.target.value)}
                >
                  <option value="ZMW">Zambian Kwacha (K)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">Pound (£)</option>
                </select>
              </div>
              <SettingInput 
                label="Standard VAT / Tax Rate (%)" 
                type="number"
                value={settings.financial.taxRate.toString()} 
                onChange={v => updateSetting('financial', 'taxRate', Number(v))} 
              />
              <div className="sm:col-span-2">
                <SettingInput 
                  label="Fiscal Year Reporting Start" 
                  value={settings.financial.fiscalYearStart} 
                  onChange={v => updateSetting('financial', 'fiscalYearStart', v)} 
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'ai' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-4 mb-2">
              <Zap className="text-amber-500 fill-amber-500" size={32} />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Omnistock AI Engine</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white">Active Advisory</h4>
                  <p className="text-sm font-semibold text-slate-500">Gemini will proactively analyze your trends.</p>
                </div>
                <Toggle 
                  checked={settings.ai.enabled} 
                  onChange={v => updateSetting('ai', 'enabled', v)} 
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Assistant Persona</label>
                <div className="grid grid-cols-2 gap-3">
                  {['friendly', 'formal'].map(t => (
                    <button 
                      key={t}
                      onClick={() => updateSetting('ai', 'tone', t)}
                      className={`px-6 py-4 rounded-2xl text-sm font-black capitalize border-2 transition-all
                        ${settings.ai.tone === t 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
                    >
                      {t} Mode
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Primary Strategic Goals</label>
                <textarea 
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white font-semibold h-32 resize-none transition-all placeholder:text-slate-400"
                  value={settings.ai.goals}
                  onChange={e => updateSetting('ai', 'goals', e.target.value)}
                  placeholder="e.g. Maximize retail margins, scale to 3 branches..."
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'system' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">System Environment</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${settings.preferences.darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                    {settings.preferences.darkMode ? <Moon size={24} /> : <Zap size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white">Interface Theme</h4>
                    <p className="text-sm font-semibold text-slate-500">{settings.preferences.darkMode ? 'Dark focus mode active' : 'Light clarity mode active'}</p>
                  </div>
                </div>
                <Toggle 
                  checked={settings.preferences.darkMode} 
                  onChange={v => updateSetting('preferences', 'darkMode', v)} 
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-slate-100 dark:border-slate-700">
          <button className="px-8 py-4 font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all">Reset All Settings</button>
          <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={20} /> Save Environment Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingInput = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-all placeholder:text-slate-400"
    />
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
  >
    <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${checked ? 'left-7' : 'left-1.5'}`} />
  </button>
);

export default SettingsPanel;
