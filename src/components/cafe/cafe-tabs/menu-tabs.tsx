'use client';

import MenuCard from '@/components/shared/menu-card';
import { useEffect, useState } from 'react';
import { MenuType } from '../../../../types';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Sheet } from '@/components/ui/sheet';
import MenuCreation from '@/components/menu/menu-creation';
import {
  deleteMenuApi,
  fetchMenu,
  updateMenuApi,
} from '@/lib/services/menu/menu.service';
import { useParams } from 'next/navigation';
import { useCategories } from '@/context/category-context';
import { Dialog } from '@/components/ui/dialog';
import DialogComponent from '@/components/ui/dialog-component';
import NoData from '@/components/shared/no-data';
import Loader from '@/components/shared/loader';

function MenuTab() {
  const { data: session } = useSession();
  const { slug } = useParams();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { categories } = useCategories();
  const [actionType, setActionType] = useState<'close' | 'delete' | ''>('');

  const limit = 6;

  const loadMenus = async (categoryId?: string, newPage: number = 1) => {
    try {
      setLoading(true);
      const menuRes = await fetchMenu({
        limit,
        page: newPage,
        cafeId: slug as string,
        myCafe: true,
        category: categoryId,
      });

      const fetchedMenus = menuRes.data || [];

      if (newPage === 1) {
        setMenus(fetchedMenus);
      } else {
        setMenus((prev) => [...prev, ...fetchedMenus]);
      }

      setHasMore(fetchedMenus.length === limit); // If less than limit, no more pages
    } catch (error) {
      console.error('Failed to fetch menus', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: all menus
  useEffect(() => {
    setPage(1);
    loadMenus(activeCategory, 1);
  }, [slug, activeCategory]);

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === activeCategory) return;
    setActiveCategory(categoryId);
    setPage(1);
    loadMenus(categoryId, 1);
  };

  // Handle "Load More"
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMenus(activeCategory, nextPage);
  };

  const handleAction = async () => {
    if (
      !selectedMenu ||
      (session?.user.role !== 'owner' && session?.user.role !== 'super_admin')
    )
      return;
    setLoading(true);

    try {
      let response;

      if (actionType === 'delete' && selectedMenu?.id) {
        response = await deleteMenuApi(selectedMenu.id);
      } else if (actionType === 'close' && selectedMenu?.id) {
        const payload = {
          ...selectedMenu,
          imageUrls: selectedMenu.Images?.map((img) => img.url),
          isAvailable: !selectedMenu.isAvailable,
        };
        response = await updateMenuApi(selectedMenu?.id, payload);
      } else {
        throw new Error('Invalid action');
      }

      if (response?.success) {
        setMenus((prev) => {
          if (actionType === 'delete') {
            return prev.filter((c: MenuType) => c.id !== selectedMenu?.id);
          } else {
            return prev.map((c: MenuType) =>
              c.id === selectedMenu?.id
                ? { ...c, isAvailable: !c.isAvailable }
                : c
            );
          }
        });
      }
    } catch (err) {
      console.log('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setSelectedMenu(null);
      setActionType('');
    }
  };
  return (
    <div className="flex px-[4px] py-[20px] space-x-[42px]">
      {/* Categories Sidebar */}
      <div className="w-[16%] px-2 sticky top-[100px] self-start">
        <h4>Categories</h4>
        <div className="mt-[24px] space-y-1 h-[70vh] overflow-y-auto rounded-md">
          <div
            onClick={() => handleCategoryClick('')}
            className={`transition-all duration-500 border ease-in-out rounded-md px-[8px] py-2 cursor-pointer ${
              activeCategory === ''
                ? 'border-primary-500 bg-primary-50/20 shadow'
                : 'hover:bg-primary-50/10 border-white'
            }`}
          >
            <p
              className={`font-bold ${
                activeCategory === '' ? 'text-primary-300' : 'text-primary-500'
              }`}
            >
              All menu
            </p>
          </div>
          {categories.map(({ id, name }) => (
            <div
              key={id}
              onClick={() => handleCategoryClick(id)}
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
        {loading && page === 1 ? (
          <Loader
            className="h-screen flex items-center justify-center"
            title="Please wait while searching for menu..."
          />
        ) : menus.length ? (
          <div>
            <div className="grid grid-cols-2 gap-4">
              {menus.map((item) => (
                <MenuCard
                  onEdit={(menu) => {
                    setSelectedMenu(menu); // set cafe to edit
                    setOpen(true); // open the sheet
                  }}
                  onAction={(menuId, type) => {
                    const menuObj = menus?.find((c) => c.id === menuId);
                    if (!menuObj) return;
                    setSelectedMenu(menuObj);
                    setActionType(type);
                    setDialogOpen(true);
                  }}
                  key={item.id}
                  menu={item}
                />
              ))}
            </div>
            {hasMore && (
              <div className="my-4 flex justify-center">
                <Button onClick={handleLoadMore} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center py-8 text-gray-500">
            <NoData
              className="h-full"
              title="No Menus Available"
              description="It looks like there are no menus added yet."
            />
          </div>
        )}
      </div>
      <Dialog open={dialogOpen}>
        <DialogComponent
          btn1="Cancel"
          isDisabled={loading}
          btn2={
            actionType === 'delete'
              ? 'Delete'
              : selectedMenu?.isAvailable
              ? 'Not available'
              : 'available'
          }
          title="Confirm Action"
          description={`Are you sure you want to ${
            actionType === 'close'
              ? selectedMenu?.isAvailable
                ? 'not available'
                : 'available'
              : actionType
          } this cafe?`}
          onConfirm={handleAction}
          onCancel={() => setDialogOpen(false)}
        />
      </Dialog>
      {/* Menu Creation Sheet */}
      <Sheet open={open}>
        <MenuCreation
          menu={selectedMenu}
          setMenu={setSelectedMenu}
          onMenuCreated={() => {
            setPage(1);
            loadMenus(activeCategory, 1);
          }}
          setOpen={setOpen}
        />
      </Sheet>
    </div>
  );
}

export default MenuTab;
