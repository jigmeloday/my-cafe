'use client';
import { useEffect, useState } from 'react';
import { fetchCafeList } from '@/lib/services/cafe/cafe-service';
import CafeCard from '@/components/shared/cafe-card';
import { Button } from '@/components/ui/button';
import { CafeListResponse, CafeType, Filters } from '../../../../../types';
import FilterComponent from '@/components/shared/filter';
import Loader from '@/components/shared/loader';

export default function Page() {
  const [cafes, setCafes] = useState<CafeType[]>([]);
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
    try {
      const response = await fetchCafeList({
        limit,
        page: nextPage,
        feature: filters.feature ? true : undefined,
        close: filters.closed ? false : undefined,
        openTime: filters.openTime,
        closeTime: filters.closeTime,
        query: filters.search || undefined,
        sortOrder: filters.sortBy === 'oldest' ? 'asc' : 'desc',
      });

      if (response.success && response.data) {
        const data = response.data as CafeListResponse;
        setCafes((prev) =>
          reset ? data.cafes : [...prev, ...(data.cafes || [])]
        );
        setTotalCount(data.totalCount || 0);
        setPage(nextPage);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch cafes', error);
    } finally {
      setLoading(false);
    }
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
      <FilterComponent
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
      />

      <div className='w-full'>
        {/* Content display */}
        {loading ? (
          <Loader
            className="h-screen flex items-center justify-center"
            title="Please wait while searching for cafes..."
          />
        ) : cafes.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-4 my-[52px]">
              {cafes.map((item) => (
                <CafeCard key={item.id} cafe={item} />
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
          <div className="flex items-center justify-center h-screen">
            No data found
          </div>
        )}
      </div>
    </main>
  );
}
