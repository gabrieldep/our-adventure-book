import { Component, inject, signal, computed } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';
import { AdventurePageComponent } from '../adventure-page/adventure-page.component';
import { BookCoverComponent } from '../book-cover/book-cover.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [AdventurePageComponent, BookCoverComponent, TimelineComponent, AdminComponent],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  readonly adventureService = inject(AdventureService);
  readonly showAdmin = signal(false);

  goNext(): void {
    this.adventureService.nextPage();
  }

  goPrev(): void {
    this.adventureService.prevPage();
  }
}
