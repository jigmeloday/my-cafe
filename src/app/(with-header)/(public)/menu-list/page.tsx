'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filters, MenuType } from '../../../../../types';
import FilterComponent from '@/components/shared/filter';
import Loader from '@/components/shared/loader';
import NoData from '@/components/shared/no-data';
import { fetchMenu } from '@/lib/services/menu/menu.service';
import MenuCard from '@/components/shared/menu-card';

export default function Page() {
  const [cafes, setCafes] = useState<MenuType[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    closed: undefined,
    feature: undefined,
    openTime: '',
    closeTime: '',
    sortBy: 'newest',
  });

  const loadCafes = async (nextPage: number, reset = false) => {
    setLoading(true);
    const response = await fetchMenu({
      limit,
      page: nextPage,
      sortOrder: filters.sortBy === 'oldest' ? 'asc' : 'desc',
    });

    if (response.data) {
      const data = response.data;
      setCafes((prev) => (reset ? data : [...prev, ...(data || [])]));
      setTotalCount(response?.pagination?.total || 0);
      setPage(nextPage);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCafes(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleLoadMore = () => {
    if (cafes.length < totalCount) {
      loadCafes(page + 1);
    }
  };

  return (
    <main className="flex px-[16px] lg:px-[112px] space-x-4">
      {/* Filters */}
      {/* <FilterComponent
        filters={filters}
        onChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
        onReset={() =>
          setFilters({
            search: '',
            closed: undefined,
            feature: undefined,
            openTime: '',
            closeTime: '',
            sortBy: 'newest',
          })
        }
      /> */}

      <div className="w-full">
        {/* Content display */}
        {loading ? (
          <Loader
            className="h-screen flex items-center justify-center"
            title="Please wait while searching for cafes..."
          />
        ) : cafes?.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-4 my-[52px]">
              {cafes?.map((item) => (
                <MenuCard key={item.id} menu={item} />
              ))}
            </div>
            {cafes.length < totalCount && (
              <div className="my-6 w-full flex items-center justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <NoData title='No menu' description='There are currently no menus available.' />
        )}
      </div>
    </main>
  );
}
