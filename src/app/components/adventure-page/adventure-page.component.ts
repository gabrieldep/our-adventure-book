import { Component, inject, computed } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';
import { PolaroidComponent } from '../polaroid/polaroid.component';
import { AdventureMapComponent } from '../adventure-map/adventure-map.component';
import type { Adventure, PageElement } from '../../models/adventure.model';

@Component({
  selector: 'app-adventure-page',
  standalone: true,
  imports: [PolaroidComponent, AdventureMapComponent],
  template: `
    <div class="adventure-page relative w-full h-full min-h-[400px]">
      <div class="relative w-full flex-1 min-h-[360px]">
        @for (el of elementsWithAdventure(); track el.adventure.id) {
          <div
            class="absolute transform"
            [style.top.%]="el.layout.top"
            [style.left.%]="el.layout.left"
            [style.transform]="'rotate(' + el.layout.rotation + 'deg)'"
          >
          @switch (el.adventure.type) {
            @case ('photo') {
              <app-polaroid
                [imageUrl]="el.adventure.contentUrl || ''"
                [caption]="el.adventure.description"
                [rotation]="0"
              />
            }
            @case ('map') {
              @if (el.adventure.coordinates) {
                <div class="w-[280px]">
                  <app-adventure-map
                    [coordinates]="el.adventure.coordinates"
                    [mapContainerId]="'map-' + el.adventure.id"
                  />
                  <p class="font-handwriting text-[#4B3621] text-sm mt-1">{{ el.adventure.title }}</p>
                </div>
              }
            }
            @case ('note') {
              <div
                class="note max-w-[200px] p-3 bg-[#F5F5DC] border border-[#4B3621]/30 rounded shadow-sm font-handwriting text-[#4B3621] text-sm"
              >
                <strong class="font-typewriter">{{ el.adventure.title }}</strong>
                <p class="mt-1">{{ el.adventure.description }}</p>
              </div>
            }
          }
          </div>
        }
      </div>
    </div>
  `,
})
export class AdventurePageComponent {
  private readonly adventureService = inject(AdventureService);

  private readonly currentPage = this.adventureService.currentPage;

  isFirstPage = computed(() => this.currentPage()?.pageNumber === 1);

  elementsWithAdventure = computed(() => {
    const page = this.currentPage();
    if (!page) return [];
    const list: { adventure: Adventure; layout: PageElement }[] = [];
    for (const el of page.elements) {
      const adventure = this.adventureService.getAdventureById(el.adventureId);
      if (adventure) {
        list.push({ adventure, layout: el });
      }
    }
    return list;
  });
}
