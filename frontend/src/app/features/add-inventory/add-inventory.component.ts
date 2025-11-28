import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LocationOption } from '../../core/models/inventory.model';
import { InventoryApiService } from '../../core/services/inventory-api.service';

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})
export class AddInventoryComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(InventoryApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly locations = signal<LocationOption[]>([]);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    price: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)]
    }),
    locationId: this.fb.control<number | null>(null, { validators: [Validators.required] })
  });

  constructor() {
    this.loadLocations();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const { name, price, locationId } = this.form.getRawValue();
    this.api
      .createInventory({
        name,
        price: Number(price),
        locationId: Number(locationId)
      })
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/'], {
            state: { flashMessage: 'Inventory item added successfully.' }
          });
        },
        error: () => {
          this.error.set('Unable to add the inventory item. Please try again.');
        }
      });
  }

  private loadLocations() {
    this.api
      .getLocations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (locations) => this.locations.set(locations),
        error: () => {
          this.error.set('Failed to load locations.');
          this.form.disable();
        }
      });
  }
}

