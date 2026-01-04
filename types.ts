
export enum UserRole {
  ADMIN = 'Owner / Admin',
  MANAGER = 'Manager',
  STAFF = 'Staff / Cashier'
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  MOBILE_MONEY = 'Mobile Money'
}

export enum MobileProvider {
  AIRTEL = 'Airtel',
  MTN = 'MTN',
  ZAMTEL = 'Zamtel'
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  supplier: string;
  reorderThreshold: number;
  image?: string;
  lastRestocked?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  mobileProvider?: MobileProvider;
  staffId: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface BusinessSettings {
  profile: {
    name: string;
    type: string;
    address: string;
    contact: string;
    logo?: string;
  };
  financial: {
    currency: string;
    taxRate: number;
    discountRules: string;
    fiscalYearStart: string;
  };
  inventory: {
    defaultReorderLevel: number;
    autoRestockAlerts: boolean;
  };
  receipt: {
    title: string;
    logoPosition: 'left' | 'center' | 'right';
    headerMessage: string;
    footerMessage: string;
    showStaff: boolean;
    showBarcode: boolean;
  };
  ai: {
    enabled: boolean;
    tone: 'formal' | 'friendly';
    goals: string;
    frequency: 'daily' | 'weekly';
  };
  preferences: {
    darkMode: boolean;
    language: string;
  };
}
