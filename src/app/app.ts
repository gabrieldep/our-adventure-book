import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpotifyEmbedComponent } from './components/spotify-embed/spotify-embed.component';

/** Replace with your playlist URI (Share → Copy link to playlist → use spotify:playlist:ID) */
const SPOTIFY_PLAYLIST_URI = 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpotifyEmbedComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly spotifyPlaylistUri = SPOTIFY_PLAYLIST_URI;
}
