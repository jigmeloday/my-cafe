'use client';

import { TIME_OPTION } from '@/lib/constant';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useEffect, useState } from 'react';
import { FilterComponentProps } from '../../../types';

export default function FilterComponent({
  filters,
  onChange,
  onReset,
}: FilterComponentProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // debounce search for smoother UX
  useEffect(() => {
    const delay = setTimeout(() => {
      onChange({ ...filters, search: localSearch });
    }, 400);
    return () => clearTimeout(delay);
  }, [localSearch]);

  return (
    <div className="flex flex-col gap-4 py-8 border-b border border-primary-200 h-fit my-[52px] rounded-md">
      <div className="px-6 space-y-[52px]">
        {/* Search */}
        <div className="w-full sm:w-[280px]">
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search cafes..."
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col gap-4">
          {/* Closed Filter */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="closed"
              checked={filters.closed || false}
              onCheckedChange={(checked) =>
                onChange({ ...filters, closed: !!checked })
              }
            />
            <label htmlFor="closed" className="text-sm text-black/60">
              Show Open
            </label>
          </div>

          {/* Featured Filter */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.feature || false}
              onCheckedChange={(checked) =>
                onChange({ ...filters, feature: !!checked })
              }
            />
            <label htmlFor="featured" className="text-sm text-black/60">
              Featured Only
            </label>
          </div>

          {/* Open Time Filter */}
          <Select
            onValueChange={(value) => onChange({ ...filters, openTime: value })}
            value={filters.openTime || ''}
          >
            <SelectTrigger className="text-black/60">
              <SelectValue placeholder="Open Time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTION.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Close Time Filter */}
          <Select
            onValueChange={(value) =>
              onChange({ ...filters, closeTime: value })
            }
            value={filters.closeTime || ''}
          >
            <SelectTrigger className="text-black/60">
              <SelectValue placeholder="Close Time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTION.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sorting */}
          <Select
            onValueChange={(value) => onChange({ ...filters, sortBy: value })}
            value={filters.sortBy || ''}
          >
            <SelectTrigger className="text-gray-400">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
