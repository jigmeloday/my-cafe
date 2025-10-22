"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BannerType } from '../../../types';

export const columns: ColumnDef<BannerType>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
  },
  {
    accessorKey: "link",
    header: "Link",
  },
  {
    accessorKey: "startDate",
    header: "Start date",
  },
  {
    accessorKey: "endDate",
    header: "End date",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
]