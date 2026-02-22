import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminStateService {
  readonly showAdmin = signal(false);

  toggle(): void {
    this.showAdmin.update((v) => !v);
  }
}
