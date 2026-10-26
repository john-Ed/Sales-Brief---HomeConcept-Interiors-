import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { initialDatabase } from '../data/seed';
import type { AppDatabase, Enquiry, EnquiryStatus, Product } from './types';

const STORAGE_KEY = 'homeconcept.salesbrief.v1';
const STORAGE_ERROR = 'Changes could not be saved in this browser. Free some storage, use smaller images, or retry before leaving this page.';

function loadDatabase(): AppDatabase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialDatabase;
    const parsed = JSON.parse(saved) as AppDatabase;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.enquiries)) return initialDatabase;
    return parsed;
  } catch {
    return initialDatabase;
  }
}

interface DataContextValue {
  database: AppDatabase;
  persistenceError: string;
  saveEnquiry: (enquiry: Enquiry) => boolean;
  updateStatus: (id: string, status: EnquiryStatus) => boolean;
  markQuoteSent: (id: string) => boolean;
  saveProduct: (product: Product) => boolean;
  deleteProduct: (id: string) => boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [database, setDatabase] = useState<AppDatabase>(loadDatabase);
  const [persistenceError, setPersistenceError] = useState('');

  const persist = useCallback((next: AppDatabase): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDatabase(next);
      setPersistenceError('');
      return true;
    } catch {
      setPersistenceError(STORAGE_ERROR);
      return false;
    }
  }, []);

  const value = useMemo<DataContextValue>(() => ({
    database,
    persistenceError,
    saveEnquiry: (enquiry) => persist({ ...database, enquiries: [enquiry, ...database.enquiries] }),
    updateStatus: (id, status) => persist({ ...database, enquiries: database.enquiries.map((item) => item.id === id ? { ...item, status } : item) }),
    markQuoteSent: (id) => persist({ ...database, enquiries: database.enquiries.map((item) => item.id === id ? { ...item, quoteSent: true, status: 'Quoted' } : item) }),
    saveProduct: (product) => persist({ ...database, products: database.products.some((item) => item.id === product.id) ? database.products.map((item) => item.id === product.id ? product : item) : [product, ...database.products] }),
    deleteProduct: (id) => persist({ ...database, products: database.products.filter((item) => item.id !== id) }),
  }), [database, persistenceError, persist]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
}
