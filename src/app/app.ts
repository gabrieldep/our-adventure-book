import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpotifyEmbedComponent } from './components/spotify-embed/spotify-embed.component';

const SPOTIFY_PLAYLIST_URI = 'spotify:playlist:1wCSpznfoAJC4OLsPevQ7C';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpotifyEmbedComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly spotifyPlaylistUri = SPOTIFY_PLAYLIST_URI;
}
