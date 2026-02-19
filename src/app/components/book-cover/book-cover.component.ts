import { Component } from '@angular/core';

@Component({
  selector: 'app-book-cover',
  standalone: true,
  host: { class: 'block w-full h-full min-w-[320px] min-h-[280px]' },
  templateUrl: './book-cover.component.html',
  styleUrl: './book-cover.component.css',
})
export class BookCoverComponent {}
