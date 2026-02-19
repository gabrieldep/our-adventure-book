import {
  Component,
  input,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Coordinates } from '../../models/adventure.model';

@Component({
  selector: 'app-adventure-map',
  standalone: true,
  template: `
    @if (!isBrowser()) {
      <div
        class="w-full h-[200px] bg-[#a0826d] rounded flex items-center justify-center text-[#4B3621] font-typewriter text-sm"
      >
        Map loading…
      </div>
    } @else if (mapContainerId()) {
      <div [id]="mapContainerId()" class="w-full h-[200px] rounded overflow-hidden"></div>
    }
  `,
})
export class AdventureMapComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  coordinates = input.required<Coordinates>();
  mapContainerId = input<string>('adventure-map');

  isBrowser = signal(false);
  private mapInstance: unknown = null;

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser() && this.mapInstance) {
      (this.mapInstance as { remove: () => void }).remove();
      this.mapInstance = null;
    }
  }

  private async initMap(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const coords = this.coordinates();
    const id = this.mapContainerId();
    if (!id || !coords) return;

    const L = await import('leaflet');
    const map = L.map(id, {
      center: [coords.lat, coords.lng],
      zoom: 10,
      zoomControl: false,
    });
    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const vintageIcon = L.divIcon({
      className: 'vintage-marker',
      html: '<div style="width:16px;height:16px;background:#8B0000;border:2px solid #4B3621;border-radius:50%;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([coords.lat, coords.lng], { icon: vintageIcon }).addTo(map);
    this.mapInstance = map;
  }
}
