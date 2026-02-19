import { Component, input } from '@angular/core';

@Component({
  selector: 'app-polaroid',
  standalone: true,
  template: `
    <div
      class="polaroid inline-block bg-white p-2 pb-8 shadow-lg border border-white/90"
      [class.rotate-1]="rotation() === 1"
      [class.-rotate-1]="rotation() === -1"
      [class.rotate-2]="rotation() === 2"
      [class.-rotate-2]="rotation() === -2"
      [class.rotate-0]="rotation() === 0"
    >
      <div class="overflow-hidden bg-neutral-100">
        @if (imageUrl()) {
          <img
            [src]="imageUrl()"
            [alt]="caption()"
            class="block w-full h-auto object-cover"
          />
        }
      </div>
      <p class="font-handwriting text-[#4B3621] text-center text-sm mt-2 px-1 select-none">
        {{ caption() }}
      </p>
    </div>
  `,
  styles: [
    `
      .polaroid {
        box-shadow:
          0 1px 3px rgba(75, 54, 33, 0.12),
          0 4px 6px rgba(75, 54, 33, 0.08),
          0 8px 16px rgba(75, 54, 33, 0.06);
      }
      :host-context(.font-handwriting) {
        font-family: 'Indie Flower', cursive;
      }
    `,
  ],
})
export class PolaroidComponent {
  imageUrl = input.required<string>();
  caption = input<string>('');
  /** Rotation class: -2, -1, 0, 1, 2 (Tailwind rotate-1 etc.) */
  rotation = input<number>(0);
}
