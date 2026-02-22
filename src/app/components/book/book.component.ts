import {
  Component,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  DestroyRef,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AdventureService } from '../../services/adventure.service';
import { AdminStateService } from '../../services/admin-state.service';
import { AdventurePageComponent } from '../adventure-page/adventure-page.component';
import { BookCoverComponent } from '../book-cover/book-cover.component';
import { AdminComponent } from '../admin/admin.component';

const BOOK_PAGE_WIDTH = 700;
const BOOK_HEIGHT = 900;
const MOBILE_BREAKPOINT = 768;
const SWIPE_THRESHOLD = 50;
const SWIPE_RATIO = 1.5;

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    AdventurePageComponent,
    BookCoverComponent,
    AdminComponent,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  readonly adventureService = inject(AdventureService);
  readonly adminState = inject(AdminStateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly bookHeight = BOOK_HEIGHT;
  /** When true, the 'turning' page shows lift shadow (briefly on prev/next). */
  readonly pageLifting = signal<'left' | 'right' | null>(null);

  private readonly viewportWidth = signal(1024);
  private readonly viewportHeight = signal(768);

  readonly isMobile = computed(() => this.viewportWidth() < MOBILE_BREAKPOINT);

  readonly bookDesignWidth = computed(() => {
    const singlePage = this.adventureService.isCoverPage() || this.isMobile();
    return singlePage ? BOOK_PAGE_WIDTH : BOOK_PAGE_WIDTH * 2;
  });

  readonly bookScale = computed(() => {
    const vw = this.viewportWidth();
    const vh = this.viewportHeight();
    const mobile = this.isMobile();
    const bookW = this.bookDesignWidth();
    const padX = mobile ? 32 : 120;
    const padY = mobile ? 140 : 100;
    const raw = Math.min((vw - padX) / bookW, (vh - padY) / BOOK_HEIGHT, 1);
    return Math.round(raw * 1000) / 1000;
  });

  readonly scaledMarginBottom = computed(() => (this.bookScale() - 1) * BOOK_HEIGHT);

  private touchStartX = 0;
  private touchStartY = 0;

  constructor() {
    afterNextRender(() => {
      this.syncViewport();
      const handler = () => this.syncViewport();
      window.addEventListener('resize', handler);
      window.addEventListener('orientationchange', handler);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('resize', handler);
        window.removeEventListener('orientationchange', handler);
      });
    });
  }

  private syncViewport(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.viewportWidth.set(window.innerWidth);
    this.viewportHeight.set(window.innerHeight);
  }

  goNext(): void {
    this.pageLifting.set('right');
    this.adventureService.nextPage();
    setTimeout(() => this.pageLifting.set(null), 400);
  }

  goPrev(): void {
    this.pageLifting.set('left');
    this.adventureService.prevPage();
    setTimeout(() => this.pageLifting.set(null), 400);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * SWIPE_RATIO) {
      if (dx < 0) this.goNext();
      else this.goPrev();
    }
  }
}
