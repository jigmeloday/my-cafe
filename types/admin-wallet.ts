export interface AdminWalletRow {
  businessId: string;
  name: string;
  slug: string;
  ownerEmail: string;
  balance: number;
}

export interface WalletListQuery {
  q: string;
  page: number;
}

export interface WalletListResult {
  items: AdminWalletRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
