import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdventureService } from '../../services/adventure.service';
import type { Adventure, AdventureType } from '../../models/adventure.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="admin fixed bottom-4 right-4 z-50 w-80 max-h-[90vh] overflow-auto rounded-lg shadow-xl bg-[#F5F5DC] border-2 border-[#8B0000] p-4 font-typewriter text-sm">
      <h2 class="font-heading text-[#4B3621] text-lg mb-2">Add memory</h2>
      <form (ngSubmit)="onSubmit()" class="flex flex-col gap-2">
        <label class="text-[#4B3621]">
          Title
          <input type="text" [(ngModel)]="title" name="title" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5" />
        </label>
        <label class="text-[#4B3621]">
          Date
          <input type="text" [(ngModel)]="date" name="date" placeholder="YYYY-MM-DD" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5" />
        </label>
        <label class="text-[#4B3621]">
          Description
          <textarea [(ngModel)]="description" name="description" rows="2" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5"></textarea>
        </label>
        <label class="text-[#4B3621]">
          Type
          <select [(ngModel)]="type" name="type" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5">
            <option value="photo">Photo</option>
            <option value="map">Map</option>
            <option value="note">Note</option>
          </select>
        </label>
        @if (type === 'photo') {
          <label class="text-[#4B3621]">
            Image URL
            <input type="url" [(ngModel)]="contentUrl" name="contentUrl" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5" />
          </label>
        }
        @if (type === 'map') {
          <label class="text-[#4B3621]">
            Lat
            <input type="number" [(ngModel)]="lat" name="lat" step="any" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5" />
          </label>
          <label class="text-[#4B3621]">
            Lng
            <input type="number" [(ngModel)]="lng" name="lng" step="any" class="w-full border border-[#4B3621]/40 rounded px-2 py-1 mt-0.5" />
          </label>
        }
        <fieldset class="border border-[#4B3621]/40 rounded p-2">
          <legend class="text-[#4B3621]">Layout (optional)</legend>
          <label class="text-[#4B3621]">Top % <input type="number" [(ngModel)]="layoutTop" name="layoutTop" min="0" max="100" class="w-16 border border-[#4B3621]/40 rounded px-1 ml-1" /></label>
          <label class="text-[#4B3621] ml-2">Left % <input type="number" [(ngModel)]="layoutLeft" name="layoutLeft" min="0" max="100" class="w-16 border border-[#4B3621]/40 rounded px-1 ml-1" /></label>
          <label class="text-[#4B3621] ml-2">Rotation <input type="number" [(ngModel)]="layoutRotation" name="layoutRotation" class="w-16 border border-[#4B3621]/40 rounded px-1 ml-1" /></label>
        </fieldset>
        <button
          type="submit"
          class="mt-2 px-4 py-2 rounded bg-[#8B0000] text-[#F5F5DC] hover:bg-[#6d0000] transition-colors"
        >
          Add memory
        </button>
      </form>
    </div>
  `,
})
export class AdminComponent {
  private readonly adventureService = inject(AdventureService);

  title = '';
  date = '';
  description = '';
  type: AdventureType = 'photo';
  contentUrl = 'https://picsum.photos/400/300';
  lat = 0;
  lng = 0;
  layoutTop = 10;
  layoutLeft = 10;
  layoutRotation = 0;

  onSubmit(): void {
    const id = Date.now().toString();
    const adventure: Adventure = {
      id,
      title: this.title || 'Untitled',
      date: this.date || new Date().toISOString().slice(0, 10),
      description: this.description || '',
      type: this.type,
      contentUrl: this.type === 'photo' ? this.contentUrl || null : null,
      coordinates: this.type === 'map' ? { lat: this.lat, lng: this.lng } : null,
    };
    this.adventureService.addAdventure(adventure, {
      top: this.layoutTop,
      left: this.layoutLeft,
      rotation: this.layoutRotation,
    });
    this.title = '';
    this.description = '';
  }
}
