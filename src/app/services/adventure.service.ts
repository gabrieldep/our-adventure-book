import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Adventure,
  AdventuresData,
  BookPage,
  PageElement,
  RightPageTextsData,
} from '../models/adventure.model';

const ADVENTURES_URL = '/assets/data/adventures.json';
const RIGHT_PAGE_TEXTS_URL = '/assets/data/right-page-texts.json';

@Injectable({ providedIn: 'root' })
export class AdventureService {
  private readonly dataSignal = signal<AdventuresData | null>(null);
  private readonly rightPageTextsSignal = signal<string[]>([]);
  readonly currentPageIndex = signal(0);

  readonly adventures = computed(() => {
    const data = this.dataSignal();
    return data?.adventures ?? [];
  });

  readonly pages = computed(() => {
    const data = this.dataSignal();
    return data?.pages ?? [];
  });

  /** Index 0 = cover; index >= 1 = spread from JSON (pages[index - 1]). */
  readonly currentPage = computed(() => {
    const pages = this.pages();
    const idx = this.currentPageIndex();
    if (idx === 0) return null;
    return pages[idx - 1] ?? null;
  });

  readonly currentPageNumber = computed(() => this.currentPageIndex() + 1);

  readonly hasNextPage = computed(() => {
    const pages = this.pages();
    const idx = this.currentPageIndex();
    return idx < pages.length;
  });

  readonly hasPrevPage = computed(() => this.currentPageIndex() > 0);

  readonly totalPages = computed(() => 1 + this.pages().length);

  readonly totalPagesIndexed = computed(() => {
    const n = this.totalPages();
    return Array.from({ length: n }, (_, i) => i + 1);
  });

  readonly isCoverPage = computed(() => this.currentPageIndex() === 0);

  /** Text for the current spread's right page (blank page). Index 0 = first content spread. */
  readonly currentRightPageText = computed(() => {
    const idx = this.currentPageIndex();
    if (idx === 0) return null;
    const texts = this.rightPageTextsSignal();
    return texts[idx - 1] ?? null;
  });

  constructor(private http: HttpClient) {
    this.loadAdventures();
    this.loadRightPageTexts();
  }

  loadAdventures(): void {
    this.http.get<AdventuresData>(ADVENTURES_URL).subscribe({
      next: (data) => this.dataSignal.set(data),
      error: () =>
        this.dataSignal.set({ adventures: [], pages: [] }),
    });
  }

  loadRightPageTexts(): void {
    this.http.get<RightPageTextsData>(RIGHT_PAGE_TEXTS_URL).subscribe({
      next: (data) => this.rightPageTextsSignal.set(data?.texts ?? []),
      error: () => this.rightPageTextsSignal.set([]),
    });
  }

  setCurrentPage(index: number): void {
    const pages = this.pages();
    const clamped = Math.max(0, Math.min(index, pages.length));
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
