import {
  Component,
  inject,
  input,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  effect,
  afterNextRender,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AdventureService } from '../../services/adventure.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent {
  private readonly adventureService = inject(AdventureService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLElement>;
  @ViewChildren('badge') badgeRefs?: QueryList<ElementRef<HTMLElement>>;

  horizontal = input(false);
  /** When set (desktop bookmark), timeline height matches the book for contained scroll. */
  bookHeight = input<number | null>(null);

  pageNumbers = this.adventureService.totalPagesIndexed;
  /** Angular Signal: current page for active state and auto-scroll. */
  currentPageNumber = this.adventureService.currentPageNumber;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.scrollActiveIntoView();
    });
    effect(() => {
      this.currentPageNumber();
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.scrollActiveIntoView(), 0);
      }
    });
  }

  goToPage(pageNumber: number): void {
    this.adventureService.setCurrentPage(pageNumber - 1);
  }

  getPageLabel(pageNum: number): string {
    if (pageNum === 1) return 'Cover';
    const pages = this.adventureService.pages();
    const page = pages[pageNum - 2];
    if (!page?.elements?.length) return `Page ${pageNum}`;
    const adv = this.adventureService.getAdventureById(page.elements[0].adventureId);
    return adv?.date ?? adv?.title ?? `Page ${pageNum}`;
  }

  onScroll(_event: Event): void {
    // Reserved for any scroll handling (e.g. debounced save of scroll position).
  }

  private scrollActiveIntoView(): void {
    const container = this.scrollContainer?.nativeElement;
    const refs = this.badgeRefs?.toArray();
    const current = this.currentPageNumber();
    if (!container || !refs?.length || current < 1 || current > refs.length) return;
    const activeEl = refs[current - 1]?.nativeElement;
    if (!activeEl) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const elCenter = elRect.top - containerRect.top + elRect.height / 2;
    const scrollCenter = container.clientHeight / 2;
    const targetScroll = container.scrollTop + elCenter - scrollCenter;
    container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
  }
}
