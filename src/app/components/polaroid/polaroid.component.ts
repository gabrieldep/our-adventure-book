import { Component, input } from '@angular/core';

@Component({
  selector: 'app-polaroid',
  standalone: true,
  templateUrl: './polaroid.component.html',
  styleUrl: './polaroid.component.css',
})
export class PolaroidComponent {
  imageUrl = input.required<string>();
  caption = input<string>('');
  /** Rotation class: -2, -1, 0, 1, 2 (Tailwind rotate-1 etc.) */
  rotation = input<number>(0);
}
