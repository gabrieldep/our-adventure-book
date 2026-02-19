/** Local copy of @labsforge/flipbook Book types so we can build the model without importing the library (avoids SSR loading hammerjs). */
export interface BookPageSide {
  imageUrl: string;
  backgroundColor?: string;
  opacity?: number;
}

export interface Cover {
  front: BookPageSide;
  back: BookPageSide;
}

export enum PageType {
  Single = 0,
  Double = 1,
}

export interface Book {
  width: number;
  height: number;
  zoom: number;
  cover?: Cover;
  pages: BookPageSide[];
  pageWidth?: number;
  pageHeight?: number;
  startPageType?: PageType;
  endPageType?: PageType;
}
