import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InventoryListItem,
  InventoryListResponse,
  InventoryStatsRow,
  LocationOption
} from '../models/inventory.model';
import { environment } from '../../../environments/environment';

export type InventorySortField = 'name' | 'price' | 'location';
export type InventorySortDirection = 'asc' | 'desc';

export interface InventoryQueryParams {
  page: number;
  pageSize: number;
  locationId?: number;
  sortField: InventorySortField;
  sortDirection: InventorySortDirection;
}

export interface CreateInventoryPayload {
  name: string;
  price: number;
  locationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getInventories(params: InventoryQueryParams): Observable<InventoryListResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString())
      .set('sortField', params.sortField)
      .set('sortDirection', params.sortDirection);

    if (params.locationId) {
      httpParams = httpParams.set('locationId', params.locationId.toString());
    }

    return this.http.get<InventoryListResponse>(`${this.baseUrl}/inventories`, {
      params: httpParams
    });
  }

  createInventory(payload: CreateInventoryPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/inventories`, payload);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/inventories/${id}`);
  }

  getLocations(): Observable<LocationOption[]> {
    return this.http.get<LocationOption[]>(`${this.baseUrl}/locations`);
  }

  getStatistics(): Observable<InventoryStatsRow[]> {
    return this.http.get<InventoryStatsRow[]>(`${this.baseUrl}/inventories/statistics`);
  }
}

