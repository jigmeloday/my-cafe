'use client';

import MenuCard from '@/components/shared/menu-card';
import { useEffect, useState, useCallback } from 'react';
import { CategoryType, MenuType } from '../../../../types';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Sheet } from '@/components/ui/sheet';
import MenuCreation from '@/components/menu/menu-creation';
import { fetchMenu } from '@/lib/services/menu/menu.service';
import { fetchCategory } from '@/lib/services/share.service';

function MenuTab() {
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and default menu
  const loadCategoriesAndMenu = useCallback(async () => {
    setLoading(true);
    try {
      const categoryRes = await fetchCategory();
      const categoriesData = categoryRes?.data || [];
      setCategories(categoriesData as CategoryType[]);

      if (categoriesData?.length) {
        const firstCategoryId = categoriesData[0].id;
        setActiveCategory(firstCategoryId);

        const menuRes = await fetchMenu({
          limit: 10,
          page: 1,
          category: firstCategoryId,
        });
        setMenus(menuRes.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories or menus', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMenusByCategory = useCallback(async (categoryId: string) => {
    setLoading(true);
    try {
      const menuRes = await fetchMenu({
        limit: 10,
        page: 1,
        category: categoryId,
      });
      setMenus(menuRes.data || []);
    } catch (error) {
      console.error('Failed to fetch menus for category', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategoriesAndMenu();
  }, [loadCategoriesAndMenu]);

  useEffect(() => {
    if (activeCategory) loadMenusByCategory(activeCategory);
  }, [activeCategory, loadMenusByCategory]);

  return (
    <div className="flex px-[4px] py-[20px] space-x-[42px]">
      {/* Categories Sidebar */}
      <div className="w-[16%] px-2 sticky top-[80px] self-start">
        <h4>Categories</h4>
        <div className="mt-[24px] space-y-1 h-[70vh] overflow-y-auto rounded-md">
          {categories.map(({ id, name }) => (
            <div
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`transition-all duration-500 border ease-in-out rounded-md px-[8px] py-2 cursor-pointer ${
                activeCategory === id
                  ? 'border-primary-500 bg-primary-50/20 shadow'
                  : 'hover:bg-primary-50/10 border-white'
              }`}
            >
              <p
                className={`font-bold ${
                  activeCategory === id
                    ? 'text-primary-300'
                    : 'text-primary-500'
                }`}
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Menu List */}
      <div className="w-full px-2">
        {session?.user.role === 'owner' && (
          <div className="flex justify-end mb-2">
            <Button onClick={() => setOpen(true)} className="w-fit">
              Add menu
            </Button>
          </div>
        )}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading menus...</div>
        ) : menus.length ? (
          <div className="grid grid-cols-2 gap-4">
            {menus.map((item) => (
              <MenuCard key={item.id} menu={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No menus available
          </div>
        )}
      </div>

      {/* Menu Creation Sheet */}
      <Sheet open={open}>
        <MenuCreation categories={categories} setOpen={setOpen} />
      </Sheet>
    </div>
  );
}

export default MenuTab;
