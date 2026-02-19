import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  effect,
  computed,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlipBookModule, Book, BookPageSide, PageType } from '@labsforge/flipbook';
import { FlipbookService } from '@labsforge/flipbook';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdventureService } from '../../services/adventure.service';
import { FlipbookTriggerService } from '../../services/flipbook-trigger.service';
import { AdventurePageComponent } from '../adventure-page/adventure-page.component';

/** Paper-texture placeholder for flipbook pages (library requires imageUrl). */
const PAPER_PAGE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect width='400' height='600' fill='%23F5F5DC'/%3E%3C/svg%3E";

@Component({
  selector: 'app-adventure-flipbook-wrapper',
  standalone: true,
  imports: [FlipBookModule, AdventurePageComponent],
  template: `
    @if (isBrowser()) {
      <div class="flipbook-wrapper relative flex justify-center items-center w-full max-w-[95vw] lg:max-w-7xl xl:max-w-[1600px] flex-1 lg:min-h-[80vh]">
        <div class="flipbook-container relative" [style.width.px]="bookModel().width * bookModel().zoom" [style.height.px]="bookModel().height * bookModel().zoom">
          <flipbook
            [model]="bookModel()"
            [startAt]="startAtPage()"
          />
          <!-- Leather-and-rope spine overlay (movie-style) -->
          <div class="flipbook-spine" aria-hidden="true">
            <div class="spine-grommet"></div>
            <div class="spine-rope">
              <div class="rope-loop rope-loop-left"></div>
              <div class="rope-loop rope-loop-right"></div>
              <div class="rope-end rope-end-top"></div>
              <div class="rope-end rope-end-bottom"></div>
            </div>
          </div>
          <!-- Overlay: current spread content (AdventurePage) so each "page" is our component -->
          <div class="flipbook-content-overlay">
            <div class="overlay-left page paper-texture">
              <div class="p-6 lg:p-8 h-full">
                <app-adventure-page />
              </div>
            </div>
            <div class="overlay-spine" aria-hidden="true"></div>
            <div class="overlay-right page paper-texture flex items-center justify-center">
              <div class="text-[#6b5344] font-typewriter text-sm">Next spread</div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="flipbook-ssr-placeholder spread flex flex-col lg:flex-row gap-4 w-full max-w-[95vw] lg:max-w-7xl xl:max-w-[1600px] items-stretch justify-center flex-1 lg:min-h-[80vh]">
        <div class="page left-page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture page">
          <div class="p-6 lg:p-8 h-full">
            <app-adventure-page />
          </div>
        </div>
        <div class="spine hidden lg:block w-2 flex-shrink-0 spine-placeholder rounded mx-0.5" aria-hidden="true"></div>
        <div class="page right-page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture flex items-center justify-center">
          <div class="text-[#6b5344] font-typewriter text-sm">Next spread</div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .flipbook-container {
        perspective: 2000px;
      }

      .flipbook-spine {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 14px;
        min-width: 14px;
        max-width: 28px;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 5;
        background: linear-gradient(180deg, #6b2020 0%, #8b0000 15%, #7a2828 50%, #8b0000 85%, #5c1818 100%);
        border-radius: 3px;
        box-shadow: inset 1px 0 3px rgba(0, 0, 0, 0.3);
      }

      .spine-grommet {
        position: absolute;
        left: 50%;
        top: 32%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);
        z-index: 2;
      }

      .spine-rope {
        position: absolute;
        left: 50%;
        top: 32%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 40px;
        z-index: 1;
      }

      .rope-loop-left,
      .rope-loop-right {
        position: absolute;
        width: 10px;
        height: 14px;
        border: 2px solid #a0826d;
        border-color: #8b7355 #6b5344 #8b7355 #a0826d;
        border-radius: 50%;
        background: linear-gradient(135deg, #c4a574 0%, #8b7355 50%, #6b5344 100%);
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3), 1px 1px 2px rgba(0, 0, 0, 0.3);
      }

      .rope-loop-left {
        left: -2px;
        top: 6px;
        transform: rotate(-15deg);
        border-right-color: transparent;
      }

      .rope-loop-right {
        right: -2px;
        top: 6px;
        transform: rotate(15deg);
        border-left-color: transparent;
      }

      .rope-end {
        position: absolute;
        left: 50%;
        width: 4px;
        height: 10px;
        background: linear-gradient(90deg, #6b5344, #8b7355, #6b5344);
        border-radius: 2px;
        transform: translateX(-50%);
        box-shadow: 1px 0 2px rgba(0, 0, 0, 0.3);
      }

      .rope-end-top {
        top: -2px;
        transform: translateX(-50%) rotate(-25deg);
        transform-origin: bottom center;
      }

      .rope-end-bottom {
        bottom: -2px;
        transform: translateX(-50%) rotate(25deg);
        transform-origin: top center;
      }

      .flipbook-content-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        pointer-events: none;
        z-index: 2;
      }

      .flipbook-content-overlay .overlay-left,
      .flipbook-content-overlay .overlay-right {
        flex: 1;
        min-width: 0;
        min-height: 100%;
        pointer-events: auto;
      }

      .flipbook-content-overlay .overlay-spine {
        width: 14px;
        min-width: 14px;
        flex-shrink: 0;
      }

      .spine-placeholder {
        background: linear-gradient(180deg, #6b2020 0%, #8b0000 50%, #5c1818 100%);
      }
    `,
  ],
})
export class AdventureFlipbookWrapperComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly adventureService = inject(AdventureService);
  private readonly flipbookService = inject(FlipbookService);
  private readonly flipbookTrigger = inject(FlipbookTriggerService);
  private readonly destroy$ = new Subject<void>();

  readonly isBrowser = signal(false);

  /** Number of spreads (excluding cover). */
  private readonly spreadCount = computed(() => {
    const pages = this.adventureService.pages();
    return Math.max(1, pages.length);
  });

  /** Flipbook Book model: double-page spread, paper-like pages. Animation is ~1s (library default, heavy/paper-like). */
  readonly bookModel = computed<Book>(() => {
    const n = this.spreadCount();
    const pageWidth = 585;
    const pageHeight = 780;
    const width = pageWidth * 2;
    const height = pageHeight;
    const sides: BookPageSide[] = [];
    for (let i = 0; i < n; i++) {
      sides.push({ imageUrl: PAPER_PAGE_URL, backgroundColor: '#F5F5DC' });
      sides.push({ imageUrl: PAPER_PAGE_URL, backgroundColor: '#F5F5DC' });
    }
    return {
      width,
      height,
      zoom: 1,
      pages: sides,
      pageWidth,
      pageHeight,
      startPageType: PageType.Double,
      endPageType: PageType.Double,
    };
  });

  /** 1-based spread index for flipbook startAt and goTo. */
  readonly startAtPage = computed(() => {
    const idx = this.adventureService.currentPageIndex();
    return idx < 1 ? 1 : Math.min(idx, this.spreadCount());
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true);
    }
    // When Timeline (or other nav) changes the page, tell the flipbook to flip to that spread.
    effect(() => {
      if (!this.isBrowser()) return;
      const idx = this.adventureService.currentPageIndex();
      if (idx < 1) return;
      const target = Math.min(idx, this.spreadCount());
      this.flipbookService.goTo.next(target);
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.flipbookService.currentPage.pipe(takeUntil(this.destroy$)).subscribe((pageOneBased) => {
      this.adventureService.setCurrentPage(pageOneBased);
      this.playFlipSound();
    });
    this.flipbookService.next.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.adventureService.hasNextPage()) this.adventureService.nextPage();
    });
    this.flipbookService.prev.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.adventureService.hasPrevPage()) this.adventureService.prevPage();
    });
    this.flipbookTrigger.next.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.adventureService.hasNextPage()) this.flipbookService.next.next();
    });
    this.flipbookTrigger.prev.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.adventureService.currentPageIndex() > 1) this.flipbookService.prev.next();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private playFlipSound(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const audio = new Audio('/assets/sounds/page-flip.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {
      // No sound asset or autoplay blocked; ignore.
    }
  }
}
