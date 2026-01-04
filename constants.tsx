
import { Product, Expense, BusinessSettings, PaymentMethod, UserRole } from './types';

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const DEFAULT_SETTINGS: BusinessSettings = {
  profile: {
    name: 'Omnistock',
    type: 'Business / Retail',
    address: 'Lusaka, Zambia',
    contact: '+260 970000000',
    logo: './logo.png'
  },
  financial: {
    currency: 'ZMW',
    taxRate: 16,
    discountRules: 'Standard discounts',
    fiscalYearStart: 'January'
  },
  inventory: {
    defaultReorderLevel: 5,
    autoRestockAlerts: true
  },
  receipt: {
    title: 'TAX INVOICE',
    logoPosition: 'center',
    headerMessage: 'Thank you for choosing Omnistock. We value your business!',
    footerMessage: 'Goods once sold are not returnable.',
    showStaff: true,
    showBarcode: true
  },
  ai: {
    enabled: true,
    tone: 'friendly',
    goals: 'Growth and profit maximization',
    frequency: 'daily'
  },
  preferences: {
    darkMode: false,
    language: 'English'
  }
};
