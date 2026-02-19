import { Component, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgComponentOutlet } from '@angular/common';
import type { Type } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';
import { FlipbookTriggerService } from '../../services/flipbook-trigger.service';
import { BookCoverComponent } from '../book-cover/book-cover.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { AdminComponent } from '../admin/admin.component';
import { AdventurePageComponent } from '../adventure-page/adventure-page.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    BookCoverComponent,
    TimelineComponent,
    AdminComponent,
    NgComponentOutlet,
    AdventurePageComponent,
  ],
  template: `
    <div class="book-spread relative flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-center min-h-screen paper-texture p-4">
      <button
        type="button"
        class="fixed top-4 right-4 z-50 px-2 py-1 rounded text-xs font-typewriter bg-[#4B3621] text-[#F5F5DC] hover:bg-[#6b5344]"
        (click)="showAdmin.set(!showAdmin())"
      >
        {{ showAdmin() ? 'Hide Admin' : 'Admin' }}
      </button>
      @if (showAdmin()) {
        <app-admin />
      }
      <aside class="lg:fixed lg:left-4 lg:top-1/2 lg:-translate-y-1/2 z-10">
        <app-timeline />
      </aside>

      @if (adventureService.isCoverPage()) {
        <div
          class="spread flex flex-col lg:flex-row gap-4 lg:gap-0 w-full max-w-[95vw] lg:max-w-7xl xl:max-w-[1600px] items-stretch justify-center flex-1 lg:min-h-[80vh]"
        >
          <div
            class="page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture page flex items-center justify-center p-6 lg:p-8"
          >
            <app-book-cover />
          </div>
        </div>
      } @else {
        @if (flipbookWrapperComponent()) {
          <ng-container [ngComponentOutlet]="flipbookWrapperComponent()" />
        } @else {
          <div
            class="spread flex flex-col lg:flex-row gap-4 lg:gap-0 w-full max-w-[95vw] lg:max-w-7xl xl:max-w-[1600px] items-stretch justify-center flex-1 lg:min-h-[80vh]"
          >
            <div
              class="page left-page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture page"
            >
              <div class="p-6 lg:p-8 h-full">
                <app-adventure-page />
              </div>
            </div>
            <div class="spine hidden lg:block w-2 flex-shrink-0 bg-[#4B3621]/40 rounded mx-0.5" aria-hidden="true"></div>
            <div
              class="page right-page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture flex items-center justify-center"
            >
              <div class="text-[#6b5344] font-typewriter text-sm">Next spread</div>
            </div>
          </div>
        }
      }

      <div class="flex gap-4 mt-6 lg:mt-8 lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        <button
          type="button"
          class="px-6 py-3 rounded-lg font-typewriter text-base bg-[#4B3621] text-[#F5F5DC] hover:bg-[#6b5344] disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-md"
          [disabled]="!adventureService.hasPrevPage()"
          (click)="goPrev()"
        >
          Previous
        </button>
        <button
          type="button"
          class="px-6 py-3 rounded-lg font-typewriter text-base bg-[#4B3621] text-[#F5F5DC] hover:bg-[#6b5344] disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-md"
          [disabled]="!adventureService.hasNextPage()"
          (click)="goNext()"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class BookComponent {
  private readonly platformId = inject(PLATFORM_ID);
  readonly adventureService = inject(AdventureService);
  private readonly flipbookTrigger = inject(FlipbookTriggerService);
  readonly showAdmin = signal(false);

  /** Lazy-loaded only in the browser to avoid hammerjs/window on SSR. */
  readonly flipbookWrapperComponent = signal<Type<unknown> | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        if (this.adventureService.isCoverPage()) return;
        import('../adventure-flipbook-wrapper/adventure-flipbook-wrapper.component').then((m) =>
          this.flipbookWrapperComponent.set(m.AdventureFlipbookWrapperComponent)
        );
      });
    }
  }

  goNext(): void {
    if (this.adventureService.isCoverPage()) {
      this.adventureService.nextPage();
    } else {
      this.flipbookTrigger.next.next();
    }
  }

  goPrev(): void {
    if (this.adventureService.currentPageIndex() <= 1) {
      this.adventureService.prevPage();
    } else {
      this.flipbookTrigger.prev.next();
    }
  }
}
