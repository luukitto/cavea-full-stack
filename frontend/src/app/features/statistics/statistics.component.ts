import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { InventoryStatsRow } from '../../core/models/inventory.model';
import { InventoryApiService } from '../../core/services/inventory-api.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  private readonly api = inject(InventoryApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly stats = signal<InventoryStatsRow[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalProducts = computed(() =>
    this.stats().reduce((sum, row) => sum + row.itemCount, 0)
  );

  readonly totalValue = computed(() =>
    this.stats().reduce((sum, row) => sum + row.totalPrice, 0)
  );

  constructor() {
    this.loadStats();
  }

  refresh() {
    this.loadStats();
  }

  private loadStats() {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getStatistics()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rows) => this.stats.set(rows),
        error: () =>
          this.error.set('Unable to load statistics. Please try again.')
      });
  }
}

