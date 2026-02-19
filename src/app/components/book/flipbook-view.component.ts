import { Component, input } from '@angular/core';
import { FlipBookModule } from '@labsforge/flipbook';
import type { Book } from './flipbook-model';

/**
 * Client-only wrapper for the flipbook. Loaded via dynamic import so
 * @labsforge/flipbook (and hammerjs) are never loaded during SSR.
 */
@Component({
  selector: 'app-flipbook-view',
  standalone: true,
  imports: [FlipBookModule],
  template: `
    @if (model()) {
      <flipbook [model]="model()!" [startAt]="startAt()" />
    }
  `,
})
export class FlipbookViewComponent {
  model = input.required<Book | null>();
  startAt = input<number>(0);
}
