import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdventureService } from '../../services/adventure.service';
import type { Adventure, AdventureType } from '../../models/adventure.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
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
