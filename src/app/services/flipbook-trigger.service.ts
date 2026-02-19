import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Used by BookComponent to trigger flipbook next/prev without importing @labsforge/flipbook (SSR-safe). */
@Injectable({ providedIn: 'root' })
export class FlipbookTriggerService {
  readonly next = new Subject<void>();
  readonly prev = new Subject<void>();
}
