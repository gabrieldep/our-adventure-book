import { Component, inject } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent {
  private readonly adventureService = inject(AdventureService);

  pageNumbers = this.adventureService.totalPagesIndexed;
  currentPageNumber = this.adventureService.currentPageNumber;

  goToPage(pageNumber: number): void {
    this.adventureService.setCurrentPage(pageNumber - 1);
  }
}
