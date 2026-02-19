import { Component } from '@angular/core';

@Component({
  selector: 'app-book-cover',
  standalone: true,
  host: { class: 'block w-full h-full min-w-0 min-h-0 flex-1' },
  templateUrl: './book-cover.component.html',
  styleUrl: './book-cover.component.css',
})
export class BookCoverComponent {}
