import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Adventure,
  AdventuresData,
  BookPage,
  PageElement,
} from '../models/adventure.model';

const ADVENTURES_URL = '/assets/data/adventures.json';

@Injectable({ providedIn: 'root' })
export class AdventureService {
  private readonly dataSignal = signal<AdventuresData | null>(null);
  private readonly currentPageIndex = signal(0);

  readonly adventures = computed(() => {
    const data = this.dataSignal();
    return data?.adventures ?? [];
  });

  readonly pages = computed(() => {
    const data = this.dataSignal();
    return data?.pages ?? [];
  });

  readonly currentPage = computed(() => {
    const pages = this.pages();
    const idx = this.currentPageIndex();
    return pages[idx] ?? null;
  });

  readonly currentPageNumber = computed(() => {
    const p = this.currentPage();
    return p?.pageNumber ?? 1;
  });

  readonly hasNextPage = computed(() => {
    const pages = this.pages();
    const idx = this.currentPageIndex();
    return idx < pages.length - 1;
  });

  readonly hasPrevPage = computed(() => {
    return this.currentPageIndex() > 0;
  });

  readonly totalPages = computed(() => this.pages().length);

  constructor(private http: HttpClient) {
    this.loadAdventures();
  }

  loadAdventures(): void {
    this.http.get<AdventuresData>(ADVENTURES_URL).subscribe({
      next: (data) => this.dataSignal.set(data),
      error: () =>
        this.dataSignal.set({ adventures: [], pages: [] }),
    });
  }

  setCurrentPage(index: number): void {
    const pages = this.pages();
    const clamped = Math.max(0, Math.min(index, pages.length - 1));
    this.currentPageIndex.set(clamped);
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPageIndex.update((i) => i + 1);
    }
  }

  prevPage(): void {
    if (this.hasPrevPage()) {
      this.currentPageIndex.update((i) => i - 1);
    }
  }

  getAdventureById(id: string): Adventure | undefined {
    return this.adventures().find((a) => a.id === id);
  }

  /** Admin: add a new adventure and optionally add it to a page. */
  addAdventure(adventure: Adventure, layout?: { top: number; left: number; rotation: number }): void {
    this.dataSignal.update((data) => {
      if (!data) return data;
      const adventures = [...data.adventures, adventure];
      let pages = data.pages;
      if (layout) {
        const lastPage = pages[pages.length - 1];
        const newElement: PageElement = {
          adventureId: adventure.id,
          top: layout.top,
          left: layout.left,
          rotation: layout.rotation,
        };
        if (lastPage) {
          pages = pages.map((p, i) =>
            i === pages.length - 1
              ? { ...p, elements: [...p.elements, newElement] }
              : p
          );
        } else {
          pages = [
            ...pages,
            { pageNumber: pages.length + 1, elements: [newElement] },
          ];
        }
      }
      return { adventures, pages };
    });
  }

  /** Admin: replace full state (e.g. after loading JSON). */
  setData(data: AdventuresData): void {
    this.dataSignal.set(data);
  }
}
