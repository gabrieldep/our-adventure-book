import { Component, inject } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <nav class="timeline flex flex-col items-center gap-0" aria-label="Book pages">
      @for (page of pages(); track page.pageNumber; let i = $index) {
        <button
          type="button"
          class="timeline-knot w-4 h-4 rounded-full border-2 border-[#4B3621] bg-[#F5F5DC] transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:ring-offset-2"
          [class.bg-[#8B0000]]="currentPageNumber() === page.pageNumber"
          [class.border-[#8B0000]]="currentPageNumber() === page.pageNumber"
          [attr.aria-current]="currentPageNumber() === page.pageNumber ? 'page' : null"
          (click)="goToPage(page.pageNumber)"
        >
          <span class="sr-only">Page {{ page.pageNumber }}</span>
        </button>
        @if (i < pages().length - 1) {
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

  pages = this.adventureService.pages;
  currentPageNumber = this.adventureService.currentPageNumber;

  goToPage(pageNumber: number): void {
    this.adventureService.setCurrentPage(pageNumber - 1);
  }
}
