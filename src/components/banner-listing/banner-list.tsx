'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { columns } from './data-column';
import NoData from '../shared/no-data';
import { BannerType, CafeType } from '../../../types';
import { Sheet } from '../ui/sheet';
import BannerForm from './banner-form';
import { useState } from 'react';

interface BannerListProps {
  data: BannerType[];
  cafe: CafeType[];
}

export function BannerList({ data, cafe }: BannerListProps) {
  const [open, setOpen] = useState(false);
  const [banners, setBanners] = useState<BannerType[]>(data);
  const [selectedBanner, setSelectedBanner] = useState<BannerType | null>(null);

  const table = useReactTable({
    data: banners,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleBannerAdded = (newBanner: BannerType) => {
  setBanners((prev) => {
    const index = prev.findIndex((b) => b.id === newBanner.id);
    if (index !== -1) {
      const updated = [...prev];
      updated[index] = newBanner;
      return updated;
    } else {
      return [newBanner, ...prev];
    }
  });
};

  // Example action handlers
  const handleEdit = (banner: BannerType) => {
    setOpen(true);
    setSelectedBanner(banner);
    // open edit modal or navigate
  };

  const handleDelete = (banner: BannerType) => {
    if (confirm(`Are you sure you want to delete ${banner.title}?`)) {
      console.log('Delete banner:', banner);
      // call delete API
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flex justify-end py-[24px]">
        <Button onClick={() => setOpen(true)} className="w-fit">
          Create Banner
        </Button>
      </div>
      <Table>
        <TableHeader className="shadow text-[18px] font-bold">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="border-r-1" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table?.getRowModel().rows.length ? (
            table?.getRowModel().rows?.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(row.original)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(row.original)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-[80vh] text-center"
              >
                <NoData
                  title="No Banner"
                  description="Currently you dont have any banner"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Sheet open={open}>
        <BannerForm
          setBanner={setSelectedBanner}
          key={selectedBanner?.id || 'new'}
          selectedBanner={selectedBanner as BannerType}
          cafe={cafe}
          setOpen={setOpen}
          onSubmit={handleBannerAdded}
        />
      </Sheet>
    </div>
  );
}
