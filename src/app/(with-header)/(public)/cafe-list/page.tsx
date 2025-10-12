'use client';
import { useEffect, useState } from 'react';
import { fetchCafeList } from '@/lib/services/cafe/cafe-service';
import CafeCard from '@/components/shared/cafe-card';
import { Button } from '@/components/ui/button';
import { CafeType, Filters } from '../../../../../types';
import FilterComponent from '@/components/shared/filter';

interface CafeListResponse {
  cafes: CafeType[];
  totalCount: number;
}

export default function Page() {
  const [cafes, setCafes] = useState<CafeType[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Combined filters
  const [filters, setFilters] = useState<Filters>({
    search: '',
    closed: false,
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
        close: filters.closed,
        openTime: filters.openTime,
        closeTime: filters.closeTime,
        query: filters.search || undefined,
        sortBy: filters.sortBy === 'newest' ? 'createdAt' : 'name',
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
    }
    setLoading(false);
  };

  // Refetch on filter change
  useEffect(() => {
    loadCafes(1, true);
  }, [filters]);

  const handleLoadMore = () => {
    if (cafes.length < totalCount) {
      loadCafes(page + 1);
    }
  };

  return (
    <main className="px-[16px] lg:px-[112px]">
      {/* Filters */}
      <FilterComponent
        filters={filters}
        onChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
        onReset={() =>
          setFilters({
            search: '',
            closed: false,
            feature: undefined,
            openTime: '',
            closeTime: '',
            sortBy: 'newest',
          })
        }
      />

      {/* Cafe Grid */}
      <div className="grid grid-cols-5 gap-4 my-[52px]">
        {cafes.map((item) => (
          <CafeCard key={item.id} cafe={item} />
        ))}
      </div>

      {/* Load More */}
      {cafes.length < totalCount && (
        <div className="my-6 w-full flex items-center justify-center">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline">
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </main>
  );
}
