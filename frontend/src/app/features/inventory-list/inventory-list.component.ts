import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import {
  InventoryListItem,
  LocationOption
} from '../../core/models/inventory.model';
import {
  InventoryApiService,
  InventorySortDirection,
  InventorySortField
} from '../../core/services/inventory-api.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe, DecimalPipe],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent {
  private readonly api = inject(InventoryApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = 20;
  readonly inventories = signal<InventoryListItem[]>([]);
  readonly totalItems = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly locationError = signal<string | null>(null);
  readonly locations = signal<LocationOption[]>([]);
  readonly selectedLocation = signal<number | 'all'>('all');
  readonly sortField = signal<InventorySortField>('name');
  readonly sortDirection = signal<InventorySortDirection>('asc');
  readonly page = signal(1);
  readonly flashMessage = signal<string | null>(
    typeof history !== 'undefined' ? history.state?.flashMessage ?? null : null
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize))
  );

  readonly pageSummary = computed(() => {
    const total = this.totalItems();
    if (!total) {
      return '0 of 0';
    }
    const start = (this.page() - 1) * this.pageSize + 1;
    const end = Math.min(this.page() * this.pageSize, total);
    return `${start}-${end} of ${total}`;
  });

  constructor() {
    if (this.flashMessage()) {
      setTimeout(() => this.flashMessage.set(null), 4000);
      if (
        typeof history !== 'undefined' &&
        typeof document !== 'undefined' &&
        typeof location !== 'undefined'
      ) {
        const { state } = history;
        history.replaceState(
          { ...state, flashMessage: undefined },
          document.title,
          location.href
        );
      }
    }

    this.loadLocations();
    this.loadInventories();
  }

  changePage(delta: number) {
    const nextPage = this.page() + delta;
    if (nextPage < 1 || nextPage > this.totalPages()) {
      return;
    }
    this.page.set(nextPage);
    this.loadInventories();
  }

  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    const value = select?.value ?? 'all';
    const parsed = value === 'all' ? 'all' : Number(value);
    this.selectedLocation.set(parsed);
    this.page.set(1);
    this.loadInventories();
  }

  changeSort(field: InventorySortField) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.page.set(1);
    this.loadInventories();
  }

  refresh() {
    this.loadInventories();
  }

  async deleteInventory(item: InventoryListItem) {
    const confirmed = window.confirm(`Delete "${item.name}"?`);
    if (!confirmed) {
      return;
    }
    this.loading.set(true);
    this.api
      .deleteInventory(item.id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.loadInventories(),
        error: () => this.error.set('Failed to delete the selected item.')
      });
  }

  private loadLocations() {
    this.api
      .getLocations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (locations) => {
          this.locations.set(locations);
          this.locationError.set(null);
        },
        error: () => this.locationError.set('Failed to load locations.')
      });
  }

  private loadInventories() {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getInventories({
        page: this.page(),
        pageSize: this.pageSize,
        sortField: this.sortField(),
        sortDirection: this.sortDirection(),
        locationId:
          this.selectedLocation() === 'all'
            ? undefined
            : Number(this.selectedLocation())
      })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.inventories.set(response.data);
          this.totalItems.set(response.meta.total);
        },
        error: () => this.error.set('Failed to load inventory items.')
      });
  }
}

