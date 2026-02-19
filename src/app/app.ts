import { Component, signal, computed, PLATFORM_ID, inject, DestroyRef, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SpotifyEmbedComponent } from './components/spotify-embed/spotify-embed.component';

const SPOTIFY_PLAYLIST_URI = 'spotify:playlist:1wCSpznfoAJC4OLsPevQ7C';
const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpotifyEmbedComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly spotifyPlaylistUri = SPOTIFY_PLAYLIST_URI;
  private readonly viewportWidth = signal(1024);
  readonly isMobile = computed(() => this.viewportWidth() < MOBILE_BREAKPOINT);

  constructor() {
    afterNextRender(() => {
      this.viewportWidth.set(window.innerWidth);
      const handler = () => this.viewportWidth.set(window.innerWidth);
      window.addEventListener('resize', handler);
      window.addEventListener('orientationchange', handler);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('resize', handler);
        window.removeEventListener('orientationchange', handler);
      });
    });
  }
}
