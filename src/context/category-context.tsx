'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchCategory } from '../lib/services/share.service';
import { CategoryType } from '../../types';

type CategoryContextType = {
  categories: CategoryType[];
  loading: boolean;
};

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: false,
});

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const res = await fetchCategory();
        setCategories(res?.data || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
