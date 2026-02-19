export type AdventureType = 'photo' | 'map' | 'note';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Adventure {
  id: string;
  title: string;
  date: string;
  description: string;
  type: AdventureType;
  contentUrl: string | null;
  coordinates: Coordinates | null;
}

export interface PageElement {
  adventureId: string;
  top: number;
  left: number;
  rotation: number;
}

export interface BookPage {
  pageNumber: number;
  elements: PageElement[];
}

export interface AdventuresData {
  adventures: Adventure[];
  pages: BookPage[];
}
