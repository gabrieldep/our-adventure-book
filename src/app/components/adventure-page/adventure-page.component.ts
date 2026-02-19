import { Component, inject, computed } from '@angular/core';
import { AdventureService } from '../../services/adventure.service';
import { PolaroidComponent } from '../polaroid/polaroid.component';
import { AdventureMapComponent } from '../adventure-map/adventure-map.component';
import type { Adventure, PageElement } from '../../models/adventure.model';

@Component({
  selector: 'app-adventure-page',
  standalone: true,
  imports: [PolaroidComponent, AdventureMapComponent],
  templateUrl: './adventure-page.component.html',
  styleUrl: './adventure-page.component.css',
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
