import { Component, inject } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <nav class="timeline flex flex-col items-center gap-0" aria-label="Book pages">
      @for (pageNum of pageNumbers(); track pageNum; let i = $index) {
        <button
          type="button"
          class="timeline-knot w-4 h-4 rounded-full border-2 border-[#4B3621] bg-[#F5F5DC] transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:ring-offset-2"
          [class.bg-[#8B0000]]="currentPageNumber() === pageNum"
          [class.border-[#8B0000]]="currentPageNumber() === pageNum"
          [attr.aria-current]="currentPageNumber() === pageNum ? 'page' : null"
          (click)="goToPage(pageNum)"
        >
          <span class="sr-only">Page {{ pageNum }}</span>
        </button>
        @if (i < pageNumbers().length - 1) {
          <div class="timeline-string w-0.5 flex-1 min-h-[24px] bg-[#4B3621]/60" aria-hidden="true"></div>
        }
      }
    </nav>
  `,
  styles: [
    `
      .timeline {
        min-height: 2rem;
      }
      .timeline-string {
        max-height: 2rem;
      }
    `,
  ],
})
export class TimelineComponent {
  private readonly adventureService = inject(AdventureService);

  pageNumbers = this.adventureService.totalPagesIndexed;
  currentPageNumber = this.adventureService.currentPageNumber;

  goToPage(pageNumber: number): void {
    this.adventureService.setCurrentPage(pageNumber - 1);
  }
}
