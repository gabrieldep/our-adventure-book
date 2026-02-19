import { Component, inject, signal } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';
import { AdventurePageComponent } from '../adventure-page/adventure-page.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [AdventurePageComponent, TimelineComponent, AdminComponent],
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

      <div
        class="spread flex flex-col lg:flex-row gap-4 lg:gap-0 w-full max-w-[95vw] lg:max-w-7xl xl:max-w-[1600px] items-stretch lg:items-stretch justify-center flex-1 lg:min-h-[80vh]"
      >
        <div
          class="page left-page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture page transition-all duration-500 ease-in-out"
          [class.flip-left]="flipDirection() === 'left'"
        >
          <div class="p-6 lg:p-8 h-full">
            <app-adventure-page />
          </div>
        </div>

        <div class="spine hidden lg:block w-2 flex-shrink-0 bg-[#4B3621]/40 rounded mx-0.5" aria-hidden="true"></div>

        <div
          class="page right-page flex-1 min-w-0 lg:min-w-[400px] lg:max-w-[50%] min-h-[60vh] lg:min-h-[80vh] paper-texture page opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
        >
          <div class="p-6 lg:p-8 h-full flex items-center justify-center text-[#6b5344] font-typewriter text-sm">
            Next spread
          </div>
        </div>
      </div>

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
  styles: [
    `
      .flip-left {
        transform: rotateY(-8deg);
      }
      .page {
        backface-visibility: hidden;
      }
    `,
  ],
})
export class BookComponent {
  readonly adventureService = inject(AdventureService);
  readonly showAdmin = signal(false);
  protected readonly flipDirection = signal<'left' | 'right'>('right');

  goNext(): void {
    this.flipDirection.set('left');
    this.adventureService.nextPage();
    setTimeout(() => this.flipDirection.set('right'), 500);
  }

  goPrev(): void {
    this.flipDirection.set('right');
    this.adventureService.prevPage();
    setTimeout(() => this.flipDirection.set('left'), 500);
  }
}
