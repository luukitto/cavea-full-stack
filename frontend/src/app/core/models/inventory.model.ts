export interface LocationOption {
  id: number;
  name: string;
}

export interface InventoryListItem {
  id: number;
  name: string;
  price: number;
  location: LocationOption | null;
}

export interface InventoryListResponse {
  data: InventoryListItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface InventoryStatsRow {
  locationId: number;
  locationName: string;
  itemCount: number;
  totalPrice: number;
}

